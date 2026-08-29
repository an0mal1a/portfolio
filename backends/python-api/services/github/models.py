from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class Contributor(BaseModel):
    name: str
    avatar_url: str
    profile_url: str
    type: str
    contributions: int = 0


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
    owner: Contributor

    contributors: list[Contributor]
    languages: list[Lang]
    topics: list
     
    forks: int
    open_issues: int
    star_count: int

    # Meta
    created_at: str
    updated_at: str
    pushed_at: Optional[str] = None



class Contribution(BaseModel):
    date: str
    commits: int
    contrib_level: str


class Link(BaseModel):
    provider: str
    url: str


class Profile(BaseModel):
    id: Optional[int] = 0
    username: Optional[str] = None
    name: Optional[str] = None
    blog: Optional[str] = None
    bio: Optional[str] = None
    avatar: Optional[str] = None
    description: Optional[str] = None

    followers: Optional[int] = None
    following: Optional[int] = None

    links: Optional[list[Link]] = []
    contributions: Optional[list[Contribution]] = []
