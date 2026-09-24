# MediaCBD production (Nginx + Gunicorn)

Nginx serves the React **`react/dist`** tree as the public site. Gunicorn only handles Django (`/api/`, `/admin/`, `/static/` for the admin).

```
https://mediacbd.fr
        │
     Nginx
        ├── /              → react/dist  (SPA + prerendered HTML)
        ├── /assets/       → hashed Vite files (1y cache)
        ├── /api/  /admin/ → unix:/run/mediacbd/gunicorn.sock
        └── /static/       → backend/staticfiles (collectstatic)
```

Default server path: **`/var/www/mediacbd`**. Change `APP_ROOT` and the matching paths in `nginx/mediacbd.conf` + `systemd/*.service` if the clone lives elsewhere.

Leave `VITE_API_BASE` / `VITE_API_BASE_URL` unset so the browser posts to same-origin `/api/leads/`.

## Server once

```bash
sudo mkdir -p /var/www/mediacbd
sudo git clone <repo> /var/www/mediacbd
sudo bash /var/www/mediacbd/deploy/install.sh
sudo nano /var/www/mediacbd/backend/.env   # DJANGO_SECRET_KEY, SMTP, hosts
sudo bash /var/www/mediacbd/deploy/release.sh
sudo systemctl enable --now mediacbd.service mediacbd-reminders.timer
sudo certbot --nginx -d mediacbd.fr -d www.mediacbd.fr
```

Create a staff user after the first migrate:

```bash
sudo -u www-data /var/www/mediacbd/backend/.venv/bin/python \
  /var/www/mediacbd/backend/manage.py createsuperuser
```

## Each release

```bash
cd /var/www/mediacbd
sudo git pull
sudo bash deploy/release.sh
```

If the VPS has no Chrome for Puppeteer prerender:

```bash
sudo SKIP_PRERENDER=1 bash deploy/release.sh
```

Or build `react/dist` on your machine (`npm run build`) and rsync that folder onto `/var/www/mediacbd/react/dist`.

## Checks

- Site: `https://mediacbd.fr/`
- API: `https://mediacbd.fr/api/health/`
- Admin: `https://mediacbd.fr/admin/`
- Gunicorn: `sudo systemctl status mediacbd`
- Logs: `sudo journalctl -u mediacbd -f`

SQLite stays the default. Keep `GUNICORN_WORKERS=2` until you move the database to Postgres.
