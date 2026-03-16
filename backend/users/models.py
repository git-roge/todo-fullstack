from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('worker', 'Worker')
    )
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='worker')

    def isAdmin(self):
        return self.role == 'admin'
    
    def isWorker(self):
        return self.role == 'worker'