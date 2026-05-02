import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDashboardApi } from '../api/dashboard.api';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import {
  HiOutlineFolder,
  HiOutlineClipboardList,
  HiOutlineExclamation,
  HiOutlineClock,
} from 'react-icons/hi';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await getDashboardApi();
        setData(res.data.data);
      } catch (err) {
        console.error('Dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <Spinner />;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="page-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>👋 Welcome, {user?.name?.split(' ')[0]}</h1>
          <p className="page-subtitle">Here's what's happening across your projects</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--accent-primary-glow)', color: 'var(--accent-primary)' }}>
            <HiOutlineFolder />
          </div>
          <div className="stat-info">
            <h3>{data?.totalProjects || 0}</h3>
            <p>Total Projects</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--info-bg)', color: 'var(--info)' }}>
            <HiOutlineClipboardList />
          </div>
          <div className="stat-info">
            <h3>{data?.totalTasks || 0}</h3>
            <p>Total Tasks</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-bg)', color: 'var(--warning)' }}>
            <HiOutlineClock />
          </div>
          <div className="stat-info">
            <h3>{data?.tasksDueToday || 0}</h3>
            <p>Due Today</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--danger-bg)', color: 'var(--danger)' }}>
            <HiOutlineExclamation />
          </div>
          <div className="stat-info">
            <h3>{data?.overdueTasks?.length || 0}</h3>
            <p>Overdue</p>
          </div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            📊 Task Status Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {['todo', 'in_progress', 'done'].map((status) => {
              const count = data?.tasksByStatus?.[status] || 0;
              const total = data?.totalTasks || 1;
              const pct = Math.round((count / total) * 100);
              const colors = {
                todo: 'var(--info)',
                in_progress: 'var(--warning)',
                done: 'var(--success)',
              };
              const labels = {
                todo: 'To Do',
                in_progress: 'In Progress',
                done: 'Done',
              };
              return (
                <div key={status}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.85rem' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{labels[status]}</span>
                    <span style={{ fontWeight: 600 }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{
                    height: '8px',
                    background: 'var(--bg-elevated)',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: colors[status],
                      borderRadius: '4px',
                      transition: 'width 0.5s ease',
                    }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* My Tasks */}
        <div className="card">
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🎯 My Tasks
          </h3>
          {data?.myTasks?.length === 0 ? (
            <p style={{ color: 'var(--text-tertiary)', fontSize: '0.9rem' }}>No tasks assigned to you</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {data?.myTasks?.slice(0, 5).map((task) => (
                <div
                  key={task.id}
                  onClick={() => navigate(`/projects/${task.projectId}`)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-elevated)',
                    cursor: 'pointer',
                    transition: 'background 150ms ease',
                    gap: '10px',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {task.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
                      {task.project?.name}
                    </div>
                  </div>
                  <PriorityBadge priority={task.priority} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Overdue Tasks */}
      {data?.overdueTasks?.length > 0 && (
        <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--danger)' }}>
            🚨 Overdue Tasks
          </h3>
          <div className="table-container" style={{ border: 'none' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Assignee</th>
                  <th>Due Date</th>
                  <th>Priority</th>
                </tr>
              </thead>
              <tbody>
                {data.overdueTasks.map((task) => (
                  <tr key={task.id} onClick={() => navigate(`/projects/${task.projectId}`)} style={{ cursor: 'pointer' }}>
                    <td style={{ fontWeight: 500 }}>{task.title}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{task.project?.name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{task.assignee?.name || '—'}</td>
                    <td style={{ color: 'var(--danger)' }}>{formatDate(task.dueDate)}</td>
                    <td><PriorityBadge priority={task.priority} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      {data?.recentActivity?.length > 0 && (
        <div className="card" style={{ marginTop: '16px' }}>
          <h3 style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            🕐 Recent Activity
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {data.recentActivity.slice(0, 8).map((task) => (
              <div
                key={task.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.85rem',
                }}
              >
                <StatusBadge status={task.status} />
                <span style={{ flex: 1, fontWeight: 500 }}>{task.title}</span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>
                  {task.project?.name}
                </span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.75rem' }}>
                  {formatDate(task.updatedAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
