from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Notification
from .serializers import NotificationSerializer

class ListNotification(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user)

class UpdateNotification(generics.UpdateAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # A user can only update their own notifications
        return Notification.objects.filter(recipient=self.request.user)

class MarkAllAsRead(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, *args, **kwargs):
        notifications = Notification.objects.filter(recipient=request.user, read=False)
        updated_count = notifications.update(read=True)

        return Response(
            {"message": f"{updated_count} notifications marked as read."},
            status=status.HTTP_200_OK
        )