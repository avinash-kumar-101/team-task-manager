import StatusBadge from './StatusBadge';
import PriorityBadge from './PriorityBadge';
import { HiOutlineClock, HiOutlineUser } from 'react-icons/hi';

export default function TaskCard({ task, onClick }) {
  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="task-card" onClick={() => onClick?.(task)} id={`task-${task.id}`}>
      <div className="task-card-header">
        <span className="task-card-title">{task.title}</span>
        <PriorityBadge priority={task.priority} />
      </div>

      {task.description && (
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {task.description}
        </p>
      )}

      <div className="task-card-meta">
        <StatusBadge status={task.status} />

        {task.dueDate && (
          <span className={`due-date ${task.isOverdue ? 'overdue' : ''}`}>
            <HiOutlineClock />
            {formatDate(task.dueDate)}
            {task.isOverdue && <span className="badge badge-overdue" style={{ marginLeft: '4px' }}>Overdue</span>}
          </span>
        )}

        {task.assignee && (
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <HiOutlineUser />
            {task.assignee.name}
          </span>
        )}
      </div>
    </div>
  );
}
