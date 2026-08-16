# Services
from services.github.models import Repository
from services.github import RepoClient
from services.errors import MissingData

from collections.abc import Callable

ProgressCallback = Callable[[int, str], None]


def sync_repos(gh_token: str, gh_user: str, on_progress: ProgressCallback | None = None) -> dict:
    def progress(value: int, message: str):
        if on_progress:
            on_progress(value, message)

    if not gh_token:
        raise MissingData("Missing GitHub token")

    progress(5, "Initializing GitHub client")

    gh_client = RepoClient(gh_token=gh_token, gh_user=gh_user)

    progress(10, "Fetching repositories")

    gh_repos_info: list[Repository] = (gh_client.process_repositories())

    total = len(gh_repos_info)

    result = {
        "repositories_found": total,
        "repositories_created": 0,
        "repositories_updated": 0,
        "repositories_failed": 0,
    }

    progress(20, f"Found {total} repositories")

    for index, repo in enumerate(gh_repos_info, start=1):
        progress_value = (20 + int((index / max(total, 1)) * 70)
        )

        progress(min(progress_value, 90), f"Syncing {repo.name}",)

        # Owner
        owner_id = gh_client.add_owner(repo.owner)

        if not owner_id:
            result["repositories_failed"] += 1
            print(f"[JOB.GH_REPO_SYNC] Missing owner_id, repo={repo.name}")
            continue

        # Repository
        repo_id, inserted = gh_client.add_repo(repo, owner_id)

        if not repo_id:
            result["repositories_failed"] += 1
            print(f"[JOB.GH_REPO_SYNC] Missing repo_id, repo={repo.name}")
            continue

        if inserted:
            result["repositories_created"] += 1
        else:
            result["repositories_updated"] += 1

        # Contributors
        for contributor in repo.contributors:
            contributor_id = gh_client.add_owner(contributor)

            if contributor_id:
                gh_client.add_contributor(repo_id, contributor_id)

        # Topics
        gh_client.add_topics(repo_id, repo.topics)

        # Languages
        for lang in repo.languages:
            gh_client.add_lang(repo_id, lang)

    progress(95, "Finishing repository sync")
    return result