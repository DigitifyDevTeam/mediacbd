import json
import logging
import re
from smtplib import SMTPException

from django.conf import settings
from django.core.mail import BadHeaderError
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from .mailer import notify_new_lead, send_lead_template, smtp_configured
from .models import Lead
from .ollama_client import ollama_configured

logger = logging.getLogger(__name__)

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')
MAX_BODY_BYTES = 32_768


def _json_error(message: str, status: int = 400, fields: dict | None = None):
    payload = {'ok': False, 'error': message}
    if fields:
        payload['fields'] = fields
    return JsonResponse(payload, status=status)


def _serialize_lead(lead: Lead) -> dict:
    return {
        'id': lead.pk,
        'brand': lead.brand_name,
        'contact': lead.contact_name,
        'email': lead.email,
        'website': lead.website,
        'address': lead.address,
        'status': lead.status,
        'created_at': lead.created_at.isoformat(),
    }


@require_http_methods(['GET'])
def api_root(request):
    """GET /api/ — short index of available endpoints."""
    return JsonResponse(
        {
            'ok': True,
            'service': 'mediacbd-api',
            'endpoints': {
                'health': '/api/health/',
                'leads': '/api/leads/',
                'admin': '/admin/',
            },
            'ollama': ollama_configured(),
            'smtp': smtp_configured(),
        }
    )


@csrf_exempt
@require_http_methods(['GET', 'POST', 'OPTIONS'])
def leads(request):
    """
    POST /api/leads/ — public form (create lead).
    GET  /api/leads/ — list leads (staff session only).
    """
    if request.method == 'OPTIONS':
        return JsonResponse({'ok': True})

    if request.method == 'GET':
        if not request.user.is_authenticated or not request.user.is_staff:
            return _json_error(
                'Connexion staff requise. Utilisez /admin/ pour voir les leads.',
                status=401,
            )
        items = [_serialize_lead(lead) for lead in Lead.objects.all()[:200]]
        return JsonResponse({'ok': True, 'count': len(items), 'leads': items})

    if len(request.body) > MAX_BODY_BYTES:
        return _json_error('Requête trop volumineuse.', status=413)

    try:
        payload = json.loads(request.body.decode('utf-8') or '{}')
    except (UnicodeDecodeError, json.JSONDecodeError):
        return _json_error('JSON invalide.')

    if not isinstance(payload, dict):
        return _json_error('JSON invalide.')

    # Honeypot — bots fill hidden "company_website"
    if str(payload.get('company_website') or '').strip():
        return JsonResponse({'ok': True, 'id': None})

    brand = str(payload.get('brand') or payload.get('brand_name') or '').strip()
    contact = str(payload.get('contact') or payload.get('contact_name') or '').strip()
    email = str(payload.get('email') or '').strip().lower()
    website = str(payload.get('website') or '').strip()
    address = str(payload.get('address') or '').strip()

    field_errors: dict[str, str] = {}
    if len(brand) < 2:
        field_errors['brand'] = 'Nom de l’enseigne requis.'
    if len(contact) < 2:
        field_errors['contact'] = 'Nom du contact requis.'
    if not EMAIL_RE.match(email):
        field_errors['email'] = 'E-mail professionnel invalide.'
    if len(address) < 5:
        field_errors['address'] = 'Adresse de la boutique requise.'
    if website and not (website.startswith('http://') or website.startswith('https://')):
        website = f'https://{website}'
    if website and len(website) > 200:
        field_errors['website'] = 'URL trop longue.'

    if field_errors:
        return _json_error('Champs invalides.', fields=field_errors)

    lead = Lead.objects.create(
        brand_name=brand[:200],
        contact_name=contact[:200],
        email=email[:254],
        website=website[:200] if website else '',
        address=address[:2000],
    )

    mail_meta: dict | None = None
    mail_error = ''
    if smtp_configured():
        try:
            mail_meta = send_lead_template(lead, 'ask_billing_pack')
            notify_new_lead(lead)
        except (SMTPException, BadHeaderError, OSError, KeyError, TimeoutError) as exc:
            logger.warning('Lead %s saved but email failed: %s', lead.pk, exc)
            mail_error = str(exc)

    payload = {
        'ok': True,
        'id': lead.pk,
        'message': 'Demande enregistrée. Nous vous recontacterons pour la suite.',
        'notify': getattr(settings, 'LISTING_NOTIFY_EMAIL', None),
    }
    if mail_meta:
        payload['email'] = mail_meta
    if mail_error:
        payload['email_error'] = mail_error

    return JsonResponse(payload, status=201)


@require_http_methods(['GET'])
def health(request):
    return JsonResponse(
        {
            'ok': True,
            'service': 'mediacbd-api',
            'ollama': ollama_configured(),
            'smtp': smtp_configured(),
        }
    )
