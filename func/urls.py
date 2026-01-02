from django.urls import path
from .views import *

urlpatterns = [
    path('', TeleportView.as_view(), name='teleport'),
    
    path('rating/', TopLadderView.as_view(), name='top-ladder'),
    path('competitions/', CompetitionsView.as_view(), name='competitions'),
    path('competitions/<int:pk>/', CompetitionsDetailView.as_view(), name='competitions-detail'),
    path('competitions/<int:pk>/results/', CompetitionResultView.as_view(), name='competition-results'),
    path('competitions/create/', CompetitionsCreateView.as_view(), name='competitions-create'),
    path('competitions/edit/<int:pk>/', CompetitionsEditView.as_view(), name='competitions-edit'),
    path('competitions/sing-up/<int:pk>/', CompetitionsSingUpView.as_view(), name='competitions-sing-up'),
    
    path('training/', TrainingView.as_view(), name='training'),
    path('training/create/', TrainingCreateView.as_view(), name='training-create'),
    path('training/edit/<int:pk>/', TrainingEditView.as_view(), name='training-edit'),
    #path('training/sing-up/<int:pk>/', TrainingSingUpView.as_view(), name='training-sing-up'),
    
    path('singhting-in/', SinghtingInView.as_view(), name='singhting-in'),
    path('singhting-in/create/', SinghtingInCreateView.as_view(), name='singhting-in-create'),
    path('singhting-in/edit/<int:pk>/', SinghtingInEditView.as_view(), name='singhting-in-edit'),
    
    path('seminar/', SeminarView.as_view(), name='seminar'),
    path('seminar/create/', SeminarCreateView.as_view(), name='seminar-create'),
    path('seminar/edit/<int:pk>/', SeminarEditView.as_view(), name='seminar-edit'),
]
