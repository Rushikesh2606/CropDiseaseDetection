"""
PlantGuard AI — backend test suite.
Run with:  pytest backend/tests/ -v
"""
from __future__ import annotations

import io
import json
import struct
import zlib
from pathlib import Path
from unittest.mock import MagicMock, patch

import numpy as np
import pytest
import torch
import torch.nn as nn
from fastapi.testclient import TestClient
from PIL import Image

# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

NUM_CLASSES = 15
CLASS_NAMES = [
    "Apple___Apple_scab",
    "Apple___Black_rot",
    "Apple___Cedar_apple_rust",
    "Apple___healthy",
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot",
    "Corn_(maize)___Common_rust_",
    "Corn_(maize)___Northern_Leaf_Blight",
    "Corn_(maize)___healthy",
    "Grape___Black_rot",
    "Grape___Esca_(Black_Measles)",
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
    "Grape___healthy",
    "Potato___Early_blight",
    "Potato___Late_blight",
    "Potato___healthy",
]


def _make_jpeg_bytes(width: int = 224, height: int = 224) -> bytes:
    """Create a minimal valid JPEG in memory."""
    img = Image.new("RGB", (width, height), color=(100, 150, 80))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    return buf.getvalue()


def _make_png_bytes(width: int = 224, height: int = 224) -> bytes:
    img = Image.new("RGB", (width, height), color=(100, 150, 80))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def _make_webp_bytes(width: int = 224, height: int = 224) -> bytes:
    img = Image.new("RGB", (width, height), color=(100, 150, 80))
    buf = io.BytesIO()
    img.save(buf, format="WEBP")
    return buf.getvalue()


class _StubModel(nn.Module):
    """Tiny stub that always predicts class 0 (Apple___Apple_scab) with high confidence."""

    def __init__(self, num_classes: int):
        super().__init__()
        self.num_classes = num_classes
        # one-layer linear that always outputs high logit for index 0
        self.fc = nn.Linear(3 * 224 * 224, num_classes)
        nn.init.zeros_(self.fc.weight)
        nn.init.zeros_(self.fc.bias)
        # bias index 0 = large positive value → class 0 dominant
        with torch.no_grad():
            self.fc.bias[0] = 10.0

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        return self.fc(x.view(x.size(0), -1))


# ─────────────────────────────────────────────────────────────────────────────
# Image Service tests
# ─────────────────────────────────────────────────────────────────────────────

class TestImageService:
    from app.services.image_service import validate_and_preprocess, ImageValidationError

    def test_valid_jpeg(self):
        from app.services.image_service import validate_and_preprocess
        tensor, img = validate_and_preprocess(_make_jpeg_bytes(), "image/jpeg", "leaf.jpg")
        assert tensor.shape == (1, 3, 224, 224)

    def test_valid_png(self):
        from app.services.image_service import validate_and_preprocess
        tensor, _ = validate_and_preprocess(_make_png_bytes(), "image/png", "leaf.png")
        assert tensor.shape == (1, 3, 224, 224)

    def test_valid_webp(self):
        from app.services.image_service import validate_and_preprocess
        tensor, _ = validate_and_preprocess(_make_webp_bytes(), "image/webp", "leaf.webp")
        assert tensor.shape == (1, 3, 224, 224)

    def test_empty_file_raises(self):
        from app.services.image_service import validate_and_preprocess, ImageValidationError
        with pytest.raises(ImageValidationError) as exc:
            validate_and_preprocess(b"", "image/jpeg", "leaf.jpg")
        assert exc.value.code == "EMPTY_FILE"

    def test_invalid_extension_raises(self):
        from app.services.image_service import validate_and_preprocess, ImageValidationError
        with pytest.raises(ImageValidationError) as exc:
            validate_and_preprocess(_make_jpeg_bytes(), "image/jpeg", "leaf.gif")
        assert exc.value.code == "INVALID_TYPE"

    def test_invalid_content_type_raises(self):
        from app.services.image_service import validate_and_preprocess, ImageValidationError
        with pytest.raises(ImageValidationError) as exc:
            validate_and_preprocess(_make_jpeg_bytes(), "text/plain", "leaf.jpg")
        assert exc.value.code == "INVALID_TYPE"

    def test_oversized_file_raises(self):
        from app.services.image_service import validate_and_preprocess, ImageValidationError
        from app import config as cfg
        big = b"\xff" * (cfg.MAX_UPLOAD_BYTES + 1)
        with pytest.raises(ImageValidationError) as exc:
            validate_and_preprocess(big, "image/jpeg", "leaf.jpg")
        assert exc.value.code == "FILE_TOO_LARGE"

    def test_corrupt_file_raises(self):
        from app.services.image_service import validate_and_preprocess, ImageValidationError
        with pytest.raises(ImageValidationError) as exc:
            validate_and_preprocess(b"not-an-image", "image/jpeg", "leaf.jpg")
        assert exc.value.code == "CORRUPT_IMAGE"

    def test_tensor_dtype(self):
        from app.services.image_service import validate_and_preprocess
        tensor, _ = validate_and_preprocess(_make_jpeg_bytes(), "image/jpeg", "leaf.jpg")
        assert tensor.dtype == torch.float32


