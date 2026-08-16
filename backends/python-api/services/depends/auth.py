from fastapi import Header, HTTPException
from secrets import compare_digest

from config import TOKEN

def require_token(authorization: str = Header(None)):
    token = authorization.split(" ", 1)[1] if authorization and authorization.startswith("Bearer ") else None

    if not token:
        raise HTTPException(status_code=401, detail="Access denied")

    # Secure comparison
    if compare_digest(token, TOKEN):
        return True

    raise HTTPException(status_code=401, detail="Access denied")
    