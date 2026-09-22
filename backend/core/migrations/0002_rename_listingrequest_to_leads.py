from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='ListingRequest',
            new_name='Lead',
        ),
        migrations.AlterModelOptions(
            name='lead',
            options={
                'ordering': ['-created_at'],
                'verbose_name': 'Lead',
                'verbose_name_plural': 'Leads',
            },
        ),
        migrations.AlterModelTable(
            name='lead',
            table='leads',
        ),
    ]
