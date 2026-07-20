from pydantic import BaseModel
from datetime import datetime

class Owner(BaseModel):
    name: str
    avatar_url: str
    profile_url: str
    type: str
    
class Lang(BaseModel):
    name: str
    percentage: int


class Repository(BaseModel):
    id: int
    name: str
    description: str
    repo_url: str
    main_language: str
    is_private: bool
    owner: Owner
    
    collaborators: list[Owner]
    languages: list[Lang]
    topics: list
     
    forks: int
    open_issues: int
    star_count: int

    # Meta
    created_at: datetime
    updated_at: datetime
    pushed_at: datetime


