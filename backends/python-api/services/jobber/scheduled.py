from .defs import TaskType
from services.database import DBClient

class ScheduledJobs:
    def __init__(self):
        self.db = DBClient()

    def create_run(self, task_type: TaskType) -> int:
        with self.db.connection() as conn, conn.cursor() as cur:
            cur.execute(
                """
                INSERT INTO github.sync_jobs (type, status)
                VALUES (%s, 'in_progress')
                RETURNING id
                """,
                (task_type.value,),
            )
            return cur.fetchone()["id"]

    def complete_run(self, job_id: int, result: dict) -> None:
        with self.db.connection() as conn, conn.cursor() as cur:
            cur.execute(
                """
                UPDATE github.sync_jobs
                SET completed_at = now(),
                    status = 'completed',
                    repositories_found = %s,
                    repositories_created = %s,
                    repositories_updated = %s,
                    repositories_failed = %s,
                    duration_ms = (EXTRACT(EPOCH FROM (now() - started_at)) * 1000)::integer
                WHERE id = %s
                """,
                (
                    result.get("repositories_found", 0),
                    result.get("repositories_created", 0),
                    result.get("repositories_updated", 0),
                    result.get("repositories_failed", 0),
                    job_id,
                ),
            )

    def fail_run(self, job_id: int, error: str) -> None:
        with self.db.connection() as conn, conn.cursor() as cur:
            cur.execute(
                """
                UPDATE github.sync_jobs
                SET completed_at = now(),
                    status = 'failed',
                    error = %s,
                    duration_ms = (EXTRACT(EPOCH FROM (now() - started_at)) * 1000)::integer
                WHERE id = %s
                """,
                (error, job_id),
            )
