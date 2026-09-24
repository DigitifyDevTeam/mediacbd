from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0003_lead_invoice_listing'),
    ]

    operations = [
        migrations.AddField(
            model_name='lead',
            name='invoiced_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Facturé le'),
        ),
        migrations.AddField(
            model_name='lead',
            name='last_payment_reminder_at',
            field=models.DateTimeField(blank=True, null=True, verbose_name='Dernière relance'),
        ),
        migrations.AddField(
            model_name='lead',
            name='payment_reminder_count',
            field=models.PositiveSmallIntegerField(default=0, verbose_name='Relances envoyées'),
        ),
    ]
