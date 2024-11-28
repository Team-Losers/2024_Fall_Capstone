# Generated by Django 5.1.1 on 2024-11-22 14:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('account', '0015_remove_userbodyinfo_muscle_goal_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='chest_recent',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='exercise_add_plan_type',
            field=models.IntegerField(default=0),
        ),
        migrations.AddField(
            model_name='user',
            name='exercise_main_plan_type',
            field=models.IntegerField(default=0),
        ),
    ]