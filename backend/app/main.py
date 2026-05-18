from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import contact, materials
from .routers import auth, admin_content
from .config import settings

Base.metadata.create_all(bind=engine)

# Additive column migrations (safe to run on every startup)
with engine.connect() as conn:
    for col in [
        "ALTER TABLE branding_content ADD COLUMN IF NOT EXISTS facebook_url VARCHAR(500)",
        "ALTER TABLE branding_content ADD COLUMN IF NOT EXISTS instagram_url VARCHAR(500)",
        "ALTER TABLE branding_content ADD COLUMN IF NOT EXISTS linkedin_url VARCHAR(500)",
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

app.include_router(contact.router)
app.include_router(materials.router)
app.include_router(auth.router)
app.include_router(admin_content.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}
