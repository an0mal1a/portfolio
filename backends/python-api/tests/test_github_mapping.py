import unittest

from services.github.client import GitHubClient


class GitHubMappingTests(unittest.TestCase):
    def test_repository_payload_mapping_uses_github_field_names(self):
        client = GitHubClient.__new__(GitHubClient)

        raw_repo = {
            "id": 1,
            "name": "portfolio",
            "description": "desc",
            "html_url": "https://github.com/example/portfolio",
            "language": "Vue",
            "fork": False,
            "private": True,
            "forks_count": 4,
            "open_issues_count": 2,
            "stargazers_count": 7,
            "archived": False,
            "created_at": "2026-01-01T00:00:00Z",
            "updated_at": "2026-01-02T00:00:00Z",
            "pushed_at": "2026-01-03T00:00:00Z",
            "owner": {
                "login": "octocat",
                "avatar_url": "https://avatars.example/u/1",
                "html_url": "https://github.com/octocat",
                "type": "User",
            },
        }

        repo = client._build_repository_payload(raw_repo)

        self.assertFalse(repo["is_fork"])
        self.assertFalse(repo["is_archived"])
        self.assertEqual(repo["forks"], 4)
        self.assertEqual(repo["open_issues"], 2)
        self.assertEqual(repo["star_count"], 7)


if __name__ == "__main__":
    unittest.main()
