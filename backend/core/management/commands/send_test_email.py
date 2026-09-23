"""Send a MediaCBD template through Amen SMTP (± Ollama rewrite)."""

from django.conf import settings
from django.core.management.base import BaseCommand, CommandError

from core.email_templates import TEMPLATES
from core.mailer import compose, context_from_lead, demo_client_context, send_composed
from core.models import Lead


class Command(BaseCommand):
    help = 'Send a test email (Amen SMTP). Uses EMAIL_FORCE_TO if set.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--template',
            default='ask_billing_pack',
            help=f'Template key ({", ".join(TEMPLATES)})',
        )
        parser.add_argument('--lead-id', type=int, default=None)
        parser.add_argument('--to', default='')
        parser.add_argument(
            '--no-llm',
            action='store_true',
            help='Skip Ollama and send the raw template.',
        )

    def handle(self, *args, **options):
        key = options['template']
        if key not in TEMPLATES:
            raise CommandError(f'Unknown template: {key}')

        lead_id = options['lead_id']
        if lead_id:
            lead = Lead.objects.filter(pk=lead_id).first()
            if lead is None:
                raise CommandError(f'Lead {lead_id} not found.')
            context = context_from_lead(lead)
            intended = lead.email
        else:
            context = demo_client_context()
            intended = options['to'] or settings.EMAIL_HOST_USER or 'contact@mediacbd.fr'

        subject, body, source = compose(key, context, use_llm=not options['no_llm'])
        recipient = send_composed(to_email=intended, subject=subject, body=body)
        self.stdout.write(
            self.style.SUCCESS(
                f'Sent [{key}] via {source} to {recipient}\nSubject: {subject}'
            )
        )
