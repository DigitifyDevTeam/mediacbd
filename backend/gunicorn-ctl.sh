#!/usr/bin/env bash
# User-level Gunicorn control. Run from backend/:
#   source venv/bin/activate
#   bash gunicorn-ctl.sh restart
#   curl http://127.0.0.1:8001/api/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
VENV="$ROOT/venv"
PIDFILE="$ROOT/run/gunicorn.pid"
LOGDIR="$ROOT/logs"
ACCESS_LOG="$LOGDIR/access.log"
ERROR_LOG="$LOGDIR/error.log"
CONF="$(cd "$ROOT/.." && pwd)/deploy/gunicorn.conf.py"
BIND_DEFAULT="127.0.0.1:8001"

cd "$ROOT"
export DJANGO_SETTINGS_MODULE="${DJANGO_SETTINGS_MODULE:-mediacbd.settings}"

if [[ -f "$ROOT/.env" ]]; then
  set -a
  # Strip CRLF so a Windows-edited .env still sources on Linux.
  # shellcheck disable=SC1090
  source <(sed 's/\r$//' "$ROOT/.env")
  set +a
fi

BIND="${GUNICORN_BIND:-$BIND_DEFAULT}"
GUNICORN="${GUNICORN:-$VENV/bin/gunicorn}"

usage() {
  echo "Usage: bash gunicorn-ctl.sh {start|stop|restart|status}" >&2
  exit 1
}

is_running() {
  local pid
  [[ -f "$PIDFILE" ]] || return 1
  pid="$(tr -d '[:space:]' < "$PIDFILE" || true)"
  [[ -n "$pid" ]] || return 1
  kill -0 "$pid" 2>/dev/null
}

pid_of() {
  tr -d '[:space:]' < "$PIDFILE"
}

start() {
  if [[ ! -x "$GUNICORN" ]]; then
    echo "Missing $GUNICORN — create it with: python3 -m venv venv && venv/bin/pip install -r requirements.txt" >&2
    exit 1
  fi
  if is_running; then
    echo "Gunicorn already running (pid $(pid_of)) on $BIND"
    return 0
  fi
  rm -f "$PIDFILE"
  mkdir -p "$ROOT/run" "$LOGDIR"

  "$GUNICORN" \
    --config "$CONF" \
    --bind "$BIND" \
    --pid "$PIDFILE" \
    --daemon \
    --access-logfile "$ACCESS_LOG" \
    --error-logfile "$ERROR_LOG" \
    mediacbd.wsgi:application

  for _ in $(seq 1 30); do
    if is_running; then
      echo "Gunicorn started (pid $(pid_of)) on $BIND"
      return 0
    fi
    sleep 0.1
  done
  echo "Gunicorn failed to start. Tail $ERROR_LOG" >&2
  tail -n 40 "$ERROR_LOG" >&2 || true
  exit 1
}

stop() {
  if ! is_running; then
    echo "Gunicorn is not running"
    rm -f "$PIDFILE"
    return 0
  fi
  local pid
  pid="$(pid_of)"
  kill -TERM "$pid" 2>/dev/null || true
  for _ in $(seq 1 40); do
    if ! kill -0 "$pid" 2>/dev/null; then
      rm -f "$PIDFILE"
      echo "Gunicorn stopped"
      return 0
    fi
    sleep 0.1
  done
  kill -KILL "$pid" 2>/dev/null || true
  rm -f "$PIDFILE"
  echo "Gunicorn killed"
}

status() {
  if is_running; then
    echo "running pid=$(pid_of) bind=$BIND"
    return 0
  fi
  echo "stopped"
  return 1
}

cmd="${1:-}"
case "$cmd" in
  start) start ;;
  stop) stop ;;
  restart) stop; start ;;
  status) status ;;
  *) usage ;;
esac
