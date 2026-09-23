from django.db import models


class Lead(models.Model):
    """Inbound demande de référencement (annuaire partenaires)."""

    class Status(models.TextChoices):
        NEW = 'new', 'Nouveau'
        CONTACTED = 'contacted', 'Contacté'
        INVOICED = 'invoiced', 'Facturé'
        PUBLISHED = 'published', 'Publié'
        REJECTED = 'rejected', 'Refusé'

    brand_name = models.CharField('Nom de l’enseigne', max_length=200)
    contact_name = models.CharField('Nom du contact', max_length=200)
    email = models.EmailField('E-mail professionnel')
    website = models.URLField('Site internet', blank=True)
    address = models.TextField('Adresse de la boutique')
    invoice_ref = models.CharField(
        'Référence facture',
        max_length=40,
        blank=True,
        db_index=True,
        help_text='Ex. MCBD-2026-001 — à indiquer sur le virement.',
    )
    listing_url = models.URLField('URL de la fiche publiée', blank=True)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.NEW,
        db_index=True,
    )
    notes = models.TextField('Notes internes', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'leads'
        ordering = ['-created_at']
        verbose_name = 'Lead'
        verbose_name_plural = 'Leads'

    def __str__(self) -> str:
        return f'{self.brand_name} — {self.email} ({self.status})'
