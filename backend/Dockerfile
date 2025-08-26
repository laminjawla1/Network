FROM python:3.13-slim-bookworm

WORKDIR /usr/src/app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

COPY ./requirements.txt /usr/src/app/requirements.txt

RUN pip install --upgrade pip --no-cache-dir && \
    pip install --no-cache-dir -r ./requirements.txt && \
    apt-get update && \
    apt-get install -y --no-install-recommends gcc libpq-dev && \
    pip install psycopg2-binary && \
    apt-get purge -y --auto-remove gcc libpq-dev && \
    rm -rf /var/lib/apt/lists/*
COPY ./ /usr/src/app/

WORKDIR /usr/src/app/
CMD [ "python", "manage.py", "runserver", "0.0.0.0:8001"]