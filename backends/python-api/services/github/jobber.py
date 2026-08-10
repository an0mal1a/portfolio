from services.database import DBClient

from datetime import datetime

class JobberLog:
    """
    This service has been created as a "beautiful" way to provide the db
    connection to the cronjobs tasks, allowing (for github) to set the job started
    change the status, save details, etc. 

    - Possible `status` field values:
        - `in_progress`
        - `completed`
        - `failed`

    The name jobber is just for pure fun :)
    """
    def __init__(self):
        self.job_id = None
        self._db_client = DBClient()

        # Define the valid fields used by `update_field` && `increase_field`
        self.VALID_FIELDS = ["started_at", "completed_at", "status", "repositories_found", "repositories_created", "repositories_updated", "repositories_failed", "duration_ms", "error", ]
        self.INT_FIELDS = ["repositories_found", "repositories_created", "repositories_updated", "repositories_failed", "duration_ms"]

    def job_started(self) -> bool:
        """Create de job in db and store the `job_id` in the class context"""
        with self._db_client.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO github.sync_jobs (
                        started_at,
                        status
                    ) VALUES (%s, 'in_progress')
                    RETURNING id
                    """, (datetime.now().isoformat(), ) 
                )

                conn.commit()

                gh_id = cur.fetchone()["id"]
                if gh_id is not None:
                    self.job_id = gh_id
                    return True

                return False

    def update_field(self, field, v) -> bool:
        """
        Update a given `field` of db to the value of `v`
        """
        if field not in self.VALID_FIELDS:
            raise ValueError("Field not allowed")

        query = f"""
            UPDATE github.sync_jobs
            SET {field} = %s
            WHERE id = %s
            RETURNING id
        """

        with self._db_client.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(query, (v, self.job_id))
                return cur.rowcount > 0
            conn.commit()

    def increase_field(self, field, n = 1) -> bool:
        """
        Increase a given `field` of db by the amount of `n`.
        """
        if field not in self.INT_FIELDS:
            raise ValueError("Field not allowed")

        query = f"""
            UPDATE github.sync_jobs
            SET {field} = {field} + %s
            WHERE id = %s
            RETURNING id
        """

        with self._db_client.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(query, (n, self.job_id))
                return cur.rowcount > 0

            conn.commit()