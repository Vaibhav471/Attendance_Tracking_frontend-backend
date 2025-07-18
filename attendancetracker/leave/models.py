from django.db import models
from django.contrib.auth.models import User

class Leave(models.Model):
    id = models.AutoField(primary_key=True)

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leaves')

    name = models.CharField(max_length=255)
    email = models.EmailField()

    start_date = models.DateField()
    end_date = models.DateField()
    type = models.CharField(max_length=50)  
    reason = models.TextField(blank=True)

    status = models.CharField(max_length=20, default="pending")  

    submit_date = models.DateField(auto_now_add=True)  
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.type} ({self.start_date} to {self.end_date}) - {self.status}"
