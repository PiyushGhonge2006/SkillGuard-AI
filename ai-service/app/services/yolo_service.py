from pathlib import Path
from ultralytics import YOLO


BASE_DIR = Path(__file__).resolve().parents[2]
MODEL_PATH = BASE_DIR / "models" / "yolo11n.pt"


class YOLOService:
    def __init__(self):
        self.model = YOLO(str(MODEL_PATH))

    def detect(self, source, confidence=0.35):
        results = self.model(
            source,
            conf=confidence,
            verbose=False
        )

        detections = []

        for result in results:
            names = result.names

            if result.boxes is None:
                continue

            for box in result.boxes:
                class_id = int(box.cls[0])
                confidence_score = float(box.conf[0])

                xyxy = box.xyxy[0].tolist()

                detections.append({
                    "classId": class_id,
                    "className": names[class_id],
                    "confidence": round(
                        confidence_score,
                        4
                    ),
                    "bbox": {
                        "x1": round(xyxy[0], 2),
                        "y1": round(xyxy[1], 2),
                        "x2": round(xyxy[2], 2),
                        "y2": round(xyxy[3], 2),
                    },
                })

        return detections


yolo_service = YOLOService()