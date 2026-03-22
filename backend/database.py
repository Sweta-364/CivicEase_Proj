import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables from .env file (no-op if already set in environment)
load_dotenv()

# Use env var for DB in production (Render provides DATABASE_URL or POSTGRES_URL)
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("POSTGRES_URL")

# Convert postgres:// to postgresql:// for SQLAlchemy compatibility
if SQLALCHEMY_DATABASE_URL and SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Fallback to local SQLite for development
if not SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./civic_response.db"
    print("INFO: No DATABASE_URL set. Using local SQLite database (civic_response.db)")

connect_args = {}
engine_kwargs = {}

if "sqlite" in SQLALCHEMY_DATABASE_URL:
    connect_args = {"check_same_thread": False}
else:
    # Production PostgreSQL: configure connection pool
    engine_kwargs = {
        "pool_size": 5,
        "max_overflow": 10,
        "pool_timeout": 30,
        "pool_recycle": 1800,  # Recycle connections every 30 min
        "pool_pre_ping": True,  # Test connections before using
    }

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args=connect_args,
    **engine_kwargs,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
