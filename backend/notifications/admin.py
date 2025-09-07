from django.contrib import admin
from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ("sender", "recipient", "type", "message", "read", "created_at")
    list_filter = ("type", "read", "created_at")
    search_fields = ("message", "sender__username", "recipient__username")
    ordering = ("-created_at",)
