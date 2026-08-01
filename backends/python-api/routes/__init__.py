from .jobs import router as jobs_router

from fastapi import APIRouter

api_router = APIRouter()

api_router.include_router(jobs_router)

__all__ = [
    "jobs_router"
]