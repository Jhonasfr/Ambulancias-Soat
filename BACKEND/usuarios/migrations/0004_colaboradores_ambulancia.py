from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('ambulancias', '0001_initial'),
        ('usuarios', '0003_colaboradores_nuevos_campos'),
    ]

    operations = [
        migrations.AddField(
            model_name='colaboradores',
            name='ambulancia',
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to='ambulancias.ambulancia',
            ),
        ),
    ]
