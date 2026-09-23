"""Compose (template ± Ollama) and send MediaCBD emails via Amen SMTP."""

from __future__ import annotations

import logging
import re
from typing import Any

from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from .email_html import wrap_html
from .email_templates import TEMPLATES, build_ai_prompt, render
from .models import Lead
from .ollama_client import generate, ollama_configured

logger = logging.getLogger(__name__)

_SUBJECT_RE = re.compile(
    r'^(?:SUBJECT|OBJET)\s*:\s*(.+)$',
    re.MULTILINE | re.IGNORECASE,
)
_BODY_RE = re.compile(
    r'^(?:BODY|CORPS)\s*:\s*\n?(.*)$',
    re.MULTILINE | re.DOTALL | re.IGNORECASE,
)
_LONG_DIGIT_RE = re.compile(r'\d{2,}')


def default_context() -> dict[str, str]:
    return {
        'media_name': settings.MEDIA_NAME,
        'media_url': settings.MEDIA_SITE_URL,
        'directory_url': settings.DIRECTORY_URL,
        'commercial_email': settings.EMAIL_HOST_USER or 'contact@mediacbd.fr',
        'sender_name': settings.EMAIL_SENDER_NAME,
        'editor_footer': settings.EDITOR_FOOTER,
        'price_ht': settings.PRICE_HT,
        'price_ttc': settings.PRICE_TTC,
        'price_dofollow_ttc': settings.PRICE_DOFOLLOW_TTC,
        'price_article_ttc': settings.PRICE_ARTICLE_TTC,
        'currency': settings.CURRENCY,
        'payment_method': settings.PAYMENT_METHOD,
        'dofollow_note': '',
    }


def demo_client_context() -> dict[str, str]:
    """Realistic boutique used for inbox previews. Recipient stays EMAIL_FORCE_TO."""
    ctx = default_context()
    ctx.update(
        {
            'brand_name': 'Origine CBD',
            'contact_name': 'Camille Martin',
            'email': settings.EMAIL_HOST_USER or 'contact@mediacbd.fr',
            'address': "17 rue de l'Arsenal, 69004 Lyon",
            'city': 'Lyon',
            'postal_code': '69004',
            'phone': '04 78 00 00 00',
            'website': 'https://origine-cbd.fr',
            'opening_hours': 'Mar–Sam 10h–19h',
            'presentation': 'Boutique CBD de proximité à Lyon Croix-Rousse.',
            'missing_fields': (
                '• SIRET / TVA intracommunautaire\n'
                '• adresse de facturation\n'
                '• logo autorisé à la publication'
            ),
            'invoice_ref': 'MCBD-2026-014',
            'listing_url': 'https://mediacbd.fr/acteurs/origine-cbd',
            'dofollow_note': ' intégré en dofollow',
        }
    )
    return ctx


def context_from_lead(lead: Lead) -> dict[str, str]:
    ctx = default_context()
    listing = (lead.listing_url or '').strip() or settings.DIRECTORY_URL
    invoice = (lead.invoice_ref or '').strip()
    ctx.update(
        {
            'brand_name': lead.brand_name,
            'contact_name': lead.contact_name,
            'email': lead.email,
            'address': lead.address,
            'website': lead.website or settings.MEDIA_SITE_URL,
            'invoice_ref': invoice,
            'listing_url': listing,
            'dofollow_note': ' intégré en dofollow',
        }
    )
    return ctx


def parse_llm_email(text: str) -> tuple[str, str] | None:
    if not text.strip():
        return None
    cleaned = text.strip()
    if cleaned.startswith('```'):
        cleaned = re.sub(r'^```(?:\w+)?\s*', '', cleaned)
        cleaned = re.sub(r'\s*```$', '', cleaned)
    subject_match = _SUBJECT_RE.search(cleaned)
    body_match = _BODY_RE.search(cleaned)
    subject = ''
    body = ''
    if subject_match:
        subject = subject_match.group(1).strip().strip('"').strip("'")
        after_subject = cleaned[subject_match.end():].lstrip('\n')
        if body_match:
            body = body_match.group(1).strip()
        else:
            body = after_subject.strip()
    elif body_match:
        body = body_match.group(1).strip()
    if not subject or not body:
        return None
    return subject, body


