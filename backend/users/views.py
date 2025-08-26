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
    """
    Allow authenticated users to change their password securely.

    Validates old password, checks new password and confirmation,
    and updates the password while keeping the user logged in.

    Returns:
        HTTP 200 OK with success message on valid password change.
        HTTP 400 BAD REQUEST with error details on failure.
    """
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

        return Response(
            {"detail": "Password updated successfully."}, status=HTTP_200_OK
        )

    return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def register(request):
    """
    Register a new user with the provided data.

    Validates user data, creates the user, and returns serialized user info.

    Returns:
        HTTP 201 CREATED with user data on success.
        HTTP 400 BAD REQUEST on validation failure.
    """
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid(raise_exception=True):
        user = User.objects.create_user(**serializer.validated_data)
        return Response(UserSerializer(user).data, status=HTTP_201_CREATED)
    return Response(status=HTTP_400_BAD_REQUEST)


class CreateUser(generics.CreateAPIView):
    """Create user api view"""

    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer
