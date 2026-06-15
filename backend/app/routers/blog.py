from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models.blog import BlogPost
from ..schemas.blog import BlogPostSchema
from ..auth import get_current_admin
from ..cloudinary_helper import upload_image
import re

router = APIRouter(prefix="/api", tags=["blog"])

def make_slug(title: str) -> str:
    slug = title.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_-]+', '-', slug)
    return slug

# Public endpoints
@router.get("/blog", response_model=List[BlogPostSchema])
def get_published_posts(db: Session = Depends(get_db)):
    return db.query(BlogPost).filter(BlogPost.is_published == True).order_by(BlogPost.created_at.desc()).all()

@router.get("/blog/{slug}", response_model=BlogPostSchema)
def get_post_by_slug(slug: str, db: Session = Depends(get_db)):
    post = db.query(BlogPost).filter(BlogPost.slug == slug, BlogPost.is_published == True).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

# Admin endpoints
@router.get("/admin/blog", response_model=List[BlogPostSchema])
def admin_get_all_posts(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(BlogPost).order_by(BlogPost.created_at.desc()).all()

@router.post("/admin/blog", response_model=BlogPostSchema)
def create_post(data: BlogPostSchema, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    slug = make_slug(data.title or "post")
    existing = db.query(BlogPost).filter(BlogPost.slug == slug).first()
    if existing:
        slug = f"{slug}-{db.query(BlogPost).count()}"
    post = BlogPost(**data.model_dump(exclude={'id', 'created_at', 'slug'}), slug=slug)
    db.add(post)
    db.commit()
    db.refresh(post)
    return post

@router.put("/admin/blog/{id}", response_model=BlogPostSchema)
def update_post(id: int, data: BlogPostSchema, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    post = db.query(BlogPost).filter(BlogPost.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.model_dump(exclude_none=True, exclude={'id', 'created_at'}).items():
        setattr(post, k, v)
    db.commit()
    db.refresh(post)
    return post

@router.delete("/admin/blog/{id}")
def delete_post(id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    post = db.query(BlogPost).filter(BlogPost.id == id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(post)
    db.commit()
    return {"ok": True}

@router.post("/admin/blog/{id}/image")
async def upload_blog_image(id: int, file: UploadFile = File(...), db: Session = Depends(get_db), _=Depends(get_current_admin)):
    content = await file.read()
    result = upload_image(content, folder="saddam-metal/blog", public_id=f"blog-{id}")
    post = db.query(BlogPost).filter(BlogPost.id == id).first()
    if post:
        post.cover_image_url = result["url"]
        db.commit()
    return {"url": result["url"]}
