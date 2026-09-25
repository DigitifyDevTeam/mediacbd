"""Gunicorn settings for MediaCBD (Django WSGI behind Nginx)."""

import os
from multiprocessing import cpu_count

bind = os.environ.get('GUNICORN_BIND', '127.0.0.1:8002')
# MySQL handles concurrent writers; 2–4 is enough on a small VPS.
workers = int(os.environ.get('GUNICORN_WORKERS', str(max(2, min(4, cpu_count())))))
worker_class = os.environ.get('GUNICORN_WORKER_CLASS', 'sync')
timeout = int(os.environ.get('GUNICORN_TIMEOUT', '120'))
graceful_timeout = 30
keepalive = 5
max_requests = int(os.environ.get('GUNICORN_MAX_REQUESTS', '1000'))
max_requests_jitter = 50
preload_app = False

accesslog = os.environ.get('GUNICORN_ACCESSLOG', '-')
errorlog = os.environ.get('GUNICORN_ERRORLOG', '-')
loglevel = os.environ.get('GUNICORN_LOG_LEVEL', 'info')
capture_output = True
forwarded_allow_ips = '*'
