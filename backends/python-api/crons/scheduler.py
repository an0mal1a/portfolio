# Scheduler
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from apscheduler.triggers.cron import CronTrigger

# Config
from ..config import GH_TOKEN, GH_USERNAME

scheduler = AsyncIOScheduler(timezone="Europe/Madrid")

def setup_scheduler():
    # If the scheduler is already running, dont start it
    if scheduler.running:
        return
    
    # ── task imports ───────────────────────
    from .tasks.github_sync import sync_gihub

    # ── Github Sync - every day at 00:00 ───────────────────────
    scheduler.add_job(sync_gihub, CronTrigger(hour=0, minute=0), gh_token=GH_TOKEN, username=GH_USERNAME)