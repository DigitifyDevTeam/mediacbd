"""Staff-only payment confirmation (Django admin). No public API."""

from __future__ import annotations

from django.conf import settings
from django.utils.text import slugify

from .mailer import send_lead_template
from .models import Lead


class PaymentActionError(ValueError):
    """Invalid lead state for a payment admin action."""


def ensure_invoice_ref(lead: Lead) -> str:
    ref = (lead.invoice_ref or '').strip()
    if ref:
        return ref
    year = lead.created_at.year if lead.created_at else 2026
    ref = f'MCBD-{year}-{lead.pk:04d}'
    lead.invoice_ref = ref
    lead.save(update_fields=['invoice_ref', 'updated_at'])
    return ref


def ensure_listing_url(lead: Lead) -> str:
    url = (lead.listing_url or '').strip()
    if url:
        return url
    slug = slugify(lead.brand_name) or f'fiche-{lead.pk}'
    base = settings.DIRECTORY_URL.rstrip('/')
    url = f'{base}/{slug}'
    lead.listing_url = url
    lead.save(update_fields=['listing_url', 'updated_at'])
    return url


def _require_open(lead: Lead) -> None:
    if lead.status == Lead.Status.PUBLISHED:
        raise PaymentActionError(
            f'{lead.brand_name} est déjà publié — e-mail « fiche en ligne » déjà envoyé.'
        )
    if lead.status == Lead.Status.REJECTED:
        raise PaymentActionError(
            f'{lead.brand_name} est refusé — action paiement impossible.'
        )


def mark_payment_received(lead: Lead) -> dict[str, str]:
    """Human saw the virement on CA → send listing_published, status=published."""
    _require_open(lead)
    ensure_invoice_ref(lead)
    ensure_listing_url(lead)
    result = send_lead_template(lead, 'listing_published', use_llm=False)
    lead.status = Lead.Status.PUBLISHED
    lead.save(update_fields=['status', 'updated_at'])
    return result
