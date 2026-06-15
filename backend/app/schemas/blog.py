from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class BlogPostSchema(BaseModel):
    id: Optional[int] = None
    title: Optional[str] = None
    slug: Optional[str] = None
    excerpt: Optional[str] = None
    content: Optional[str] = None
    cover_image_url: Optional[str] = None
    category: Optional[str] = None
    tags: Optional[str] = None
    author: Optional[str] = None
    is_published: Optional[bool] = False
    meta_title: Optional[str] = None
    meta_description: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
