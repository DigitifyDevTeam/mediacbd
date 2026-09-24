from datetime import timedelta
from unittest.mock import patch

from django.test import TestCase, override_settings
from django.utils import timezone

from .models import Lead
from .payments import PaymentActionError
from .reminders import is_reminder_due, send_payment_reminder, stamp_invoiced


def _lead(**kwargs) -> Lead:
    now = timezone.now()
    defaults = {
        'brand_name': 'Origine CBD',
        'contact_name': 'Camille Martin',
        'email': 'camille@example.com',
        'address': '17 rue de l’Arsenal, 69004 Lyon',
        'status': Lead.Status.INVOICED,
        'invoice_ref': 'MCBD-2026-014',
        'invoiced_at': now - timedelta(days=3),
    }
    defaults.update(kwargs)
    return Lead.objects.create(**defaults)


@override_settings(
    PAYMENT_REMINDER_AFTER_DAYS=2,
    PAYMENT_REMINDER_INTERVAL_DAYS=2,
    PAYMENT_REMINDER_MAX=3,
)
class PaymentReminderTests(TestCase):
    def test_not_due_before_waiting_period(self):
        lead = _lead(invoiced_at=timezone.now() - timedelta(days=1))
        self.assertFalse(is_reminder_due(lead))

    def test_due_after_waiting_period(self):
        lead = _lead(invoiced_at=timezone.now() - timedelta(days=2))
        self.assertTrue(is_reminder_due(lead))

    def test_published_stops_reminders(self):
        lead = _lead(status=Lead.Status.PUBLISHED)
        self.assertFalse(is_reminder_due(lead))

    def test_interval_between_reminders(self):
        lead = _lead(
            last_payment_reminder_at=timezone.now() - timedelta(days=1),
            payment_reminder_count=1,
        )
        self.assertFalse(is_reminder_due(lead))
        lead.last_payment_reminder_at = timezone.now() - timedelta(days=2)
        self.assertTrue(is_reminder_due(lead))

    def test_max_reminders_stops(self):
        lead = _lead(
            last_payment_reminder_at=timezone.now() - timedelta(days=10),
            payment_reminder_count=3,
        )
        self.assertFalse(is_reminder_due(lead))

    def test_stamp_invoiced_sets_clock_once(self):
        lead = _lead(status=Lead.Status.INVOICED, invoiced_at=None, invoice_ref='')
        stamp_invoiced(lead)
        lead.refresh_from_db()
        self.assertIsNotNone(lead.invoiced_at)
        self.assertTrue(lead.invoice_ref)
        first = lead.invoiced_at
        stamp_invoiced(lead)
        lead.refresh_from_db()
        self.assertEqual(lead.invoiced_at, first)

    def test_send_reminder_increments_count(self):
        lead = _lead()
        with patch('core.reminders.send_lead_template', return_value={'to': 'x', 'subject': 'Rappel'}):
            send_payment_reminder(lead)
        lead.refresh_from_db()
        self.assertEqual(lead.payment_reminder_count, 1)
        self.assertIsNotNone(lead.last_payment_reminder_at)

    def test_send_reminder_blocked_when_paid(self):
        lead = _lead(status=Lead.Status.PUBLISHED)
        with self.assertRaises(PaymentActionError):
            send_payment_reminder(lead)
