from django.contrib.auth import aget_user
from django.db import models
from cabinet.models import User
from django.urls import reverse
from django.utils import timezone
from datetime import datetime

# Create your models here.
class OrganizerList(models.Model):
    organizer = models.CharField(max_length=255, blank=True, null=True)
    
class CompetitionsModel(models.Model):
    TYPE_CHOICES = (
        ('---', '---'),
        ("Снайпинг", "Снайпинг"),
        ("Снайпинг МК", "Снайпинг МК"),
        ("Силуэтная стрельба", "Силуэтная стрельба"),
        ("Практическая стрельба", "Практическая стрельба"),
    )
    
    date = models.DateTimeField(null=True, blank=True, help_text='дата создания')
    date_end = models.DateField(null=True, blank=True, help_text='дата конца')
    type = models.CharField(max_length=255, choices=TYPE_CHOICES)
    
    description = models.TextField(max_length=255, help_text='описание')
    participants = models.ManyToManyField(User, related_name='competitions', default=None, blank=True)
    
    result = models.FileField(blank=True, null=True)
    
    # True - active, False - inactive
    status = models.BooleanField(default=True)

    is_raiting = models.BooleanField(default=False)
    has_winner = models.BooleanField(default=False)
    winner = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True, related_name='won_competitions')
    
    location = models.CharField(max_length=255, blank=True, null=True, help_text='Полигон/место проведения')
    organizer = models.ForeignKey(OrganizerList, on_delete=models.CASCADE, blank=True, null=True)
    cof = models.FloatField(default=1.0)

    def save(self, *args, **kwargs):
        if self.participants.count() > 20:
            self.is_raiting = True
        if self.date < timezone.now():
            self.status = False
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.date} - {self.type} - {self.is_raiting}"
    
    def get_absolute_url(self):
        return reverse('competitions-detail', kwargs={'pk': self.pk})


class CompetitionResult(models.Model):
    competition = models.ForeignKey(CompetitionsModel, on_delete=models.CASCADE)
    participant = models.ForeignKey(User, on_delete=models.CASCADE)
    points = models.FloatField(default=0)
    place = models.IntegerField()

    rating_points = models.FloatField(default=0, help_text='Рейтинговые очки в %')
    final_rating_points = models.FloatField(default=0, help_text='Итоговые очки с коэффициентом')
    
    def calc_raiting_points(self):
        """
        Рассчитываем рейтинговые очки в процентах от победителя
        """    
        winner = CompetitionResult.objects.filter(competition=self.competition).order_by('-points').first()
        
        if not winner or winner.points == 0:
            return 0
        
        raiting_percent = (self.points / winner.points) * 100 
        previous_result = CompetitionResult.objects.filter(
            competition=self.competition,
            place=self.place - 1
        ).first()
        
        if previous_result and previous_result.points == self.points:
            raiting_percent -= 0.01
        
        return round(raiting_percent, 2)
    def calc_final_point(self):
        if not self.competition.is_raiting:
            return 0
    
        return round(self.rating_points * self.competition.cof, 2)
    
    def save(self, *args, **kwargs):
        self.rating_points = self.calc_raiting_points()
        self.final_rating_points = self.calc_final_point()

        super().save(*args, **kwargs)
        
    def __str__(self):        
        return f'Resultat {self.competition}'


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