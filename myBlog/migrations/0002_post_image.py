# Generated by Django 2.1.5 on 2019-02-27 01:28

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myBlog', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='post',
            name='image',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]
