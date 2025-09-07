from rest_framework import serializers
from .models import Post, Comment
from users.serializers import UserSerializer


class CommentSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "user", "content", "created_at", "updated_at"]


class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    likes_count = serializers.SerializerMethodField()
    comments = CommentSerializer(many=True, read_only=True)

    class Meta:
        model = Post
        fields = [
            "id",
            "user",
            "content",
            "likes_count",
            "likes",
            "comments",
            "created_at",
            "updated_at",
        ]

    def get_likes_count(self, obj):
        return obj.likes.count()
