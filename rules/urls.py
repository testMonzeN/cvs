from django.urls import path
from .views import *

urlpatterns = [
    path('', CalculatorView.as_view(), name='rules'),
    path('sniper-rules/', RulesView.as_view(), name='sniper_rules'),
    path('calc/', CalculatorView.as_view(), name='calc'),
    path('download-rules/', DownloadLauncherView.as_view(), name='download_rules'),
]