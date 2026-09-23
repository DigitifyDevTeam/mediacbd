from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_rename_listingrequest_to_leads'),
    ]

    operations = [
        migrations.AddField(
            model_name='lead',
            name='invoice_ref',
            field=models.CharField(
                blank=True,
                db_index=True,
                help_text='Ex. MCBD-2026-001 — à indiquer sur le virement.',
                max_length=40,
                verbose_name='Référence facture',
            ),
        ),
        migrations.AddField(
            model_name='lead',
            name='listing_url',
            field=models.URLField(blank=True, verbose_name='URL de la fiche publiée'),
        ),
    ]
