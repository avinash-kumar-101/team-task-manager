export default function EmptyState({ icon = '📭', title, message, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{message}</p>
      {action && <div style={{ marginTop: '18px' }}>{action}</div>}
    </div>
  );
}
