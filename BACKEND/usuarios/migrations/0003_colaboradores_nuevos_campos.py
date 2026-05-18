from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('usuarios', '0002_colaboradores_sede'),
    ]

    operations = [
        migrations.AddField(
            model_name='colaboradores',
            name='tipo_documento',
            field=models.CharField(blank=True, default='CC', max_length=10, null=True),
        ),
        migrations.AddField(
            model_name='colaboradores',
            name='direccion',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
        migrations.AddField(
            model_name='colaboradores',
            name='numero_licencia',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='colaboradores',
            name='especialidad',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='colaboradores',
            name='tipo_sangre',
            field=models.CharField(blank=True, max_length=5, null=True),
        ),
        migrations.AddField(
            model_name='colaboradores',
            name='contacto_emergencia',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
