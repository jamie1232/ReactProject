export default function TaskCard({ task }) {
  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      {task.assignee && <p>@{task.assignee.username}</p>}
      {task.due_date && <p>Due: {task.due_date}</p>}
    </div>
  );
}