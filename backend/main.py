from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from database import engine, get_db, Base
import models, schemas, auth
from typing import List

Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Seed demo data on startup ---
@app.on_event("startup")
def seed():
    db = next(get_db())
    if db.query(models.User).count() == 0:
        # Super admin
        sa = models.User(email="superadmin@college.edu", password_hash=auth.hash_password("admin123"),
                         role="super_admin", full_name="Super Admin")
        db.add(sa)
        # Clubs
        clubs_data = [
            ("Technical Club", "For tech enthusiasts"),
            ("Cultural Club", "Arts and culture"),
            ("Sports Club", "Sports activities"),
            ("Photography Club", "Photography enthusiasts"),
            ("Literary Club", "Debate and literature"),
        ]
        clubs = []
        for name, desc in clubs_data:
            c = models.Club(name=name, description=desc)
            db.add(c)
            clubs.append(c)
        db.flush()
        # Club admin
        ca = models.User(email="clubadmin@college.edu", password_hash=auth.hash_password("admin123"),
                         role="club_admin", full_name="Tech Club Admin", club_id=clubs[0].id)
        db.add(ca)
        # Students
        for i in range(5):
            s = models.User(email=f"student{i}@college.edu", password_hash=auth.hash_password("student123"),
                            role="student", full_name=f"Student {i}", roll_number=f"2023-CS-10{i}")
            db.add(s)
        db.flush()
        # Events
        events_data = [
            ("Tech Talk: AI in Education", "AI in modern education", "Feb 15, 2026", "3:00 PM", "Main Auditorium", 0.0, 100, clubs[0].id),
            ("Hackathon 2026", "24-hour coding marathon where teams compete to build innovative solutions. Prizes worth ₹50,000 to be won!", "Feb 28, 2026", "9:00 AM", "Computer Lab", 500.0, 150, clubs[0].id),
            ("Web Development Workshop", "Learn modern web development", "Mar 5, 2026", "2:00 PM", "Room 201", 300.0, 60, clubs[0].id),
            ("Coding Competition", "Algorithm challenges", "Mar 12, 2026", "10:00 AM", "Computer Lab", 0.0, 120, clubs[0].id),
            ("Annual Cultural Fest", "Celebrate arts and culture", "Mar 1, 2026", "10:00 AM", "Open Ground", 200.0, 500, clubs[1].id),
            ("Photography Workshop", "Learn photography basics", "Mar 5, 2026", "2:00 PM", "Room 301", 0.0, 50, clubs[3].id),
            ("Basketball Tournament", "Inter-college basketball", "Mar 10, 2026", "4:00 PM", "Basketball Court", 300.0, 32, clubs[2].id),
            ("Debate Competition", "Parliamentary debate", "Mar 12, 2026", "11:00 AM", "Seminar Hall", 0.0, 80, clubs[4].id),
        ]
        events = []
        for title, desc, date, time, venue, fee, cap, cid in events_data:
            e = models.Event(title=title, description=desc, date=date, time=time, venue=venue, fee=fee, capacity=cap, club_id=cid)
            db.add(e)
            events.append(e)
        db.flush()
        # Seed registrations
        reg_counts = [45, 120, 78, 92, 450, 28, 16, 62]
        student = db.query(models.User).filter(models.User.role=="student").first()
        for i, ev in enumerate(events):
            for j in range(min(reg_counts[i], 3)):
                r = models.Registration(event_id=ev.id, student_id=student.id,
                    full_name=f"Demo Student {j}", email=f"demo{j}@college.edu",
                    phone=f"9876543{j:03d}", roll_number=f"2023-CS-{j:03d}")
                db.add(r)
        db.commit()

# --- AUTH ---
@app.post("/login", response_model=schemas.Token)
def login(creds: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == creds.email).first()
    if not user or not auth.verify_password(creds.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    club_name = None
    if user.club_id:
        club = db.query(models.Club).filter(models.Club.id == user.club_id).first()
        club_name = club.name if club else None
    token = auth.create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "role": user.role,
            "user_id": user.id, "full_name": user.full_name, "club_id": user.club_id, "club_name": club_name}

