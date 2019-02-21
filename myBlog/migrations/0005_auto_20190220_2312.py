# Generated by Django 2.1.5 on 2019-02-21 06:12

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myBlog', '0004_auto_20190220_2304'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='author',
            name='url',
        ),
        migrations.AlterField(
            model_name='author',
            name='host',
            field=models.URLField(),
        ),
        migrations.AlterField(
            model_name='post',
            name='origin',
            field=models.URLField(),
        ),
    ]
