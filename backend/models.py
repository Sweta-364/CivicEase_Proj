from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from database import Base
import datetime
import enum

class UserRole(str, enum.Enum):
    CITIZEN = "citizen"
    ADMIN = "admin"

class ComplaintStatus(str, enum.Enum):
    PENDING = "Pending"
    WORKING = "Working"
    SOLVED = "Solved"
    INVALID = "Invalid"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    role = Column(String, default=UserRole.CITIZEN)
    password_hash = Column(String)

    complaints = relationship("Complaint", back_populates="owner")
    logs = relationship("ComplaintLog", back_populates="admin")

class Complaint(Base):
    __tablename__ = "complaints"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(String)
    image_url = Column(String, nullable=True)
    category = Column(String, default="Uncategorized")
    status = Column(String, default=ComplaintStatus.PENDING)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="complaints")
    logs = relationship("ComplaintLog", back_populates="complaint")

class ComplaintLog(Base):
    __tablename__ = "complaint_logs"

    id = Column(Integer, primary_key=True, index=True)
    complaint_id = Column(Integer, ForeignKey("complaints.id"))
    action_by = Column(Integer, ForeignKey("users.id"))
    action_type = Column(String) # e.g., "Status Change", "Comment"
    previous_status = Column(String, nullable=True)
    new_status = Column(String, nullable=True)
    admin_comment = Column(String, nullable=True)
    proof_image_url = Column(String, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    complaint = relationship("Complaint", back_populates="logs")
    admin = relationship("User", back_populates="logs")
