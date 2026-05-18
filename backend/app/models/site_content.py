from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.sql import func
from ..database import Base

class HeroContent(Base):
    __tablename__ = "hero_content"
    id = Column(Integer, primary_key=True)
    badge_text = Column(String(200), default="Trusted in 30+ Countries Worldwide")
    headline_line1 = Column(String(200), default="Your Global Partner in")
    headline_line2 = Column(String(200), default="Scrap & Alloy Metals")
    subheadline = Column(Text, default="Saddam Scrap and Metal connects the global supply chain with premium ferrous, non-ferrous, and specialty alloy metals.")
    cta_primary_text = Column(String(100), default="Request a Quote")
    cta_secondary_text = Column(String(100), default="Explore Materials")
    bg_image_url = Column(String(500), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AboutContent(Base):
    __tablename__ = "about_content"
    id = Column(Integer, primary_key=True)
    section_label = Column(String(100), default="About Us")
    headline = Column(String(300), default="Built on 40 Years of Gulf Expertise")
    body_paragraph1 = Column(Text, default="Saddam Scrap and Metal is founded by Mohammad Hamad Al Bahar (Kuwait) and Bandar Mohammad Al Ghamdi (Saudi Arabia).")
    body_paragraph2 = Column(Text, default="From major construction and industrial projects to banking and international trade, our founders bring unmatched credibility to every deal.")
    photo_url = Column(String(500), nullable=True)
    founded_year = Column(String(20), default="Est. 1984")
    headquarters = Column(String(100), default="Jeddah, KSA")
    operations = Column(String(100), default="Gulf & Global")
    specialty = Column(String(100), default="Alloys & Scrap")
    quote_text = Column(Text, default="Leveraging more than 40 years of hands-on experience in the Gulf and Middle East's key sectors.")
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class StatsContent(Base):
    __tablename__ = "stats_content"
    id = Column(Integer, primary_key=True)
    annual_tonnage = Column(String(50), default="1.2M+")
    annual_tonnage_sub = Column(String(50), default="metric tons")
    countries_served = Column(String(50), default="30+")
    countries_served_sub = Column(String(50), default="worldwide")
    years_in_industry = Column(String(50), default="40+")
    years_in_industry_sub = Column(String(50), default="of expertise")
    global_partners = Column(String(50), default="150+")
    global_partners_sub = Column(String(50), default="and growing")
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class Testimonial(Base):
    __tablename__ = "testimonials"
    id = Column(Integer, primary_key=True, index=True)
    quote = Column(Text, nullable=False)
    author_name = Column(String(100), nullable=False)
    author_title = Column(String(150), nullable=False)
    author_location = Column(String(100), nullable=True)
    photo_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class ContactInfo(Base):
    __tablename__ = "contact_info"
    id = Column(Integer, primary_key=True)
    phone = Column(String(50), default="+966 54 666 2697")
    whatsapp = Column(String(50), default="966546662697")
    email = Column(String(150), default="info@mahdmetals.com")
    address_line1 = Column(String(200), default="3469 Al Sarawat District")
    address_line2 = Column(String(200), default="Al Khomra Area")
    city = Column(String(100), default="Jeddah")
    postal_code = Column(String(50), default="22525-7891")
    country = Column(String(100), default="Saudi Arabia")
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class SiteSettings(Base):
    __tablename__ = "site_settings"
    id = Column(Integer, primary_key=True)
    company_name = Column(String(100), default="Saddam Scrap and Metal")
    tagline = Column(String(300), default="Your global partner in scrap and alloy metal trading.")
    footer_text = Column(String(500), default="© 2026 Saddam Scrap and Metal. All rights reserved.")
    meta_title = Column(String(200), default="Saddam Scrap and Metal | Global Scrap & Alloy Metal Trading")
    meta_description = Column(Text, default="Saddam Scrap and Metal connects the global supply chain with premium ferrous, non-ferrous, and specialty alloy metals.")
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class PageBanner(Base):
    __tablename__ = "page_banners"
    id = Column(Integer, primary_key=True)
    page = Column(String(50), unique=True, nullable=False)  # about, materials, contact
    title = Column(String(200), nullable=True)
    subtitle = Column(String(300), nullable=True)
    image_url = Column(String(500), nullable=True)
    min_height = Column(String(20), default="320px")
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class BrandingContent(Base):
    __tablename__ = "branding_content"
    id = Column(Integer, primary_key=True)
    logo_text_primary = Column(String(50), default="SADDAM")
    logo_text_secondary = Column(String(50), default=" Scrap and Metal")
    company_tagline = Column(String(300), default="Your global partner in scrap and alloy metal trading.")
    footer_copyright = Column(String(300), default="© 2026 Saddam Scrap and Metal. All rights reserved.")
    developer_name = Column(String(100), nullable=True)
    footer_locations = Column(String(200), default="Jeddah · Kuwait · Global")
    favicon_url = Column(String(500), nullable=True)
    logo_image_url = Column(String(500), nullable=True)
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
