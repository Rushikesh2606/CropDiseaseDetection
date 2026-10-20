"""
PlantGuard AI — Pydantic response schemas.
"""
from __future__ import annotations
from typing import Optional
from pydantic import BaseModel, Field


# ── Health ─────────────────────────────────────────────────────────────────────

class HealthResponse(BaseModel):
    status: str = Field(..., example="ok")
    model_loaded: bool
    num_classes: Optional[int] = None
    device: str
    calibrated: bool
    temperature: float
    confidence_threshold: float
    max_upload_mb: int
    allowed_types: list[str]


# ── Classes ────────────────────────────────────────────────────────────────────

class ClassItem(BaseModel):
    class_id: str
    label: str
    crop: str
    condition: str
    is_healthy: bool


class ClassesResponse(BaseModel):
    classes: list[ClassItem]


# ── Prediction ─────────────────────────────────────────────────────────────────

class TopPrediction(BaseModel):
    rank: int
    class_id: str
    label: str
    confidence: float = Field(..., ge=0.0, le=1.0)


class PredictionResponse(BaseModel):
    status: str = Field(..., example="confident")  # "confident" | "uncertain"
    predicted_class: str
    label: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    threshold: float
    calibrated: bool
    top_predictions: list[TopPrediction]
    inference_time_ms: float


# ── Diseases ───────────────────────────────────────────────────────────────────

class DiseaseSummary(BaseModel):
    class_id: str
    crop: str
    condition: str
    label: str
    is_healthy: bool
    summary: str


class DiseaseDetail(BaseModel):
    class_id: str
    crop: str
    condition: str
    label: str
    is_healthy: bool
    summary: str
    symptoms: list[str]
    causes: list[str]
    management: list[str]
    prevention: list[str]
    notes: str


class DiseasesListResponse(BaseModel):
    diseases: list[DiseaseSummary]


# ── Error ──────────────────────────────────────────────────────────────────────

class ErrorResponse(BaseModel):
    error: str
    detail: str
    code: str
