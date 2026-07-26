# Scheduler
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

# Config
from config import GH_TOKEN, GH_USERNAME, TIMEZONE

from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

TIMEZONE_FRM = ZoneInfo(TIMEZONE)
scheduler = AsyncIOScheduler(timezone=str(TIMEZONE_FRM))


def setup_scheduler():
    # If the scheduler is already running, dont start it
    if scheduler.running:
        return

    # ── task imports ───────────────────────
    from .tasks.github_sync import sync_gihub

    # ── Github Sync - every day at 00:00 ───────────────────────
    next_run_time = datetime.now(TIMEZONE_FRM) + timedelta(seconds=10)
    scheduler.add_job(sync_gihub, CronTrigger(hour=0, minute=0, timezone=TIMEZONE_FRM),kwargs={"gh_token": GH_TOKEN, "gh_user": GH_USERNAME}, next_run_time=next_run_time, misfire_grace_time=60)
    # scheduler.add_job(sync_gihub, CronTrigger(hour=0, minute=0, timezone=TIMEZONE_FRM),kwargs={"gh_token": GH_TOKEN, "gh_user": GH_USERNAME}, misfire_grace_time=60)

    scheduler.start()
    print(f"Scheduler started with {len(scheduler.get_jobs())} jobs")
    print(f"First run scheduled for: {next_run_time}")