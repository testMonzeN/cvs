from django.db import models
from django.contrib.auth.models import AbstractUser
from .ModelConfig import CITIES

# Create your models here.
class User(AbstractUser):
    ROLES = (
        ('---', '---'),
        ('admin', 'admin'),
        ('user', 'user'),
    )
    # qr code fields
    otp_secret = models.CharField(max_length=16, null=True, blank=True)
    otp_auth_url = models.CharField(max_length=100, null=True, blank=True)
    role_user = models.CharField(max_length=255, choices=ROLES) # user role
        
    # datetime fields
    registration_date = models.DateTimeField(auto_now_add=True)
    last_login_date = models.DateTimeField(auto_now=True)
    
    # boolean fields
    mfa_enabled = models.BooleanField(default=False) # 2FA enabled

    pts = models.IntegerField(default=0, null=True, blank=True)
    hometown = models.CharField(max_length=255, choices=CITIES, null=True, blank=True)
    mmr = models.IntegerField(default=0, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role_user = 'admin'
        else:
            self.role_user = 'user'
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username


class TopLadder(models.Model):
    users = models.ManyToManyField(User)

    def get_user_position(self, username):
        ranked_users = User.objects.all().order_by('-mmr')
        for index, user in enumerate(ranked_users, 1):
            if user.username == username:
                return index + 1

        return None

    def get_top(self, count):
        return User.objects.all().order_by('-mmr')[:count]

    def __str__(self):
        return 'Топ лидеров'

