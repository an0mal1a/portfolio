from services.jobber import TaskType

# Other
from pydantic import BaseModel
from datetime import datetime

class JobCreation(BaseModel):
    job_type: TaskType
    start_time: datetime
    run_once: bool
    run_now: bool