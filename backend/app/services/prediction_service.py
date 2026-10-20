"""
Prediction service — wraps model inference with threshold logic and schema assembly.
"""
from __future__ import annotations

import logging
from typing import TYPE_CHECKING

from app.config import CONFIDENCE_THRESHOLD
from app.schemas import PredictionResponse, TopPrediction
from app.services.model_service import model_service
from app.services.disease_service import get_label_for_class

if TYPE_CHECKING:
    import torch

logger = logging.getLogger(__name__)

NUM_TOP = 3


def run_prediction(tensor: "torch.Tensor") -> PredictionResponse:
    """
    Run inference, apply threshold, return a fully formed PredictionResponse.
    Raises RuntimeError if model is not loaded.
    """
    probs, inference_time_ms = model_service.predict(tensor)

    # ── Sort by confidence descending ──────────────────────────────────────────
    indexed = sorted(enumerate(probs), key=lambda x: x[1], reverse=True)

    top_idx, top_conf = indexed[0]
    predicted_class = model_service.class_names[top_idx]
    label = get_label_for_class(predicted_class)

    status = "confident" if top_conf >= CONFIDENCE_THRESHOLD else "uncertain"

    top_predictions = [
        TopPrediction(
            rank=rank + 1,
            class_id=model_service.class_names[idx],
            label=get_label_for_class(model_service.class_names[idx]),
            confidence=round(conf, 6),
        )
        for rank, (idx, conf) in enumerate(indexed[:NUM_TOP])
    ]

    return PredictionResponse(
        status=status,
        predicted_class=predicted_class,
        label=label,
        confidence=round(top_conf, 6),
        threshold=CONFIDENCE_THRESHOLD,
        calibrated=model_service.calibrated,
        top_predictions=top_predictions,
        inference_time_ms=round(inference_time_ms, 2),
    )
