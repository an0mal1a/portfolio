def sync_gihub(gh_token, gh_username) -> bool:
    if not gh_token:
        print("No github token, stopping task")
        return False
    
    print("[CRONJOB.GH_SYNC_TASK] > Starting GitHub sync task")
    raise NotImplementedError
    

