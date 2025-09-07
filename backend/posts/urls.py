from django.urls import path # type: ignore
from . import views

urlpatterns = [
    path("", views.ListPosts.as_view(), name="get_posts"),
    path("following/", views.ListFollowingPosts.as_view(), name="get_following_posts"),
    path("<int:pk>/like_unlike/", views.like_unlike, name="like_unlike"),
    path("<int:pk>/comments/", views.CreateComment.as_view(), name="comments"),
    path("<int:pk>/delete/", views.DeletePost.as_view(), name="delete_post"),
    path("<int:pk>/update/", views.UpdatePost.as_view(), name="update_post"),
]