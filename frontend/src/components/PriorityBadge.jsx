const priorityConfig = {
  low: { label: 'Low', className: 'badge-low' },
  medium: { label: 'Medium', className: 'badge-medium' },
  high: { label: 'High', className: 'badge-high' },
};

export default function PriorityBadge({ priority }) {
  const config = priorityConfig[priority] || priorityConfig.medium;
  return <span className={`badge ${config.className}`}>{config.label}</span>;
}
