from rest_framework.permissions import BasePermission
from .models import Membership, Team

class IsTeamMember(BasePermission):
    def has_object_permission(self, request, view, obj):
        team = None
        if isinstance(obj, Team):
            team = obj
        else:
            team = getattr(obj, "team", None)

        if not team:
            return False

        return Membership.objects.filter(user=request.user, team=team).exists()