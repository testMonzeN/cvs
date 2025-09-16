from django.db import models
from cabinet.models import User
from django.urls import reverse
from django.utils import timezone
from datetime import datetime

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
    participants = models.ManyToManyField(User, related_name='competitions', default=None, blank=True)
    
    result = models.FileField(blank=True, null=True)
    
    # True - active, False - inactive
    status = models.BooleanField(default=True)
    
    def save(self, *args, **kwargs):
        if self.date < timezone.now():
            self.status = False
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.date} - {self.type}"
    
    def get_absolute_url(self):
        return reverse('competitions-detail', kwargs={'pk': self.pk})


class TrainingModel(models.Model):
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
    participants = models.ManyToManyField(User, related_name='training', default=None, blank=True)
    
    # True - active, False - inactive
    status = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.date} - {self.type}"
    
    def get_absolute_url(self):
        return reverse('training_detail', kwargs={'pk': self.pk})

class SeminarModel(models.Model):
    date = models.DateTimeField(null=True, blank=True)
    participants = models.ManyToManyField(User, related_name='seminar', default=None, blank=True)
    status = models.BooleanField(default=True)
    
    
    def __str__(self):
        return f"{self.date} - seminar"
    
    def get_absolute_url(self):
        return reverse('seminar_detail', kwargs={'pk': self.pk})
    

class SinghtingInModel(models.Model):
    date = models.DateTimeField(null=True, blank=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='singhting_in', default=None, blank=True)
    status = models.BooleanField(default=True)
    description = models.TextField(max_length=255)
    
    def __str__(self):
        return f"{self.date} - {self.user.username}"
    
    def get_absolute_url(self):
        return reverse('singhting_in_detail', kwargs={'pk': self.pk})