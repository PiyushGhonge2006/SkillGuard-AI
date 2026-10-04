from pathlib import Path

from app.services.yolo_service import yolo_service
from app.utils.detection_utils import (
    summarize_detections,
    get_detection_statistics,
)


def process_image(
    image_path,
    confidence=0.35
):
    image_path = Path(image_path)

    if not image_path.exists():
        raise FileNotFoundError(
            f"Image not found: {image_path}"
        )

    detections = yolo_service.detect(
        str(image_path),
        confidence
    )

    summary = summarize_detections(
        detections
    )

    statistics = get_detection_statistics(
        detections
    )

    return {
        "sourceType": "image",
        "sourceFile": image_path.name,
        "detections": detections,
        "summary": summary,
        "statistics": statistics,
    }