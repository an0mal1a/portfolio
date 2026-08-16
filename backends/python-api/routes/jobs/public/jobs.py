# Services related
from services.jobber import TaskType
from services.jobber.runner import execute_run
from services.depends.visitor import hash_visitor
from services.jobber.runs import JobRuns, JobAlreadyRunning, PublicDailyLimitReached, VisitorDailyLimitReached

# fastapi
from fastapi import APIRouter, BackgroundTasks, HTTPException, Request, status
from fastapi.responses import StreamingResponse

# Other
from datetime import datetime
from zoneinfo import ZoneInfo
from uuid import UUID
import asyncio
import json


router = APIRouter(
    prefix="/public/jobs",
    tags=["public-jobs"],
)


@router.post("/{task_type}/run", status_code=status.HTTP_202_ACCEPTED)
def run_public_job(task_type: TaskType, request: Request, background_tasks: BackgroundTasks):
    today = datetime.now(ZoneInfo("Europe/Madrid")).date()

    ip = request.client.host

    requester_hash = hash_visitor(ip, today)

    jobs = JobRuns()

    try:
        run = jobs.create_public_run(job_type=task_type, requester_hash=requester_hash, quota_date=today)

    except JobAlreadyRunning as exc:
        raise HTTPException(
            status_code=409,
            detail={
                "code": "job_already_running",
                "run_id": str(exc.run_id),
            },
        )

    except VisitorDailyLimitReached:
        raise HTTPException(
            status_code=429,
            detail={
                "code": "visitor_daily_limit",
                "message": (
                    "You already ran this job today."
                ),
            },
        )

    except PublicDailyLimitReached:
        raise HTTPException(
            status_code=429,
            detail={
                "code": "public_daily_limit",
                "message": (
                    "Daily public execution "
                    "limit reached."
                ),
            },
        )

    background_tasks.add_task(
        execute_run,
        run.id,
    )

    return {
        "run_id": str(run.id),
        "job_type": run.job_type.value,
        "status": run.status,
        "remaining_today": run.remaining_today,
    }


def get_run_or_404(run_id: UUID) -> dict:
    run = JobRuns().get_public_run(run_id)
    if not run:
        raise HTTPException(status_code=404, detail={"code": "run_not_found"})
    run["id"] = str(run["id"])
    run["created_at"] = run["created_at"].isoformat()
    for field in ("started_at", "finished_at"):
        if run[field]:
            run[field] = run[field].isoformat()
    return run


@router.get("/{run_id}")
def get_public_job(run_id: UUID):
    """Polling endpoint used if EventSource is unavailable."""
    return get_run_or_404(run_id)


@router.get("/{run_id}/events")
async def stream_public_job(run_id: UUID):
    """Server-sent progress events for the GitHub sync popup."""
    async def events():
        last_payload = None
        last_keepalive = 0.0

        while True:
            run = get_run_or_404(run_id)
            payload = json.dumps(run, default=str, sort_keys=True)

            # Only send actual DB state transitions. A short check interval makes
            # job progress feel immediate without flooding EventSource clients.
            if payload != last_payload:
                yield f"event: progress\ndata: {payload}\n\n"
                last_payload = payload

            if run["status"] in {"completed", "failed"}:
                return

            now = asyncio.get_running_loop().time()
            if now - last_keepalive >= 15:
                yield ": keep-alive\n\n"
                last_keepalive = now

            await asyncio.sleep(0.2)

    return StreamingResponse(
        events(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