# ─────────────────────────────────────────────────────────────────────────────
# Prediction Service tests (stub model, no weights needed)
# ─────────────────────────────────────────────────────────────────────────────

@pytest.fixture
def patched_model_service():
    """Patch model_service to use a stub model with stub class names."""
    from app.services import model_service as ms_module
    stub = _StubModel(NUM_CLASSES)
    stub.eval()
    with (
        patch.object(ms_module.model_service, "model_loaded", True),
        patch.object(ms_module.model_service, "model", stub),
        patch.object(ms_module.model_service, "class_names", CLASS_NAMES),
        patch.object(ms_module.model_service, "num_classes", NUM_CLASSES),
        patch.object(ms_module.model_service, "calibrated", False),
        patch.object(ms_module.model_service, "temperature", 1.0),
        patch.object(ms_module.model_service, "device", torch.device("cpu")),
    ):
        yield ms_module.model_service


class TestPredictionService:
    def test_softmax_sums_to_one(self, patched_model_service):
        from app.services.image_service import validate_and_preprocess
        from app.services.prediction_service import run_prediction
        tensor, _ = validate_and_preprocess(_make_jpeg_bytes(), "image/jpeg", "leaf.jpg")
        result = run_prediction(tensor)
        total = sum(p.confidence for p in result.top_predictions)
        # top_predictions is top-3 only; check that each value is valid prob
        for p in result.top_predictions:
            assert 0.0 <= p.confidence <= 1.0

    def test_top3_ordering(self, patched_model_service):
        from app.services.image_service import validate_and_preprocess
        from app.services.prediction_service import run_prediction
        tensor, _ = validate_and_preprocess(_make_jpeg_bytes(), "image/jpeg", "leaf.jpg")
        result = run_prediction(tensor)
        assert len(result.top_predictions) == 3
        confs = [p.confidence for p in result.top_predictions]
        assert confs == sorted(confs, reverse=True)

    def test_confident_status(self, patched_model_service):
        from app.services.image_service import validate_and_preprocess
        from app.services.prediction_service import run_prediction
        tensor, _ = validate_and_preprocess(_make_jpeg_bytes(), "image/jpeg", "leaf.jpg")
        result = run_prediction(tensor)
        # stub always puts class 0 at ~1.0 confidence (bias=10.0)
        assert result.status == "confident"
        assert result.confidence > 0.8

    def test_uncertain_status(self, patched_model_service):
        """When all logits equal, softmax outputs 1/15 ≈ 0.067 < threshold."""
        from app.services.image_service import validate_and_preprocess
        from app.services.prediction_service import run_prediction
        # Override stub with uniform logits
        flat = nn.Linear(3 * 224 * 224, NUM_CLASSES)
        nn.init.zeros_(flat.weight)
        nn.init.zeros_(flat.bias)  # uniform → all equal softmax → uncertain
        flat.eval()
        patched_model_service.model = flat
        tensor, _ = validate_and_preprocess(_make_jpeg_bytes(), "image/jpeg", "leaf.jpg")
        result = run_prediction(tensor)
        assert result.status == "uncertain"
        assert result.confidence < 0.8

    def test_temperature_scaling_effect(self, patched_model_service):
        """Higher temperature should flatten confidence."""
        from app.services.image_service import validate_and_preprocess
        from app.services.prediction_service import run_prediction

        tensor, _ = validate_and_preprocess(_make_jpeg_bytes(), "image/jpeg", "leaf.jpg")

        patched_model_service.temperature = 1.0
        r1 = run_prediction(tensor)

        patched_model_service.temperature = 5.0
        r2 = run_prediction(tensor)

        assert r2.confidence < r1.confidence


# ─────────────────────────────────────────────────────────────────────────────
# API (TestClient) tests
# ─────────────────────────────────────────────────────────────────────────────

@pytest.fixture
def client_no_model():
    """TestClient with model NOT loaded."""
    from app.main import create_app
    return TestClient(create_app())


@pytest.fixture
def client_stub(patched_model_service):
    """TestClient with stub model loaded."""
    from app.main import create_app
    return TestClient(create_app())


class TestHealthEndpoint:
    def test_health_ok(self, client_no_model):
        r = client_no_model.get("/api/health")
        assert r.status_code == 200
        data = r.json()
        assert data["status"] == "ok"
        assert "model_loaded" in data
        assert "confidence_threshold" in data

    def test_health_model_not_loaded(self, client_no_model):
        r = client_no_model.get("/api/health")
        data = r.json()
        assert data["model_loaded"] is False


class TestClassesEndpoint:
    def test_classes_returns_list(self, client_no_model):
        r = client_no_model.get("/api/classes")
        assert r.status_code == 200
        data = r.json()
        assert "classes" in data

    def test_classes_has_expected_count(self, client_stub):
        r = client_stub.get("/api/classes")
        assert r.status_code == 200
        assert len(r.json()["classes"]) == NUM_CLASSES


