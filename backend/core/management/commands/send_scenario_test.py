"""Send the full commercial email scenario to EMAIL_FORCE_TO."""

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from core.email_templates import TEMPLATES
from core.mailer import compose, demo_client_context, send_composed

# Funnel: prospection → accusé + dossier facturation → relance → facture → publié
SCENARIO: tuple[str, ...] = (
    'prospect_outreach',
    'ask_billing_pack',
    'nudge_missing_fields',
    'invoice_sent',
    'payment_reminder',
    'listing_published',
)

LLM_KEYS = frozenset({'prospect_outreach', 'ask_billing_pack'})


class Command(BaseCommand):
    help = (
        'Send every MediaCBD commercial template as a realistic Origine CBD example. '
        'Always uses EMAIL_FORCE_TO when set.'
    )

    def add_arguments(self, parser):
        parser.add_argument(
            '--no-llm',
            action='store_true',
            help='Skip Ollama on every message (faster visual check).',
        )

    def handle(self, *args, **options):
        forced = (settings.EMAIL_FORCE_TO or '').strip()
        if not forced:
            raise CommandError(
                'EMAIL_FORCE_TO is empty. Set it to contact@mediacbd.fr before a test send.'
            )

        context = demo_client_context()
        total = len(SCENARIO)
        for index, key in enumerate(SCENARIO, start=1):
            if key not in TEMPLATES:
                raise CommandError(f'Unknown template: {key}')
            use_llm = (not options['no_llm']) and key in LLM_KEYS
            subject, body, source = compose(key, context, use_llm=use_llm)
            labeled = f'[TEST {index}/{total}] {subject}'
            send_composed(to_email=forced, subject=labeled, body=body)
            self.stdout.write(
                self.style.SUCCESS(f'{index}/{total} [{key}] via {source} to {forced}')
            )
            self.stdout.write(f'  {labeled}')
