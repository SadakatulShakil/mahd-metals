import cloudinary
import cloudinary.uploader
from .config import settings

cloudinary.config(
    cloud_name=settings.CLOUDINARY_CLOUD_NAME,
    api_key=settings.CLOUDINARY_API_KEY,
    api_secret=settings.CLOUDINARY_API_SECRET,
)

def upload_image(file_bytes: bytes, folder: str = "mahd-metals", public_id: str = None) -> dict:
    options = {"folder": folder, "resource_type": "image"}
    if public_id:
        options["public_id"] = public_id
    result = cloudinary.uploader.upload(file_bytes, **options)
    return {
        "url": result["secure_url"],
        "public_id": result["public_id"],
    }

def delete_image(public_id: str):
    cloudinary.uploader.destroy(public_id)
