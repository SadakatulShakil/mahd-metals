from fastapi import APIRouter, Depends, UploadFile, File, HTTPException
from sqlalchemy.orm import Session
import re
from ..database import get_db
from ..auth import get_current_admin
from ..cloudinary_helper import upload_image

def _make_slug(name: str) -> str:
    slug = name.lower().strip()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[\s_-]+', '-', slug)
    return slug
from ..models.site_content import (
    HeroContent, AboutContent, StatsContent,
    Testimonial, ContactInfo, SiteSettings, AboutBulletPoint, FAQ
)
from ..models.material import Material
from ..schemas.site_content import (
    HeroContentSchema, AboutContentSchema, StatsContentSchema,
    TestimonialCreate, TestimonialResponse, ContactInfoSchema, SiteSettingsSchema,
    AboutBulletCreate, AboutBulletResponse, FAQSchema
)
from ..schemas.material import MaterialBase, MaterialResponse
from typing import List

router = APIRouter(prefix="/api/admin", tags=["admin"])

def get_or_create(db, Model):
    obj = db.query(Model).first()
    if not obj:
        obj = Model()
        db.add(obj)
        db.commit()
        db.refresh(obj)
    return obj

# ── HERO ──────────────────────────────────────────
@router.get("/hero", response_model=HeroContentSchema)
def get_hero(db: Session = Depends(get_db)):
    return get_or_create(db, HeroContent)

