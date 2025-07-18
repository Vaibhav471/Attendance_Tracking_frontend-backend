from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeaveViewSet

router = DefaultRouter()
router.register('leaves', LeaveViewSet, basename='leaves')

urlpatterns = [
    path('api/', include(router.urls)),
]
