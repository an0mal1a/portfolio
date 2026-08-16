# services
from services.database import DBClient
from services.jobber import TaskType

# other
from dataclasses import dataclass
from datetime import date
from uuid import UUID
import json

PUBLIC_DAILY_LIMIT = 3
STALE_RUN_AFTER_MINUTES = 60

# CustomExceptions
class PublicDailyLimitReached(Exception):
    pass

class VisitorDailyLimitReached(Exception):
    pass

class JobAlreadyRunning(Exception):
    def __init__(self, run_id: UUID):
        self.run_id = run_id

@dataclass
class JobRun:
    id: UUID
    job_type: TaskType
    status: str
    remaining_today: int


class JobRuns:
    def __init__(self):
        self.db = DBClient()

    def create_scheduled_run(self, job_type: TaskType):
        with self.db.connection() as conn, conn.cursor() as cur:
            cur.execute("""
                INSERT INTO github.job_runs (job_type, trigger, status)
                VALUES (%s, 'scheduled', 'pending')
                ON CONFLICT DO NOTHING
                RETURNING id
            """, (job_type.value,))

            row = cur.fetchone()

        return row["id"] if row else None

    def recover_stale_runs(self) -> int:
        """Release runs abandoned by a worker restart or crash."""
        with self.db.connection() as conn, conn.cursor() as cur:
            cur.execute(
                """
                UPDATE github.job_runs
                SET status = 'failed',
                    message = 'Worker did not finish the job',
                    error = 'Run timed out or the worker restarted',
                    finished_at = now()
                WHERE status IN ('pending', 'running')
                  AND COALESCE(started_at, created_at)
                      < now() - (%s * interval '1 minute')
                """,
                (STALE_RUN_AFTER_MINUTES,),
            )
            return cur.rowcount

    def get_public_run(self, run_id: UUID) -> dict | None:
        with self.db.connection() as conn, conn.cursor() as cur:
            cur.execute(
                """
                SELECT id, job_type, status, progress, message, result, error,
                       created_at, started_at, finished_at
                FROM github.job_runs
                WHERE id = %s AND trigger = 'public'
                """,
                (run_id,),
            )
            return cur.fetchone()

    def start_run(self, run_id: UUID) -> TaskType | None:
        with self.db.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE github.job_runs
                    SET
                        status = 'running',
                        started_at = now(),
                        message = 'Starting job'
                    WHERE
                        id = %s
                        AND status = 'pending'
                    RETURNING job_type
                    """,
                    (run_id,),
                )

                row = cur.fetchone()

        if not row:
            return None

        return TaskType(row["job_type"])

    def update_progress(self, run_id: UUID, progress: int, message: str):
        with self.db.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE github.job_runs
                    SET
                        progress = %s,
                        message = %s
                    WHERE id = %s
                    """,
                    (
                        progress,
                        message,
                        run_id,
                    ),
                )

    def complete_run(self, run_id: UUID, result=None):
        with self.db.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE github.job_runs
                    SET
                        status = 'completed',
                        progress = 100,
                        message = 'Completed',
                        result = %s::jsonb,
                        finished_at = now()
                    WHERE id = %s
                    """,
                    (
                        json.dumps(result or {}),
                        run_id,
                    ),
                )


    def fail_run(self, run_id: UUID, error: str):
        with self.db.connection() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    """
                    UPDATE github.job_runs
                    SET
                        status = 'failed',
                        message = 'Job failed',
                        error = %s,
                        finished_at = now()
                    WHERE id = %s
                    """,
                    (
                        error,
                        run_id,
                    ),
                )

    def create_public_run(self, job_type: TaskType, requester_hash: str, quota_date: date) -> JobRun:
        lock_key = (
            f"public-job:"
            f"{job_type.value}:"
            f"{quota_date.isoformat()}"
        )

        self.recover_stale_runs()

        with self.db.connection() as conn:
            with conn.cursor() as cur:
                # Serializa las peticiones públicas de
                # este job durante este día.
                cur.execute(
                    """
                    SELECT pg_advisory_xact_lock(
                        hashtext(%s)::bigint
                    )
                    """,
                    (lock_key,),
                )

                # 1. ¿Ya está ejecutándose?
                cur.execute(
                    """
                    SELECT id
                    FROM github.job_runs
                    WHERE
                        job_type = %s
                        AND status IN ('pending', 'running')
                    LIMIT 1
                    """,
                    (job_type.value,),
                )

                active = cur.fetchone()

                if active:
                    raise JobAlreadyRunning(active["id"])

                # 2. ¿Este visitante ya lo ejecutó hoy?
                cur.execute(
                    """
                    SELECT id
                    FROM github.job_runs
                    WHERE
                        job_type = %s
                        AND trigger = 'public'
                        AND requester_hash = %s
                        AND quota_date = %s
                        AND status <> 'failed'
                    LIMIT 1
                    """,
                    (
                        job_type.value,
                        requester_hash,
                        quota_date,
                    ),
                )

                if cur.fetchone():
                    raise VisitorDailyLimitReached()

                # 3. ¿Cuántos públicos se han usado hoy?
                cur.execute(
                    """
                    SELECT COUNT(*) AS used
                    FROM github.job_runs
                    WHERE
                        job_type = %s
                        AND trigger = 'public'
                        AND quota_date = %s
                        AND status <> 'failed'
                    """,
                    (
                        job_type.value,
                        quota_date,
                    ),
                )

                used = cur.fetchone()["used"]

                if used >= PUBLIC_DAILY_LIMIT:
                    raise PublicDailyLimitReached()

                # 4. Crear ejecución.
                #
                # ON CONFLICT también nos protege de
                # una carrera con un job scheduled.
                cur.execute(
                    """
                    INSERT INTO github.job_runs (
                        job_type,
                        trigger,
                        status,
                        requester_hash,
                        quota_date
                    )
                    VALUES (
                        %s,
                        'public',
                        'pending',
                        %s,
                        %s
                    )
                    ON CONFLICT DO NOTHING
                    RETURNING id, status
                    """,
                    (
                        job_type.value,
                        requester_hash,
                        quota_date,
                    ),
                )

                row = cur.fetchone()

                if not row:
                    # Lo normal sería que un scheduled
                    # se haya colado justo entre medias.
                    cur.execute(
                        """
                        SELECT id
                        FROM github.job_runs
                        WHERE
                            job_type = %s
                            AND status IN (
                                'pending',
                                'running'
                            )
                        LIMIT 1
                        """,
                        (job_type.value,),
                    )

                    active = cur.fetchone()

                    if active:
                        raise JobAlreadyRunning(
                            active["id"]
                        )

                    raise RuntimeError(
                        "Unable to create job run"
                    )

        return JobRun(
            id=row["id"],
            job_type=job_type,
            status=row["status"],
            remaining_today=(
                PUBLIC_DAILY_LIMIT - used - 1
            ),
        )
