import asyncio
from functools import partial

import cloudinary
import cloudinary.uploader
from fastapi import UploadFile

from app.config import get_settings


def _init_cloudinary() -> None:
    s = get_settings()
    cloudinary.config(
        cloud_name=s.CLOUDINARY_CLOUD_NAME,
        api_key=s.CLOUDINARY_API_KEY,
        api_secret=s.CLOUDINARY_API_SECRET,
        secure=True,
    )


_init_cloudinary()


async def upload_image(file: UploadFile, folder: str = "nyumbasasa") -> dict:
    """Upload an image to Cloudinary, auto-converting to WebP."""
    contents = await file.read()

    loop = asyncio.get_event_loop()
    result = await loop.run_in_executor(
        None,
        partial(
            cloudinary.uploader.upload,
            contents,
            folder=folder,
            resource_type="image",
            format="webp",
            quality="auto",
            fetch_format="auto",
        ),
    )
    return result


async def destroy_image(public_id: str) -> None:
    """Delete an image from Cloudinary by public_id."""
    loop = asyncio.get_event_loop()
    await loop.run_in_executor(
        None,
        partial(cloudinary.uploader.destroy, public_id),
    )
