# DB Client
from services.database.client import DBClient

# Internal modules
from .models import Repository, Owner, Lang
from .errors import GitHubInvalidAuth
from ..errors import MissingData
from config import TIMEZONE

# Other
from datetime import datetime
from zoneinfo import ZoneInfo
import requests

class GitHubClient:
    def __init__(self, gh_token, gh_user):
        self.base_path = "https://api.github.com"
        self.api_version = "2026-03-10"
        self.token = gh_token
        self.username = gh_user 
        self._current_request = None
        self._db_client = None

        # Define the required headers in all endpoints
        self.headers = {
            "User-Agent": f"{self.username}_portfolio",
            "X-GitHub-Api-Version": self.api_version,
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {self.token}"
        }

        try:
            client = self.get_authenticated_user()
        except GitHubInvalidAuth: raise 
        except Exception: raise

        self.avatar = client.get("avatar_url")
        self.name = client.get("name")


    """
    This helper funcion is used to check every request that the response
    code is 200, otherwise check if it is 401 to return the custom error
    class `GitHubInvalidAuth`.
    """
    def check_response(self):
        if self._current_request.status_code != 200:

            # Raise invalid token error (custom)
            if self._current_request.status_code == 401:
                raise GitHubInvalidAuth("Invalid GitHub token.")
            
            raise Exception(f"Github API returned {self._current_request.status_code}")

    """
    This function recvs the user information (is used to check that the token is valid)
    """
    def get_authenticated_user(self) -> dict:
        # make the request
        self._current_request = requests.get(f"{self.base_path}/user", headers=self.headers)
        
        # check valid auth
        self.check_response()
        
        # return response
        return self._current_request.json()
        

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
        return self._current_request.json()
    

    """
    This function is used to recive all the tags written on the repo
    """
    def list_repo_topics(self, repo_name) -> list[str]:
        # Check required vaulues
        if not repo_name or not self.username:
            raise MissingData(f"No repo or username found. username={self.username}, repo_name={repo_name}")
        
        # make req
        self._current_request = requests.get(f"{self.base_path}/repos/{self.username}/{repo_name}/topics")

        # check valid auth
        self.check_response()

        # Extract the list from the dict
        return self._current_request.json().get("names", [])
    

    """
    the function used to list all the collaboratos on the repository.
    this function dont extract permissions of collaboratos.
    """
    def list_repo_collaborators(self, repo_name) -> list[Owner]:
        # Check required vaulues
        if not repo_name or not self.username:
            raise MissingData(f"No repo or username found. username={self.username}, repo_name={repo_name}")
        
        # make req
        self._current_request = requests.get(f"{self.base_path}/repos/{self.username}/{repo_name}/collaborators")

        # check valid auth
        self.check_response()

        # Extract the list from the dict
        raw = self._current_request.json()
 
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
        self._current_request = requests.get(f"{self.base_path}/repos/{self.username}/{repo_name}/languages")

        # Check auth
        self.check_response()

        r = self._current_request.json()

        total = sum(r.values()) # sum the total of files
        if total == 0: return []
        
        return [
            Lang(
                name=lang,
                percentage=(value / total) * 100 

            )
            for lang, value in r.items()
        ] 
    

    """
    function to extract and process all the repo languages
    this function requires (also) the size arg to create a %
    over 100
    """
    def list_repo_forks(self, repo_name) -> int:
        # Check required vaulues
        if not repo_name or not self.username:
            raise MissingData(f"No repo or username found. username={self.username}, repo_name={repo_name}")
        
        # make req
        self._current_request = requests.get(f"{self.base_path}/repos/{self.username}/{repo_name}/forks")

        # Check auth
        self.check_response()

        r = self._current_request.json()


    """
    Function oriented to return a readable/processable object of repos (private/publics) 
    returns everything needed to feed the tables of the DB.
    """
    def process_repositories(self) -> list[Repository]:
        repos = self.list_repositories()

        if len(repos) == 0 or repos is None:
            return []
        
        # Define the list of easy values to scrap
        map = { 
            "id": "id",
            "name": "name",
            "description": "description",
            "repo_url": "html_url",
            "main_language": "language",
            "is_private": "private",  
            "forks": "forks",
            "open_issues": "open_issues",
            "star_count": "stargazers_count",
            "created_at": "created_at",
            "updated_at": "updated_at",
            "pushed_at": "pushed_at",
        }      
        
        processed_repos: list[Repository] = []
        # unique_owners: list[Owner] = []
        # repo_langs: list[Owner] = []

        for raw_repo in repos:
            repo = Repository()

            # Iterate over `map` to construct `repo` dict
            for key, raw_key in map.items():
                repo[key] = raw_repo[raw_key]

            # Get main owner
            owner_info = raw_repo["owner"]
            repo.owner = Owner(
                name=owner_info["login"], avatar_url=owner_info["avatar_url"],
                profile_url=owner_info["html_url"], type=owner_info["type"]
            )

            # # Append the owner to the list if its not added already
            # if repo.owner not in unique_owners:
            #     unique_owners.append(repo.owner)

            # Get topics
            repo.topics = self.list_repo_topics(repo["name"])

            # Get collaboratos
            repo.collaborators = self.list_repo_collaborators(repo["name"])

            # Get languages
            repo.languages = self.list_repo_langs(repo["name"])

            # Append procesed repo
            processed_repos.append(repo)

        
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
    function to add collaborators to the database
    """
    def add_collaborator(self, repo_id: int, collab_id: int):
        if not self._db_client:
            self._db_client = DBClient()
        

        with self._db_client.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                        """
                        INSERT INTO github.collaborators (
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
                    ) ON CONFLICT DO UPDATE SET
                        topics = EXCLUDED.topics
                    """,
                    (repo_id, topics)
                )
                
        return True
    

    """
    function to add langs to the database
    """
    def add_langs(self, repo_id: int, lang: Lang):
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
                        %s, %s
                    ) ON CONFLICT DO UPDATE SET
                        language = EXCLUDED.language,
                        percentage = EXCLUDED.percentage
                    """,
                    (repo_id, lang.name, lang.percentage)
                )
                
        return True
        

    """
    function to add a repo to the database
    """
    def add_repo(self, repo: Repository, owner_id: int):
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
                        starts_count = EXCLUDED.starts_count,
                        is_portfolio_visible = EXCLUDED.is_portfolio_visible,
                        display_name = EXCLUDED.display_name,
                        display_description = EXCLUDED.display_description,
                        github_created_at = EXCLUDED.github_created_at,
                        github_updated_at = EXCLUDED.github_updated_at,
                        github_pushed_at = EXCLUDED.github_pushed_at,
                        synced_at = EXCLUDED.synced_at
                    RETURNING id
                    """,
                    (
                        repo.id,
                        owner_id,
                        repo.name,
                        repo.description,
                        repo.repo_url,
                        repo.main_language,
                        repo.is_private,
                        False,
                        False,
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
                repo_id = cur.fetchone()["id"]

        return repo_id