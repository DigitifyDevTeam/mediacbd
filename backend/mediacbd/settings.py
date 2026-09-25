"""Django settings for MediaCBD."""

from pathlib import Path
import os
import sys

try:
    import pymysql
except ImportError:
    pymysql = None
else:
    pymysql.install_as_MySQLdb()


def _load_dotenv(path: Path) -> None:
    """Load KEY=VALUE lines into os.environ without overwriting existing vars."""
    if not path.is_file():
        return
    for raw in path.read_text(encoding='utf-8').splitlines():
        line = raw.strip()
        if not line or line.startswith('#') or '=' not in line:
            continue
        key, value = line.split('=', 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key:
            os.environ.setdefault(key, value)


BASE_DIR = Path(__file__).resolve().parent.parent
_load_dotenv(BASE_DIR / '.env')

SECRET_KEY = os.environ.get(
    'DJANGO_SECRET_KEY',
    'django-insecure-87n5vz*(ps2zk=0w(9rl$=th*9y#$x+-61y@dlls6t7+yjf4h&',
)

DEBUG = os.environ.get('DJANGO_DEBUG', '1') == '1'

if not DEBUG and SECRET_KEY.startswith('django-insecure-'):
    raise ValueError('Set DJANGO_SECRET_KEY before running with DJANGO_DEBUG=0.')

ALLOWED_HOSTS = [
    h.strip()
    for h in os.environ.get('DJANGO_ALLOWED_HOSTS', 'localhost,127.0.0.1,testserver').split(',')
    if h.strip()
]

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'corsheaders',
    'core',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mediacbd.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mediacbd.wsgi.application'


def _required_env(name: str) -> str:
    value = os.environ.get(name, '').strip()
    if not value:
        raise ValueError(f'Set {name} in backend/.env — MySQL is required (SQLite is gone).')
    return value


if pymysql is None:
    raise ValueError('PyMySQL is required. pip install -r backend/requirements.txt')

_db_options = {
    'charset': 'utf8mb4',
    'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
}
_unix_socket = os.environ.get('DB_UNIX_SOCKET', '').strip()
if _unix_socket:
    _db_options['unix_socket'] = _unix_socket

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': _required_env('DB_NAME'),
        'USER': _required_env('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD', ''),
        # localhost / 127.0.0.1 only. The public hostname is refused (MySQL binds locally).
        'HOST': os.environ.get('DB_HOST', 'localhost').strip() or 'localhost',
        'PORT': os.environ.get('DB_PORT', '3306').strip() or '3306',
        # manage.py (createsuperuser, etc.) must not reuse a socket that died while typing.
        'CONN_MAX_AGE': (
            0
            if any(a.endswith('manage.py') for a in sys.argv)
            else int(os.environ.get('DB_CONN_MAX_AGE', '60'))
        ),
        'OPTIONS': _db_options,
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator'},
    {'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator'},
    {'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator'},
    {'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator'},
]

LANGUAGE_CODE = 'fr-fr'
TIME_ZONE = 'Europe/Paris'
USE_I18N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = Path(os.environ.get('DJANGO_STATIC_ROOT') or (BASE_DIR / 'staticfiles'))
STORAGES = {
    'default': {
        'BACKEND': 'django.core.files.storage.FileSystemStorage',
    },
    'staticfiles': {
        'BACKEND': 'whitenoise.storage.CompressedStaticFilesStorage',
    },
}
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {'class': 'logging.StreamHandler'},
    },
    'root': {
        'handlers': ['console'],
        'level': os.environ.get('DJANGO_LOG_LEVEL', 'INFO'),
    },
}

# Nginx terminates TLS and forwards the original scheme.
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')
USE_X_FORWARDED_HOST = True
if not DEBUG:
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_SSL_REDIRECT = os.environ.get('DJANGO_SECURE_SSL_REDIRECT', '0') == '1'
    SECURE_HSTS_SECONDS = int(os.environ.get('DJANGO_SECURE_HSTS_SECONDS', '0'))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = SECURE_HSTS_SECONDS > 0
    SECURE_HSTS_PRELOAD = SECURE_HSTS_SECONDS > 0
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_REFERRER_POLICY = 'same-origin'

