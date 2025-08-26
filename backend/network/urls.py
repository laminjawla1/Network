from django.contrib import admin # type: ignore
from django.urls import path, include # type: ignore

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/users/", include("users.urls")),
    path("api/posts/", include("posts.urls")),
]
