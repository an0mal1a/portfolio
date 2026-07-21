# GitHub service
from services.github.errors import GitHubInvalidAuth
from services.github.client import GitHubClient
from services.github.models import Repository

# Shared errors
from services.errors import MissingData

def sync_gihub(gh_token, gh_user) -> bool: 
    if not gh_token:
        print("No github token, stopping task")
        return False
    
    try:
        gh_client = GitHubClient(gh_token=gh_token, gh_user=gh_user)
    except (GitHubInvalidAuth, MissingData, Exception) as e:
        print(f"[CRONJOB.GH_SYNC_TASK] !> Invalid auth token, details={e}")
        return False

    print("[CRONJOB.GH_SYNC_TASK] > Starting GitHub sync task")
    
    # Get all the repos information
    gh_repos_info: list[Repository] = gh_client.list_repositories()
    
    for repo in gh_repos_info:
        # Account info
        owner_id = gh_client.add_owner(repo.owner)
        
        if not owner_id:
            print(f"[CRONJOB.GH_SYNC_TASK] !> Missing owner_id, ignoring repo={repo.name}, owner_id={owner_id}")
            continue

        repo_id = gh_client.add_repo(repo, owner_id)

        if not repo_id:
            print(f"[CRONJOB.GH_SYNC_TASK] !> Missing repo_id, ignoring repo={repo.name}, repo_id={repo_id}")
            continue

        # Collaborators         
        for collaborator in repo.collaborators:
            collaborator_id = gh_client.add_owner(collaborator)
            gh_client.add_collaborator(repo_id, collaborator_id)


        # Topics info -> Depends on repo info
        gh_client.add_owner(repo_id, repo.topics)

        # Repo lang -> Depends on repo info
        for lang in repo.languages:
            gh_client.add_lang(repo_id, lang)

