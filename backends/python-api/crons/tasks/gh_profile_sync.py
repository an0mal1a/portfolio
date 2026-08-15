# GitHub service
from services.github.models import Profile
from services.github.errors import GitHubInvalidAuth
from services.github.jobber import JobberLog, TaskType
from services.github.profile_client import ProfileClient

# common error
from services.errors import MissingData

# Other
from datetime import datetime

def sync_profile(gh_token, gh_user) -> bool: 
    start_time = datetime.now()
    if not gh_token:
        print("No github token, stopping task")
        return False
    
    try:
        gh_client = ProfileClient(gh_token=gh_token, gh_user=gh_user)
    except (GitHubInvalidAuth, MissingData, Exception) as e:
        print(f"[CRONJOB.GH_SYNC_TASK] !> Invalid auth token, details={e}")
        return False

    db_jobber = JobberLog(task_type=TaskType.PROFILE)
    db_jobber.job_started()
    print(f"[CRONJOB.GH_SYNC_TASK] > Starting GHProfile sync task [JOB_ID: {db_jobber.job_id}]")
    
    # Get profile information
    gh_profile_info: Profile = gh_client.process_profile()
    
    try:
        gh_client.add_profile(gh_profile_info)
    except Exception as e:
        print(f"[CRONJOB.GH_SYNC_TASK] !> error={e}")
        db_jobber.update_field("status", "failed")
        db_jobber.update_field("error", str(e))


    # Calculate & push elapsed time
    end_time = datetime.now()
    elapsed = (end_time - start_time).microseconds

    db_jobber.update_field("completed_at", end_time.isoformat())
    db_jobber.update_field("duration_ms", elapsed)

    db_jobber.update_field("status", "completed")