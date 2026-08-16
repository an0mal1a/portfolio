# DB Client
from services.database import DBClient

# Parent class
from services.github.client import GitHubClient

# Service/s data
from services.github.models import Repository, Owner, Lang
from services.errors import MissingData

# Internal modules
from config import TIMEZONE

# Other
from json.decoder import JSONDecodeError
from datetime import datetime
from zoneinfo import ZoneInfo
from collections.abc import Callable
import requests

RepositoryProgressCallback = Callable[[int, int, str, str], None]

class RepoClient(GitHubClient):
    def __init__(self, gh_token, gh_user):
        super().__init__(gh_token, gh_user)

    """
    The function to recive all the repositories and the related information of them
    """
    def list_repositories(self) -> list:
        # preapre params
        params = {
            "visibility": "all",
            "affiliation": "owner",
            "sort": "pushed",
            "direction": "desc",
            "per_page": 100
        }

        # make request
        self._current_request = requests.get(f"{self.base_path}/user/repos", params=params, headers=self.headers)

        # check valid auth
        self.check_response()

        # return response
        try:
            return self._current_request.json()
        except JSONDecodeError:
            return []
    

    """
    This function is used to recive all the tags written on the repo
    """
    def list_repo_topics(self, repo_name) -> list[str]:
        # Check required vaulues
        if not repo_name or not self.username:
            raise MissingData(f"No repo or username found. username={self.username}, repo_name={repo_name}")
        
        # make req
        self._current_request = requests.get(f"{self.base_path}/repos/{self.username}/{repo_name}/topics", headers=self.headers)

        # check valid auth
        self.check_response()

        # Extract the list from the dict
        try:
            return self._current_request.json().get("names", [])
        except JSONDecodeError:
            return []
    

    """
    the function used to list all the contributors on the repository.
    this function dont extract permissions of contributors.
    """
    def list_repo_contributors(self, repo_name) -> list[Owner]:
        # Check required vaulues
        if not repo_name or not self.username:
            raise MissingData(f"No repo or username found. username={self.username}, repo_name={repo_name}")
        
        # make req 
        self._current_request = requests.get(f"{self.base_path}/repos/{self.username}/{repo_name}/contributors", headers=self.headers)

        # check valid auth
        self.check_response()

        # Extract the list from the dict
        try:
            raw = self._current_request.json()
        except JSONDecodeError:
            return []
 
        return [
            Owner(
                name=raw_user["login"],
                avatar_url=raw_user["avatar_url"],
                profile_url=raw_user["html_url"],
                type=raw_user["type"],
            )
            for raw_user in raw
        ]
    

    """
    function to extract and process all the repo languages
    this function requires (also) the size arg to create a %
    over 100
    """
    def list_repo_langs(self, repo_name) -> list[Lang]:
        # Check required vaulues
        if not repo_name or not self.username:
            raise MissingData(f"No repo or username found. username={self.username}, repo_name={repo_name}")
        
        # make req
        self._current_request = requests.get(f"{self.base_path}/repos/{self.username}/{repo_name}/languages", headers=self.headers)

        # Check auth
        self.check_response()

        r = self._current_request
        try:
            r = self._current_request.json()
        except JSONDecodeError:
            return []

        total = sum(r.values()) # sum the total of files
        if total == 0: return []
        
        return [
            Lang(
                name=lang,
                percentage=int((value / total) * 100)

            )
            for lang, value in r.items()
        ] 


    def _build_repository_payload(self, raw_repo: dict) -> dict:
        mapping = {
            "id": "id",
            "name": "name",
            "description": "description",
            "repo_url": "html_url",
            "main_language": "language",
            "is_fork": "fork",
            "is_private": "private",
            "is_archived": "archived",
            "forks": "forks_count",
            "open_issues": "open_issues_count",
            "star_count": "stargazers_count",
            "created_at": "created_at",
            "updated_at": "updated_at",
            "pushed_at": "pushed_at",
        }

        repo = {}
        for key, raw_key in mapping.items():
            value = raw_repo.get(raw_key)

            if key in {"is_fork", "is_private", "is_archived"}:
                repo[key] = bool(value if value is not None else False)
            elif key in {"forks", "open_issues", "star_count"}:
                repo[key] = int(value or 0)
            else:
                repo[key] = value

        owner_info = raw_repo.get("owner", {})
        repo["owner"] = Owner(
            name=owner_info.get("login", ""),
            avatar_url=owner_info.get("avatar_url", ""),
            profile_url=owner_info.get("html_url", ""),
            type=owner_info.get("type", "User"),
        )

        return repo

    """
    Function oriented to return a readable/processable object of repos (private/publics) 
    returns everything needed to feed the tables of the DB.
    """
    def process_repositories(
        self,
        on_progress: RepositoryProgressCallback | None = None,
    ) -> list[Repository]:
        repos = self.list_repositories()

        if len(repos) == 0 or repos is None:
            if on_progress:
                on_progress(0, 0, "", "No repositories returned by GitHub")
            return []

        processed_repos: list[Repository] = []
        total = len(repos)

        for index, raw_repo in enumerate(repos, start=1):
            repo = self._build_repository_payload(raw_repo)
            repo_name = raw_repo["name"]

            # Get topics
            if on_progress:
                on_progress(index, total, repo_name, "fetching topics")
            repo["topics"] = self.list_repo_topics(repo_name)

            # Get contributors
            if on_progress:
                on_progress(index, total, repo_name, "fetching contributors")
            repo["contributors"] = self.list_repo_contributors(repo_name)

            # Get languages
            if on_progress:
                on_progress(index, total, repo_name, "fetching languages")
            repo["languages"] = self.list_repo_langs(repo_name)

            processed_repos.append(Repository.model_validate(repo))

        # Return processed data
        return processed_repos
    

    """
    function to add a owner to the database
    """
    def add_owner(self, owner: Owner):
        if not self._db_client:
            self._db_client = DBClient()
        

        with self._db_client.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO github.accounts (
                        github_login,
                        avatar_url,
                        profile_url,
                        account_type
                    )
                    VALUES (%s, %s, %s, %s)
                    ON CONFLICT (github_login)
                    DO UPDATE SET
                        avatar_url = EXCLUDED.avatar_url,
                        profile_url = EXCLUDED.profile_url,
                        account_type = EXCLUDED.account_type
                    RETURNING id
                    """,
                    (
                        owner.name,
                        owner.avatar_url,
                        owner.profile_url,
                        owner.type,
                    ),
                )
                owner_id = cur.fetchone()["id"]

        return owner_id
    
    """
    function to add contributors to the database
    """
    def add_contributor(self, repo_id: int, collab_id: int):
        if not self._db_client:
            self._db_client = DBClient()
        

        with self._db_client.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                        """
                        INSERT INTO github.repository_contributors (
                            repository_id,
                            account_id
                        )
                        VALUES (
                            %s, %s
                        ) ON CONFLICT (repository_id, account_id) DO NOTHING
                        """,
                        (repo_id, collab_id)
                    )
                
        return True
    

    """
    function to add topics to the database
    """
    def add_topics(self, repo_id: int, topics: list):
        if not self._db_client:
            self._db_client = DBClient()
        

        with self._db_client.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO github.repository_topics (
                        repository_id,
                        topic
                    )
                    VALUES (
                        %s, %s
                    ) ON CONFLICT (repository_id, topic) DO UPDATE SET
                        topic = EXCLUDED.topic
                    """,
                    (repo_id, topics)
                )
                
        return True
    

    """
    function to add langs to the database
    """
    def add_lang(self, repo_id: int, lang: Lang):
        if not self._db_client:
            self._db_client = DBClient()
        

        with self._db_client.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO github.repository_languages (
                        repository_id,
                        language,
                        percentage
                    )
                    VALUES (
                        %s, %s, %s
                    ) ON CONFLICT (repository_id, language) DO UPDATE SET
                        language = EXCLUDED.language,
                        percentage = EXCLUDED.percentage
                    """,
                    (repo_id, lang.name, lang.percentage)
                )
                
        return True
        

    """
    function to add a repo to the database
    """
    def add_repo(self, repo: Repository, owner_id: int) -> int:
        if not self._db_client:
            self._db_client = DBClient()
        

        with self._db_client.get_db_connection() as conn:
            with conn.cursor() as cur:
                # Repo info
                cur.execute(
                    """
                    INSERT INTO github.repositories (
                        github_id,
                        owner_id,
                        
                        name,
                        description,
                        repository_url,
                        main_language,

                        is_private,
                        is_fork,
                        is_archived,

                        forks_count,
                        open_issues_count,
                        stars_count,

                        is_portfolio_visible,
                        display_name,
                        display_description,

                        github_created_at,
                        github_updated_at,
                        github_pushed_at,

                        synced_at
                    )
                    VALUES (
                       %s, %s, %s, %s, 
                       %s, %s, %s, %s, 
                       %s, %s, %s, %s, 
                       %s, %s, %s, %s, 
                       %s, %s, %s
                    )
                    ON CONFLICT (github_id) 
                    DO UPDATE SET
                        name = EXCLUDED.name,
                        description = EXCLUDED.description,
                        repository_url = EXCLUDED.repository_url,
                        main_language = EXCLUDED.main_language,
                        is_private = EXCLUDED.is_private,
                        is_fork = EXCLUDED.is_fork,
                        is_archived = EXCLUDED.is_archived,
                        forks_count = EXCLUDED.forks_count,
                        open_issues_count = EXCLUDED.open_issues_count,
                        stars_count = EXCLUDED.stars_count,
                        display_name = EXCLUDED.display_name,
                        display_description = EXCLUDED.display_description,
                        github_created_at = EXCLUDED.github_created_at,
                        github_updated_at = EXCLUDED.github_updated_at,
                        github_pushed_at = EXCLUDED.github_pushed_at,
                        synced_at = EXCLUDED.synced_at
                    RETURNING id, (xmax = 0) as inserted
                    """,
                    (
                        repo.id,
                        owner_id,
                        repo.name,
                        repo.description,
                        repo.repo_url,
                        repo.main_language,
                        repo.is_private,
                        repo.is_fork,
                        repo.is_archived,
                        repo.forks,
                        repo.open_issues,
                        repo.star_count,
                        False if repo.is_private else True, # is_portfolio_visible
                        
                        repo.name,         # -> DisplayName
                        repo.description,  # -> DisplayDesk

                        repo.created_at,
                        repo.updated_at,
                        repo.pushed_at,

                        datetime.now(ZoneInfo(TIMEZONE)).isoformat() # SyncedAt
                    )
                )
                row = cur.fetchone()
                repo_id = row["id"]
                inserted = row["inserted"]

        return repo_id, inserted