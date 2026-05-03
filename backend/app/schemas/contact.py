from pydantic import BaseModel, EmailStr

class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str | None = None

class ContactResponse(BaseModel):
    success: bool
    message: str
