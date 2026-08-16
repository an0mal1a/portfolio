from services.database import DBClient

class JobsRepository:
    def __init__(self):
        self.db = DBClient()

    def list_recent(self, limit: int = 7) -> list[dict]:
        with self.db.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT 
                        id, started_at, completed_at, status, duration_ms, error 
                    FROM github.sync_jobs 
                    ORDER BY started_at DESC
                    LIMIT %s
                    """,
                    (
                        limit,
                    )
                )

                rows = cur.fetchall()

        # Close conn & return valuer
        conn.close()
        return rows

    
    def list_job_info(self, id: int) -> list[dict]:
        with self.db.get_db_connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    SELECT 
                        *
                    FROM github.sync_jobs 
                    WHERE id = %s
                    """,
                    (
                        id,
                    )
                )

                job = cur.fetchone()

        # Close conn & return valuer
        conn.close()
        return job

            