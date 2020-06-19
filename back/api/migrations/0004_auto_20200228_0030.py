# Generated by Django 2.2.10 on 2020-02-28 00:30

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20200216_1918'),
    ]

    operations = [
        migrations.AddField(
            model_name='bigpicture',
            name='private',
            field=models.BooleanField(default=False),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='bigpicture',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='allchildren', to='api.BigPicture'),
        ),
        migrations.AlterField(
            model_name='bigpicture',
            name='subject',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='allfamily', to='api.BigPicture'),
        ),
    ]
