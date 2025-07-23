from django.urls import path, include
from .views import hello
from rest_framework.routers import DefaultRouter
from .views import AttendanceViewSet, get_attendance_by_date

router=DefaultRouter()
router.register('attendance', AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('hello/', hello),
    path('', include(router.urls)),
    path('by-date/', get_attendance_by_date, name='attendance-by-date'),

]
