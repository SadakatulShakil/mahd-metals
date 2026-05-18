import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models.admin import AdminUser
from app.models.site_content import (
    HeroContent, AboutContent, StatsContent,
    ContactInfo, SiteSettings
)
from app.models.material import Material
from app.database import Base
from app.auth import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Create default admin
existing = db.query(AdminUser).filter(AdminUser.email == "admin@mahdmetals.com").first()
if not existing:
    admin = AdminUser(
        email="admin@mahdmetals.com",
        hashed_password=hash_password("admin123"),
        full_name="SADDAM Admin"
    )
    db.add(admin)
    db.commit()
    print("✅ Admin user created: admin@mahdmetals.com / admin123")
else:
    print("ℹ️  Admin user already exists")

# Seed default site content
for Model, name in [
    (HeroContent, "Hero"),
    (AboutContent, "About"),
    (StatsContent, "Stats"),
    (ContactInfo, "Contact Info"),
    (SiteSettings, "Site Settings"),
]:
    if not db.query(Model).first():
        db.add(Model())
        db.commit()
        print(f"✅ {name} content seeded")

db.close()
print("\n✅ All done! Login at: http://localhost:5173/admin")
print("   Email:    admin@mahdmetals.com")
print("   Password: admin123")

# Seed page banners
from app.models.site_content import PageBanner, BrandingContent
for page, title, subtitle in [
    ("about",     "About Saddam Scrap and Metal",    "A partnership built on 40 years of Gulf expertise and global trust."),
    ("materials", "Our Materials",        "Premium ferrous, non-ferrous, and specialty alloy metals — sourced and traded globally."),
    ("contact",   "Contact Us",           "Request a quote or get in touch with our global trading team."),
]:
    if not db.query(PageBanner).filter(PageBanner.page == page).first():
        db.add(PageBanner(page=page, title=title, subtitle=subtitle))

if not db.query(BrandingContent).first():
    db.add(BrandingContent())

db.commit()
print("✅ Banners + Branding seeded")
