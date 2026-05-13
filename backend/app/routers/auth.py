from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.admin import AdminUser
from ..schemas.admin import AdminLogin, Token, AdminCreate
from ..auth import hash_password, verify_password, create_token, get_current_admin

router = APIRouter(prefix="/api/admin/auth", tags=["auth"])

@router.post("/login", response_model=Token)
def login(data: AdminLogin, db: Session = Depends(get_db)):
    admin = db.query(AdminUser).filter(AdminUser.email == data.email).first()
    if not admin or not verify_password(data.password, admin.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_token({"sub": admin.email})
    return Token(access_token=token)

@router.get("/me")
def get_me(current_admin = Depends(get_current_admin)):
    return {"email": current_admin.email, "full_name": current_admin.full_name}
