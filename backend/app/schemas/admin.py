from pydantic import BaseModel, EmailStr
from typing import Optional

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class AdminCreate(BaseModel):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
