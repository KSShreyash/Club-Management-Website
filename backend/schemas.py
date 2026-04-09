from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    user_id: int
    full_name: str
    club_id: Optional[int] = None
    club_name: Optional[str] = None

class ClubCreate(BaseModel):
    name: str
    description: str

class ClubOut(BaseModel):
    id: int
    name: str
    description: str
    class Config:
        from_attributes = True

class EventCreate(BaseModel):
    title: str
    description: str
    date: str
    time: str
    venue: str
    fee: float
    capacity: int

class EventOut(BaseModel):
    id: int
    title: str
    description: str
    date: str
    time: str
    venue: str
    fee: float
    capacity: int
    club_id: int
    club_name: Optional[str] = None
    registration_count: Optional[int] = 0
    class Config:
        from_attributes = True

class RegistrationCreate(BaseModel):
    full_name: str
    email: str
    phone: str
    roll_number: str

class RegistrationOut(BaseModel):
    id: int
    full_name: str
    email: str
    phone: str
    roll_number: str
    created_at: datetime
    event_id: int
    class Config:
        from_attributes = True

class AssignAdmin(BaseModel):
    student_email: str
    club_id: int

class AnnouncementCreate(BaseModel):
    title: str
    message: str

class AnnouncementOut(BaseModel):
    id: int
    title: str
    message: str
    created_at: datetime
    class Config:
        from_attributes = True

class StatsOut(BaseModel):
    total_clubs: int
    total_events: int
    total_students: int
