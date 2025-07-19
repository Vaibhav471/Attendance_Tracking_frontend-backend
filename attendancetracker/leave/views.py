from rest_framework import viewsets, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from .models import Leave
from .serializers import LeaveSerializer

class LeaveViewSet(viewsets.ModelViewSet):
    serializer_class = LeaveSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Leave.objects.filter(user=self.request.user).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


# Get all pending leaves
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def pending_leaves(request):
    pending = Leave.objects.filter(user=request.user, status="pending").order_by('-created_at')
    serializer = LeaveSerializer(pending, many=True)
    return Response(serializer.data)

# Get all non-pending leaves
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def non_pending_leaves(request):
    non_pending = Leave.objects.filter(user=request.user).exclude(status="pending").order_by('-created_at')
    serializer = LeaveSerializer(non_pending, many=True)
    return Response(serializer.data)

#Fetch all pending leaves
@api_view(['GET'])
@permission_classes([AllowAny])
def all_pending_leaves(request):
    pending_leaves = Leave.objects.filter(status="pending").order_by('-created_at')
    serializer = LeaveSerializer(pending_leaves, many=True)
    return Response(serializer.data)

#Update status of a leave by ID (NO token required)
@api_view(['PATCH'])
@permission_classes([AllowAny])
def update_leave_status(request, leave_id):
    try:
        leave_obj = Leave.objects.get(id=leave_id)
    except Leave.DoesNotExist:
        return Response({"error": "Leave not found"}, status=status.HTTP_404_NOT_FOUND)

    # Expecting request body: { "status": "approved" }
    new_status = request.data.get("status")
    if not new_status:
        return Response({"error": "Status is required"}, status=status.HTTP_400_BAD_REQUEST)

    leave_obj.status = new_status
    leave_obj.save()

    return Response({"message": f"Leave {leave_id} updated to {new_status} successfully"})