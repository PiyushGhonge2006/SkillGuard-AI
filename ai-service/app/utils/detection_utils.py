from collections import Counter


def summarize_detections(detections):
    counts = Counter()

    for detection in detections:
        class_name = detection.get("className")

        if class_name:
            counts[class_name] += 1

    return [
        {
            "name": name,
            "count": count
        }
        for name, count in counts.items()
    ]


def count_class(detections, class_name):
    return sum(
        1
        for detection in detections
        if detection.get("className", "").lower()
        == class_name.lower()
    )


def get_detection_statistics(detections):
    summary = summarize_detections(detections)

    return {
        "totalObjects": len(detections),
        "uniqueClasses": len(summary),
        "objects": summary,
    }