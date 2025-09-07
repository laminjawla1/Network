from django.db import models # type: ignore
from django.conf import settings # type: ignore


class Post(models.Model):
    class Meta:
        ordering = ("-created_at",)

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts"
    )
    content = models.TextField()
    likes = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="liked_posts",
        blank=True
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} - {self.content[:30]}"


class Comment(models.Model):
    class Meta:
        ordering = ("-created_at",)

    post = models.ForeignKey(
        Post,
        on_delete=models.CASCADE,
        related_name="comments"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments"
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username} on {self.post.id}: {self.content[:30]}"
