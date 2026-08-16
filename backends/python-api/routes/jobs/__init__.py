from .read import router as job_read_router
from .write import router as job_write_router
from .public import router as public_job_router

from fastapi import APIRouter

router = APIRouter()

router.include_router(job_read_router)
router.include_router(job_write_router)
router.include_router(public_job_router)

__all__ = [
    "job_read_router",
    "job_write_router",
    "public_job_router"
]