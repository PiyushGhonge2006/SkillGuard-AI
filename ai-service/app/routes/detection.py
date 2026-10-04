import os
import shutil
from pathlib import Path

from fastapi import (
    APIRouter,
    File,
    UploadFile,
    HTTPException,
)

from app.services.image_service import (
    process_image,
)

from app.services.video_service import (
    process_video,
)


router = APIRouter(
    prefix="/api/detection",
    tags=["Detection"],
)


BASE_DIR = Path(__file__).resolve().parents[2]

UPLOAD_DIR = BASE_DIR / "uploads"

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
}

VIDEO_EXTENSIONS = {
    ".mp4",
    ".avi",
    ".mov",
    ".mkv",
    ".webm",
}


@router.post("/image")
async def detect_image(
    file: UploadFile = File(...)
):
    extension = Path(
        file.filename
    ).suffix.lower()

    if extension not in IMAGE_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported image format"
        )

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    try:
        result = process_image(
            file_path
        )

        return {
            "success": True,
            "data": result,
        }

    except Exception as error:
        if file_path.exists():
            os.remove(file_path)

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.post("/video")
async def detect_video(
    file: UploadFile = File(...)
):
    extension = Path(
        file.filename
    ).suffix.lower()

    if extension not in VIDEO_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported video format"
        )

    file_path = UPLOAD_DIR / file.filename

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    try:
        result = process_video(
            file_path
        )

        return {
            "success": True,
            "data": result,
        }

    except Exception as error:
        if file_path.exists():
            os.remove(file_path)

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.get("/health")
async def detection_health():
    return {
        "success": True,
        "message": "Detection service is running",
    }