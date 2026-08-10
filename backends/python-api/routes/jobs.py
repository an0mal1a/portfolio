# Jobs Repo
from repositories.jobs import JobsRepository

# FastAPI
from fastapi.responses import JSONResponse
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/jobs", tags="jobs")


router.get("")
def list_jobs():
    """ 
    This function shows a list of jobs done & the next one (max of 7 are stored)
    """
    j = JobsRepository()
    jobs = j.list_recent()

    JSONResponse(
        {
            "status": "ok",
            "jobs": jobs
        },
        200
    )


router.get("/{id}")
def list_job_information(id: int):
    """ 
    This function show the information of a job that
    has to be run or has been already run
    """
    j = JobsRepository()
    job = j.list_job_info(id)

    if not job:
        # Job not found
        raise JSONResponse({ "status": "ko" }, 404)

    JSONResponse(
        {
            "status": "ok",
            "job": job
        }, 
        200
    )