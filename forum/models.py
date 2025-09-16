from django.db import models
from cabinet.models import User
from django.urls import reverse
from django.utils import timezone

# Create your models here.
class QuestionModel(models.Model):
    TYPE_CHOICES = (
        ('---', '---'),
        ('Вопрос', 'Вопрос'), 
        ('Предложение', 'Предложение'),
        ('Жалоба', 'Жалоба'),
        ('Обсуждение', 'Обсуждение'),
        ('Другое', 'Другое'),
    )

    type = models.CharField(max_length=255, choices=TYPE_CHOICES, blank=True, null=True)
    
    title = models.TextField(max_length=255, blank=True, null=True)
    text = models.TextField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    author = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.title or "Без названия"
    
    def get_absolute_url(self):
        return reverse('question-detail', kwargs={'pk': self.pk})

class CommentModel(models.Model):
    question = models.ForeignKey(QuestionModel, on_delete=models.CASCADE, blank=True, null=True)
    text = models.TextField(max_length=255, blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    author = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.text
    
    def get_absolute_url(self):
        return reverse('comment-detail', kwargs={'pk': self.pk})
    
    def get_question(self):
        return self.question
    