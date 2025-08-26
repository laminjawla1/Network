from django.urls import path, include # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views


urlpatterns = [
    # Endpoint to obtain jwt token
    path("token/", TokenObtainPairView.as_view(), name="get_token"),
    # Endpoint to refresh jwt token
    path("token/refresh/", TokenRefreshView.as_view(), name="get_token"),
    # Endpoint for registering a new user
    path("register/", views.CreateUser.as_view(), name="register"),
    # Endpoint to get the currently authenticated user’s details
    path("current_user/", views.get_current_user, name="current_user"),
    # Endpoint to change the current user's password
    path("change_password/", views.change_password, name="change_password"),
    # Include Restframework auth views
    path("api-auth/", include("rest_framework.urls")),
]
