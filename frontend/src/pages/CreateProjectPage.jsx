import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProjectApi } from '../api/project.api';
import toast from 'react-hot-toast';

export default function CreateProjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createProjectApi({ name, description });
      toast.success('Project created successfully!');
      navigate(`/projects/${res.data.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container" style={{ maxWidth: '640px' }}>
      <div className="page-header">
        <div>
          <h1>🚀 New Project</h1>
          <p className="page-subtitle">Create a new project to organize your team's work</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="project-name">Project Name</label>
            <input
              id="project-name"
              type="text"
              className="form-input"
              placeholder="E.g., Mobile App Redesign"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              minLength={3}
              maxLength={150}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="project-description">Description</label>
            <textarea
              id="project-description"
              className="form-textarea"
              placeholder="What's this project about?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
            <button type="submit" className="btn btn-primary" disabled={loading} id="create-project-submit">
              {loading ? <span className="spinner spinner-sm"></span> : 'Create Project'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/projects')}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
