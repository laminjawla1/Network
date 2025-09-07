from django.contrib import admin # type: ignore
from .models import Post, Comment

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("user",)

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("user",)

