"""user authentication and management"""

from rest_framework.response import Response
from rest_framework.decorators import (
    api_view,
    permission_classes,
)
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_200_OK,
)
from django.contrib.auth import update_session_auth_hash # type: ignore
from django.shortcuts import get_object_or_404 # type: ignore
from posts.serializers import PostSerializer
from posts.models import Post
from notifications.models import Notification
from .models import User
from .serializers import UserSerializer, ChangePasswordSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_current_user(request):
    """
    Retrieve details of the currently authenticated user.

    Returns:
        JSON response with serialized user data.
    """
    return Response(UserSerializer(request.user).data)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(
        data=request.data, context={"request": request}
    )
    if serializer.is_valid():
        user = request.user
        new_password = serializer.validated_data["new_password"]

        # Set new password and save user
        user.set_password(new_password)
        user.save()

        # Update session hash to prevent logout after password change
        update_session_auth_hash(request, user)

        # Notify the user about password change
        Notification.objects.create(
            sender=user,
            recipient=user,
            type="system",
            message="Your password has changed",
            content_object=user
        )

        return Response(
            {"detail": "Password updated successfully."}, status=HTTP_200_OK
        )

    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = User.objects.create_user(**serializer.validated_data)
        return Response(UserSerializer(user).data, status=HTTP_201_CREATED)
    return Response(status=HTTP_400_BAD_REQUEST)


class CreateUser(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def follow_or_unfollow(request, pk):
    user = get_object_or_404(User, pk=pk)

    # Prevent self-following
    if request.user == user:
        return Response(
            {"detail": "You cannot follow yourself."},
            status=HTTP_400_BAD_REQUEST
        )

    if request.user in user.followers.all():
        # Unfollow
        user.followers.remove(request.user)
        action = "unfollowed"
    else:
        # Follow
        user.followers.add(request.user)
        action = "followed"

        # Notify only when followed
        sender_name = f"{request.user.first_name} {request.user.last_name}".strip()
        if not sender_name:
            sender_name = request.user.username

        Notification.objects.create(
            sender=request.user,
            recipient=user,
            type="follow",
            message=f"{sender_name} followed you.",
            content_object=request.user
        )

    return Response(
        {"detail": f"Successfully {action} {user.username}."},
        status=HTTP_200_OK
    )



class ListUser(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return User.objects.exclude(pk=self.request.user.pk)

class ListFollowers(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        user = User.objects.get(pk=kwargs.get("pk"))
        serializer = self.get_serializer(user.followers.all(), many=True)
        return Response(serializer.data)

class ListFollowing(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def list(self, request, *args, **kwargs):
        user = User.objects.get(pk=kwargs.get("pk"))
        serializer = self.get_serializer(user.following_users.all(), many=True)
        return Response(serializer.data)

class ListUserPosts(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(user__pk=self.kwargs.get("pk"))

class GetUser(generics.RetrieveAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    lookup_field = "username"

class UserDetailUpdate(generics.UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
