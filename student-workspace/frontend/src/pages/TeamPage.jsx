import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

export default function TeamPage() {
  const { teamId } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api
      .get(`/teams/${teamId}/`)
      .then((res) => setTeam(res.data))
      .catch(() => setError("No team found for this ID."))
      .finally(() => setLoading(false));
  }, [teamId]);

  if (loading) return <p>Loading team...</p>;
  if (error) return <p>{error}</p>;
  if (!team) return <p>No team data.</p>;

  return (
    <div>
      <div className="page-header">
        <div>
          <div className="page-title">{team.name}</div>
          <div className="page-subtitle">
            Overview of the team and its members.
          </div>
        </div>
      </div>

      <div className="team-layout">
        <div className="card">
          <div className="team-section-title">Description</div>
          <p>{team.description || "No description yet."}</p>
        </div>

        <div className="card">
          <div className="team-section-title">Members</div>
          {team.memberships.length === 0 ? (
            <p>No members yet.</p>
          ) : (
            <ul className="team-members-list">
              {team.memberships.map((m) => (
                <li key={m.id}>
                  <span>{m.user.username}</span>
                  <span className="team-member-role">{m.role}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}