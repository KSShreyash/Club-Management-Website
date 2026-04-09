from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey, DateTime, Text
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    role = Column(String)  # super_admin, club_admin, student
    full_name = Column(String)
    roll_number = Column(String, nullable=True)
    club_id = Column(Integer, ForeignKey("clubs.id"), nullable=True)
    registrations = relationship("Registration", back_populates="student")

class Club(Base):
    __tablename__ = "clubs"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, index=True)
    description = Column(Text)
    events = relationship("Event", back_populates="club")
    admins = relationship("User", foreign_keys=[User.club_id])

class Event(Base):
    __tablename__ = "events"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    description = Column(Text)
    date = Column(String)
    time = Column(String)
    venue = Column(String)
    fee = Column(Float, default=0.0)
    capacity = Column(Integer)
    club_id = Column(Integer, ForeignKey("clubs.id"))
    club = relationship("Club", back_populates="events")
    registrations = relationship("Registration", back_populates="event")

class Registration(Base):
    __tablename__ = "registrations"
    id = Column(Integer, primary_key=True, index=True)
    event_id = Column(Integer, ForeignKey("events.id"))
    student_id = Column(Integer, ForeignKey("users.id"))
    full_name = Column(String)
    email = Column(String)
    phone = Column(String)
    roll_number = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    event = relationship("Event", back_populates="registrations")
    student = relationship("User", back_populates="registrations")

class Announcement(Base):
    __tablename__ = "announcements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    message = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)