from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Team, Membership, Task, Meeting

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "email"]

class MembershipSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = Membership
        fields = ["id", "user", "role", "joined_at"]

class TeamSerializer(serializers.ModelSerializer):
    owner = UserSerializer(read_only=True)
    memberships = MembershipSerializer(many=True, read_only=True)

    class Meta:
        model = Team
        fields = ["id", "name", "description", "owner", "memberships", "created_at"]

class TaskSerializer(serializers.ModelSerializer):
    assignee = UserSerializer(read_only=True)
    assignee_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        source="assignee",
        write_only=True,
        required=False,
    )

    class Meta:
        model = Task
        fields = [
            "id",
            "team",
            "title",
            "description",
            "status",
            "priority",
            "due_date",
            "assignee",
            "assignee_id",
            "created_at",
        ]
        read_only_fields = ["team", "created_at"]

class MeetingSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)

    class Meta:
        model = Meeting
        fields = ["id", "team", "title", "agenda", "scheduled_for", "created_by", "created_at"]
        read_only_fields = ["team", "created_by", "created_at"]