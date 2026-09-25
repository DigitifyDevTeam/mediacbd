#!/usr/bin/env bash
# User-level Gunicorn control. Run from backend/:
#   source venv/bin/activate
#   bash gunicorn-ctl.sh restart
#   curl --noproxy '*' http://127.0.0.1:8002/api/
set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
VENV="$ROOT/venv"
PIDFILE="$ROOT/run/gunicorn.pid"
LOGDIR="$ROOT/logs"
ACCESS_LOG="$LOGDIR/access.log"
ERROR_LOG="$LOGDIR/error.log"
CONF="$(cd "$ROOT/.." && pwd)/deploy/gunicorn.conf.py"
BIND_DEFAULT="127.0.0.1:8002"

cd "$ROOT"
export DJANGO_SETTINGS_MODULE="${DJANGO_SETTINGS_MODULE:-mediacbd.settings}"

load_dotenv() {
  local envf="$1" line key value
  [[ -f "$envf" ]] || return 0
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%$'\r'}"
    [[ -z "${line//[[:space:]]/}" || "$line" == \#* ]] && continue
    [[ "$line" == *=* ]] || continue
    key="${line%%=*}"
    value="${line#*=}"
    key="${key%"${key##*[![:space:]]}"}"
    key="${key#"${key%%[![:space:]]*}"}"
    value="${value#"${value%%[![:space:]]*}"}"
    value="${value%"${value##*[![:space:]]}"}"
    if [[ "$value" == \"*\" ]]; then
      value="${value#\"}"
      value="${value%\"}"
    elif [[ "$value" == \'*\' ]]; then
      value="${value#\'}"
      value="${value%\'}"
    fi
    [[ -n "$key" ]] && export "$key=$value"
  done < "$envf"
}

load_dotenv "$ROOT/.env"

BIND="${GUNICORN_BIND:-$BIND_DEFAULT}"
if [[ ! -x "$VENV/bin/gunicorn" ]]; then
  echo "==> venv missing — creating it (no sudo)"
  bash "$ROOT/ensure-venv.sh"
fi
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

bind_in_use() {
  local host port
  host="${BIND%:*}"
  port="${BIND##*:}"
  python3 - "$host" "$port" <<'PY'
import socket, sys
host, port = sys.argv[1], int(sys.argv[2])
s = socket.socket()
s.settimeout(0.4)
try:
    s.connect((host, port))
except OSError:
    raise SystemExit(0)
s.close()
raise SystemExit(1)
PY
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
  if ! bind_in_use; then
    echo "Port $BIND is already taken by another app (not MediaCBD)." >&2
    echo "Set GUNICORN_BIND=127.0.0.1:8002 in .env and retry." >&2
    exit 1
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
