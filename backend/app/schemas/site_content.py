from pydantic import BaseModel
from typing import Optional

class HeroContentSchema(BaseModel):
    badge_text: Optional[str] = None
    headline_line1: Optional[str] = None
    headline_line2: Optional[str] = None
    subheadline: Optional[str] = None
    cta_primary_text: Optional[str] = None
    cta_secondary_text: Optional[str] = None
    bg_image_url: Optional[str] = None

    class Config:
        from_attributes = True

class AboutContentSchema(BaseModel):
    section_label: Optional[str] = None
    headline: Optional[str] = None
    body_paragraph1: Optional[str] = None
    body_paragraph2: Optional[str] = None
    photo_url: Optional[str] = None
    founded_year: Optional[str] = None
    headquarters: Optional[str] = None
    operations: Optional[str] = None
    specialty: Optional[str] = None
    quote_text: Optional[str] = None

    class Config:
        from_attributes = True

class StatsContentSchema(BaseModel):
    annual_tonnage: Optional[str] = None
    annual_tonnage_sub: Optional[str] = None
    countries_served: Optional[str] = None
    countries_served_sub: Optional[str] = None
    years_in_industry: Optional[str] = None
    years_in_industry_sub: Optional[str] = None
    global_partners: Optional[str] = None
    global_partners_sub: Optional[str] = None

    class Config:
        from_attributes = True

class TestimonialCreate(BaseModel):
    quote: str
    author_name: str
    author_title: str
    author_location: Optional[str] = None
    photo_url: Optional[str] = None
    is_active: bool = True
    sort_order: int = 0

class TestimonialResponse(TestimonialCreate):
    id: int
    class Config:
        from_attributes = True

class ContactInfoSchema(BaseModel):
    phone: Optional[str] = None
    phone_alternative: Optional[str] = None
    phone_alternative_label: Optional[str] = None
    whatsapp: Optional[str] = None
    email: Optional[str] = None
    address_line1: Optional[str] = None
    address_line2: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None

    class Config:
        from_attributes = True

class SiteSettingsSchema(BaseModel):
    company_name: Optional[str] = None
    tagline: Optional[str] = None
    footer_text: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

    class Config:
        from_attributes = True

class PageBannerSchema(BaseModel):
    page: Optional[str] = None
    title: Optional[str] = None
    subtitle: Optional[str] = None
    image_url: Optional[str] = None
    min_height: Optional[str] = None

    class Config:
        from_attributes = True

class AboutBulletCreate(BaseModel):
    text: str
    order: int = 0
    is_active: bool = True

class AboutBulletResponse(AboutBulletCreate):
    id: int
    class Config:
        from_attributes = True

class BrandingSchema(BaseModel):
    logo_text_primary: Optional[str] = None
    logo_text_secondary: Optional[str] = None
    company_tagline: Optional[str] = None
    footer_copyright: Optional[str] = None
    developer_name: Optional[str] = None
    footer_locations: Optional[str] = None
    favicon_url: Optional[str] = None
    logo_image_url: Optional[str] = None
    facebook_url: Optional[str] = None
    instagram_url: Optional[str] = None
    linkedin_url: Optional[str] = None

    class Config:
        from_attributes = True

class FAQSchema(BaseModel):
    id: Optional[int] = None
    question: Optional[str] = None
    answer: Optional[str] = None
    order: Optional[int] = 0
    is_active: Optional[bool] = True

    class Config:
        from_attributes = True
