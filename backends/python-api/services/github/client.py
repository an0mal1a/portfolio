from .errors import GitHubInvalidAuth
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
        url = self._current_request.url
        status = self._current_request.status_code
        text = self._current_request.text
        headers = self._current_request.headers

        if status == 200 or status == 204: return

        if status == 401:
            raise GitHubInvalidAuth(f"Invalid GitHub token. Response: {text}")

        if status in (403, 404):
            perms = headers.get("X-Accepted-GitHub-Permissions")
            sso = headers.get("X-GitHub-SSO")
            details = []

            if perms: details.append(f"Required permissions: {perms}")
            if sso: details.append(f"SAML SSO info: {sso}")

            raise Exception(
                f"GitHub API access denied ({status}). "
                + " ".join(details)
                + f" Response: {text}"
            )

        if status == 422:
            raise Exception(f"GitHub validation error: {text}")

        raise Exception(
            f"GitHub API returned {status}. "
            f"Response: {text}"
            f"Url: {url}"
        )

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