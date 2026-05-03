from pydantic import BaseModel
from typing import Optional

class MaterialBase(BaseModel):
    slug: str
    name: str
    category: str
    description: Optional[str] = None
    seo_title: Optional[str] = None
    seo_description: Optional[str] = None
    image_url: Optional[str] = None

class MaterialResponse(MaterialBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True
