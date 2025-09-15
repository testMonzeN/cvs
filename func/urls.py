from django.urls import path
from .views import *

urlpatterns = [
    path('', TeleportView.as_view(), name='teleport'),
    path('competitions/', CompetitionsView.as_view(), name='competitions'),
    path('training/', TrainingView.as_view(), name='training'),
    path('singhting-in/', SinghtingInView.as_view(), name='singhting-in'),
    path('seminar/', SeminarView.as_view(), name='seminar'),
    
]
