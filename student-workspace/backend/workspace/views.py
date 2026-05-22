from django.shortcuts import get_object_or_404
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Team, Membership, Task, Meeting
from .serializers import TeamSerializer, TaskSerializer, MeetingSerializer
from .permissions import IsTeamMember

class TeamViewSet(viewsets.ModelViewSet):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Team.objects.filter(memberships__user=self.request.user).distinct()

    def perform_create(self, serializer):
        team = serializer.save(owner=self.request.user)
        Membership.objects.create(user=self.request.user, team=team, role="leader")

    @action(detail=True, methods=["post"])
    def invite(self, request, pk=None):
        team = self.get_object()
        username = request.data.get("username")
        user_model = team.owner.__class__
        user = get_object_or_404(user_model, username=username)
        Membership.objects.get_or_create(user=user, team=team, defaults={"role": "member"})
        return Response({"status": "invited"})

class TaskViewSet(viewsets.ModelViewSet):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMember]

    def get_queryset(self):
        team_id = self.request.query_params.get("team")
        qs = Task.objects.filter(team__memberships__user=self.request.user)
        if team_id:
            qs = qs.filter(team_id=team_id)
        return qs

    def perform_create(self, serializer):
        team_id = self.request.data.get("team")
        team = get_object_or_404(Team, id=team_id, memberships__user=self.request.user)
        serializer.save(team=team)

class MeetingViewSet(viewsets.ModelViewSet):
    serializer_class = MeetingSerializer
    permission_classes = [permissions.IsAuthenticated, IsTeamMember]

    def get_queryset(self):
        team_id = self.request.query_params.get("team")
        qs = Meeting.objects.filter(team__memberships__user=self.request.user)
        if team_id:
            qs = qs.filter(team_id=team_id)
        return qs

    def perform_create(self, serializer):
        team_id = self.request.data.get("team")
        team = get_object_or_404(Team, id=team_id, memberships__user=self.request.user)
        serializer.save(team=team, created_by=self.request.user)