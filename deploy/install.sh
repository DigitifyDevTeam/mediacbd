#!/usr/bin/env bash
# One-time server bootstrap. Run as root on Ubuntu/Debian.
# Usage: sudo APP_ROOT=/var/www/mediacbd bash deploy/install.sh
set -euo pipefail

APP_ROOT="${APP_ROOT:-/var/www/mediacbd}"
APP_USER="${APP_USER:-www-data}"
APP_GROUP="${APP_GROUP:-www-data}"

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Run as root: sudo bash deploy/install.sh" >&2
  exit 1
fi

if [[ ! -d "$APP_ROOT/backend" || ! -d "$APP_ROOT/deploy" ]]; then
  echo "Clone the repo to $APP_ROOT first." >&2
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update
apt-get install -y --no-install-recommends \
  python3 python3-venv python3-pip \
  nginx \
  rsync \
  curl

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is required to build react/dist. Install Node 22 LTS, then re-run or use deploy/release.sh." >&2
fi

install -d -m 0755 /var/www/certbot
install -d -m 0755 "$APP_ROOT/backend/staticfiles"

if [[ ! -x "$APP_ROOT/backend/.venv/bin/python" ]]; then
  python3 -m venv "$APP_ROOT/backend/.venv"
fi

"$APP_ROOT/backend/.venv/bin/pip" install --upgrade pip
"$APP_ROOT/backend/.venv/bin/pip" install -r "$APP_ROOT/backend/requirements.txt"

if [[ ! -f "$APP_ROOT/backend/.env" ]]; then
  cp "$APP_ROOT/deploy/env.production.example" "$APP_ROOT/backend/.env"
  echo "Created $APP_ROOT/backend/.env — set DJANGO_SECRET_KEY and SMTP before starting Gunicorn."
fi

ln -sfn "$APP_ROOT/deploy/systemd/mediacbd.service" /etc/systemd/system/mediacbd.service
ln -sfn "$APP_ROOT/deploy/systemd/mediacbd-reminders.service" /etc/systemd/system/mediacbd-reminders.service
ln -sfn "$APP_ROOT/deploy/systemd/mediacbd-reminders.timer" /etc/systemd/system/mediacbd-reminders.timer
ln -sfn "$APP_ROOT/deploy/nginx/mediacbd.conf" /etc/nginx/sites-available/mediacbd
ln -sfn /etc/nginx/sites-available/mediacbd /etc/nginx/sites-enabled/mediacbd
rm -f /etc/nginx/sites-enabled/default

chown -R "$APP_USER:$APP_GROUP" "$APP_ROOT/backend"
# Frontend tree stays readable; www-data only needs dist after the first build.
chmod 640 "$APP_ROOT/backend/.env" || true

systemctl daemon-reload
nginx -t

echo
echo "Next:"
echo "  1. Edit $APP_ROOT/backend/.env"
echo "  2. sudo bash $APP_ROOT/deploy/release.sh"
echo "  3. sudo systemctl enable --now mediacbd.service mediacbd-reminders.timer"
echo "  4. sudo systemctl reload nginx"
echo "  5. sudo certbot --nginx -d mediacbd.fr -d www.mediacbd.fr"
