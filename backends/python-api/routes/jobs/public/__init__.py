from .jobs import router as public_job_router

from fastapi import APIRouter

router = APIRouter()

router.include_router(public_job_router) 
__all__ = [
    "public_job_router", 
]