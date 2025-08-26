from django.db import models # type: ignore
from django.contrib.auth.models import AbstractUser # type: ignore


class User(AbstractUser):
    followers = models.ManyToManyField(
        "self",
        symmetrical=False,
        related_name="following_users",
        blank=True
    )

    def follow(self, user):
        """Follow another user"""
        if user != self:
            self.followers.add(user)

    def unfollow(self, user):
        """Unfollow another user"""
        if user != self:
            self.followers.remove(user)

    def is_following(self, user):
        return user in self.followers.all()

    def is_followed_by(self, user):
        return self in user.followers.all()
