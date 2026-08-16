from config import PUBLIC_JOB_HASH_SECRET

from datetime import date
import hashlib
import hmac


def hash_visitor(ip: str, quota_date: date) -> str:
    value = (f"{quota_date.isoformat()}:{ip}").encode()

    return hmac.new(
        (PUBLIC_JOB_HASH_SECRET or "").encode(),
        value,
        hashlib.sha256,
    ).hexdigest()
