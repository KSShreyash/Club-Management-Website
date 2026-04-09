from database import SessionLocal, engine, Base
from models import User, Club
import auth

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Show existing clubs first so you know which club_id to use
print("Existing clubs:")
print(f"  {'ID':<5} {'Name':<30}")
print("  " + "-" * 35)
for c in db.query(Club).all():
    print(f"  {c.id:<5} {c.name:<30}")
print()

# ── ADD YOUR CLUB ADMINS HERE ──────────────────────────
club_admins = [
    ("Cultural Admin", "culturaladmin@college.edu", "admin123", 2),
    ("Sports Admin",   "sportsadmin@college.edu",   "admin123", 3),
]
# Format: ("Full Name", "email@college.edu", "password", club_id)
# Use the club IDs printed above

for full_name, email, password, club_id in club_admins:
    existing = db.query(User).filter(User.email == email).first()
    if existing:
        print(f"SKIPPED (already exists): {email}")
        continue
    club = db.query(Club).filter(Club.id == club_id).first()
    if not club:
        print(f"SKIPPED (club_id={club_id} not found): {email}")
        continue
    db.add(User(
        full_name=full_name,
        email=email,
        password_hash=auth.hash_password(password),
        role="club_admin",
        club_id=club_id
    ))
    print(f"ADDED: {full_name} | {email} | club: {club.name}")

db.commit()
print("\nDone!")
db.close()