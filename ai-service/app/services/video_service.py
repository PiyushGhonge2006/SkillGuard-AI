from pathlib import Path

import cv2

from app.services.yolo_service import yolo_service
from app.utils.detection_utils import (
    summarize_detections,
)


def process_video(
    video_path,
    confidence=0.35,
    frame_interval=30
):
    video_path = Path(video_path)

    if not video_path.exists():
        raise FileNotFoundError(
            f"Video not found: {video_path}"
        )

    capture = cv2.VideoCapture(
        str(video_path)
    )

    if not capture.isOpened():
        raise ValueError(
            "Unable to open video file"
        )

    frame_number = 0
    processed_frames = 0
    all_detections = []

    while True:
        success, frame = capture.read()

        if not success:
            break

        if frame_number % frame_interval == 0:
            detections = yolo_service.detect(
                frame,
                confidence
            )

            all_detections.extend(
                detections
            )

            processed_frames += 1

        frame_number += 1

    capture.release()

    summary = summarize_detections(
        all_detections
    )

    return {
        "sourceType": "video",
        "sourceFile": video_path.name,
        "totalFrames": frame_number,
        "processedFrames": processed_frames,
        "detections": all_detections,
        "summary": summary,
    }