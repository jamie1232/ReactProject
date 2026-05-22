import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/client";
import TaskBoard from "../components/TaskBoard";

export default function BoardPage() {
  const { teamId } = useParams();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get(`/tasks/?team=${teamId}`).then((res) => setTasks(res.data));
  }, [teamId]);

  return (
    <div>
      <h2>Board</h2>
      <TaskBoard tasks={tasks} />
    </div>
  );
}