# Vite / SPA
CORS_ALLOWED_ORIGINS = [
    o.strip()
    for o in os.environ.get(
        'CORS_ALLOWED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if o.strip()
]
CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = [
    o.strip()
    for o in os.environ.get(
        'CSRF_TRUSTED_ORIGINS',
        'http://localhost:5173,http://127.0.0.1:5173',
    ).split(',')
    if o.strip()
]

# --- SMTP (Amen Securemail: 465 + SSL; TLS and SSL are mutually exclusive) ---
EMAIL_BACKEND = os.environ.get(
    'EMAIL_BACKEND',
    'django.core.mail.backends.smtp.EmailBackend',
)
EMAIL_HOST = os.environ.get('EMAIL_HOST', 'smtp-fr.securemail.pro')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', '465'))
EMAIL_USE_TLS = os.environ.get('EMAIL_USE_TLS', '0') == '1'
EMAIL_USE_SSL = os.environ.get('EMAIL_USE_SSL', '1') == '1'
if EMAIL_USE_TLS:
    EMAIL_USE_SSL = False
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER', '')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD', '').replace(' ', '')
DEFAULT_FROM_EMAIL = os.environ.get(
    'DEFAULT_FROM_EMAIL',
    EMAIL_HOST_USER or 'MediaCBD <commercial@mediacbd.fr>',
)
EMAIL_SENDER_NAME = os.environ.get('EMAIL_SENDER_NAME', "L'équipe MediaCBD")
# Loopback while testing: all mail goes to this address.
EMAIL_FORCE_TO = os.environ.get('EMAIL_FORCE_TO', '').strip()
LISTING_NOTIFY_EMAIL = (
    os.environ.get('LISTING_NOTIFY_EMAIL', '').strip() or EMAIL_HOST_USER
)

# --- Ollama (remote, Bearer) ---
OLLAMA_URL = os.environ.get('OLLAMA_URL', '').rstrip('/')
OLLAMA_API_KEY = os.environ.get('OLLAMA_API_KEY', '')
LLAMA_MODEL = os.environ.get('LLAMA_MODEL', 'llama3.1:8b')
OLLAMA_TIMEOUT = int(os.environ.get('OLLAMA_TIMEOUT', '180'))
OLLAMA_ENABLED = os.environ.get('OLLAMA_ENABLED', '1') == '1'

# --- Offer / media (email only, never on the public site) ---
MEDIA_NAME = os.environ.get('MEDIA_NAME', 'MediaCBD')
MEDIA_SITE_URL = os.environ.get('MEDIA_SITE_URL', 'https://mediacbd.fr')
DIRECTORY_URL = os.environ.get('DIRECTORY_URL', 'https://mediacbd.fr/acteurs')
EDITOR_FOOTER = os.environ.get('EDITOR_FOOTER', 'MediaCBD')
PRICE_HT = os.environ.get('PRICE_HT', '30')
PRICE_TTC = os.environ.get('PRICE_TTC', '36')
PRICE_DOFOLLOW_TTC = os.environ.get('PRICE_DOFOLLOW_TTC', '50')
PRICE_ARTICLE_TTC = os.environ.get('PRICE_ARTICLE_TTC', '80')
CURRENCY = os.environ.get('CURRENCY', '€')
PAYMENT_METHOD = os.environ.get('PAYMENT_METHOD', 'virement bancaire')

# Payment reminders while status=invoiced (stopped by « C’est payé »).
# No in-process loop — run: python manage.py send_payment_reminders
PAYMENT_REMINDER_AFTER_DAYS = int(os.environ.get('PAYMENT_REMINDER_AFTER_DAYS', '2'))
PAYMENT_REMINDER_INTERVAL_DAYS = int(os.environ.get('PAYMENT_REMINDER_INTERVAL_DAYS', '2'))
PAYMENT_REMINDER_MAX = int(os.environ.get('PAYMENT_REMINDER_MAX', '3'))
