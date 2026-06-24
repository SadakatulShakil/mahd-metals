from sqlalchemy import Column, Integer, String, Text, Boolean
from ..database import Base

class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # ferrous / non-ferrous / specialty
    description = Column(Text, nullable=True)
    seo_title = Column(String(200), nullable=True)
    seo_description = Column(String(300), nullable=True)
    image_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    full_description = Column(Text, nullable=True)
    specifications = Column(Text, nullable=True)       # JSON string: [{"key":…,"value":…}]
    applications = Column(String(500), nullable=True)  # comma-separated
    origin_countries = Column(String(500), nullable=True)
    min_order = Column(String(100), nullable=True)
    packaging = Column(String(200), nullable=True)
    meta_title = Column(String(300), nullable=True)
    meta_description = Column(String(500), nullable=True)
    name_ar = Column(String(200), nullable=True)
    description_ar = Column(Text, nullable=True)
    full_description_ar = Column(Text, nullable=True)
