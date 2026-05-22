import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";

export default function MeetingsPage() {
  const { teamId } = useParams();
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    api.get(`/meetings/?team=${teamId}`).then((res) => setMeetings(res.data));
  }, [teamId]);

  return (
    <div>
      <h2>Meetings</h2>
      <div className="card">
        <div className="card-title">Upcoming meetings</div>
        {meetings.length === 0 ? (
          <p>No meetings scheduled.</p>
        ) : (
          <ul>
            {meetings.map((m) => (
              <li key={m.id}>
                <strong>{m.title}</strong> –{" "}
                {new Date(m.scheduled_for).toLocaleString()}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}