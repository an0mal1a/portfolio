# Internal imports

from services.github.errors import GitHubInvalidAuth
from services.github.client import GitHubClient

def sync_gihub(gh_token, gh_username) -> bool: 
    if not gh_token:
        print("No github token, stopping task")
        return False
    
    try:
        gh_client = GitHubClient(gh_token=gh_token, gh_user=gh_username)
    except (GitHubInvalidAuth, Exception) as e:
        print(f"[CRONJOB.GH_SYNC_TASK] !> Invalid auth token, details={e}")
        return False

    print("[CRONJOB.GH_SYNC_TASK] > Starting GitHub sync task")
    
    

