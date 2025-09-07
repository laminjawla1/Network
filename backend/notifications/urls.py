from django.urls import path
from . import views

urlpatterns = [
    path("", views.ListNotification.as_view()),
    path("mark_all_as_read/", views.MarkAllAsRead.as_view()),
    path("<int:pk>/", views.UpdateNotification.as_view())
]