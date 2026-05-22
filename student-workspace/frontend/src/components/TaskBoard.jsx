import TaskCard from "./TaskCard";

const columns = [
  { id: "todo", title: "To Do" },
  { id: "in_progress", title: "In Progress" },
  { id: "done", title: "Done" },
];

export default function TaskBoard({ tasks }) {
  return (
    <div className="board">
      {columns.map((col) => (
        <div key={col.id} className="board-column">
          <h3>{col.title}</h3>
          {tasks
            .filter((t) => t.status === col.id)
            .map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
        </div>
      ))}
    </div>
  );
}