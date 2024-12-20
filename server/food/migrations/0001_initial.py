# Generated by Django 5.1.1 on 2024-10-31 04:23

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Allergy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='Food',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
                ('calorie', models.IntegerField()),
                ('carbohydrate', models.IntegerField()),
                ('protein', models.IntegerField()),
                ('fat', models.IntegerField()),
                ('vegan', models.BooleanField(default=False)),
            ],
        ),
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=30)),
            ],
        ),
        migrations.CreateModel(
            name='FoodKeyword',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('keyword', models.CharField(max_length=30)),
                ('food_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='food.food')),
            ],
            options={
                'constraints': [models.UniqueConstraint(fields=('food_id', 'keyword'), name='unique_food_id_keyword')],
            },
        ),
        migrations.CreateModel(
            name='IngredientInFood',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('food_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='food.food')),
                ('ingredient_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='food.ingredient')),
            ],
            options={
                'constraints': [models.UniqueConstraint(fields=('ingredient_id', 'food_id'), name='unique_ingredient_id_food_id')],
            },
        ),
        migrations.CreateModel(
            name='UserAllergy',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('allergy_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='food.allergy')),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'constraints': [models.UniqueConstraint(fields=('user_id', 'allergy_id'), name='unique_user_id_allergy_id')],
            },
        ),
    ]
