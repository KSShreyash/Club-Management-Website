from database import SessionLocal, engine, Base
from models import User
import auth

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── ADD YOUR STUDENTS HERE ─────────────────────────────
students = [
    ("John Doe",    "john@college.edu",  "student123", "2023-CS-105"),
    ("Jane Smith",  "jane@college.edu",  "student123", "2023-CS-106"),
    ("Raj Kumar",   "raj@college.edu",   "student123", "2023-CS-107"),
    ("Priya Nair",  "priya@college.edu", "student123", "2023-CS-108"),
    ("Arjun Singh", "arjun@college.edu", "student123", "2023-CS-109"),
]
# Format: ("Full Name", "email@college.edu", "password", "roll_number")

for full_name, email, password, roll_number in students:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"SKIPPED (already exists): {email}")
        continue
    db.add(User(
        full_name=full_name,
        email=email,
        password_hash=auth.hash_password(password),
        role="student",
        roll_number=roll_number
    ))
    print(f"ADDED: {full_name} | {email} | {roll_number}")

db.commit()
print("\nDone!")
db.close()