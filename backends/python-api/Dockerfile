FROM python:3.11
WORKDIR /code/python-api

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# The visitor's address is resolved in services/depends/client_ip.py, from the socket.
CMD ["python", "-m", "uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8001", "--no-proxy-headers"]