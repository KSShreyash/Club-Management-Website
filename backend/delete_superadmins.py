from database import SessionLocal
from models import User

db = SessionLocal()

# ── DELETE BY EMAIL ────────────────────────────────────
emails_to_delete = [
    "superadmin2@college.edu",
    "superadmin3@college.edu",
]
# NOTE: be careful not to delete your only super admin!

for email in emails_to_delete:
    user = db.query(User).filter(User.email == email, User.role == "super_admin").first()
    if not user:
        print(f"NOT FOUND: {email}")
        continue
    db.delete(user)
    print(f"DELETED: {user.full_name} | {email}")

db.commit()
print("\nDone!")
db.close()