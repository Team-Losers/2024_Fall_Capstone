from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(User)
admin.site.register(UserBodyInfo)
admin.site.register(UserFridgeImage)
admin.site.register(UserWeight)
admin.site.register(UserMuscle)