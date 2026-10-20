"""
PlantGuard AI — Backend configuration.
All settings are read from environment variables (or .env in the project root).
"""
import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from the backend directory or two levels up
_HERE = Path(__file__).resolve().parent  # backend/app/
_BACKEND = _HERE.parent                  # backend/
load_dotenv(_BACKEND / ".env", override=False)

# ── Model ──────────────────────────────────────────────────────────────────────
MODEL_PATH: Path = _BACKEND / "models" / "best_model.pth"
CLASSES_PATH: Path = _BACKEND / "models" / "classes.json"
CALIBRATION_PATH: Path = _BACKEND / "models" / "calibration.json"

# ── Inference ──────────────────────────────────────────────────────────────────
CONFIDENCE_THRESHOLD: float = float(os.getenv("CONFIDENCE_THRESHOLD", "0.80"))
DEFAULT_TEMPERATURE: float = 1.0  # used when calibration.json is absent

# ── Upload limits ──────────────────────────────────────────────────────────────
MAX_UPLOAD_MB: int = int(os.getenv("MAX_UPLOAD_MB", "10"))
MAX_UPLOAD_BYTES: int = MAX_UPLOAD_MB * 1024 * 1024
ALLOWED_TYPES: list[str] = ["image/jpeg", "image/png", "image/webp"]
ALLOWED_EXTENSIONS: set[str] = {".jpg", ".jpeg", ".png", ".webp"}

# Prevent decompression bombs
MAX_IMAGE_PIXELS: int = 178_956_970  # Pillow default safety limit

# ── CORS ───────────────────────────────────────────────────────────────────────
CORS_ORIGINS: list[str] = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

# ── PlantVillage class names (checkpoint order) ─────────────────────────────────
# These are the 15 classes the ResNet-50 was trained on.
# Ordering must match the training label mapping; if the checkpoint embeds its
# own class list (key: "class_names" or similar), model_service.py will prefer that.
DEFAULT_CLASS_NAMES: list[str] = [
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
