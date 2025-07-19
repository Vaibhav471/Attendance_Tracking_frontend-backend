from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import LeaveViewSet, pending_leaves, non_pending_leaves, all_pending_leaves, update_leave_status


router = DefaultRouter()
router.register('leaves', LeaveViewSet, basename='leaves')

urlpatterns = [
    path('', include(router.urls)),
    path('pending/', pending_leaves, name='pending-leaves'),
    path('non-pending/', non_pending_leaves, name='non-pending-leaves'),
    path('all-pending/', all_pending_leaves, name='all-pending-leaves'),
    path('update-status/<int:leave_id>/', update_leave_status, name='update-leave-status'),
]
