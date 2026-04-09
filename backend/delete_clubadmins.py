from database import SessionLocal
from models import User

db = SessionLocal()

# ── DELETE BY EMAIL ────────────────────────────────────
emails_to_delete = [
    "culturaladmin@college.edu",
    "sportsadmin@college.edu",
]

for email in emails_to_delete:
    user = db.query(User).filter(User.email == email, User.role == "club_admin").first()
    if not user:
        print(f"NOT FOUND: {email}")
        continue
    db.delete(user)
    print(f"DELETED: {user.full_name} | {email} | club_id={user.club_id}")

db.commit()
print("\nDone!")
db.close()