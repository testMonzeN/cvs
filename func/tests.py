from django.test import TestCase
from .models import CompetitionsModel
from cabinet.models import User

# Create your tests here.
User.objects.create_user(username='admin', password='admin', role_user='admin')
User.objects.create_user(username='user', password='user', role_user='user')


CompetitionsModel.objects.create(date='2025-01-01', type='Снайпинг', description='Описание', status=True)
CompetitionsModel.objects.create(date='2025-01-02', type='Снайпинг МК', description='Описание', status=True)
CompetitionsModel.objects.create(date='2025-01-03', type='Силуэтная стрельба', description='Описание', status=True)
CompetitionsModel.objects.create(date='2025-01-04', type='Практическая стрельба', description='Описание', status=True)
