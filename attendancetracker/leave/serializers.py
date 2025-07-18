from rest_framework import serializers
from .models import Leave

class LeaveSerializer(serializers.ModelSerializer):
    class Meta:
        model = Leave
        fields = [
            'id',
            'user',
            'name',
            'email',
            'start_date',
            'end_date',
            'type',
            'reason',
            'status',
            'submit_date',
            'created_at'
        ]
        read_only_fields = ['id', 'user', 'submit_date', 'created_at']
