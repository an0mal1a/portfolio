from fastapi import APIRouter, BackgroundTasks, Depends, status

from services.depends.auth import require_token
from services.jobber import TaskType
from services.jobber.runner import run_scheduled

router = APIRouter(prefix="/jobs", tags=["job-creating"])


@router.post("/{task_type}/run", status_code=status.HTTP_202_ACCEPTED)
def run_internal_job(
    task_type: TaskType,
    background_tasks: BackgroundTasks,
    _=Depends(require_token),
):
    """Manually trigger a fixed internal job, recorded in github.sync_jobs."""
    background_tasks.add_task(run_scheduled, task_type)
    return {"status": "accepted", "job_type": task_type.value}


