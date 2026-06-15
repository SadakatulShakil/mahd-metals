import sys, os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models.admin import AdminUser
from app.models.site_content import (
    HeroContent, AboutContent, StatsContent,
    ContactInfo, SiteSettings, FAQ
)
from app.models.material import Material
from app.database import Base
from app.auth import hash_password

Base.metadata.create_all(bind=engine)
db = SessionLocal()

# Create default admin
existing = db.query(AdminUser).filter(AdminUser.email == "admin@website.com").first()
if not existing:
    admin = AdminUser(
        email="admin@website.com",
        hashed_password=hash_password("admin123"),
        full_name="SADDAM Admin"
    )
    db.add(admin)
    db.commit()
    print("✅ Admin user created: admin@website.com / admin123")
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
print("   Email:    admin@website.com")
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

# Seed default FAQs
default_faqs = [
    ("What types of metals do you trade?", "We trade a wide range of metals including ferrous metals (HMS, steel, iron), non-ferrous metals (aluminum, brass, zinc), copper, stainless steel grades 304/316/430, specialty alloys, ferroalloys, and mixed metal streams.", 0),
    ("What is the minimum order quantity?", "Our minimum order quantity is generally one container load (20–25 metric tons) depending on the material type. For specialty alloys, smaller quantities may be considered. Contact us to discuss your specific requirements.", 1),
    ("Which countries do you export to?", "We serve clients in 10+ countries across the Middle East, Asia, Europe, and Africa including Saudi Arabia, Kuwait, UAE, Bahrain, Qatar, Oman, India, Pakistan, Bangladesh, and Turkey.", 2),
    ("How is pricing determined?", "Metal prices are based on daily LME (London Metal Exchange) market rates, material grade and quality, quantity, origin, and current market conditions. Contact us for a real-time competitive quote.", 3),
    ("What payment terms do you accept?", "We accept standard international trade payment terms including Letter of Credit (LC) at sight, Telegraphic Transfer (TT), and Documents Against Payment (DP). Terms are discussed based on order volume and business relationship.", 4),
]
for q, a, o in default_faqs:
    if not db.query(FAQ).filter(FAQ.question == q).first():
        db.add(FAQ(question=q, answer=a, order=o))
db.commit()
print("✅ FAQs seeded")
