#!/usr/bin/env bash
# Repeatable release: build React dist, migrate Django, collectstatic, reload Gunicorn.
# Usage: sudo APP_ROOT=/var/www/mediacbd bash deploy/release.sh
set -euo pipefail

APP_ROOT="${APP_ROOT:-/var/www/mediacbd}"
APP_USER="${APP_USER:-www-data}"
APP_GROUP="${APP_GROUP:-www-data}"
VENV="$APP_ROOT/backend/.venv"
SKIP_PRERENDER="${SKIP_PRERENDER:-0}"

if [[ ! -d "$APP_ROOT/backend" ]]; then
  echo "Missing $APP_ROOT/backend" >&2
  exit 1
fi

if [[ ! -x "$VENV/bin/python" ]]; then
  echo "Create the venv first: sudo bash $APP_ROOT/deploy/install.sh" >&2
  exit 1
fi

echo "==> Python deps"
"$VENV/bin/pip" install -r "$APP_ROOT/backend/requirements.txt"

echo "==> Django migrate + collectstatic"
"$VENV/bin/python" "$APP_ROOT/backend/manage.py" migrate --noinput
"$VENV/bin/python" "$APP_ROOT/backend/manage.py" collectstatic --noinput

if [[ -d "$APP_ROOT/react" ]]; then
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

if [[ ! -f "$APP_ROOT/react/dist/index.html" ]]; then
  echo "react/dist/index.html is missing. Build the frontend or copy dist onto the server." >&2
  exit 1
fi

chown -R "$APP_USER:$APP_GROUP" "$APP_ROOT/backend/db.sqlite3" \
  "$APP_ROOT/backend/staticfiles" 2>/dev/null || true
chown -R "$APP_USER:$APP_GROUP" "$APP_ROOT/backend"

if systemctl is-enabled mediacbd.service >/dev/null 2>&1 || systemctl is-active mediacbd.service >/dev/null 2>&1; then
  echo "==> Restart Gunicorn"
  systemctl restart mediacbd.service
fi

if command -v nginx >/dev/null 2>&1; then
  nginx -t
  systemctl reload nginx
fi

echo "==> Release done"
if command -v curl >/dev/null 2>&1; then
  curl -fsS -H "Host: mediacbd.fr" "http://127.0.0.1/api/health/" || true
fi
