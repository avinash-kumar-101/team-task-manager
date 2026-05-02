import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '6rem', marginBottom: '16px', opacity: 0.3 }}>🔍</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '8px' }}>404</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '24px' }}>
        The page you're looking for doesn't exist
      </p>
      <Link to="/dashboard" className="btn btn-primary">
        Go to Dashboard
      </Link>
    </div>
  );
}
