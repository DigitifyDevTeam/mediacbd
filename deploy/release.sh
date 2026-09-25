#!/usr/bin/env bash
# Repeatable user-level release. No root / no sudo.
# Usage (from the repo root): bash deploy/release.sh
set -euo pipefail

APP_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$APP_ROOT/backend"
VENV="$BACKEND/venv"
SKIP_PRERENDER="${SKIP_PRERENDER:-0}"
SKIP_FRONTEND="${SKIP_FRONTEND:-1}"

if [[ ! -d "$BACKEND" ]]; then
  echo "Missing $BACKEND" >&2
  exit 1
fi

if [[ ! -x "$VENV/bin/python" ]]; then
  echo "Create the venv first: bash $APP_ROOT/deploy/install.sh" >&2
  exit 1
fi

echo "==> Python deps"
"$VENV/bin/pip" install -r "$BACKEND/requirements.txt"

echo "==> Django migrate + collectstatic"
"$VENV/bin/python" "$BACKEND/manage.py" migrate --noinput
"$VENV/bin/python" "$BACKEND/manage.py" collectstatic --noinput

if [[ "$SKIP_FRONTEND" != "1" && -d "$APP_ROOT/react" ]]; then
  echo "==> React build → react/dist"
  if [[ ! -d "$APP_ROOT/react/node_modules" ]]; then
    (cd "$APP_ROOT/react" && npm ci)
  fi
  if [[ "$SKIP_PRERENDER" == "1" ]]; then
    (cd "$APP_ROOT/react" && npm run build:vite)
  else
    (cd "$APP_ROOT/react" && npm run build)
  fi
fi

if [[ -x "$BACKEND/gunicorn-ctl.sh" ]]; then
  echo "==> Restart Gunicorn"
  bash "$BACKEND/gunicorn-ctl.sh" restart
fi

echo "==> Release done"
if command -v curl >/dev/null 2>&1; then
  curl -fsS --noproxy '*' "http://127.0.0.1:8002/api/" || true
  echo
fi
