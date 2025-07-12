# Multi-stage build for AI Experiment Environment
FROM python:3.11-slim AS builder

WORKDIR /app
COPY ai_experiment/requirements.txt ./
RUN pip install --user -r requirements.txt

COPY ai_experiment/ ./ai_experiment/

FROM python:3.11-slim AS runtime
WORKDIR /app
COPY --from=builder /root/.local /root/.local
COPY --from=builder /app/ai_experiment/ ./ai_experiment/
ENV PATH=/root/.local/bin:$PATH
CMD ["python", "ai_experiment/api.py"]
