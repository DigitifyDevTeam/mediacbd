"""Automatic payment reminders for invoiced leads that are not yet paid."""

from __future__ import annotations

import logging
from datetime import datetime, timedelta

from django.conf import settings
from django.db import transaction
from django.utils import timezone

from .mailer import send_lead_template
from .models import Lead
from .payments import PaymentActionError, ensure_invoice_ref

logger = logging.getLogger(__name__)


def stamp_invoiced(lead: Lead) -> None:
    """Record the invoice clock the first time a lead is marked Facturé."""
    if lead.status != Lead.Status.INVOICED:
        return
    if lead.invoiced_at is None:
        lead.invoiced_at = timezone.now()
        lead.save(update_fields=['invoiced_at', 'updated_at'])
    if lead.pk and not (lead.invoice_ref or '').strip():
        ensure_invoice_ref(lead)


def invoice_anchor(lead: Lead) -> datetime:
    return lead.invoiced_at or lead.updated_at or lead.created_at or timezone.now()


def is_reminder_due(lead: Lead, now: datetime | None = None) -> bool:
    now = now or timezone.now()
    if lead.status != Lead.Status.INVOICED:
        return False
    if not (lead.invoice_ref or '').strip():
        return False
    if lead.payment_reminder_count >= settings.PAYMENT_REMINDER_MAX:
        return False

    after = timedelta(days=settings.PAYMENT_REMINDER_AFTER_DAYS)
    interval = timedelta(days=settings.PAYMENT_REMINDER_INTERVAL_DAYS)

    if lead.last_payment_reminder_at is None:
        return now >= invoice_anchor(lead) + after
    return now >= lead.last_payment_reminder_at + interval


def due_unpaid_leads(now: datetime | None = None) -> list[Lead]:
    now = now or timezone.now()
    candidates = Lead.objects.filter(status=Lead.Status.INVOICED).exclude(invoice_ref='')
    return [lead for lead in candidates if is_reminder_due(lead, now)]


def send_payment_reminder(lead: Lead) -> dict[str, str]:
    """Send one polite reminder. No-op once « C’est payé » has published the lead."""
    if lead.status == Lead.Status.PUBLISHED:
        raise PaymentActionError(
            f'{lead.brand_name} est déjà payé / publié — aucune relance.'
        )
    if lead.status == Lead.Status.REJECTED:
        raise PaymentActionError(f'{lead.brand_name} est refusé — aucune relance.')
    if lead.status != Lead.Status.INVOICED:
        raise PaymentActionError(
            f'{lead.brand_name} n’est pas facturé — relance uniquement après facture.'
        )
    ensure_invoice_ref(lead)
    result = send_lead_template(lead, 'payment_reminder', use_llm=False)
    lead.last_payment_reminder_at = timezone.now()
    lead.payment_reminder_count = lead.payment_reminder_count + 1
    lead.save(update_fields=['last_payment_reminder_at', 'payment_reminder_count', 'updated_at'])
    return result


def send_due_payment_reminders(*, force: bool = False) -> list[dict[str, str]]:
    """Send reminders to every invoiced unpaid lead that is due (or all if force)."""
    sent: list[dict[str, str]] = []
    queryset = Lead.objects.filter(status=Lead.Status.INVOICED).order_by('pk')
    for lead_id in queryset.values_list('pk', flat=True):
        with transaction.atomic():
            lead = Lead.objects.select_for_update().filter(pk=lead_id).first()
            if lead is None:
                continue
            if not force and not is_reminder_due(lead):
                continue
            if force and lead.status != Lead.Status.INVOICED:
                continue
            if force and not (lead.invoice_ref or '').strip():
                ensure_invoice_ref(lead)
            if force and lead.payment_reminder_count >= settings.PAYMENT_REMINDER_MAX:
                continue
            try:
                result = send_payment_reminder(lead)
            except PaymentActionError as exc:
                logger.info('Skip reminder: %s', exc)
                continue
            sent.append({'lead_id': str(lead.pk), 'brand': lead.brand_name, **result})
    return sent
