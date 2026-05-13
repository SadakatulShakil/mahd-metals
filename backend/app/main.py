from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import Base, engine
from .routers import contact, materials
from .routers import auth, admin_content
from .config import settings

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MAHD Metals API",
    description="Backend API for MAHD Metals International",
    version="2.0.0"
)

origins = [
    settings.FRONTEND_URL,
    "http://localhost:5173",
    # "https://mahdmetals.com",
    # "https://www.mahdmetals.com",
    # "https://mahd-metals.vercel.app",
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
