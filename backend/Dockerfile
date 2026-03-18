# ─── Stage 1: builder ────────────────────────────────────────────────────────
FROM python:3.12-slim AS builder

WORKDIR /app

# System deps for argon2 / cryptography builds
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc libffi-dev libssl-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir --prefix=/install -r requirements.txt


# ─── Stage 2: runtime ────────────────────────────────────────────────────────
FROM python:3.12-slim

WORKDIR /app

COPY --from=builder /install /usr/local

# Copy source
COPY . .

# Generate Prisma Python client
RUN prisma generate

EXPOSE 3001

# gunicorn + UvicornWorker — 4 workers handles ~2k req/s on a 2-core pod
CMD ["gunicorn", "app.main:app", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:3001", \
     "--timeout", "60", \
     "--graceful-timeout", "30", \
     "--keep-alive", "5", \
     "--access-logfile", "-"]
