from database import SessionLocal
from models import User

db = SessionLocal()

# ── DELETE BY EMAIL ────────────────────────────────────
emails_to_delete = [
    "john@college.edu",
    "jane@college.edu",
]

for email in emails_to_delete:
    user = db.query(User).filter(User.email == email, User.role == "student").first()
    if not user:
        print(f"NOT FOUND: {email}")
        continue
    db.delete(user)
    print(f"DELETED: {user.full_name} | {email}")

db.commit()
print("\nDone!")
db.close()