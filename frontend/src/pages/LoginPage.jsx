import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginApi } from '../api/auth.api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi({ email, password });
      const { user, token } = res.data.data;
      login(user, token);
      toast.success(`Welcome back, ${user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <h1>TaskFlow</h1>
        </div>

        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account to continue</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg w-full"
            disabled={loading}
            id="login-submit"
            style={{ marginTop: '8px' }}
          >
            {loading ? <span className="spinner spinner-sm"></span> : 'Sign In'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </div>

        {/* Demo credentials */}
        <div style={{
          marginTop: '20px',
          padding: '14px',
          background: 'var(--bg-elevated)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.78rem',
          color: 'var(--text-secondary)',
        }}>
          <div style={{ fontWeight: 600, marginBottom: '6px', color: 'var(--text-primary)' }}>
            🧪 Demo Credentials
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            <span><strong>Admin:</strong> admin@teamtask.com / Admin@123</span>
            <span><strong>Member:</strong> member@teamtask.com / Member@123</span>
          </div>
        </div>
      </div>
    </div>
  );
}
