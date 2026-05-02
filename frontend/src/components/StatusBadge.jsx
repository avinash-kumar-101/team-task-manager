const statusConfig = {
  todo: { label: 'To Do', className: 'badge-todo' },
  in_progress: { label: 'In Progress', className: 'badge-in-progress' },
  done: { label: 'Done', className: 'badge-done' },
};

export default function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.todo;
  return <span className={`badge ${config.className}`}>{config.label}</span>;
}
