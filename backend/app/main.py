from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import contact, materials
from .routers import auth, admin_content
from .routers import blog
from .models import blog as blog_models  # noqa: F401 — registers BlogPost with Base
from .config import settings

Base.metadata.create_all(bind=engine)

# Additive column migrations (safe to run on every startup)
with engine.connect() as conn:
    for col in [
        "ALTER TABLE branding_content ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(500)",
        "ALTER TABLE branding_content ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(500)",
        "ALTER TABLE branding_content ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500)",
        "ALTER TABLE materials ADD COLUMN IF NOT EXISTS full_description TEXT",
        "ALTER TABLE materials ADD COLUMN IF NOT EXISTS specifications TEXT",
        "ALTER TABLE materials ADD COLUMN IF NOT EXISTS applications VARCHAR(500)",
        "ALTER TABLE materials ADD COLUMN IF NOT EXISTS origin_countries VARCHAR(500)",
        "ALTER TABLE materials ADD COLUMN IF NOT EXISTS min_order VARCHAR(100)",
        "ALTER TABLE materials ADD COLUMN IF NOT EXISTS packaging VARCHAR(200)",
        "ALTER TABLE materials ADD COLUMN IF NOT EXISTS meta_title VARCHAR(300)",
        "ALTER TABLE materials ADD COLUMN IF NOT EXISTS meta_description VARCHAR(500)",
    ]:
        try:
            conn.execute(__import__('sqlalchemy').text(col))
            conn.commit()
        except Exception:
            pass

app = FastAPI(
    title="MAHD Metals API",
    version="2.0.0"
)

origins = [
    "http://localhost:5173",
    "https://saddamscarpandmetal.com",
    "https://www.saddamscarpandmetal.com",
    "https://mahd-metals.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

PUBLIC_GET_PREFIXES = (
    "/api/admin/hero", "/api/admin/about", "/api/admin/stats",
    "/api/admin/testimonials", "/api/admin/contact-info", "/api/admin/settings",
    "/api/admin/branding", "/api/admin/banners", "/api/admin/about-bullets",
    "/api/admin/faqs",
    "/api/blog",
    "/api/materials/",
)

@app.middleware("http")
async def cache_headers(request: Request, call_next):
    response: Response = await call_next(request)
    if request.method == "GET" and request.url.path.startswith(tuple(PUBLIC_GET_PREFIXES)):
        response.headers["Cache-Control"] = "public, max-age=300, stale-while-revalidate=600"
    return response

app.include_router(contact.router)
app.include_router(materials.router)
app.include_router(auth.router)
app.include_router(admin_content.router)
app.include_router(blog.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}
