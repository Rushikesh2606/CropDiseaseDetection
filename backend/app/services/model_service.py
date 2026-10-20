"""
Model service — loads the ResNet-50 checkpoint once at startup,
applies temperature calibration, exposes class names and inference.
"""
from __future__ import annotations

import json
import logging
import time
from pathlib import Path
from typing import Optional

import torch
import torch.nn as nn
import torchvision.models as models

from app.config import (
    MODEL_PATH,
    CLASSES_PATH,
    CALIBRATION_PATH,
    DEFAULT_CLASS_NAMES,
    DEFAULT_TEMPERATURE,
    CONFIDENCE_THRESHOLD,
)

logger = logging.getLogger(__name__)


class _TemperatureScaler(nn.Module):
    """Thin wrapper that divides logits by a learned scalar T."""

    def __init__(self, model: nn.Module, temperature: float):
        super().__init__()
        self.model = model
        self.temperature = temperature

    def forward(self, x: torch.Tensor) -> torch.Tensor:
        logits = self.model(x)
        return logits / self.temperature


class ModelService:
    """Singleton that owns the loaded model and all model-related state."""

    model_loaded: bool = False
    model: Optional[nn.Module] = None
    class_names: list[str] = []
    device: torch.device = torch.device("cpu")
    calibrated: bool = False
    temperature: float = DEFAULT_TEMPERATURE
    num_classes: int = 0

    # ── Startup ────────────────────────────────────────────────────────────────

    def load(self) -> None:
        """Load model and calibration from disk. Called once at startup."""
        self._load_calibration()
        self._load_model()

    def _load_calibration(self) -> None:
        if not CALIBRATION_PATH.exists():
            logger.warning(
                "calibration.json not found at %s — using T=%.1f (no calibration).",
                CALIBRATION_PATH,
                DEFAULT_TEMPERATURE,
            )
            self.calibrated = False
            self.temperature = DEFAULT_TEMPERATURE
            return

        try:
            data = json.loads(CALIBRATION_PATH.read_text())
            self.temperature = float(data["temperature"])
            self.calibrated = True
            if self.model is not None and isinstance(self.model, _TemperatureScaler):
                self.model.temperature = self.temperature
            logger.info("Calibration loaded: T=%.4f", self.temperature)
        except Exception as exc:
            logger.error("Failed to parse calibration.json: %s — using T=1.0", exc)
            self.calibrated = False
            self.temperature = DEFAULT_TEMPERATURE

    def _parse_classes_json(self, path: Path) -> Optional[list[str]]:
        try:
            data = json.loads(path.read_text(encoding="utf-8"))
            if isinstance(data, list):
                return [str(x) for x in data]
            if isinstance(data, dict):
                if "classes" in data and isinstance(data["classes"], list):
                    return [str(x) for x in data["classes"]]
                if "class_names" in data and isinstance(data["class_names"], list):
                    return [str(x) for x in data["class_names"]]
                # Check mapping with integer keys: {"0": "class_a", "1": "class_b"}
                try:
                    sorted_by_idx = sorted(data.items(), key=lambda kv: int(kv[0]))
                    return [str(v) for _, v in sorted_by_idx]
                except (ValueError, TypeError):
                    pass
                # Check mapping with integer values: {"class_a": 0, "class_b": 1}
                try:
                    sorted_by_val = sorted(data.items(), key=lambda kv: int(kv[1]))
                    return [str(k) for k, _ in sorted_by_val]
                except (ValueError, TypeError):
                    pass
        except Exception as exc:
            logger.error("Failed to parse classes JSON from %s: %s", path, exc)
        return None

    def _load_model(self) -> None:
        if not MODEL_PATH.exists():
            logger.warning(
                "Model weights not found at %s. "
                "POST /api/predict will return 503 until weights are placed here.",
                MODEL_PATH,
            )
            self.model_loaded = False
            return

        try:
            checkpoint = torch.load(MODEL_PATH, map_location="cpu")

            # ── Extract state dict ─────────────────────────────────────────────
            if isinstance(checkpoint, dict):
                for k in ("model_state_dict", "state_dict", "model"):
                    if k in checkpoint and isinstance(checkpoint[k], dict):
                        state_dict = checkpoint[k]
                        break
                else:
                    state_dict = checkpoint
            else:
                state_dict = checkpoint

            # ── Determine class names (from file, checkpoint, or defaults) ────
            loaded_classes = None
            alt_classes_path = CLASSES_PATH.parent / "class_names.json"
            if CLASSES_PATH.exists():
                loaded_classes = self._parse_classes_json(CLASSES_PATH)
                if loaded_classes:
                    logger.info("Class names loaded from %s.", CLASSES_PATH)
            elif alt_classes_path.exists():
                loaded_classes = self._parse_classes_json(alt_classes_path)
                if loaded_classes:
                    logger.info("Class names loaded from %s.", alt_classes_path)

            if loaded_classes:
                self.class_names = loaded_classes
            elif isinstance(checkpoint, dict) and "class_names" in checkpoint:
                self.class_names = list(checkpoint["class_names"])
                logger.info("Class names loaded from checkpoint key 'class_names'.")
            elif isinstance(checkpoint, dict) and "classes" in checkpoint:
                self.class_names = list(checkpoint["classes"])
                logger.info("Class names loaded from checkpoint key 'classes'.")
            else:
                self.class_names = list(DEFAULT_CLASS_NAMES)
                logger.info("Using DEFAULT_CLASS_NAMES.")

            self.num_classes = len(self.class_names)
            logger.info(
                "Classes (%d): %s", self.num_classes, self.class_names
            )

            # ── Build Model (ResNet variant) ──────────────────────────────────
            arch_name = "resnet50"
            if isinstance(checkpoint, dict) and "architecture" in checkpoint:
                arch_name = str(checkpoint["architecture"]).lower()

            if "resnet18" in arch_name:
                base_model = models.resnet18(weights=None)
            elif "resnet34" in arch_name:
                base_model = models.resnet34(weights=None)
            elif "resnet101" in arch_name:
                base_model = models.resnet101(weights=None)
            else:
                base_model = models.resnet50(weights=None)

            in_features = base_model.fc.in_features
            base_model.fc = nn.Linear(in_features, self.num_classes)

            # Strip common prefixes that training wrappers add
            cleaned: dict = {}
            for k, v in state_dict.items():
                key = k
                for prefix in ("model.", "module.", "base_model."):
                    if key.startswith(prefix):
                        key = key[len(prefix):]
                cleaned[key] = v

            missing, unexpected = base_model.load_state_dict(
                cleaned, strict=False
            )
            if missing:
                logger.warning("Missing keys in state_dict: %s", missing[:5])
            if unexpected:
                logger.warning("Unexpected keys in state_dict: %s", unexpected[:5])

            base_model.eval()

            # ── Apply temperature scaling ──────────────────────────────────────
            self.model = _TemperatureScaler(base_model, self.temperature)
            self.model.eval()

            self.device = torch.device("cpu")
            self.model_loaded = True
            logger.info(
                "Model loaded successfully (T=%.4f, calibrated=%s).",
                self.temperature,
                self.calibrated,
            )

        except Exception as exc:
            logger.exception("Failed to load model weights: %s", exc)
            self.model_loaded = False

    # ── Inference ──────────────────────────────────────────────────────────────

    def predict(
        self, tensor: "torch.Tensor"
    ) -> tuple[list[float], float]:
        """
        Run inference and return (probabilities, inference_time_ms).
        tensor: shape [1, 3, 224, 224]
        """
        if not self.model_loaded or self.model is None:
            raise RuntimeError("Model is not loaded.")

        if not self.calibrated and CALIBRATION_PATH.exists():
            self._load_calibration()

        t0 = time.perf_counter()
        with torch.no_grad():
            logits = self.model(tensor.to(self.device))  # [1, num_classes]
            probs = torch.softmax(logits, dim=1).squeeze(0).tolist()
        elapsed_ms = (time.perf_counter() - t0) * 1000
        return probs, elapsed_ms


# Module-level singleton used by routes and tests
model_service = ModelService()
