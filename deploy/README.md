# MediaCBD production (user-level Gunicorn)

No sudo. The project SSH user owns the clone, the venv, and Gunicorn.

**Nginx or Apache** (Webmin) is the public proxy. PHP cannot proxy to Gunicorn.

```
https://mediacbd.fr
        │
     Apache / Nginx   (already serving public_html)
        ├── /              → public_html (React dist)
        └── /api/ /admin/ /static/ → 127.0.0.1:8001  (Gunicorn)
```

Ask the host admin once to proxy those three prefixes to `127.0.0.1:8001` (`deploy/apache/mediacbd.conf` or `deploy/nginx/mediacbd.conf`).

Leave `VITE_API_BASE` / `VITE_API_BASE_URL` unset so the browser posts to same-origin `/api/leads/`.

## Once

```bash
cd /path/to/clone
git pull
bash deploy/install.sh
nano backend/.env
bash deploy/release.sh
cd backend
source venv/bin/activate
bash gunicorn-ctl.sh restart
curl http://127.0.0.1:8001/api/
```

Create a staff user:

```bash
cd backend
source venv/bin/activate
python manage.py createsuperuser
```

## After that, every deploy

```bash
cd backend
source venv/bin/activate
bash gunicorn-ctl.sh restart
curl http://127.0.0.1:8001/api/
```

(`bash gunicorn-ctl.sh` also accepts `start`, `stop`, `status`.)

If you also pulled Django/Python changes:

```bash
git pull
bash deploy/release.sh
```

`release.sh` migrates, collectstatics, and restarts Gunicorn. It does not rebuild React (`SKIP_FRONTEND=1`) because `public_html` already holds `dist`.

## Checks

- Local API: `curl http://127.0.0.1:8001/api/`
- Public API: `https://mediacbd.fr/api/health/`
- Admin: `https://mediacbd.fr/admin/`
- Logs: `backend/logs/error.log`

MySQL is selected when `DB_NAME` is set in `.env`.
