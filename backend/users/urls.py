from django.urls import path, include # type: ignore
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views


urlpatterns = [
    # Get all users
    path("", views.ListUser.as_view(), name="get_users"),
    path("<int:pk>/", views.UserDetailUpdate.as_view(), name="user-detail-update"),
    # Get followers
    path("<int:pk>/followers/", views.ListFollowers.as_view(), name="get_followers"),
    # Get followers
    path("<int:pk>/following/", views.ListFollowing.as_view(), name="get_following"),
    # Follow user
    path("<int:pk>/follow_or_unfollow/", views.follow_or_unfollow, name="follow_unfollow"),
    # Get user posts
    path("<int:pk>/posts/", views.ListUserPosts.as_view(), name="get_user_posts"),
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
    # Get a user
    path("<str:username>/", views.GetUser.as_view(), name="get_user"),
]
