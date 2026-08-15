# Service related
from services.github.models import Profile, Link, Contribution
from services.github.client import GitHubClient

from services.database import DBClient

# Other
from binascii import Error as BinasciiError
from psycopg.types.json import Jsonb
from json import JSONDecodeError
from base64 import b64decode
import requests


class ProfileClient(GitHubClient):
    def __init__(self, gh_token, gh_user):
        super().__init__(gh_token, gh_user)


    """
    makes a raw request to /users/{username} for later
    parsing to fullfil `Profile` model
    """    
    def get_profile_information(self) -> dict:
        self._current_request = requests.get(f"{self.base_path}/users/{self.username}", headers=self.headers)

        # check valid response
        self.check_response()

        # return response
        try:
            return self._current_request.json()
        except JSONDecodeError:
            return {}


    """
    function that extract social links of profile
    """
    def get_profile_links(self) -> list[Link]:
        self._current_request = requests.get(f"{self.base_path}/users/{self.username}/social_accounts", headers=self.headers)

        #  valid response
        self.check_response()

        # return response
        try:
            return self._current_request.json()
        except JSONDecodeError:
            return []
    
    
    """
    see if the user has the username repo to extract the readme
    content to show as description of `Profile`
    """
    def get_profile_description(self) -> dict:
        self._current_request = requests.get(f"{self.base_path}/repos/{self.username}/{self.username}/readme")

        # check if its 404
        if self._current_request.status_code == 404:
            return None

        # check response 
        self.check_response()

        try:
            return self._current_request.json()
        except JSONDecodeError:
            return {}
        

    """
    return raw request to gh graphql api to extract contributions
    """
    def get_graphql_contributions(self) -> dict:
        body = {
            "query": "query($username:String!){ user(login:$username){ contributionsCollection { contributionCalendar { totalContributions weeks { contributionDays { date contributionCount contributionLevel } } } } } }",
            "variables": {
                "username": self.username
            }
        }

        self._current_request = requests.post(f"{self.base_path}/graphql", headers=self.headers, json=body)

        # return response
        try:
            return self._current_request.json()
        except JSONDecodeError:
            return {}


    """
    main function to process and parse all the extracted
    information from the API.
    """
    def process_profile(self) -> Profile:
        profile = Profile()

        # Profile main information
        profile = self.parse_main_information(profile)
        profile = self.parse_links(profile)
        profile = self.parse_description(profile)
        profile = self.parse_contributions(profile)

        return profile


    """
    SQL Function to insert the Profile into DB
    """
    def add_profile(self, profile_info: Profile):
        db_client = DBClient()

        with db_client.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO github.profile (
                        github_id, username, name, blog, 
                        bio, avatar, description, followers,
                        following, links, contributions
                    ) VALUES (
                        %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s
                    ) 
                    ON CONFLICT (github_id) 
                    DO UPDATE SET
                        name = EXCLUDED.name,
                        blog = EXCLUDED.blog,
                        bio = EXCLUDED.bio,
                        avatar = EXCLUDED.avatar,
                        description = EXCLUDED.description,
                        followers = EXCLUDED.followers,
                        following = EXCLUDED.following,
                        links = EXCLUDED.links,
                        contributions = EXCLUDED.contributions
                    """,
                    (
                        profile_info.id,
                        profile_info.username,
                        profile_info.name,
                        profile_info.blog,
                        profile_info.bio,
                        profile_info.avatar,
                        profile_info.description,
                        profile_info.followers,
                        profile_info.following,
                        Jsonb([link.model_dump() for link in profile_info.links]),
                        Jsonb([contrib.model_dump() for contrib in profile_info.contributions]),
                    )
                )

    """
    list of fuinctions to correctly parse profile 
    information to `Profile` pydantic model
    """
    def parse_main_information(self, profile: Profile) -> Profile:
        raw = self.get_profile_information()

        mapping = {
            "id": "id",
            "name": "name",
            "username": "login",
            "blog": "blog",
            "bio": "bio",
            "avatar": "avatar_url",
            "followers": "followers",
            "following": "following",
        }

        for field, github_field in mapping.items():
            setattr(profile, field, raw.get(github_field))

        return profile

    
    def parse_links(self, profile: Profile) -> Profile:
        raw_links = self.get_profile_links()
        links = []

        for link in raw_links:
            links.append(Link.model_validate(link))


        profile.links = links
        return profile


    def parse_description(self, profile: Profile) -> Profile:
        raw_desc = self.get_profile_description()
        encoded_desc = raw_desc.get("content", None)

        if not encoded_desc:
            return None

        try:    
            profile.description = b64decode(encoded_desc).decode()
        except BinasciiError:
            return profile
        
        return profile

    def parse_contributions(self, profile: Profile) -> Profile:
        raw_contribs = self.get_graphql_contributions()

        weeks = (
            raw_contribs
            .get("data", {})
            .get("user", {})
            .get("contributionsCollection", {})
            .get("contributionCalendar", {})
            .get("weeks", [])
        )

        contributions = []

        for week in weeks:
            for day in week.get("contributionDays", []):
                contributions.append(
                    Contribution(
                        date=day.get("date"),
                        commits=day.get("contributionCount", 0),
                        contrib_level=day.get("contributionLevel", "NONE"),
                    )
                )

        profile.contributions = contributions
        return profile
