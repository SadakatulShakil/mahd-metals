from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import contact, materials
from .config import settings

# Create all DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MAHD Metals API",
    description="Backend API for MAHD Metals International",
    version="1.0.0"
)

# ─────────────────────────────────────────────
# CORS — allowed origins
# ─────────────────────────────────────────────
origins = [
    settings.FRONTEND_URL,               # local dev or production domain
    "http://localhost:5173",              # Vite dev server (always allow locally)

    # Uncomment when you deploy to Vercel:
    # "https://mahd-metals.vercel.app",

    # Uncomment when you have your domain:
    # "https://mahdmetals.com",
    # "https://www.mahdmetals.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(contact.router)
app.include_router(materials.router)

@app.get("/api/health")
def health_check():
    return {"status": "ok", "environment": settings.ENVIRONMENT}

@app.get("/api/stats")
def get_stats():
    return {
        "annual_tonnage": "1.2M+",
        "countries_served": "30+",
        "years_in_industry": "40+",
        "global_partners": "150+"
    }
