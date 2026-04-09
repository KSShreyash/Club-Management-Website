from database import SessionLocal
from models import User

db = SessionLocal()

admins = db.query(User).filter(User.role == "super_admin").all()

print(f"\nTotal super admins: {len(admins)}\n")
print(f"  {'ID':<5} {'Full Name':<25} {'Email':<30}")
print("  " + "-" * 62)
for a in admins:
    print(f"  {a.id:<5} {a.full_name:<25} {a.email:<30}")

db.close()
