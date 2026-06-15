from pydantic import BaseModel
from typing import Optional

class MaterialBase(BaseModel):
    slug: Optional[str] = None   # auto-generated from name if omitted
    name: str
    category: str
    description: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    image_url: Optional[str] = None
    full_description: Optional[str] = None
    specifications: Optional[str] = None
    applications: Optional[str] = None
    origin_countries: Optional[str] = None
    min_order: Optional[str] = None
    packaging: Optional[str] = None
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None

class MaterialResponse(MaterialBase):
    id: int
    slug: str   # always present after creation
    is_active: bool

    class Config:
        from_attributes = True
