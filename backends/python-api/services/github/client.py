import requests

class GitHubInvalidAuth(Exception):
    """Raised when Github authentication is invalid"""
    pass

class GitHubClient:
    def __init__(self, gh_token, gh_user):
        self.base_path = "https://api.github.com"
        self.api_version = "2026-03-10"
        self.token = gh_token
        self.username = gh_user 

        # Define the required headers in all endpoints
        self.headers = {
            "User-Agent": f"{self.username}_portfolio",
            "X-GitHub-Api-Version": self.api_version,
            "Accept": "application/vnd.github+json",
            "Authorization": f"Bearer {self.token}"
        }


    """
    This function recvs the user information
    """
    def get_authenticated_user(self):
        # make the request
        r = requests.get(f"{self.base_path}/user", headers=self.headers)
        
        if r.status_code != 200:

            # Raise invalid token error (custom)
            if r.status_code == 401:
                raise GitHubInvalidAuth("Invalid GitHub token.")
            
            raise Exception(f"Github API returned {r.status_code}")
        

    



