import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProjectApi, deleteProjectApi, inviteMemberApi, removeMemberApi } from '../api/project.api';
import { listTasksApi, createTaskApi, updateTaskStatusApi, deleteTaskApi } from '../api/task.api';
import { useAuth } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import Modal from '../components/Modal';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import toast from 'react-hot-toast';
import {
  HiOutlineUsers,
  HiOutlinePlus,
  HiOutlineTrash,
  HiOutlinePencil,
  HiOutlineUserAdd,
  HiOutlineFilter,
} from 'react-icons/hi';

export default function ProjectDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks');

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Modals
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showTaskDetail, setShowTaskDetail] = useState(null);

  // Task form
  const [taskForm, setTaskForm] = useState({ title: '', description: '', priority: 'medium', dueDate: '', assigneeId: '' });
  const [taskLoading, setTaskLoading] = useState(false);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteLoading, setInviteLoading] = useState(false);

  const isAdmin = user?.role === 'admin' || project?.members?.find(m => m.userId === user?.id)?.role === 'admin';

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [projRes, taskRes] = await Promise.all([
        getProjectApi(id),
        listTasksApi(id, { status: statusFilter, priority: priorityFilter }),
      ]);
      setProject(projRes.data.data);
      setTasks(taskRes.data.data);
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      listTasksApi(id, { status: statusFilter, priority: priorityFilter })
        .then(res => setTasks(res.data.data))
        .catch(() => {});
    }
  }, [statusFilter, priorityFilter]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    setTaskLoading(true);
    try {
      await createTaskApi(id, {
        ...taskForm,
        assigneeId: taskForm.assigneeId || null,
        dueDate: taskForm.dueDate || null,
      });
      toast.success('Task created!');
      setShowTaskModal(false);
      setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', assigneeId: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create task');
    } finally {
      setTaskLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatusApi(taskId, newStatus);
      toast.success('Status updated');
      fetchData();
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTaskApi(taskId);
      toast.success('Task deleted');
      setShowTaskDetail(null);
      fetchData();
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    setInviteLoading(true);
    try {
      await inviteMemberApi(id, { email: inviteEmail });
      toast.success('Member invited!');
      setInviteEmail('');
      setShowInviteModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to invite');
    } finally {
      setInviteLoading(false);
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!confirm('Remove this member?')) return;
    try {
      await removeMemberApi(id, userId);
      toast.success('Member removed');
      fetchData();
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  const handleDeleteProject = async () => {
    if (!confirm('Delete this project? This action cannot be undone.')) return;
    try {
      await deleteProjectApi(id);
      toast.success('Project deleted');
      navigate('/projects');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      {/* Project Header */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-secondary)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        marginBottom: '24px',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: 'var(--radius-md)',
                background: `linear-gradient(135deg, hsl(${project?.name?.length * 37 % 360}, 60%, 50%), hsl(${project?.name?.length * 37 % 360 + 40}, 60%, 40%))`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', color: 'white', fontWeight: 700,
              }}>
                {project?.name?.charAt(0).toUpperCase()}
              </div>
              <h1 style={{ fontSize: '1.5rem' }}>{project?.name}</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '4px' }}>
              {project?.description || 'No description'}
            </p>
          </div>

          {isAdmin && (
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
              <button className="btn btn-danger btn-sm" onClick={handleDeleteProject}>
                <HiOutlineTrash /> Delete
              </button>
            </div>
          )}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', gap: '4px', marginTop: '20px',
          borderTop: '1px solid var(--border-secondary)', paddingTop: '16px',
        }}>
          {['tasks', 'members'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
              style={{ textTransform: 'capitalize' }}
            >
              {tab === 'tasks' ? '📋 Tasks' : '👥 Members'} ({tab === 'tasks' ? tasks.length : project?.members?.length || 0})
            </button>
          ))}
        </div>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <>
          <div className="filter-bar">
            <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All Status</option>
              <option value="todo">To Do</option>
              <option value="in_progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <select className="form-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
              <option value="">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <div style={{ flex: 1 }}></div>
            <button className="btn btn-primary btn-sm" onClick={() => setShowTaskModal(true)} id="create-task-btn">
              <HiOutlinePlus /> New Task
            </button>
          </div>

          {tasks.length === 0 ? (
            <EmptyState
              icon="📋"
              title="No tasks yet"
              message="Create your first task to get started"
              action={
                <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
                  Create Task
                </button>
              }
            />
          ) : (
            <div className="tasks-grid">
              {tasks.map((task) => (
                <TaskCard key={task.id} task={task} onClick={(t) => setShowTaskDetail(t)} />
              ))}
            </div>
          )}
        </>
      )}

      {/* Members Tab */}
      {activeTab === 'members' && (
        <>
          {isAdmin && (
            <div style={{ marginBottom: '16px' }}>
              <button className="btn btn-primary btn-sm" onClick={() => setShowInviteModal(true)} id="invite-member-btn">
                <HiOutlineUserAdd /> Invite Member
              </button>
            </div>
          )}

          <div className="card">
            {project?.members?.map((m) => (
              <div key={m.id} className="member-item">
                <div className="avatar">
                  {m.user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                </div>
                <div className="member-info">
                  <div className="name">{m.user?.name}</div>
                  <div className="email">{m.user?.email}</div>
                </div>
                <span className={`badge badge-${m.role}`}>{m.role}</span>
                {isAdmin && m.userId !== user?.id && (
                  <button className="btn btn-ghost btn-sm" onClick={() => handleRemoveMember(m.userId)}
                    style={{ color: 'var(--danger)' }}>
                    <HiOutlineTrash />
                  </button>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Create Task Modal */}
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Create Task">
        <form onSubmit={handleCreateTask}>
          <div className="form-group">
            <label className="form-label">Title</label>
            <input className="form-input" value={taskForm.title}
              onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
              required minLength={3} placeholder="Task title" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea className="form-textarea" value={taskForm.description}
              onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
              placeholder="What needs to be done?" rows={3} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Priority</label>
              <select className="form-select" value={taskForm.priority}
                onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Due Date</label>
              <input type="date" className="form-input" value={taskForm.dueDate}
                onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Assign To</label>
            <select className="form-select" value={taskForm.assigneeId}
              onChange={(e) => setTaskForm({ ...taskForm, assigneeId: e.target.value })}>
              <option value="">Unassigned</option>
              {project?.members?.map((m) => (
                <option key={m.userId} value={m.userId}>{m.user?.name} ({m.user?.email})</option>
              ))}
            </select>
          </div>
          <div className="modal-footer" style={{ border: 'none', padding: 0, marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={taskLoading}>
              {taskLoading ? <span className="spinner spinner-sm"></span> : 'Create Task'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Invite Modal */}
      <Modal isOpen={showInviteModal} onClose={() => setShowInviteModal(false)} title="Invite Member">
        <form onSubmit={handleInvite}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-input" value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              required placeholder="user@example.com" />
            <p style={{ fontSize: '0.78rem', color: 'var(--text-tertiary)', marginTop: '4px' }}>
              The user must have an existing account
            </p>
          </div>
          <div className="modal-footer" style={{ border: 'none', padding: 0, marginTop: '16px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setShowInviteModal(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={inviteLoading}>
              {inviteLoading ? <span className="spinner spinner-sm"></span> : 'Send Invite'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Task Detail Modal */}
      <Modal isOpen={!!showTaskDetail} onClose={() => setShowTaskDetail(null)} title="Task Details">
        {showTaskDetail && (
          <div>
            <h3 style={{ marginBottom: '12px' }}>{showTaskDetail.title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
              {showTaskDetail.description || 'No description'}
            </p>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <StatusBadge status={showTaskDetail.status} />
              <PriorityBadge priority={showTaskDetail.priority} />
              {showTaskDetail.isOverdue && <span className="badge badge-overdue">Overdue</span>}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem', marginBottom: '16px' }}>
              <div><strong>Assignee:</strong> {showTaskDetail.assignee?.name || 'Unassigned'}</div>
              <div><strong>Due Date:</strong> {showTaskDetail.dueDate ? new Date(showTaskDetail.dueDate).toLocaleDateString() : '—'}</div>
              <div><strong>Created by:</strong> {showTaskDetail.creator?.name}</div>
            </div>

            {/* Status Change */}
            <div className="form-group">
              <label className="form-label">Change Status</label>
              <select className="form-select" value={showTaskDetail.status}
                onChange={(e) => {
                  handleStatusChange(showTaskDetail.id, e.target.value);
                  setShowTaskDetail({ ...showTaskDetail, status: e.target.value });
                }}>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="done">Done</option>
              </select>
            </div>

            {isAdmin && (
              <button className="btn btn-danger btn-sm" style={{ marginTop: '8px' }}
                onClick={() => handleDeleteTask(showTaskDetail.id)}>
                <HiOutlineTrash /> Delete Task
              </button>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
