from django.contrib import admin
from .models import CompetitionsModel, TrainingModel, SeminarModel, SinghtingInModel

# Register your models here.
admin.site.register(CompetitionsModel)
admin.site.register(TrainingModel)
admin.site.register(SeminarModel)
admin.site.register(SinghtingInModel)
