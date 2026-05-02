import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listProjectsApi } from '../api/project.api';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/Spinner';
import EmptyState from '../components/EmptyState';
import { HiOutlineFolder, HiOutlineUsers, HiOutlineClipboardList } from 'react-icons/hi';

export default function ProjectListPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await listProjectsApi();
        setProjects(res.data.data);
      } catch (err) {
        console.error('Error loading projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1><HiOutlineFolder /> Projects</h1>
          <p className="page-subtitle">{projects.length} project{projects.length !== 1 ? 's' : ''} in your workspace</p>
        </div>
        {user?.role === 'admin' && (
          <button className="btn btn-primary" onClick={() => navigate('/projects/new')} id="new-project-btn">
            + New Project
          </button>
        )}
      </div>

      {projects.length === 0 ? (
        <EmptyState
          icon="📁"
          title="No projects yet"
          message="Create your first project to start organizing your team's work"
          action={
            user?.role === 'admin' && (
              <button className="btn btn-primary" onClick={() => navigate('/projects/new')}>
                Create Project
              </button>
            )
          }
        />
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '16px',
        }}>
          {projects.map((project) => (
            <div
              key={project.id}
              className="card"
              onClick={() => navigate(`/projects/${project.id}`)}
              style={{ cursor: 'pointer' }}
              id={`project-${project.id}`}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: 'var(--radius-md)',
                  background: `linear-gradient(135deg, hsl(${project.name.length * 37 % 360}, 60%, 50%), hsl(${project.name.length * 37 % 360 + 40}, 60%, 40%))`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.1rem',
                  color: 'white',
                  fontWeight: 700,
                  flexShrink: 0,
                }}>
                  {project.name.charAt(0).toUpperCase()}
                </div>
              </div>

              <h3 style={{ fontSize: '1.05rem', marginBottom: '6px' }}>{project.name}</h3>
              <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.82rem',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                marginBottom: '16px',
                minHeight: '38px',
              }}>
                {project.description || 'No description'}
              </p>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                paddingTop: '12px',
                borderTop: '1px solid var(--border-secondary)',
                fontSize: '0.8rem',
                color: 'var(--text-tertiary)',
              }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <HiOutlineUsers /> {project._count?.members || 0} members
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <HiOutlineClipboardList /> {project._count?.tasks || 0} tasks
                </span>
                <span style={{ marginLeft: 'auto', fontSize: '0.75rem' }}>
                  by {project.owner?.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
