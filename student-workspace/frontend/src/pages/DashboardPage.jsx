import { useEffect, useState } from "react";
import api from "../api/client";

export default function DashboardPage() {
  const [teams, setTeams] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("/teams/").then((res) => setTeams(res.data));
    api.get("/tasks/").then((res) => setTasks(res.data));
  }, []);

  const totalTasks = tasks.length;
  const todo = tasks.filter((t) => t.status === "todo").length;
  const inProgress = tasks.filter((t) => t.status === "in_progress").length;
  const done = tasks.filter((t) => t.status === "done").length;

  return (
    <div>
      <h2>Dashboard</h2>
      <div className="card">
        <div className="card-title">Overview</div>
        <p>Welcome to your student workspace dashboard.</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">Teams</div>
          <div className="stat-value">{teams.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total tasks</div>
          <div className="stat-value">{totalTasks}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">To Do</div>
          <div className="stat-value">{todo}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">In Progress</div>
          <div className="stat-value">{inProgress}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Done</div>
          <div className="stat-value">{done}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Teams</div>
        {teams.length === 0 ? (
          <p>No teams yet.</p>
        ) : (
          <ul>
            {teams.map((team) => (
              <li key={team.id}>{team.name}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}