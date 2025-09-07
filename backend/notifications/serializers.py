from rest_framework import serializers
from users.serializers import UserSerializer
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    sender = UserSerializer(read_only=True)
    recipient = UserSerializer(read_only=True)
    related_object = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            "id", "sender", "recipient", "type", "message", "read",
            "created_at", "updated_at", "related_object"
        ]

    def get_related_object(self, obj):
        if obj.content_object:
            return {
                "id": obj.content_object.id,
                "type": obj.content_type.model,  # e.g., "post", "comment"
                "str": str(obj.content_object)   # fallback string
            }
        return None