# --- STATS ---
@app.get("/stats", response_model=schemas.StatsOut)
def get_stats(db: Session = Depends(get_db), current_user: models.User = Depends(auth.get_current_user)):
    return {
        "total_clubs": db.query(models.Club).count(),
        "total_events": db.query(models.Event).count(),
        "total_students": db.query(models.User).filter(models.User.role == "student").count(),
    }

# --- CLUBS ---
@app.get("/clubs", response_model=List[schemas.ClubOut])
def get_clubs(db: Session = Depends(get_db)):
    return db.query(models.Club).all()

@app.post("/clubs", response_model=schemas.ClubOut)
def create_club(club: schemas.ClubCreate, db: Session = Depends(get_db),
                current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    existing = db.query(models.Club).filter(models.Club.name == club.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Club already exists")
    new_club = models.Club(**club.dict())
    db.add(new_club)
    db.commit()
    db.refresh(new_club)
    return new_club

@app.delete("/clubs/{club_id}")
def delete_club(club_id: int, db: Session = Depends(get_db),
                current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "super_admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    club = db.query(models.Club).filter(models.Club.id == club_id).first()
    if not club:
        raise HTTPException(status_code=404, detail="Club not found")
    db.delete(club)
    db.commit()
    return {"message": "Club deleted"}

# --- ASSIGN ADMIN ---
@app.post("/assign-admin")
def assign_admin(data: schemas.AssignAdmin, db: Session = Depends(get_db),
                 current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "super_admin":
        raise HTTPException(status_code=403)
    user = db.query(models.User).filter(models.User.email == data.student_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = "club_admin"
    user.club_id = data.club_id
    db.commit()
    return {"message": "Admin assigned"}

@app.post("/remove-admin")
def remove_admin(data: schemas.AssignAdmin, db: Session = Depends(get_db),
                 current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "super_admin":
        raise HTTPException(status_code=403)
    user = db.query(models.User).filter(models.User.email == data.student_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    user.role = "student"
    user.club_id = None
    db.commit()
    return {"message": "Admin removed"}

# --- ANNOUNCEMENTS ---
@app.post("/announcements", response_model=schemas.AnnouncementOut)
def create_announcement(ann: schemas.AnnouncementCreate, db: Session = Depends(get_db),
                        current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "super_admin":
        raise HTTPException(status_code=403)
    new_ann = models.Announcement(**ann.dict())
    db.add(new_ann)
    db.commit()
    db.refresh(new_ann)
    return new_ann

@app.get("/announcements", response_model=List[schemas.AnnouncementOut])
def get_announcements(db: Session = Depends(get_db)):
    return db.query(models.Announcement).order_by(models.Announcement.created_at.desc()).all()

# --- EVENTS ---
@app.get("/events", response_model=List[schemas.EventOut])
def get_events(db: Session = Depends(get_db)):
    events = db.query(models.Event).all()
    result = []
    for e in events:
        club = db.query(models.Club).filter(models.Club.id == e.club_id).first()
        count = db.query(models.Registration).filter(models.Registration.event_id == e.id).count()
        result.append(schemas.EventOut(
            id=e.id, title=e.title, description=e.description,
            date=e.date, time=e.time, venue=e.venue, fee=e.fee, capacity=e.capacity,
            club_id=e.club_id, club_name=club.name if club else None, registration_count=count
        ))
    return result

@app.get("/events/my-club", response_model=List[schemas.EventOut])
def get_my_club_events(db: Session = Depends(get_db),
                       current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "club_admin":
        raise HTTPException(status_code=403)
    events = db.query(models.Event).filter(models.Event.club_id == current_user.club_id).all()
    result = []
    for e in events:
        club = db.query(models.Club).filter(models.Club.id == e.club_id).first()
        count = db.query(models.Registration).filter(models.Registration.event_id == e.id).count()
        result.append(schemas.EventOut(
            id=e.id, title=e.title, description=e.description,
            date=e.date, time=e.time, venue=e.venue, fee=e.fee, capacity=e.capacity,
            club_id=e.club_id, club_name=club.name if club else None, registration_count=count
        ))
    return result

@app.get("/events/{event_id}", response_model=schemas.EventOut)
def get_event(event_id: int, db: Session = Depends(get_db)):
    e = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not e:
        raise HTTPException(status_code=404)
    club = db.query(models.Club).filter(models.Club.id == e.club_id).first()
    count = db.query(models.Registration).filter(models.Registration.event_id == e.id).count()
    return schemas.EventOut(
        id=e.id, title=e.title, description=e.description,
        date=e.date, time=e.time, venue=e.venue, fee=e.fee, capacity=e.capacity,
        club_id=e.club_id, club_name=club.name if club else None, registration_count=count
    )

@app.post("/events", response_model=schemas.EventOut)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db),
                 current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "club_admin":
        raise HTTPException(status_code=403)
    new_event = models.Event(**event.dict(), club_id=current_user.club_id)
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    club = db.query(models.Club).filter(models.Club.id == new_event.club_id).first()
    return schemas.EventOut(
        id=new_event.id, title=new_event.title, description=new_event.description,
        date=new_event.date, time=new_event.time, venue=new_event.venue,
        fee=new_event.fee, capacity=new_event.capacity, club_id=new_event.club_id,
        club_name=club.name if club else None, registration_count=0
    )

@app.put("/events/{event_id}", response_model=schemas.EventOut)
def update_event(event_id: int, event: schemas.EventCreate, db: Session = Depends(get_db),
                 current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "club_admin":
        raise HTTPException(status_code=403)
    e = db.query(models.Event).filter(models.Event.id == event_id, models.Event.club_id == current_user.club_id).first()
    if not e:
        raise HTTPException(status_code=404)
    for k, v in event.dict().items():
        setattr(e, k, v)
    db.commit()
    db.refresh(e)
    club = db.query(models.Club).filter(models.Club.id == e.club_id).first()
    count = db.query(models.Registration).filter(models.Registration.event_id == e.id).count()
    return schemas.EventOut(
        id=e.id, title=e.title, description=e.description,
        date=e.date, time=e.time, venue=e.venue, fee=e.fee, capacity=e.capacity,
        club_id=e.club_id, club_name=club.name if club else None, registration_count=count
    )

@app.delete("/events/{event_id}")
def delete_event(event_id: int, db: Session = Depends(get_db),
                 current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "club_admin":
        raise HTTPException(status_code=403)
    e = db.query(models.Event).filter(models.Event.id == event_id, models.Event.club_id == current_user.club_id).first()
    if not e:
        raise HTTPException(status_code=404)
    db.delete(e)
    db.commit()
    return {"message": "Event deleted"}

# --- REGISTRATIONS ---
@app.post("/events/{event_id}/register", response_model=schemas.RegistrationOut)
def register(event_id: int, reg: schemas.RegistrationCreate, db: Session = Depends(get_db),
             current_user: models.User = Depends(auth.get_current_user)):
    event = db.query(models.Event).filter(models.Event.id == event_id).first()
    if not event:
        raise HTTPException(status_code=404)
    existing = db.query(models.Registration).filter(
        models.Registration.event_id == event_id,
        models.Registration.student_id == current_user.id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Already registered")
    count = db.query(models.Registration).filter(models.Registration.event_id == event_id).count()
    if count >= event.capacity:
        raise HTTPException(status_code=400, detail="Event is full")
    new_reg = models.Registration(event_id=event_id, student_id=current_user.id, **reg.dict())
    db.add(new_reg)
    db.commit()
    db.refresh(new_reg)
    return new_reg

@app.get("/events/{event_id}/registrations", response_model=List[schemas.RegistrationOut])
def get_registrations(event_id: int, db: Session = Depends(get_db),
                      current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role not in ["club_admin", "super_admin"]:
        raise HTTPException(status_code=403)
    return db.query(models.Registration).filter(models.Registration.event_id == event_id).all()

@app.get("/my-registrations", response_model=List[schemas.RegistrationOut])
def my_registrations(db: Session = Depends(get_db),
                     current_user: models.User = Depends(auth.get_current_user)):
    return db.query(models.Registration).filter(models.Registration.student_id == current_user.id).all()

# --- CLUB STATS ---
@app.get("/club-stats")
def club_stats(db: Session = Depends(get_db),
               current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "club_admin":
        raise HTTPException(status_code=403)
    event_count = db.query(models.Event).filter(models.Event.club_id == current_user.club_id).count()
    events = db.query(models.Event).filter(models.Event.club_id == current_user.club_id).all()
    total_regs = sum(db.query(models.Registration).filter(models.Registration.event_id == e.id).count() for e in events)
    return {"total_events": event_count, "total_registrations": total_regs}