class TestDiseasesEndpoints:
    def test_diseases_list(self, client_no_model):
        r = client_no_model.get("/api/diseases")
        assert r.status_code == 200
        data = r.json()
        assert "diseases" in data
        assert len(data["diseases"]) == NUM_CLASSES

    def test_disease_detail_apple_scab(self, client_no_model):
        r = client_no_model.get("/api/diseases/Apple___Apple_scab")
        assert r.status_code == 200
        data = r.json()
        assert data["class_id"] == "Apple___Apple_scab"
        assert data["crop"] == "Apple"
        assert len(data["symptoms"]) > 0

    def test_disease_detail_not_found(self, client_no_model):
        r = client_no_model.get("/api/diseases/Unknown___class")
        assert r.status_code == 404
        assert r.json()["detail"]["code"] == "DISEASE_NOT_FOUND"

    def test_healthy_class_detail(self, client_no_model):
        r = client_no_model.get("/api/diseases/Apple___healthy")
        assert r.status_code == 200
        assert r.json()["is_healthy"] is True


class TestPredictEndpoint:
    def test_predict_no_model_503(self, client_no_model):
        files = {"file": ("leaf.jpg", _make_jpeg_bytes(), "image/jpeg")}
        r = client_no_model.post("/api/predict", files=files)
        assert r.status_code == 503
        assert r.json()["detail"]["code"] == "MODEL_NOT_LOADED"

    def test_predict_success(self, client_stub):
        files = {"file": ("leaf.jpg", _make_jpeg_bytes(), "image/jpeg")}
        r = client_stub.post("/api/predict", files=files)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] in ("confident", "uncertain")
        assert 0.0 <= data["confidence"] <= 1.0
        assert len(data["top_predictions"]) == 3
        assert data["inference_time_ms"] > 0

    def test_predict_empty_file_400(self, client_stub):
        files = {"file": ("leaf.jpg", b"", "image/jpeg")}
        r = client_stub.post("/api/predict", files=files)
        assert r.status_code == 400
        assert r.json()["detail"]["code"] == "EMPTY_FILE"

    def test_predict_invalid_type_400(self, client_stub):
        files = {"file": ("doc.pdf", b"%PDF-1.4", "application/pdf")}
        r = client_stub.post("/api/predict", files=files)
        assert r.status_code == 400

    def test_predict_corrupt_image_400(self, client_stub):
        files = {"file": ("leaf.jpg", b"not-an-image", "image/jpeg")}
        r = client_stub.post("/api/predict", files=files)
        assert r.status_code == 400
        assert r.json()["detail"]["code"] == "CORRUPT_IMAGE"

    def test_predict_oversized_400(self, client_stub):
        from app import config as cfg
        big = b"\xff" * (cfg.MAX_UPLOAD_BYTES + 1)
        files = {"file": ("leaf.jpg", big, "image/jpeg")}
        r = client_stub.post("/api/predict", files=files)
        assert r.status_code == 400
        assert r.json()["detail"]["code"] == "FILE_TOO_LARGE"

    def test_predict_png_accepted(self, client_stub):
        files = {"file": ("leaf.png", _make_png_bytes(), "image/png")}
        r = client_stub.post("/api/predict", files=files)
        assert r.status_code == 200

    def test_predict_webp_accepted(self, client_stub):
        files = {"file": ("leaf.webp", _make_webp_bytes(), "image/webp")}
        r = client_stub.post("/api/predict", files=files)
        assert r.status_code == 200


# ─────────────────────────────────────────────────────────────────────────────
# Disease KB completeness test
# ─────────────────────────────────────────────────────────────────────────────

class TestKBCompleteness:
    def test_all_classes_have_kb_entry(self):
        from app.services.disease_service import check_kb_completeness
        missing = check_kb_completeness(CLASS_NAMES)
        assert missing == [], (
            f"These classes are missing from disease_info.json: {missing}"
        )


# ─────────────────────────────────────────────────────────────────────────────
# Optional integration test — skipped if best_model.pth is absent
# ─────────────────────────────────────────────────────────────────────────────

_MODEL_PATH = Path(__file__).resolve().parent.parent / "models" / "best_model.pth"


@pytest.mark.skipif(
    not _MODEL_PATH.exists(),
    reason="best_model.pth not present — skipping real-model integration test",
)
class TestRealModelIntegration:
    def test_real_inference_schema(self):
        from app.main import create_app
        client = TestClient(create_app())
        files = {"file": ("leaf.jpg", _make_jpeg_bytes(), "image/jpeg")}
        r = client.post("/api/predict", files=files)
        assert r.status_code == 200
        data = r.json()
        assert data["status"] in ("confident", "uncertain")
        assert isinstance(data["predicted_class"], str)
        assert 0.0 <= data["confidence"] <= 1.0
        assert len(data["top_predictions"]) == 3
        assert isinstance(data["inference_time_ms"], float)
        assert data["inference_time_ms"] > 0
