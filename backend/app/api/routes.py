"""
PlantGuard AI — FastAPI router (all /api/* endpoints).
"""
from __future__ import annotations

import logging

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.config import (
    CONFIDENCE_THRESHOLD,
    MAX_UPLOAD_MB,
    ALLOWED_TYPES,
    CALIBRATION_PATH,
)
from app.schemas import (
    ClassItem,
    ClassesResponse,
    DiseaseDetail,
    DiseasesListResponse,
    ErrorResponse,
    HealthResponse,
    PredictionResponse,
)
from app.services.model_service import model_service
from app.services.image_service import ImageValidationError, validate_and_preprocess
from app.services.prediction_service import run_prediction
from app.services.disease_service import (
    get_all_diseases,
    get_disease,
    get_label_for_class,
    check_kb_completeness,
)

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api", tags=["PlantGuard AI"])


# ── Helper ────────────────────────────────────────────────────────────────────

def _json_error(status_code: int, error: str, detail: str, code: str) -> HTTPException:
    return HTTPException(
        status_code=status_code,
        detail={"error": error, "detail": detail, "code": code},
    )


# ── Health ────────────────────────────────────────────────────────────────────

@router.get(
    "/health",
    response_model=HealthResponse,
    summary="API and model health check",
    responses={200: {"model": HealthResponse}},
)
async def health() -> HealthResponse:
    if not model_service.calibrated and CALIBRATION_PATH.exists():
        model_service._load_calibration()
    return HealthResponse(
        status="ok",
        model_loaded=model_service.model_loaded,
        num_classes=model_service.num_classes if model_service.model_loaded else None,
        device=str(model_service.device),
        calibrated=model_service.calibrated,
        temperature=model_service.temperature,
        confidence_threshold=CONFIDENCE_THRESHOLD,
        max_upload_mb=MAX_UPLOAD_MB,
        allowed_types=ALLOWED_TYPES,
    )


# ── Classes ────────────────────────────────────────────────────────────────────

@router.get(
    "/classes",
    response_model=ClassesResponse,
    summary="List all supported crop disease classes",
)
async def classes() -> ClassesResponse:
    from app.services.disease_service import _RAW  # internal; fine here

    names = (
        model_service.class_names
        if model_service.class_names
        else list(_RAW.keys())
    )

    items: list[ClassItem] = []
    for name in names:
        entry = _RAW.get(name)
        if entry:
            items.append(
                ClassItem(
                    class_id=name,
                    label=entry["label"],
                    crop=entry["crop"],
                    condition=entry["condition"],
                    is_healthy=entry["is_healthy"],
                )
            )
        else:
            items.append(
                ClassItem(
                    class_id=name,
                    label=name.replace("___", " — ").replace("_", " "),
                    crop=name.split("___")[0] if "___" in name else name,
                    condition=name.split("___")[1] if "___" in name else name,
                    is_healthy="healthy" in name.lower(),
                )
            )
    return ClassesResponse(classes=items)


# ── Diseases ──────────────────────────────────────────────────────────────────

@router.get(
    "/diseases",
    response_model=DiseasesListResponse,
    summary="List all diseases with summaries",
)
async def diseases_list() -> DiseasesListResponse:
    return DiseasesListResponse(diseases=get_all_diseases())


@router.get(
    "/diseases/{class_id:path}",
    response_model=DiseaseDetail,
    summary="Get full details for a disease class",
    responses={404: {"model": ErrorResponse}},
)
async def disease_detail(class_id: str) -> DiseaseDetail:
    detail = get_disease(class_id)
    if detail is None:
        raise _json_error(
            404,
            "Not Found",
            f"No disease entry found for class_id '{class_id}'.",
            "DISEASE_NOT_FOUND",
        )
    return detail


# ── Predict ────────────────────────────────────────────────────────────────────

@router.post(
    "/predict",
    response_model=PredictionResponse,
    summary="Classify a leaf image",
    responses={
        200: {"model": PredictionResponse},
        400: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
    },
)
async def predict(file: UploadFile = File(...)) -> PredictionResponse:
    # ── Model availability check ───────────────────────────────────────────────
    if not model_service.model_loaded:
        raise _json_error(
            503,
            "Model Not Available",
            (
                "The model weights (best_model.pth) have not been loaded. "
                "Place the file at backend/models/best_model.pth and restart the server."
            ),
            "MODEL_NOT_LOADED",
        )

    # ── Read upload ────────────────────────────────────────────────────────────
    raw_bytes = await file.read()

    # ── Validate and preprocess ────────────────────────────────────────────────
    try:
        tensor, _ = validate_and_preprocess(
            file_bytes=raw_bytes,
            content_type=file.content_type,
            filename=file.filename,
        )
    except ImageValidationError as exc:
        raise _json_error(400, "Invalid Image", str(exc), exc.code)
    except Exception as exc:
        logger.exception("Unexpected error during image processing")
        raise _json_error(500, "Processing Error", str(exc), "PROCESSING_ERROR")

    # ── Run inference ──────────────────────────────────────────────────────────
    try:
        result = run_prediction(tensor)
    except Exception as exc:
        logger.exception("Inference failed")
        raise _json_error(500, "Inference Error", str(exc), "INFERENCE_ERROR")

    logger.info(
        "Prediction: class=%s confidence=%.4f status=%s time=%.1fms",
        result.predicted_class,
        result.confidence,
        result.status,
        result.inference_time_ms,
    )
    return result
