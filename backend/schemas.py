from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from enum import Enum

class ComplaintStatus(str, Enum):
    PENDING = "Pending"
    WORKING = "Working"
    SOLVED = "Solved"
    INVALID = "Invalid"

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str
    role: str = "citizen"

class User(UserBase):
    id: int
    role: str
    class Config:
        from_attributes = True

class ComplaintBase(BaseModel):
    title: str
    description: str
    category: Optional[str] = None

class ComplaintCreate(ComplaintBase):
    pass

class Complaint(ComplaintBase):
    id: int
    image_url: Optional[str] = None
    status: str
    created_at: datetime
    user_id: int
    class Config:
        from_attributes = True

class LogBase(BaseModel):
    action_type: str
    admin_comment: Optional[str] = None
    proof_image_url: Optional[str] = None

class LogCreate(LogBase):
    new_status: Optional[str] = None

class Log(LogBase):
    id: int
    complaint_id: int
    action_by: int
    timestamp: datetime
    class Config:
        from_attributes = True
