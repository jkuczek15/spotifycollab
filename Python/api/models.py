from django.db import models

class User(models.Model):
    user_id = models.CharField(max_length=50)
    access_token = models.CharField(max_length=200)
