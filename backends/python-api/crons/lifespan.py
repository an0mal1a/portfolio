# Cronjobs
from crons.scheduler import setup_scheduler, scheduler

# Other imports
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app):
    # This function start the scheduler service
    setup_scheduler()

    try:
        yield
    finally:
        if scheduler.running:
            scheduler.shutdown()