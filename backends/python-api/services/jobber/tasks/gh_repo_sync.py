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

    progress(5, "Validating GitHub access")

    gh_client = RepoClient(gh_token=gh_token, gh_user=gh_user)

    progress(12, "GitHub · fetching repository list")

    stages = {
        "fetching topics": 0,
        "fetching contributors": 1,
        "fetching languages": 2,
    }

    def github_progress(index: int, total: int, repository: str, stage: str):
        if total == 0:
            progress(55, "GitHub returned no repositories")
            return

        completed_steps = ((index - 1) * 3) + stages.get(stage, 0)
        progress_value = 15 + int((completed_steps / (total * 3)) * 40)
        progress(
            min(progress_value, 55),
            f"GitHub · {repository} · {stage} ({index}/{total})",
        )

    gh_repos_info: list[Repository] = gh_client.process_repositories(
        on_progress=github_progress,
    )

    total = len(gh_repos_info)

    result = {
        "repositories_found": total,
        "repositories_created": 0,
        "repositories_updated": 0,
        "repositories_failed": 0,
    }

    progress(60, f"Saving {total} repositories to database")

    for index, repo in enumerate(gh_repos_info, start=1):
        progress_value = (60 + int((index / max(total, 1)) * 35)
        )

        progress(min(progress_value, 95), f"Database · saving {repo.name} ({index}/{total})")

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

    progress(96, "Finalizing repository sync")
    return result