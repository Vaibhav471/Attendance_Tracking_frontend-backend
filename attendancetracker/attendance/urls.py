from django.urls import path, include
from .views import hello
from rest_framework.routers import DefaultRouter
from .views import AttendanceViewSet

router=DefaultRouter()
router.register('attendance', AttendanceViewSet, basename='attendance')

urlpatterns = [
    path('hello/', hello),
    path('api/', include(router.urls))
]
