from datetime import timedelta
from smtplib import SMTPException

from django.conf import settings
from django.contrib import admin, messages
from django.core.mail import BadHeaderError
from django.http import HttpResponseRedirect
from django.shortcuts import get_object_or_404
from django.template.response import TemplateResponse
from django.urls import path, reverse
from django.utils import timezone
from django.utils.html import format_html

from .models import Lead
from .payments import PaymentActionError, mark_payment_received
from .reminders import send_due_payment_reminders, stamp_invoiced


def _run_paid(request, queryset) -> None:
    for lead in queryset:
        try:
            result = mark_payment_received(lead)
        except PaymentActionError as exc:
            messages.error(request, str(exc))
            continue
        except (SMTPException, BadHeaderError, OSError, KeyError, RuntimeError) as exc:
            messages.error(request, f'{lead.brand_name} : e-mail non envoyé ({exc}).')
            continue
        messages.success(
            request,
            f'C’est payé — {lead.brand_name} → {result.get("to")} ({result.get("subject")})',
        )


@admin.register(Lead)
class LeadAdmin(admin.ModelAdmin):
    change_form_template = 'admin/core/lead/change_form.html'
    list_display = (
        'brand_name',
        'contact_name',
        'email',
        'invoice_ref',
        'status',
        'paiement_button',
        'relance_auto',
        'created_at',
    )
    list_filter = ('status', 'created_at')
    search_fields = (
        'brand_name',
        'contact_name',
        'email',
        'website',
        'address',
        'invoice_ref',
    )
    readonly_fields = (
        'created_at',
        'updated_at',
        'payment_actions',
        'invoiced_at',
        'last_payment_reminder_at',
        'payment_reminder_count',
    )
    ordering = ('-created_at',)
    actions = ('action_cest_paye',)
    fieldsets = (
        (
            None,
            {
                'fields': (
                    'brand_name',
                    'contact_name',
                    'email',
                    'website',
                    'address',
                    'status',
                ),
            },
        ),
        (
            'Facture / publication',
            {
                'fields': (
                    'invoice_ref',
                    'listing_url',
                    'invoiced_at',
                    'last_payment_reminder_at',
                    'payment_reminder_count',
                    'payment_actions',
                ),
            },
        ),
        ('Notes', {'fields': ('notes', 'created_at', 'updated_at')}),
    )

    @admin.display(description='Paiement')
    def paiement_button(self, obj: Lead) -> str:
        if obj.status == Lead.Status.PUBLISHED:
            return format_html('<strong style="color:#2f6b4f;">Payé</strong>')
        url = reverse('admin:core_lead_paiement', args=[obj.pk])
        return format_html(
            '<a class="button" href="{}" style="background:#2f6b4f;color:#fff;'
            'padding:6px 12px;border-radius:6px;text-decoration:none;">C’est payé</a>',
            url,
        )

    @admin.display(description='Paiement')
    def payment_actions(self, obj: Lead) -> str:
        if not obj.pk:
            return 'Enregistrez le lead pour voir le bouton.'
        if obj.status == Lead.Status.PUBLISHED:
            return format_html('<strong style="color:#2f6b4f;">Payé — déjà traité.</strong>')
        url = reverse('admin:core_lead_paiement', args=[obj.pk])
        return format_html(
            '<a class="button default" href="{}">C’est payé</a>',
            url,
        )

    def get_urls(self):
        extra = [
            path(
                '<int:object_id>/paiement/',
                self.admin_site.admin_view(self.paiement_confirm_view),
                name='core_lead_paiement',
            ),
            path(
                '<int:object_id>/paiement-recu/',
                self.admin_site.admin_view(self.paiement_recu_view),
                name='core_lead_paiement_recu',
            ),
        ]
        return extra + super().get_urls()

    def _redirect_lead(self, object_id: int) -> HttpResponseRedirect:
        return HttpResponseRedirect(reverse('admin:core_lead_change', args=[object_id]))

    def _paiement_page(self, request, lead: Lead) -> TemplateResponse:
        context = {
            **self.admin_site.each_context(request),
            'opts': self.model._meta,
            'lead': lead,
            'title': f'C’est payé — {lead.brand_name}',
        }
        return TemplateResponse(
            request,
            'admin/core/lead/paiement_confirm.html',
            context,
        )

    def paiement_confirm_view(self, request, object_id: int):
        lead = get_object_or_404(Lead, pk=object_id)
        return self._paiement_page(request, lead)

    def paiement_recu_view(self, request, object_id: int):
        lead = get_object_or_404(Lead, pk=object_id)
        if request.method != 'POST':
            return self._paiement_page(request, lead)
        _run_paid(request, [lead])
        return self._redirect_lead(object_id)

    @admin.action(description='C’est payé — envoyer e-mail fiche publiée')
    def action_cest_paye(self, request, queryset):
        _run_paid(request, queryset)

    @admin.display(description='Relance auto')
    def relance_auto(self, obj: Lead) -> str:
        if obj.status == Lead.Status.PUBLISHED:
            return 'Stop — payé'
        if obj.status != Lead.Status.INVOICED:
            return '—'
        max_n = settings.PAYMENT_REMINDER_MAX
        if obj.payment_reminder_count >= max_n:
            return f'Stop — {obj.payment_reminder_count}/{max_n}'
        if obj.last_payment_reminder_at:
            next_at = obj.last_payment_reminder_at + timedelta(
                days=settings.PAYMENT_REMINDER_INTERVAL_DAYS
            )
            return f'{obj.payment_reminder_count}/{max_n} · prochaine {timezone.localtime(next_at):%d/%m}'
        return f'0/{max_n} · 1re dans {settings.PAYMENT_REMINDER_AFTER_DAYS} j'

    def changelist_view(self, request, extra_context=None):
        try:
            sent = send_due_payment_reminders()
        except (SMTPException, BadHeaderError, OSError, RuntimeError, KeyError) as exc:
            messages.error(request, f'Relance auto : e-mail non envoyé ({exc}).')
            sent = []
        for item in sent:
            messages.success(
                request,
                f'Relance automatique — {item["brand"]} → {item["to"]} ({item["subject"]})',
            )
        return super().changelist_view(request, extra_context=extra_context)

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)
        stamp_invoiced(obj)
