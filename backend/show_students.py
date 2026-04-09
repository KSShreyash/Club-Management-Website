from database import SessionLocal
from models import User

db = SessionLocal()

students = db.query(User).filter(User.role == "student").all()

print(f"\nTotal students: {len(students)}\n")
print(f"  {'ID':<5} {'Full Name':<25} {'Email':<30} {'Roll Number':<15}")
print("  " + "-" * 78)
for s in students:
    print(f"  {s.id:<5} {s.full_name:<25} {s.email:<30} {s.roll_number or 'N/A':<15}")

db.close()