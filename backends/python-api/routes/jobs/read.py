# Jobs Repo
from repositories.jobs import JobsRepository

# FastAPI
from fastapi import APIRouter

router = APIRouter(prefix="/jobs", tags=["job-listing"])


@router.get("")
def list_jobs():
    """
    This function shows a list of jobs done & the next one (max of 7 are stored)
    """
    j = JobsRepository()
    jobs = j.list_recent()
    return {"status": "ok", "jobs": jobs}


@router.get("/{id}")
def list_job_information(id: int):
    """
    This function show the information of a job that
    has to be run or has been already run
    """
    j = JobsRepository()
    job = j.list_job_info(id)

    if not job:
        return {"status": "ko"}

    return {"status": "ok", "job": job}