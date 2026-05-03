import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import SessionLocal, engine
from app.models.material import Material
from app.models.contact import ContactSubmission
from app.database import Base

Base.metadata.create_all(bind=engine)

db = SessionLocal()

materials = [
    {
        "slug": "copper",
        "name": "Copper",
        "category": "Non-Ferrous",
        "description": "High-grade copper scrap and wire sourced from industrial facilities, demolition projects, and manufacturing plants. One of the most valuable recyclable metals in global markets with consistent demand from electrical, construction, and electronics industries.",
        "seo_title": "Copper Scrap Trading | MAHD Metals International",
        "seo_description": "Premium copper scrap and wire trading. MAHD Metals sources and exports high-grade copper globally. 40+ years expertise. Request a quote today.",
        "image_url": "/images/copper.jpg",
    },
    {
        "slug": "aluminum",
        "name": "Aluminum",
        "category": "Non-Ferrous",
        "description": "Lightweight aluminum alloys and scrap sourced for automotive, aerospace, and construction sectors. We handle mixed aluminum, cast aluminum, extrusion scrap, and UBC (used beverage cans) with precision grading.",
        "seo_title": "Aluminum Scrap Trading | MAHD Metals International",
        "seo_description": "Global aluminum scrap trading — automotive, aerospace & construction grades. MAHD Metals delivers reliable supply with 40+ years Gulf expertise.",
        "image_url": "/images/aluminum.jpg",
    },
    {
        "slug": "steel-iron",
        "name": "Steel & Iron",
        "category": "Ferrous",
        "description": "Premium ferrous materials including HMS 1&2 (Heavy Melting Scrap), cast iron, structural steel, and shredded scrap. Sourced from industrial yards, demolition sites, and manufacturing facilities across the Gulf and globally.",
        "seo_title": "Steel & Iron Scrap Trading | MAHD Metals International",
        "seo_description": "HMS 1&2, cast iron and structural steel scrap trading. MAHD Metals supplies global steel mills with premium ferrous materials. Get a quote.",
        "image_url": "/images/steel.jpg",
    },
    {
        "slug": "stainless-steel",
        "name": "Stainless Steel",
        "category": "Specialty",
        "description": "304, 316, and 430 grade stainless steel scrap critical for food processing, medical equipment, and industrial applications. Carefully segregated and tested for alloy composition to meet precise buyer specifications.",
        "seo_title": "Stainless Steel Scrap | MAHD Metals International",
        "seo_description": "Grade 304, 316 & 430 stainless steel scrap trading. Precision-graded specialty alloys for global buyers. MAHD Metals — trusted Gulf metal trader.",
        "image_url": "/images/stainless.jpg",
    },
    {
        "slug": "brass-bronze",
        "name": "Brass & Bronze",
        "category": "Non-Ferrous",
        "description": "Mixed and segregated brass and bronze alloys traded to foundries and manufacturers worldwide. Includes yellow brass, red brass, bronze turnings, and mixed brass — all properly graded per ISRI specifications.",
        "seo_title": "Brass & Bronze Scrap Trading | MAHD Metals International",
        "seo_description": "Yellow brass, red brass & bronze scrap trading globally. ISRI-graded non-ferrous alloys. MAHD Metals — 30+ countries, 40+ years expertise.",
        "image_url": "/images/brass.jpg",
    },
    {
        "slug": "mixed-metals",
        "name": "Mixed Metals",
        "category": "Mixed",
        "description": "Processed and unprocessed mixed metal streams sourced from industrial yards, demolition projects, and end-of-life equipment. Includes zorba, zurik, and mixed non-ferrous streams for downstream processing and smelting.",
        "seo_title": "Mixed Metal Scrap Trading | MAHD Metals International",
        "seo_description": "Zorba, zurik & mixed non-ferrous metal streams. MAHD Metals sources and trades mixed metals globally with reliable logistics and transparent pricing.",
        "image_url": "/images/mixed.jpg",
    },
]

# Clear existing and re-seed
db.query(Material).delete()
for m in materials:
    db.add(Material(**m))

db.commit()
print(f"✅ Seeded {len(materials)} materials successfully!")

# Verify
count = db.query(Material).count()
print(f"✅ Database now has {count} materials")
db.close()
