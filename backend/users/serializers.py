"""User Serializers

Defines serializers for the custom User model, including:
- User creation/update
- Secure password change
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password # type: ignore
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the custom User model.

    Handles serialization and deserialization of user data.
    Ensures password write-only behavior and validates password strength.
    """

    class Meta:
        """Meta class"""

        model = User
        fields = [
            "id",
            "first_name",
            "last_name",
            "email",
            "username",
            "password",
            "image",
            "followers",
        ]
        extra_kwargs = {
            "first_name": {"required": True},
        }

    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    password = serializers.CharField(
        write_only=True,
        validators=[validate_password],
        help_text="Write-only password field with validation",
        style={"input_type": "password"},
    )

    def create(self, validated_data):
        """Create user"""
        return User.objects.create_user(**validated_data)


class ChangePasswordSerializer(serializers.Serializer):
    """
    Serializer for changing user password securely.

    Fields:
        old_password: The user's current password (for validation).
        new_password: The desired new password.
        confirm_new_password: Confirmation to match the new password.

    Validation:
        - Ensures old password is correct.
        - Ensures new password and confirmation match.
        - Applies Django's built-in password validators.
    """

    old_password = serializers.CharField(write_only=True)
    new_password = serializers.CharField(
        write_only=True, validators=[validate_password]
    )
    confirm_new_password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        """
        Validates the password change inputs:
        - new_password and confirm_new_password must match
        - old_password must be correct
        """
        old_password = attrs.get("old_password")
        new_password = attrs.get("new_password")
        confirm_new_password = attrs.get("confirm_new_password")

        # Ensure new and confirm passwords match
        if new_password != confirm_new_password:
            raise serializers.ValidationError("The new passwords do not match.")

        # Validate the user's old password
        user = self.context["request"].user
        if not user.check_password(old_password):
            raise serializers.ValidationError("Old password is incorrect.")

        return attrs

    def create(self, validated_data):
        """Not needed but must be implemented to silence the warning"""
        return validated_data

    def update(self, instance, validated_data):  # pylint: disable=unused-argument
        """Not needed but must be implemented to silence the warning"""
        return instance
