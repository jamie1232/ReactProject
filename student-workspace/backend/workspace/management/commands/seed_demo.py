from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from django.utils import timezone
from random import choice, randint

from workspace.models import Team, Membership, Task, Meeting


class Command(BaseCommand):
    help = "Create demo teams, tasks and meetings for the Student Workspace app."

    def handle(self, *args, **options):
        # 1. Ensure there is at least one user
        user, created = User.objects.get_or_create(
            username="demo_user",
            defaults={"email": "demo@example.com"},
        )
        if created:
            user.set_password("demo1234")
            user.save()
            self.stdout.write(self.style.SUCCESS("Created demo user demo_user / demo1234"))

        # 2. Create a demo team
        team, created = Team.objects.get_or_create(
            name="Final Year Project",
            defaults={
                "description": "Demo team for Student Workspace.",
                "owner": user,
            },
        )
        if created:
            self.stdout.write(self.style.SUCCESS(f"Created team: {team.name}"))

        # 3. Ensure membership
        Membership.objects.get_or_create(
            user=user,
            team=team,
            defaults={"role": "leader"},
        )

        # 4. Create some tasks for the board
        Task.objects.filter(team=team).delete()

        titles = [
            "Design database schema",
            "Set up CI pipeline",
            "Implement auth flow",
            "Write unit tests",
            "Prepare demo slides",
            "Polish dashboard UI",
        ]
        statuses = ["todo", "in_progress", "done"]

        for title in titles:
            Task.objects.create(
                team=team,
                title=title,
                description=f"Task: {title}",
                status=choice(statuses),
                priority=randint(1, 3),
                assignee=user,
                due_date=timezone.now().date(),
            )

        self.stdout.write(self.style.SUCCESS(f"Created {len(titles)} tasks"))

        # 5. Create a few upcoming meetings
        Meeting.objects.filter(team=team).delete()

        for i in range(3):
            Meeting.objects.create(
                team=team,
                title=f"Weekly sync #{i + 1}",
                agenda="Discuss progress and blockers.",
                scheduled_for=timezone.now() + timezone.timedelta(days=2 * (i + 1)),
                created_by=user,
            )

        self.stdout.write(self.style.SUCCESS("Created demo meetings"))
        self.stdout.write(self.style.SUCCESS("Demo data seeding complete."))