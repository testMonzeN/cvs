from django.db import models
from django.contrib.auth.models import AbstractUser

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
    
    def __str__(self):
        return self.username
    
