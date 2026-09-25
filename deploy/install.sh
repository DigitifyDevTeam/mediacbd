#!/usr/bin/env bash
# One-time user-level bootstrap. No root / no sudo.
# Usage (from the repo root): bash deploy/install.sh
set -euo pipefail

APP_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
BACKEND="$APP_ROOT/backend"
VENV="$BACKEND/venv"

if [[ ! -d "$BACKEND" ]]; then
  echo "Missing $BACKEND" >&2
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  echo "python3 is required on this account." >&2
  exit 1
fi

mkdir -p "$BACKEND/staticfiles" "$BACKEND/run" "$BACKEND/logs"

if [[ ! -x "$VENV/bin/python" ]]; then
  python3 -m venv "$VENV"
fi

"$VENV/bin/pip" install --upgrade pip
"$VENV/bin/pip" install -r "$BACKEND/requirements.txt"

if [[ ! -f "$BACKEND/.env" ]]; then
  cp "$APP_ROOT/deploy/env.production.example" "$BACKEND/.env"
  chmod 600 "$BACKEND/.env" || true
  echo "Created $BACKEND/.env — set DJANGO_SECRET_KEY, DB_*, SMTP before start."
fi

chmod +x "$BACKEND/gunicorn-ctl.sh"

echo
echo "Next:"
echo "  1. Edit $BACKEND/.env"
echo "  2. bash $APP_ROOT/deploy/release.sh"
echo "  3. cd $BACKEND"
echo "     source venv/bin/activate"
echo "     bash gunicorn-ctl.sh restart"
echo "     curl http://127.0.0.1:8001/api/"
