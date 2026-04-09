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
print("\nDone!")
db.close()