from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from app.config import get_settings
from app.database import connect_db, disconnect_db
from app.auth.router import router as auth_router
from app.listings.router import router as listings_router
from app.dashboard.router import router as dashboard_router
from app.locations.router import router as locations_router


# ── Rate limiter ─────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])


# ── Lifespan ─────────────────────────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_db()
    yield
    await disconnect_db()


# ── App ───────────────────────────────────────────────────────────────────────
def create_app() -> FastAPI:
    settings = get_settings()

    app = FastAPI(
        title="NyumbaSasa API",
        version="2.0.0",
        description="Kenya's #1 Rental Platform — FastAPI backend",
        lifespan=lifespan,
        docs_url="/api/docs",
        redoc_url="/api/redoc",
        openapi_url="/api/openapi.json",
    )

    # ── Middlewares ─────────────────────────────────────────────────────────
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[settings.FRONTEND_URL, "http://localhost:3000"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # ── Rate limiting ───────────────────────────────────────────────────────
    app.state.limiter = limiter
    app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

    # ── Routers ─────────────────────────────────────────────────────────────
    api_prefix = "/api"
    app.include_router(auth_router, prefix=api_prefix)
    app.include_router(listings_router, prefix=api_prefix)
    app.include_router(dashboard_router, prefix=api_prefix)
    app.include_router(locations_router, prefix=api_prefix)

    # ── Health check ─────────────────────────────────────────────────────────
    @app.get("/api/health", tags=["Health"])
    async def health():
        return {"status": "ok", "service": "nyumbasasa-api"}

    return app


app = create_app()
