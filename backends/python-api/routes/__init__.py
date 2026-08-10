from .jobs import router as jobs_router
from .health import router as health_router

from fastapi import APIRouter

api_router = APIRouter()

api_router.include_router(jobs_router)
api_router.include_router(health_router)

__all__ = [
    "jobs_router",
    health_router
]