import sys, os, re
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

def _make_slug(name: str) -> str:
    slug = name.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_-]+', '-', slug)
    return slug

from app.database import SessionLocal, engine
from app.models.admin import AdminUser
from app.models.site_content import (
    HeroContent, AboutContent, StatsContent,
    ContactInfo, SiteSettings, FAQ
)
from app.models.material import Material
import json as _json
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

# Backfill slugs for any materials missing one
for m in db.query(Material).all():
    if not m.slug:
        m.slug = _make_slug(m.name or f"material-{m.id}")
db.commit()
print("✅ Material slugs backfilled")

# Seed rich content for the 6 default materials (only fills empty fields)
_material_seeds = {
    "copper": {
        "full_description": "High-grade copper scrap sourced from industrial facilities, demolition projects, and manufacturing plants across the Gulf region and globally. We handle Bare Bright Copper, #1 Copper, #2 Copper, Copper Wire, and Copper Tubing. Each batch is carefully sorted, graded, and documented to meet international buyer specifications and ISRI coding standards. Consistent supply from established Gulf-region industrial sources ensures reliable container-load availability year-round.",
        "applications": "Electrical wiring,Electronics manufacturing,Plumbing systems,Construction,Automotive components,Heat exchangers",
        "specifications": _json.dumps([
            {"key": "Grade", "value": "#1, #2, Bare Bright"},
            {"key": "Form", "value": "Wire, Tubing, Sheet, Busbar"},
            {"key": "Purity", "value": "99%+ (Bare Bright)"},
            {"key": "Standard", "value": "ISRI 520–524"},
            {"key": "Packaging", "value": "Baled or loose in containers"},
        ]),
        "origin_countries": "Saudi Arabia, UAE, Kuwait, Bahrain, Global",
        "min_order": "20 MT per container",
        "packaging": "Baled or loose in 20/40ft containers",
        "meta_title": "Copper Scrap | Saddam Scarp and Metal",
        "meta_description": "High-grade copper scrap and wire — #1, #2, and Bare Bright copper sourced globally. Contact Saddam Scarp and Metal for competitive pricing and reliable supply.",
    },
    "aluminum": {
        "full_description": "Premium aluminum scrap covering a wide range of alloys and forms sourced from automotive, aerospace, packaging, and construction sectors. We handle mixed aluminum, cast aluminum, extrusion scrap, UBC (used beverage cans), Taint/Tabor, and segregated aluminum alloys. All material is graded and processed to international standards for consistent metallurgical performance at the smelter.",
        "applications": "Automotive manufacturing,Aerospace components,Packaging industry,Construction profiles,Electrical transmission,Consumer electronics",
        "specifications": _json.dumps([
            {"key": "Grade", "value": "Mixed, Cast, Extrusion, UBC"},
            {"key": "Alloy Series", "value": "1xxx, 3xxx, 5xxx, 6xxx"},
            {"key": "Standard", "value": "ISRI 200–299"},
            {"key": "Form", "value": "Loose, Baled, Shredded"},
            {"key": "Moisture", "value": "Max 2%"},
        ]),
        "origin_countries": "Saudi Arabia, UAE, Kuwait, Qatar, Oman, Global",
        "min_order": "20 MT per container",
        "packaging": "Baled or loose in 20/40ft containers",
        "meta_title": "Aluminum Scrap | Saddam Scarp and Metal",
        "meta_description": "Premium aluminum scrap — mixed, cast, extrusion, and UBC grades sourced globally from the Gulf region. Request a competitive quote today.",
    },
    "steel-iron": {
        "full_description": "Premium ferrous metals including HMS 1&2 (Heavy Melting Scrap), Cast Iron, P&S (Plate and Structural), Shredded Steel, and Demolition Steel. Sourced from industrial yards, demolition sites, manufacturing facilities, and ship recycling across the Gulf. All material is graded to ISRI specifications and buyer requirements, with strict dimensional and thickness compliance.",
        "applications": "Steel mill feedstock,Iron foundries,Rebar manufacturing,Ship recycling,Infrastructure construction,Automotive steel production",
        "specifications": _json.dumps([
            {"key": "Grade", "value": "HMS 1, HMS 2, HMS 1&2"},
            {"key": "Standard", "value": "ISRI 200, 201"},
            {"key": "Max Dimensions", "value": "5ft × 2ft × 2ft"},
            {"key": "Min Thickness", "value": "1/4 inch"},
            {"key": "Packaging", "value": "Loose, Baled, or Shredded"},
        ]),
        "origin_countries": "Saudi Arabia, UAE, Kuwait, Bahrain, Global",
        "min_order": "500 MT (bulk) / 20 MT (container)",
        "packaging": "Loose in containers or bulk vessels",
        "meta_title": "Steel & Iron Scrap (HMS 1&2) | Saddam Scarp and Metal",
        "meta_description": "HMS 1&2, cast iron, and structural steel scrap traded globally. Premium ferrous metals sourced from the Gulf. Competitive pricing and reliable logistics.",
    },
    "stainless-steel": {
        "full_description": "Carefully segregated and composition-verified stainless steel scrap in grades 304, 316, 316L, 430, and specialty duplex alloys. Critical for food processing, medical equipment, chemical processing, and industrial applications. Each batch undergoes XRF alloy composition verification to ensure grade accuracy, providing buyers with full confidence in material specification.",
        "applications": "Food processing equipment,Medical devices,Chemical plant construction,Marine hardware,Aerospace components,Kitchen equipment",
        "specifications": _json.dumps([
            {"key": "Grades", "value": "304, 316, 316L, 430, 201"},
            {"key": "Form", "value": "Shredded, Turnings, Solids, Punchings"},
            {"key": "Standard", "value": "ISRI 400–499"},
            {"key": "Testing", "value": "XRF composition verified"},
            {"key": "Packaging", "value": "Baled or bulk in containers"},
        ]),
        "origin_countries": "Saudi Arabia, UAE, Kuwait, Global industrial sources",
        "min_order": "10 MT per container",
        "packaging": "Baled or loose in 20ft containers",
        "meta_title": "Stainless Steel Scrap 304/316/430 | Saddam Scarp and Metal",
        "meta_description": "XRF-verified 304, 316, 316L, and 430 stainless steel scrap. Precision-graded specialty alloys for global buyers. Request a competitive quote.",
    },
    "brass-bronze": {
        "full_description": "Mixed and segregated brass and bronze alloys sourced from demolition, plumbing, electrical, and manufacturing scrap streams across the Gulf region. We handle Yellow Brass, Red Brass, Brass Radiators, Bronze Turnings, Mixed Brass, and Brass Rod clips. All material is properly graded per ISRI specifications with visual inspection and gravity sorting to meet foundry buyer requirements.",
        "applications": "Brass foundries,Plumbing fixture manufacturing,Electrical components,Ammunition casings,Marine hardware,Decorative fittings",
        "specifications": _json.dumps([
            {"key": "Grades", "value": "Yellow Brass, Red Brass, Bronze"},
            {"key": "Standard", "value": "ISRI 70–79"},
            {"key": "Form", "value": "Solids, Turnings, Mixed"},
            {"key": "Min Copper Content", "value": "60–90% (grade dependent)"},
            {"key": "Packaging", "value": "Baled or drummed"},
        ]),
        "origin_countries": "Saudi Arabia, UAE, Kuwait, Gulf region",
        "min_order": "5 MT per shipment",
        "packaging": "Baled, drummed, or loose in containers",
        "meta_title": "Brass & Bronze Scrap | Saddam Scarp and Metal",
        "meta_description": "Yellow brass, red brass, and bronze scrap. ISRI-graded non-ferrous alloys from the Gulf. Reliable supply for global foundries and manufacturers.",
    },
    "mixed-metals": {
        "full_description": "Processed and unprocessed mixed metal streams sourced from industrial yards, demolition projects, end-of-life electronics, and equipment recycling across the Gulf region. We supply Zorba (shredded mixed non-ferrous), Zurik (stainless-rich mix), Twitch (die-cast aluminum-rich), and other mixed non-ferrous streams to secondary processors and smelters worldwide.",
        "applications": "Secondary smelters,Aluminum die casting,Metal recovery facilities,Non-ferrous processing plants,Foundry operations,Electronic scrap processing",
        "specifications": _json.dumps([
            {"key": "Types", "value": "Zorba, Zurik, Twitch, ISRI Mix"},
            {"key": "Fe Content", "value": "Max 5% by weight"},
            {"key": "Moisture", "value": "Max 3%"},
            {"key": "Fines", "value": "Max 5%"},
            {"key": "Packaging", "value": "Loose in containers"},
        ]),
        "origin_countries": "Saudi Arabia, UAE, Kuwait, Bahrain, Oman, Global",
        "min_order": "20 MT per container",
        "packaging": "Loose in 20/40ft containers",
        "meta_title": "Mixed Metals Scrap | Saddam Scarp and Metal",
        "meta_description": "Zorba, Zurik, and mixed non-ferrous metal streams for global buyers. Processed mixed metals sourced from the Gulf and traded worldwide.",
    },
}

for slug_key, seed in _material_seeds.items():
    mat = db.query(Material).filter(Material.slug == slug_key).first()
    if mat:
        for field, value in seed.items():
            if not getattr(mat, field, None):
                setattr(mat, field, value)
db.commit()
print("✅ Material rich content seeded")
