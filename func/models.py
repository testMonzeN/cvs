from django.db import models
from cabinet.models import User
from django.urls import reverse

# Create your models here.
class CompetitionsModel(models.Model):
    TYPE_CHOICES = (
        ('---', '---'),
        ("Снайпинг", "Снайпинг"),
        ("Снайпинг МК", "Снайпинг МК"),
        ("Силуэтная стрельба", "Силуэтная стрельба"),
        ("Практическая стрельба", "Практическая стрельба"),
    )
    
    date = models.DateTimeField(null=True, blank=True)
    type = models.CharField(max_length=255, choices=TYPE_CHOICES)
    
    description = models.TextField(max_length=255)
    participants = models.ManyToManyField(User, related_name='competitions')
    
    # True - active, False - inactive
    status = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.date} - {self.type}"
    
    def get_absolute_url(self):
        return reverse('competitions_detail', kwargs={'pk': self.pk})

    