from django.db import models
from django.contrib.auth.models import User

class Attendance(models.Model):
    id = models.AutoField(primary_key=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='attendances')

    name = models.CharField(max_length=255)
    email = models.EmailField()

    date = models.CharField(max_length=50)  
    day = models.CharField(max_length=20)   

    status = models.CharField(max_length=20, default="Present")  

    checkin = models.TimeField(null=True, blank=True)
    break_start = models.TimeField(null=True, blank=True)
    break_end = models.TimeField(null=True, blank=True)
    checkout = models.TimeField(null=True, blank=True)

    hours = models.CharField(max_length=20, blank=True)  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.date} - {self.status}"