@router.put("/hero", response_model=HeroContentSchema)
def update_hero(data: HeroContentSchema, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = get_or_create(db, HeroContent)
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@router.post("/hero/image")
async def upload_hero_image(file: UploadFile = File(...), db: Session = Depends(get_db), _=Depends(get_current_admin)):
    content = await file.read()
    result = upload_image(content, folder="mahd-metals/hero", public_id="hero-bg")
    obj = get_or_create(db, HeroContent)
    obj.bg_image_url = result["url"]
    db.commit()
    return {"url": result["url"]}

# ── ABOUT ─────────────────────────────────────────
@router.get("/about", response_model=AboutContentSchema)
def get_about(db: Session = Depends(get_db)):
    return get_or_create(db, AboutContent)

@router.put("/about", response_model=AboutContentSchema)
def update_about(data: AboutContentSchema, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = get_or_create(db, AboutContent)
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@router.post("/about/image")
async def upload_about_image(file: UploadFile = File(...), db: Session = Depends(get_db), _=Depends(get_current_admin)):
    content = await file.read()
    result = upload_image(content, folder="mahd-metals/about", public_id="about-photo")
    obj = get_or_create(db, AboutContent)
    obj.photo_url = result["url"]
    db.commit()
    return {"url": result["url"]}

# ── STATS ─────────────────────────────────────────
@router.get("/stats", response_model=StatsContentSchema)
def get_stats(db: Session = Depends(get_db)):
    return get_or_create(db, StatsContent)

@router.put("/stats", response_model=StatsContentSchema)
def update_stats(data: StatsContentSchema, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = get_or_create(db, StatsContent)
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

# ── TESTIMONIALS ──────────────────────────────────
@router.get("/testimonials", response_model=List[TestimonialResponse])
def get_testimonials(db: Session = Depends(get_db)):
    return db.query(Testimonial).order_by(Testimonial.sort_order).all()

@router.post("/testimonials", response_model=TestimonialResponse)
def create_testimonial(data: TestimonialCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = Testimonial(**data.model_dump())
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/testimonials/{tid}", response_model=TestimonialResponse)
def update_testimonial(tid: int, data: TestimonialCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Testimonial).filter(Testimonial.id == tid).first()
    if not obj:
        raise HTTPException(404, "Not found")
    for k, v in data.model_dump().items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/testimonials/{tid}")
def delete_testimonial(tid: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Testimonial).filter(Testimonial.id == tid).first()
    if not obj:
        raise HTTPException(404, "Not found")
    db.delete(obj)
    db.commit()
    return {"success": True}

# ── MATERIALS ─────────────────────────────────────
@router.get("/materials", response_model=List[MaterialResponse])
def get_materials(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(Material).all()

@router.post("/materials", response_model=MaterialResponse)
def create_material(data: MaterialBase, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    slug = data.slug or _make_slug(data.name)
    if db.query(Material).filter(Material.slug == slug).first():
        slug = f"{slug}-{db.query(Material).count()}"
    fields = data.model_dump(exclude={'slug'})
    obj = Material(**fields, slug=slug)
    db.add(obj)
    db.commit()
    db.refresh(obj)
    return obj

@router.put("/materials/{mid}", response_model=MaterialResponse)
def update_material(mid: int, data: MaterialBase, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Material).filter(Material.id == mid).first()
    if not obj:
        raise HTTPException(404, "Not found")
    fields = data.model_dump(exclude_none=True)
    if not fields.get('slug'):
        fields['slug'] = _make_slug(data.name)
    for k, v in fields.items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

@router.delete("/materials/{mid}")
def delete_material(mid: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Material).filter(Material.id == mid).first()
    if not obj:
        raise HTTPException(404, "Not found")
    db.delete(obj)
    db.commit()
    return {"success": True}

@router.post("/materials/{mid}/image")
async def upload_material_image(mid: int, file: UploadFile = File(...), db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(Material).filter(Material.id == mid).first()
    if not obj:
        raise HTTPException(404, "Not found")
    content = await file.read()
    result = upload_image(content, folder="mahd-metals/materials", public_id=f"material-{obj.slug}")
    obj.image_url = result["url"]
    db.commit()
    return {"url": result["url"]}

# ── CONTACT INFO ──────────────────────────────────
@router.get("/contact-info", response_model=ContactInfoSchema)
def get_contact_info(db: Session = Depends(get_db)):
    return get_or_create(db, ContactInfo)

@router.put("/contact-info", response_model=ContactInfoSchema)
def update_contact_info(data: ContactInfoSchema, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = get_or_create(db, ContactInfo)
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

# ── CONTACT SUBMISSIONS (inbox) ───────────────────
@router.get("/submissions")
def get_submissions(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    from ..models.contact import ContactSubmission
    return db.query(ContactSubmission).order_by(ContactSubmission.created_at.desc()).all()

@router.put("/submissions/{sid}/read")
def mark_read(sid: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    from ..models.contact import ContactSubmission
    obj = db.query(ContactSubmission).filter(ContactSubmission.id == sid).first()
    if not obj:
        raise HTTPException(404, "Not found")
    obj.is_read = True
    db.commit()
    return {"success": True}

# ── SITE SETTINGS ─────────────────────────────────
@router.get("/settings", response_model=SiteSettingsSchema)
def get_settings(db: Session = Depends(get_db)):
    return get_or_create(db, SiteSettings)

@router.put("/settings", response_model=SiteSettingsSchema)
def update_settings(data: SiteSettingsSchema, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = get_or_create(db, SiteSettings)
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(obj, k, v)
    db.commit()
    db.refresh(obj)
    return obj

# ── PAGE BANNERS ──────────────────────────────────
from ..models.site_content import PageBanner, BrandingContent
from ..schemas.site_content import PageBannerSchema, BrandingSchema

@router.get("/banners/{page}", response_model=PageBannerSchema)
def get_banner(page: str, db: Session = Depends(get_db)):
    obj = db.query(PageBanner).filter(PageBanner.page == page).first()
    if not obj:
        obj = PageBanner(page=page, title=page.capitalize(), subtitle="")
        db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.put("/banners/{page}", response_model=PageBannerSchema)
def update_banner(page: str, data: PageBannerSchema, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(PageBanner).filter(PageBanner.page == page).first()
    if not obj:
        obj = PageBanner(page=page)
        db.add(obj)
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(obj, k, v)
    db.commit(); db.refresh(obj)
    return obj

@router.post("/banners/{page}/image")
async def upload_banner_image(page: str, file: UploadFile = File(...), db: Session = Depends(get_db), _=Depends(get_current_admin)):
    content = await file.read()
    result = upload_image(content, folder="mahd-metals/banners", public_id=f"banner-{page}")
    obj = db.query(PageBanner).filter(PageBanner.page == page).first()
    if not obj:
        obj = PageBanner(page=page)
        db.add(obj)
    obj.image_url = result["url"]
    db.commit()
    return {"url": result["url"]}

# ── ABOUT BULLET POINTS ───────────────────────────────
@router.get("/about-bullets", response_model=List[AboutBulletResponse])
def get_about_bullets(db: Session = Depends(get_db)):
    return db.query(AboutBulletPoint).filter(AboutBulletPoint.is_active == True).order_by(AboutBulletPoint.order).all()

@router.get("/about-bullets/all", response_model=List[AboutBulletResponse])
def get_all_about_bullets(db: Session = Depends(get_db), _=Depends(get_current_admin)):
    return db.query(AboutBulletPoint).order_by(AboutBulletPoint.order).all()

@router.post("/about-bullets", response_model=AboutBulletResponse)
def create_about_bullet(data: AboutBulletCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = AboutBulletPoint(**data.model_dump())
    db.add(obj); db.commit(); db.refresh(obj)
    return obj

@router.put("/about-bullets/{bid}", response_model=AboutBulletResponse)
def update_about_bullet(bid: int, data: AboutBulletCreate, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(AboutBulletPoint).filter(AboutBulletPoint.id == bid).first()
    if not obj: raise HTTPException(404, "Not found")
    for k, v in data.model_dump().items():
        setattr(obj, k, v)
    db.commit(); db.refresh(obj)
    return obj

@router.delete("/about-bullets/{bid}")
def delete_about_bullet(bid: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = db.query(AboutBulletPoint).filter(AboutBulletPoint.id == bid).first()
    if not obj: raise HTTPException(404, "Not found")
    db.delete(obj); db.commit()
    return {"success": True}

# ── BRANDING ──────────────────────────────────────
@router.get("/branding", response_model=BrandingSchema)
def get_branding(db: Session = Depends(get_db)):
    return get_or_create(db, BrandingContent)

@router.put("/branding", response_model=BrandingSchema)
def update_branding(data: BrandingSchema, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    obj = get_or_create(db, BrandingContent)
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(obj, k, v)
    db.commit(); db.refresh(obj)
    return obj

@router.post("/branding/logo")
async def upload_logo(file: UploadFile = File(...), db: Session = Depends(get_db), _=Depends(get_current_admin)):
    content = await file.read()
    result = upload_image(content, folder="mahd-metals/branding", public_id="logo")
    obj = get_or_create(db, BrandingContent)
    obj.logo_image_url = result["url"]
    db.commit()
    return {"url": result["url"]}

# ── FAQs ──────────────────────────────────────────
@router.get("/faqs", response_model=List[FAQSchema])
def get_faqs(db: Session = Depends(get_db)):
    return db.query(FAQ).order_by(FAQ.order).all()

@router.post("/faqs", response_model=FAQSchema)
def create_faq(data: FAQSchema, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    faq = FAQ(**data.model_dump(exclude={'id'}))
    db.add(faq)
    db.commit()
    db.refresh(faq)
    return faq

@router.put("/faqs/{id}", response_model=FAQSchema)
def update_faq(id: int, data: FAQSchema, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    faq = db.query(FAQ).filter(FAQ.id == id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="Not found")
    for k, v in data.model_dump(exclude_none=True, exclude={'id'}).items():
        setattr(faq, k, v)
    db.commit()
    db.refresh(faq)
    return faq

@router.delete("/faqs/{id}")
def delete_faq(id: int, db: Session = Depends(get_db), _=Depends(get_current_admin)):
    faq = db.query(FAQ).filter(FAQ.id == id).first()
    if not faq:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(faq)
    db.commit()
    return {"ok": True}
