from django.core.management.base import BaseCommand

from core.models import Lead
from core.reminders import due_unpaid_leads, send_due_payment_reminders


class Command(BaseCommand):
    help = (
        'Send payment-reminder emails to invoiced leads that have not been marked '
        '« C’est payé ». Safe to run hourly (Windows Task Scheduler / cron).'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='List due leads without sending.',
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Ignore waiting delays (still skips published / max relances).',
        )

    def handle(self, *args, **options):
        if options['dry_run']:
            leads = (
                list(Lead.objects.filter(status=Lead.Status.INVOICED))
                if options['force']
                else due_unpaid_leads()
            )
            if not leads:
                self.stdout.write('Aucune relance due.')
                return
            for lead in leads:
                self.stdout.write(
                    f'DUE #{lead.pk} {lead.brand_name} ({lead.email}) '
                    f'ref={lead.invoice_ref} relances={lead.payment_reminder_count}'
                )
            return

        sent = send_due_payment_reminders(force=options['force'])
        if not sent:
            self.stdout.write('Aucune relance envoyée.')
            return
        for item in sent:
            self.stdout.write(
                self.style.SUCCESS(
                    f'{item["brand"]} → {item["to"]} ({item["subject"]})'
                )
            )
