from crons.scheduler import scheduler
from fastapi import APIRouter

router = APIRouter(tags=["health"])

# Health path
@router.get("/")
@router.get("/health")
def health():

    return {
        "status": "ok",
        "service": "python-worker",
        "version": "0.1.0",
        "scheduler": "running" if scheduler.running else "stopped",
        "message": "Server is running correctly (python)!"
    }