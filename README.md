# Student Workspace

A full‑stack **team collaboration dashboard** built with **React (Vite)** on the frontend and **Django REST Framework + SimpleJWT** on the backend.

It provides a small but realistic feature set suitable for a junior developer portfolio project:

- Teams with membership and roles
- Kanban‑style task board
- Meetings scheduling
- Authenticated API with JWT
- Modern glassmorphism dark UI

---

## Features

### Core domain

- **Teams**
  - Create teams with name, description and owner
  - Membership model linking users ↔ teams
  - Roles: `leader`, `member`

- **Tasks / Board**
  - Tasks belong to a team
  - Fields: title, description, status (`todo`, `in_progress`, `done`), priority, due date, assignee
  - Board view shows tasks grouped by status (simple Kanban)

- **Meetings**
  - Meetings belong to a team
  - Fields: title, agenda, scheduled datetime, created_by
  - “Upcoming meetings” list per team

### Frontend (React)

- Built with **Vite + React Router**
- Protected routes behind JWT login
- Sidebar with navigation:
  - Dashboard
  - Team overview
  - Board
  - Meetings
- Dashboard with:
  - Team count
  - Task counts by status
- Glassmorphism‑style dark theme:
  - Blurred glass panels
  - Soft gradients and grid background
  - Responsive layout for desktop and mobile

### Backend (Django)

- Django 5 + Django REST Framework
- JWT authentication with `djangorestframework-simplejwt` [web:53]
- CORS enabled for local React dev server
- Models:
  - `Team`, `Membership`, `Task`, `Meeting`
- Viewsets (`ModelViewSet`) for:
  - `/api/teams/`
  - `/api/tasks/`
  - `/api/meetings/`
- Permissions so users only see teams where they are members

---

## Tech Stack

**Frontend**

- React (Vite)
- React Router DOM
- Zustand (simple auth store)
- Axios

**Backend**

- Django
- Django REST Framework
- djangorestframework-simplejwt
- django-cors-headers
- SQLite (`db.sqlite3`) by default

---

## Project Structure

```text
student-workspace/
  backend/
    manage.py
    backend/
      settings.py
      urls.py
      ...
    workspace/
      models.py
      views.py
      serializers.py
      permissions.py
      urls.py
      admin.py
      management/
        commands/
          seed_demo.py      # optional demo data command
  frontend/
    index.html
    vite.config.js
    package.json
    src/
      main.jsx
      App.jsx
      api/client.js
      store/authStore.js
      components/
        Layout.jsx
        Sidebar.jsx
        TaskBoard.jsx
        TaskCard.jsx
      pages/
        LoginPage.jsx
        DashboardPage.jsx
        TeamPage.jsx
        BoardPage.jsx
        MeetingsPage.jsx
      index.css
```

---

## Getting Started

### 1. Clone and set up

```bash
git clone <your-repo-url> student-workspace
cd student-workspace
```

### 2. Backend setup (Django)

Create / activate a virtual environment (example for Windows PowerShell):

```powershell
python -m venv .venv
(Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned)
& .\.venv\Scripts\Activate.ps1
```

Install backend dependencies:

```bash
cd backend
pip install django djangorestframework django-cors-headers djangorestframework-simplejwt
```

Run migrations and create a superuser:

```bash
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
```

Run the dev server:

```bash
python manage.py runserver
# -> http://127.0.0.1:8000/
```

### 3. Frontend setup (React + Vite)

In a second terminal:

```bash
cd student-workspace/frontend
npm install
npm install axios react-router-dom zustand
npm run dev
# -> http://localhost:5173/
```

---

## Backend Details

### Settings (`backend/backend/settings.py`)

Key additions:

```python
INSTALLED_APPS = [
    # Django apps...
    "rest_framework",
    "corsheaders",
    "rest_framework_simplejwt",
    "workspace",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    # ...
]

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
}

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173",  # React dev server
]
```

### URLs (`backend/backend/urls.py`)

```python
from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/", include("workspace.urls")),
]
```

### Workspace app

**Models** (simplified):

- `Team(name, description, owner)`
- `Membership(user, team, role)`
- `Task(team, title, description, status, priority, due_date, assignee)`
- `Meeting(team, title, agenda, scheduled_for, created_by)`

**Permissions**

`IsTeamMember` ensures only members of a team can access its tasks/meetings.

**Viewsets**

- `TeamViewSet`
  - `get_queryset` → teams where `memberships__user = request.user`
  - `perform_create` → auto‑add creator as `leader`
  - `invite` action to add members by username
- `TaskViewSet`, `MeetingViewSet`
  - Filter by `team` query param
  - Use `IsTeamMember` to restrict access

**Admin**

`workspace/admin.py` registers all models so you can use Django admin to manage data.

---

## Frontend Details

### Auth Store (`src/store/authStore.js`)

Zustand store manages:

- `user` (currently just `{ username }`)
- `loading`, `error`
- `login(username, password)`:
  - POSTs to `/api/token/`
  - Stores `access` / `refresh` in `localStorage`
- `logout()`:
  - Clears tokens, resets user

### API Client (`src/api/client.js`)

Axios instance with base URL and JWT interceptor:

```js
const api = axios.create({
  baseURL: "http://localhost:8000/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Routing (`src/App.jsx`)

- `/login` – login page
- `/` – dashboard (protected)
- `/teams/:teamId` – team overview
- `/teams/:teamId/board` – Kanban board
- `/teams/:teamId/meetings` – meetings list

`PrivateRoute` wrapper redirects to `/login` when no user is set.

### UI

- `Sidebar` shows:
  - Brand pill + logged‑in username
  - Nav links (Dashboard / Team / Board / Meetings)
  - Logout button
- `DashboardPage`:
  - Overview card
  - Stat cards for team and task counts
- `TeamPage`:
  - Description card
  - Members card with roles
- `BoardPage` + `TaskBoard`:
  - 3 columns (`To Do`, `In Progress`, `Done`)
- `MeetingsPage`:
  - Upcoming meetings list

---

## Demo Data (Optional)

You can add a custom management command `seed_demo` under `workspace/management/commands/` to create a demo user, team, tasks and meetings automatically:

```bash
cd backend
python manage.py seed_demo
```

Then update the hard‑coded `teamId` in `Sidebar.jsx` to the seeded team’s ID.

---

## How to Use

1. Start Django (`python manage.py runserver`).
2. Start Vite (`npm run dev` in `frontend`).
3. Visit `http://localhost:5173/`.
4. Log in with your Django user (e.g. `admin`).
5. Use Django admin to:
   - Create a team
   - Create a membership linking your user to that team
   - Add tasks and meetings
6. Navigate between Dashboard, Team, Board, and Meetings in the React app.

---

## Future Improvements

- Replace hard‑coded `teamId` with dynamic team selection
- Pagination / search on tasks & meetings
- Drag‑and‑drop task reordering
- Better user profiles and avatars
- Deployment config (Docker / production settings)
