from database import SessionLocal
from models import User, Club

db = SessionLocal()

admins = db.query(User).filter(User.role == "club_admin").all()

print(f"\nTotal club admins: {len(admins)}\n")
print(f"  {'ID':<5} {'Full Name':<25} {'Email':<30} {'Club Name':<25}")
print("  " + "-" * 88)
for a in admins:
    club = db.query(Club).filter(Club.id == a.club_id).first()
    club_name = club.name if club else "No club assigned"
    print(f"  {a.id:<5} {a.full_name:<25} {a.email:<30} {club_name:<25}")

db.close()