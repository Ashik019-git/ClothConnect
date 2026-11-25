
from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):

    ROLE_CHOICES = [
        ('CUSTOMER', 'Customer'),
        ('BRAND', 'Brand'),
        ('ADMIN', 'Admin'),
    ]

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default='CUSTOMER'
    )

    def __str__(self):
        return self.username

