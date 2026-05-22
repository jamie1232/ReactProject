import { NavLink } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  const teamId = 1; // temp

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-brand-pill">
          <span className="sidebar-brand-dot" />
          Student Workspace
        </div>
        <p>{user?.username}</p>
      </div>

      <nav>
        <NavLink to="/" end>
          Dashboard
        </NavLink>

        {/* add `end` here so it doesn't stay active on subroutes */}
        <NavLink to={`/teams/${teamId}`} end>
          Team
        </NavLink>

        <NavLink to={`/teams/${teamId}/board`}>
          Board
        </NavLink>

        <NavLink to={`/teams/${teamId}/meetings`}>
          Meetings
        </NavLink>
      </nav>

      <button onClick={logout}>Log out</button>
    </aside>
  );
}