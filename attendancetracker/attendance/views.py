from django.shortcuts import render, HttpResponse
from rest_framework import viewsets, permissions, status
from .models import Attendance
from .serializers import AttendanceSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.dateparse import parse_date



class AttendanceViewSet(viewsets.ModelViewSet):
    serializer_class = AttendanceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Attendance.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


def hello(req):
    return HttpResponse("hello")


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_attendance_by_date(request):
    date_param = request.query_params.get('date')

    if not date_param:
        return Response({"error": "date query parameter is required"}, status=400)

    attendance_qs = Attendance.objects.filter(user=request.user, date=date_param)

    if not attendance_qs.exists():
        return Response({"message": "No attendance record found for this date"}, status=404)

    serializer = AttendanceSerializer(attendance_qs, many=True)
    return Response(serializer.data)