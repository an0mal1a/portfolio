# GitHub service
from services.github.models import Profile 
from services.github.profile_client import ProfileClient

# common error
from services.errors import MissingData

from collections.abc import Callable

ProgressCallback = Callable[[int, str], None]

def sync_profile(gh_token, gh_user, on_progress: ProgressCallback | None = None) -> dict: 
    def progress(value: int, message: str):
        if on_progress:
            on_progress(value, message)

    if not gh_token:
        raise MissingData("Missing GitHub token")

    progress(5, "Validating GitHub access")

    gh_client = ProfileClient(gh_token=gh_token, gh_user=gh_user)

    # Get profile information
    gh_profile_info: Profile = gh_client.process_profile(on_progress=progress)

    progress(78, "Saving profile to database")
    
    gh_client.add_profile(gh_profile_info)

    progress(96, "Finalizing profile sync")

    return {
        "user": gh_user,
        "profile_synced": True,
    }