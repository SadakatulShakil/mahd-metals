from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.contact import ContactSubmission
from ..schemas.contact import ContactCreate, ContactResponse
from ..config import settings
import aiosmtplib
from email.message import EmailMessage

router = APIRouter(prefix="/api/contact", tags=["contact"])

async def send_notification_email(name: str, email: str, subject: str, message: str):
    """Send email notification to admin team when contact form submitted"""
    try:
        msg = EmailMessage()
        msg["From"] = settings.SMTP_USER
        msg["To"] = settings.NOTIFY_EMAIL
        msg["Subject"] = f"New Inquiry: {subject} — from {name}"
        msg.set_content(f"""
New contact form submission on Saddam Scrap and Metal:

Name: {name}
Email: {email}
Subject: {subject}
Message:
{message or 'No message provided'}

---
Reply directly to: {email}
        """)

        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            await aiosmtplib.send(
                msg,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                start_tls=True,
                username=settings.SMTP_USER,
                password=settings.SMTP_PASSWORD,
            )
    except Exception as e:
        print(f"Notification email failed: {e}")

async def send_confirmation_email(name: str, email: str):
    """Send confirmation email to the user after form submission"""
    try:
        msg = EmailMessage()
        msg["From"] = settings.SMTP_USER
        msg["To"] = email
        msg["Subject"] = "We've received your inquiry — Saddam Scrap and Metal"
        msg.set_content(f"""Dear {name},

Thank you for contacting Saddam Scrap and Metal.

We've received your inquiry and will get back to you within 24 hours.

If you have any urgent questions, please feel free to call us directly.

Best regards,
Saddam Scrap and Metal Team
        """)

        if settings.SMTP_USER and settings.SMTP_PASSWORD:
            await aiosmtplib.send(
                msg,
                hostname=settings.SMTP_HOST,
                port=settings.SMTP_PORT,
                start_tls=True,
                username=settings.SMTP_USER,
                password=settings.SMTP_PASSWORD,
            )
    except Exception as e:
        print(f"Confirmation email failed: {e}")

@router.post("/", response_model=ContactResponse)
async def submit_contact(
    data: ContactCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    submission = ContactSubmission(
        name=data.name,
        email=data.email,
        subject=data.subject,
        message=data.message
    )
    db.add(submission)
    db.commit()

    background_tasks.add_task(
        send_notification_email,
        data.name, data.email, data.subject, data.message or ""
    )
    background_tasks.add_task(
        send_confirmation_email,
        data.name, data.email
    )

    return ContactResponse(
        success=True,
        message="Thank you! We will get back to you within 24 hours."
    )
