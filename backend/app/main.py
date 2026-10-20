"""
PlantGuard AI — FastAPI application entry point.
"""
from __future__ import annotations

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS
from app.api.routes import router
from app.services.model_service import model_service
from app.services.disease_service import warn_missing_classes

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s — %(message)s",
)
logger = logging.getLogger(__name__)


def create_app() -> FastAPI:
    app = FastAPI(
        title="PlantGuard AI",
        description=(
            "AI-powered crop leaf disease detection API. "
            "Upload a leaf image and receive a calibrated prediction across 15 classes."
        ),
        version="1.0.0",
        docs_url="/docs",
        redoc_url="/redoc",
    )

    # ── CORS ───────────────────────────────────────────────────────────────────
    app.add_middleware(
        CORSMiddleware,
        allow_origins=CORS_ORIGINS,
        allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Routes ─────────────────────────────────────────────────────────────────
    app.include_router(router)

    # ── Startup event ──────────────────────────────────────────────────────────
    @app.on_event("startup")
    async def _startup() -> None:
        logger.info("PlantGuard AI starting up…")
        model_service.load()
        if model_service.model_loaded:
            warn_missing_classes(model_service.class_names)
        else:
            logger.warning(
                "⚠️  Model not loaded. Place best_model.pth at backend/models/ and restart."
            )

    return app


app = create_app()
