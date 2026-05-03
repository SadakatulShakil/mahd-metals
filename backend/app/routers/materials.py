from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.material import Material
from ..schemas.material import MaterialResponse
from typing import List

router = APIRouter(prefix="/api/materials", tags=["materials"])

@router.get("/", response_model=List[MaterialResponse])
def get_materials(db: Session = Depends(get_db)):
    return db.query(Material).filter(Material.is_active == True).all()

@router.get("/{slug}", response_model=MaterialResponse)
def get_material(slug: str, db: Session = Depends(get_db)):
    material = db.query(Material).filter(
        Material.slug == slug,
        Material.is_active == True
    ).first()
    if not material:
        raise HTTPException(status_code=404, detail="Material not found")
    return material
