"""
Image service — validation, decoding, preprocessing.
"""
from __future__ import annotations

import io
import logging
from pathlib import Path

from PIL import Image, ExifTags, ImageOps, UnidentifiedImageError
import torchvision.transforms as T
import torch

from app.config import (
    MAX_UPLOAD_BYTES,
    MAX_UPLOAD_MB,
    ALLOWED_TYPES,
    ALLOWED_EXTENSIONS,
    MAX_IMAGE_PIXELS,
)

logger = logging.getLogger(__name__)

# ImageNet normalisation (used after ToTensor)
_IMAGENET_MEAN = [0.485, 0.456, 0.406]
_IMAGENET_STD  = [0.229, 0.224, 0.225]

_PREPROCESS = T.Compose([
    T.Resize(256),
    T.CenterCrop(224),
    T.ToTensor(),
    T.Normalize(mean=_IMAGENET_MEAN, std=_IMAGENET_STD),
])


class ImageValidationError(Exception):
    """Raised for invalid / malformed upload."""
    def __init__(self, message: str, code: str = "INVALID_IMAGE"):
        super().__init__(message)
        self.code = code


def validate_and_preprocess(
    file_bytes: bytes,
    content_type: str | None,
    filename: str | None,
) -> tuple[torch.Tensor, Image.Image]:
    """
    Validate raw bytes and return (preprocessed_tensor [1,3,224,224], pil_image).

    Raises ImageValidationError for anything invalid.
    """
    # ── Size check ─────────────────────────────────────────────────────────────
    if len(file_bytes) == 0:
        raise ImageValidationError("Uploaded file is empty.", code="EMPTY_FILE")

    if len(file_bytes) > MAX_UPLOAD_BYTES:
        raise ImageValidationError(
            f"File exceeds the {MAX_UPLOAD_MB} MB limit "
            f"({len(file_bytes) / 1024 / 1024:.1f} MB received).",
            code="FILE_TOO_LARGE",
        )

    # ── Extension check ────────────────────────────────────────────────────────
    if filename:
        ext = Path(filename).suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            raise ImageValidationError(
                f"File extension '{ext}' is not allowed. "
                f"Accepted: {', '.join(sorted(ALLOWED_EXTENSIONS))}.",
                code="INVALID_TYPE",
            )

    # ── Content-type check ─────────────────────────────────────────────────────
    if content_type and content_type not in ALLOWED_TYPES:
        raise ImageValidationError(
            f"Content-type '{content_type}' is not supported. "
            f"Accepted: {', '.join(ALLOWED_TYPES)}.",
            code="INVALID_TYPE",
        )

    # ── Pillow decode (most reliable validity check) ────────────────────────────
    Image.MAX_IMAGE_PIXELS = MAX_IMAGE_PIXELS
    try:
        img = Image.open(io.BytesIO(file_bytes))
        img.verify()  # detect truncated / corrupt files
    except UnidentifiedImageError:
        raise ImageValidationError(
            "Cannot identify image file. Upload a valid JPG, PNG, or WEBP.",
            code="CORRUPT_IMAGE",
        )
    except Exception as exc:
        raise ImageValidationError(
            f"Image is corrupt or truncated: {exc}",
            code="CORRUPT_IMAGE",
        )

    # Re-open after verify() (verify() closes the file handle internally)
    img = Image.open(io.BytesIO(file_bytes))

    # ── Pixel-dimension bomb guard ─────────────────────────────────────────────
    try:
        img.load()
    except Exception as exc:
        raise ImageValidationError(
            f"Image could not be fully decoded: {exc}",
            code="CORRUPT_IMAGE",
        )

    # ── EXIF orientation ────────────────────────────────────────────────────────
    try:
        img = ImageOps.exif_transpose(img)
    except Exception:
        pass  # non-fatal; proceed without rotation

    # ── Convert to RGB (handles RGBA, P, L, etc.) ───────────────────────────────
    img = img.convert("RGB")

    # ── Preprocessing ──────────────────────────────────────────────────────────
    tensor: torch.Tensor = _PREPROCESS(img).unsqueeze(0)  # [1, 3, 224, 224]

    return tensor, img
