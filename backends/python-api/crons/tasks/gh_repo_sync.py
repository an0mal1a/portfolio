# GitHub service
from services.github.models import Repository
from services.github.errors import GitHubInvalidAuth
from services.github.repo_client import RepoClient
from services.github.jobber import JobberLog

# common error
from services.errors import MissingData

# Other
from datetime import datetime

def sync_repos(gh_token, gh_user) -> bool: 
    start_time = datetime.now()
    if not gh_token:
        print("No github token, stopping task")
        return False
    
    try:
        gh_client = RepoClient(gh_token=gh_token, gh_user=gh_user)
    except (GitHubInvalidAuth, MissingData, Exception) as e:
        db_jobber.update_field("status", "failed")
        db_jobber.update_field("error", str(e))
        print(f"[CRONJOB.GH_SYNC_TASK] !> Invalid auth token, details={e}")
        return False

    db_jobber = JobberLog()
    db_jobber.job_started()
    print(f"[CRONJOB.GH_SYNC_TASK] > Starting GitHub sync task [JOB_ID: {db_jobber.job_id}]")
    
    # Get all the repos information
    gh_repos_info: list[Repository] = gh_client.process_repositories()

    # Set repos_found in db
    db_jobber.update_field("repositories_found", len(gh_repos_info))
    
    try:
        for repo in gh_repos_info:
            # Account info
            owner_id = gh_client.add_owner(repo.owner)
            
            if not owner_id:
                db_jobber.increase_field('repositories_failed')
                print(f"[CRONJOB.GH_SYNC_TASK] !> Missing owner_id, ignoring repo={repo.name}, owner_id={owner_id}")
                continue

            repo_id, inserted = gh_client.add_repo(repo, owner_id)

            if not repo_id:
                db_jobber.increase_field('repositories_failed')
                print(f"[CRONJOB.GH_SYNC_TASK] !> Missing repo_id, ignoring repo={repo.name}, repo_id={repo_id}")
                continue

            if inserted:
                db_jobber.increase_field('repositories_created')
            else: 
                db_jobber.increase_field('repositories_updated')
                
            # contributors         
            for contributors in repo.contributors:
                contributor_id = gh_client.add_owner(contributors)
                gh_client.add_contributor(repo_id, contributor_id)


            # Topics info -> Depends on repo info
            gh_client.add_topics(repo_id, repo.topics)

            # Repo lang -> Depends on repo info
            for lang in repo.languages:
                gh_client.add_lang(repo_id, lang)

    except Exception as e:
        print(f"[CRONJOB.GH_SYNC_TASK] !> error={e}")
        db_jobber.update_field("status", "failed")
        db_jobber.update_field("error", str(e))
        return False


    # Calculate & push elapsed time
    end_time = datetime.now()
    elapsed = (end_time - start_time).microseconds

    db_jobber.update_field("completed_at", end_time.isoformat())
    db_jobber.update_field("duration_ms", elapsed)

    db_jobber.update_field("status", "completed")
    print(f"[CRONJOB.GH_SYNC_TASK] *> Task={db_jobber.job_id} ended successfully")



