#!/bin/sh
set -e

echo "Waiting for Postgres..."
while ! pg_isready -h db -p 5432 -U "${POSTGRES_USER:-mydea}" >/dev/null 2>&1; do
  sleep 1
done

echo "Postgres is ready"
if [ -f "./alembic.ini" ]; then
  alembic upgrade head || true
fi
exec "$@"
