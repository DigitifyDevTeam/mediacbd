#!/usr/bin/env bash
# Create backend/venv without sudo. Prefer stdlib venv; fall back to virtualenv.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
VENV="$ROOT/venv"

if [[ -x "$VENV/bin/gunicorn" ]]; then
  echo "venv already ready: $VENV"
  exit 0
fi

create_venv() {
  if python3 -m venv "$VENV" && [[ -x "$VENV/bin/pip" ]]; then
    return 0
  fi
  echo "python3 -m venv failed (python3-venv missing?). Using virtualenv --user."
  rm -rf "$VENV"
  python3 -m pip install --user --quiet virtualenv
  python3 -m virtualenv "$VENV"
}

if [[ ! -x "$VENV/bin/pip" ]]; then
  echo "==> Creating $VENV"
  create_venv
fi

"$VENV/bin/pip" install --upgrade pip
"$VENV/bin/pip" install -r "$ROOT/requirements.txt"
echo "venv ready. Next: source venv/bin/activate"