def _digit_tokens(text: str) -> set[str]:
    return set(_LONG_DIGIT_RE.findall(text or ''))


def policy_ok(subject: str, body: str, context: dict[str, Any], fallback: str) -> bool:
    """Reject rewrite if it invents numbers not present in context/template."""
    allowed = _digit_tokens(fallback)
    for value in context.values():
        allowed.update(_digit_tokens(str(value)))
    invented = _digit_tokens(f'{subject}\n{body}') - allowed
    if invented:
        logger.warning('Ollama rewrite rejected (invented numbers: %s)', invented)
        return False
    return True


def compose(template_key: str, context: dict[str, Any], use_llm: bool = True) -> tuple[str, str, str]:
    """
    Returns (subject, body, source) where source is 'llm' or 'template'.
    """
    template = TEMPLATES.get(template_key)
    if template is None:
        raise KeyError(f'Unknown email template: {template_key}')

    subject, body = render(template, context)
    if not use_llm or not ollama_configured():
        return subject, body, 'template'

    raw = generate(build_ai_prompt(template_key, context))
    parsed = parse_llm_email(raw)
    if parsed is None:
        logger.warning('Ollama rewrite ignored (unparsed). chars=%s', len(raw))
        return subject, body, 'template'

    llm_subject, llm_body = parsed
    fallback = f'{subject}\n{body}'
    if not policy_ok(llm_subject, llm_body, context, fallback):
        return subject, body, 'template'
    return llm_subject, llm_body, 'llm'


def resolve_recipient(intended: str) -> str:
    forced = (settings.EMAIL_FORCE_TO or '').strip()
    return forced or intended


def smtp_configured() -> bool:
    return bool(settings.EMAIL_HOST_USER and settings.EMAIL_HOST_PASSWORD)


def send_composed(
    *,
    to_email: str,
    subject: str,
    body: str,
    reply_to: str | None = None,
) -> str:
    """Send via Amen SMTP. Returns the address actually used."""
    if not smtp_configured():
        raise RuntimeError('SMTP is not configured (EMAIL_HOST_USER / PASSWORD).')

    recipient = resolve_recipient(to_email)
    html_body = wrap_html(
        subject=subject,
        body=body,
        media_name=settings.MEDIA_NAME,
        media_url=settings.MEDIA_SITE_URL,
    )
    message = EmailMultiAlternatives(
        subject=subject,
        body=body,
        from_email=settings.DEFAULT_FROM_EMAIL,
        to=[recipient],
        reply_to=[reply_to or settings.EMAIL_HOST_USER],
    )
    message.attach_alternative(html_body, 'text/html')
    message.send(fail_silently=False)
    return recipient


def send_template(
    template_key: str,
    to_email: str,
    context: dict[str, Any],
    use_llm: bool = True,
) -> dict[str, str]:
    subject, body, source = compose(template_key, context, use_llm=use_llm)
    recipient = send_composed(to_email=to_email, subject=subject, body=body)
    return {
        'template': template_key,
        'to': recipient,
        'subject': subject,
        'source': source,
    }


def send_lead_template(lead: Lead, template_key: str = 'ask_billing_pack', use_llm: bool = True) -> dict[str, str]:
    return send_template(
        template_key,
        lead.email,
        context_from_lead(lead),
        use_llm=use_llm,
    )


def notify_new_lead(lead: Lead) -> None:
    inbox = (settings.LISTING_NOTIFY_EMAIL or '').strip()
    if not inbox or not smtp_configured():
        return
    subject = f'[MediaCBD] Nouveau lead — {lead.brand_name}'
    body = (
        f'Nouvelle demande de référencement.\n\n'
        f'Enseigne : {lead.brand_name}\n'
        f'Contact : {lead.contact_name}\n'
        f'E-mail : {lead.email}\n'
        f'Site : {lead.website or "—"}\n'
        f'Adresse : {lead.address}\n'
        f'Id : {lead.pk}\n'
    )
    send_composed(to_email=inbox, subject=subject, body=body)
