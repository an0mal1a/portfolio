class GitHubInvalidAuth(Exception):
    """Raised when Github authentication is invalid"""
    pass

class MissingData(Exception):
    """Raised when missing data on a function call"""
    pass