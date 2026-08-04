from pydantic import BaseModel
from datetime import datetime
from typing import Optional

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
    description: Optional[str] = None
    repo_url: str
    main_language: Optional[str] = None
    is_private: bool
    is_fork: Optional[bool]
    is_archived: bool
    owner: Owner
    
    contributors: list[Owner]
    languages: list[Lang]
    topics: list
     
    forks: int
    open_issues: int
    star_count: int

    # Meta
    created_at: str
    updated_at: str
    pushed_at: Optional[str] = None


