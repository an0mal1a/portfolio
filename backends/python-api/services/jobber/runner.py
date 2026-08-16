from services.jobber import TaskType
from services.jobber.runs import JobRuns
from services.jobber.scheduled import ScheduledJobs

from services.jobber.tasks.gh_repo_sync import sync_repos
from services.jobber.tasks.gh_profile_sync import sync_profile

from config import GH_TOKEN, GH_USERNAME

# other
from uuid import UUID

TASKS = {
    TaskType.REPO_SYNC: sync_repos,
    TaskType.PROFILE: sync_profile,
}

def run_scheduled(job_type: TaskType):
    """Run a fixed scheduler task and save its history in github.sync_jobs."""
    jobs = ScheduledJobs()
    job_id = jobs.create_run(job_type)

    try:
        result = TASKS[job_type](gh_token=GH_TOKEN, gh_user=GH_USERNAME)
        jobs.complete_run(job_id, result)
    except Exception as exc:
        jobs.fail_run(job_id, str(exc))
        raise

def execute_run(run_id: UUID):
    runs = JobRuns()
    job_type = runs.start_run(run_id)

    if job_type is None:
        return

    def progress(value: int, message: str):
        runs.update_progress(
            run_id,
            value,
            message,
        )

    try:
        task = TASKS[job_type]

        result = task(gh_token=GH_TOKEN, gh_user=GH_USERNAME, on_progress=progress)
        runs.complete_run(run_id, result)

    except Exception as exc:
        runs.fail_run(run_id, str(exc))
        raise
