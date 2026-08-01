from fastapi import APIRouter

router = APIRouter(prefix="/jobs", tags="jobs")


router.get("")
def list_jobs():
    """ 
    This function shows a list of jobs done & the next one (max of 7 are stored)
    """
    raise NotImplementedError("This function hasn't been implemented")


router.get("/{id}")
def list_job_information():
    """ 
    This function show the information of a job that
    has to be run or has been already run
    """
    raise NotImplementedError("This function hasn't been implemented")