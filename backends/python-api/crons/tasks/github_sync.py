# GitHub service
from services.github.errors import GitHubInvalidAuth
from services.github.client import GitHubClient
from services.github.models import Repository

# PostgreSQL Service
from services.database.client import DBClient

# Shared errors
from services.errors import MissingData

def sync_gihub(gh_token, gh_username) -> bool: 
    if not gh_token:
        print("No github token, stopping task")
        return False
    
    try:
        gh_client = GitHubClient(gh_token=gh_token, gh_user=gh_username)
    except (GitHubInvalidAuth, MissingData, Exception) as e:
        print(f"[CRONJOB.GH_SYNC_TASK] !> Invalid auth token, details={e}")
        return False
    
    try:
        db_client = DBClient()
    except MissingData as e:
        print(f"[CRONJOB.GH_SYNC_TASK] !> Missing database data, details={e}")

    print("[CRONJOB.GH_SYNC_TASK] > Starting GitHub sync task")
    
    # Get all the repos information
    gh_repos_info: list[Repository] = gh_client.list_repositories()
    

    # Made connection
    with db_client.get_db_connection() as conn:
        with conn.cursor() as cur:
            
            for repo in gh_repos_info:
                # Account info (owner)
                repo.owner

                # Repo lang

                # Topics info

                # Collaboratos

                # Repo info


    


