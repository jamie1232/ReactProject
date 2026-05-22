from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, TaskViewSet, MeetingViewSet

router = DefaultRouter()
router.register("teams", TeamViewSet, basename="team")
router.register("tasks", TaskViewSet, basename="task")
router.register("meetings", MeetingViewSet, basename="meeting")

urlpatterns = [
    path("", include(router.urls)),
]