from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session
from typing import List, Optional
import shutil
import os
import uuid
import cloudinary
import cloudinary.uploader

import models
import schemas
from database import engine, get_db

# Cloudinary Config (optional — used in production)
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)

app = FastAPI(title="CivicEase API")

# Create DB tables on startup
@app.on_event("startup")
def startup_db():
    try:
        models.Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Database initialization error: {e}")

# Seed mock users on startup
@app.on_event("startup")
def seed_users():
    try:
        db = next(get_db())
        if not db.query(models.User).first():
            user = models.User(email="user@demo.com", password_hash="pass", role="citizen")
            admin = models.User(email="admin@demo.com", password_hash="pass", role="admin")
            db.add(user)
            db.add(admin)
            db.commit()
        db.close()
    except Exception as e:
        print(f"Seed users error: {e}")

# CORS — allow all origins for development and mobile app access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Image Upload Helper ---
def upload_image(file: UploadFile):
    try:
        # If Cloudinary envs are present, use cloud storage
        if os.getenv("CLOUDINARY_CLOUD_NAME"):
            result = cloudinary.uploader.upload(file.file, folder="civic_response")
            return result.get("secure_url")
        else:
            # Fallback to local file storage
            os.makedirs("uploads", exist_ok=True)
            file_ext = file.filename.split(".")[-1]
            filename = f"{uuid.uuid4()}.{file_ext}"
            path = f"uploads/{filename}"
            with open(path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            return f"/uploads/{filename}"
    except Exception as e:
        print(f"Upload error: {e}")
        return None

# Mount local uploads directory for serving static files
if not os.getenv("CLOUDINARY_CLOUD_NAME"):
    try:
        os.makedirs("uploads", exist_ok=True)
        app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")
    except OSError:
        print("Warning: Could not create 'uploads' directory.")

# --- AI Mock Classification ---
def mock_ai_classify(description: str) -> str:
    desc_lower = description.lower()
    if any(x in desc_lower for x in ["road", "pothole", "street"]):
        return "Infrastructure"
    if any(x in desc_lower for x in ["garbage", "trash", "clean", "dustbin"]):
        return "Sanitation"
    if any(x in desc_lower for x in ["light", "electric", "pole", "wire"]):
        return "Electrical"
    if any(x in desc_lower for x in ["water", "pipe", "drain", "flood"]):
        return "Water Supply"
    return "General"

# ==================== API Endpoints ====================

@app.get("/")
def root():
    return {"status": "ok", "message": "CivicEase API is running"}

@app.get("/health")
def health_check():
    return {"status": "ok"}

# --- Complaints ---

@app.post("/complaints/", response_model=schemas.Complaint)
@app.post("/complaints", response_model=schemas.Complaint, include_in_schema=False)
def create_complaint(
    title: str = Form(...),
    description: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    image_url = upload_image(image) if image else None
    category = mock_ai_classify(description)

    db_complaint = models.Complaint(
        title=title,
        description=description,
        image_url=image_url,
        category=category,
        user_id=1  # TODO: Get real user ID from auth
    )
    db.add(db_complaint)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@app.get("/complaints/", response_model=List[schemas.Complaint])
@app.get("/complaints", response_model=List[schemas.Complaint], include_in_schema=False)
def read_complaints(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    complaints = db.query(models.Complaint).offset(skip).limit(limit).all()
    return complaints

@app.get("/complaints/{complaint_id}", response_model=schemas.Complaint)
def read_complaint(complaint_id: int, db: Session = Depends(get_db)):
    complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")
    return complaint

@app.patch("/complaints/{complaint_id}/status", response_model=schemas.Complaint)
def update_status(
    complaint_id: int,
    new_status: str = Form(...),
    admin_comment: str = Form(None),
    proof_image: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    db_complaint = db.query(models.Complaint).filter(models.Complaint.id == complaint_id).first()
    if not db_complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    old_status = db_complaint.status
    db_complaint.status = new_status

    proof_url = upload_image(proof_image) if proof_image else None

    log = models.ComplaintLog(
        complaint_id=complaint_id,
        action_by=2,  # Mock Admin ID
        action_type="Status Change",
        previous_status=old_status,
        new_status=new_status,
        admin_comment=admin_comment,
        proof_image_url=proof_url
    )
    db.add(log)
    db.commit()
    db.refresh(db_complaint)
    return db_complaint

@app.get("/complaints/{complaint_id}/logs")
def get_logs(complaint_id: int, db: Session = Depends(get_db)):
    logs = db.query(models.ComplaintLog).filter(models.ComplaintLog.complaint_id == complaint_id).all()
    return logs

# --- Users ---

@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = models.User(email=user.email, password_hash=user.password, role=user.role)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# --- File Upload (standalone) ---

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    image_url = upload_image(file)
    if image_url:
        return {"url": image_url}
    raise HTTPException(status_code=500, detail="Failed to upload file")
