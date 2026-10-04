from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.routes.detection import router as detection_router


BASE_DIR = Path(__file__).resolve().parents[1]
UPLOAD_DIR = BASE_DIR / "uploads"

UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


app = FastAPI(
    title="SkillGuard AI Detection Service",
    description="YOLO11 based training centre monitoring service",
    version="1.0.0",
)


# Serve uploaded images/videos
app.mount(
    "/uploads",
    StaticFiles(directory=str(UPLOAD_DIR)),
    name="uploads",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(detection_router)


@app.get("/")
async def root():
    return {
        "success": True,
        "message": "SkillGuard AI Detection Service is running",
    }


@app.get("/health")
async def health():
    return {
        "success": True,
        "service": "FastAPI + YOLO11",
        "status": "online",
    }