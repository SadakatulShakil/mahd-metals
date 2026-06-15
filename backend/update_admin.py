import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
from app.database import SessionLocal
from app.models.admin import AdminUser
import bcrypt

db = SessionLocal()
admin = db.query(AdminUser).first()
if admin:
    admin.email = "admin@website.com"
    db.commit()
    print("✅ Admin email updated to admin@website.com")
else:
    print("❌ No admin user found")
db.close()
