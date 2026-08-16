# Scheduler
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

# Config
from config import TIMEZONE

from zoneinfo import ZoneInfo

TIMEZONE_FRM = ZoneInfo(TIMEZONE)
scheduler = AsyncIOScheduler(timezone=str(TIMEZONE_FRM))

def setup_scheduler():
    # If the scheduler is already running, dont start it
    if scheduler.running:
        return

    # ── task imports ───────────────────────
    from services.jobber.runner import run_scheduled
    from services.jobber import TaskType

    # Runs internos: se registran únicamente en github.sync_jobs.
    scheduler.add_job(run_scheduled, CronTrigger(hour=0, minute=0, timezone=TIMEZONE_FRM), args=[TaskType.PROFILE], id="profile_sync", replace_existing=True, misfire_grace_time=60, max_instances=1, coalesce=True)
    scheduler.add_job(run_scheduled, CronTrigger(hour=0, minute=1, timezone=TIMEZONE_FRM), args=[TaskType.REPO_SYNC], id="repo_sync", replace_existing=True, misfire_grace_time=60, max_instances=1, coalesce=True)

    scheduler.start()
    print(f"Scheduler started with {len(scheduler.get_jobs())} jobs")
