from django.shortcuts import get_object_or_404 # type: ignore
from django.core.exceptions import ObjectDoesNotExist, PermissionDenied # type: ignore

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND, HTTP_200_OK

from notifications.models import Notification

from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer


# Get all Posts
class ListPosts(generics.ListAPIView, generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        post = serializer.save(user=self.request.user)

        sender_name = f"{self.request.user.first_name} {self.request.user.last_name}".strip()
        if not sender_name:
            sender_name = self.request.user.username

        # Notify all followers
        for follower in self.request.user.followers.all():
            Notification.objects.create(
                sender=self.request.user,
                recipient=follower,
                type="post",
                message=f"{sender_name} created a new post",
                content_object=post
            )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

class CreateComment(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def create(self, request, *args, **kwargs):
        post = get_object_or_404(Post, pk=kwargs.get("pk"))

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        serializer.save(user=request.user, post=post)

        # Notify the post owner if someone else comments
        if self.request.user != post.user:
            sender_name = f"{self.request.user.first_name} {self.request.user.last_name}".strip()
            if not sender_name:
                sender_name = self.request.user.username

            Notification.objects.create(
                sender=self.request.user,
                recipient=post.user,
                type="comment",
                message=f"{sender_name} commented on your post",
                content_object=post
            )

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def like_unlike(request, pk):
    try:
        post = Post.objects.get(pk=pk)
        if request.user in post.likes.all():
            post.likes.remove(request.user)
        else:
            post.likes.add(request.user)
            if request.user != post.user:
                sender_name = f"{request.user.first_name} {request.user.last_name}".strip()
                if not sender_name:
                    sender_name = request.user.username

                Notification.objects.create(
                    sender=request.user,
                    recipient=post.user,
                    type="like",
                    message=f"{sender_name} liked your post",
                    content_object=post
                )
        return Response(HTTP_200_OK)
    except ObjectDoesNotExist:
        return Response(status=HTTP_404_NOT_FOUND)

class ListFollowingPosts(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Get all users the current user is following
        following_users = self.request.user.following_users.all()
        # Return posts created by those users
        return Post.objects.filter(user__in=following_users)

class DeletePost(generics.DestroyAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    queryset = Post.objects.all()

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You cannot delete someone else's post.")
        instance.delete()

class UpdatePost(generics.UpdateAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Post.objects.filter(user=self.request.user)
