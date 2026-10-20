"""
Disease service — loads disease_info.json and provides lookup helpers.
"""
from __future__ import annotations

import json
import logging
from pathlib import Path
from typing import Optional

from app.schemas import DiseaseSummary, DiseaseDetail

logger = logging.getLogger(__name__)

_DATA_PATH = Path(__file__).resolve().parent.parent / "data" / "disease_info.json"

# Loaded once at module import
_RAW: dict = {}
_META: dict = {}

try:
    _DATA = json.loads(_DATA_PATH.read_text(encoding="utf-8"))
    _META = _DATA.get("_meta", {})
    _RAW = {k: v for k, v in _DATA.items() if k != "_meta"}
    logger.info("Disease KB loaded: %d entries.", len(_RAW))
except Exception as exc:
    logger.error("Failed to load disease_info.json: %s", exc)


# ── Public helpers ─────────────────────────────────────────────────────────────

def get_all_diseases() -> list[DiseaseSummary]:
    return [
        DiseaseSummary(
            class_id=v["id"],
            crop=v["crop"],
            condition=v["condition"],
            label=v["label"],
            is_healthy=v["is_healthy"],
            summary=v["summary"],
        )
        for v in _RAW.values()
    ]


def get_disease(class_id: str) -> Optional[DiseaseDetail]:
    entry = _RAW.get(class_id)
    if not entry:
        return None
    return DiseaseDetail(
        class_id=entry["id"],
        crop=entry["crop"],
        condition=entry["condition"],
        label=entry["label"],
        is_healthy=entry["is_healthy"],
        summary=entry["summary"],
        symptoms=entry.get("symptoms", []),
        causes=entry.get("causes", []),
        management=entry.get("management", []),
        prevention=entry.get("prevention", []),
        notes=entry.get("notes", ""),
    )


def get_label_for_class(class_id: str) -> str:
    entry = _RAW.get(class_id)
    if entry:
        return entry["label"]
    # Fallback: prettify the class name
    return class_id.replace("___", " — ").replace("_", " ")


def get_meta() -> dict:
    return _META


def warn_missing_classes(class_names: list[str]) -> None:
    """Log a warning for any class that lacks a KB entry."""
    for name in class_names:
        if name not in _RAW:
            logger.warning(
                "Class '%s' has no entry in disease_info.json. "
                "Add an entry to complete the knowledge base.",
                name,
            )


def check_kb_completeness(class_names: list[str]) -> list[str]:
    """Return a list of class names missing from the KB (empty = all present)."""
    return [name for name in class_names if name not in _RAW]
