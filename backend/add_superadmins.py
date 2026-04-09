from database import SessionLocal, engine, Base
from models import User
import auth

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# ── ADD YOUR SUPER ADMINS HERE ─────────────────────────
super_admins = [
    ("Super Admin Two",   "superadmin2@college.edu", "admin123"),
    ("Super Admin Three", "superadmin3@college.edu", "admin123"),
]
# Format: ("Full Name", "email@college.edu", "password")

for full_name, email, password in super_admins:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"SKIPPED (already exists): {email}")
        continue
    db.add(User(
        full_name=full_name,
        email=email,
        password_hash=auth.hash_password(password),
        role="super_admin"
    ))
    print(f"ADDED: {full_name} | {email}")

db.commit()
print("\nDone!")
db.close()
