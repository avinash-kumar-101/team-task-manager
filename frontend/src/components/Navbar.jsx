import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { HiOutlineSearch, HiOutlineBell, HiOutlineLogout } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || '?';
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      right: 0,
      left: 'var(--sidebar-width)',
      height: 'var(--navbar-height)',
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-secondary)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 28px',
      zIndex: 100,
    }}>
      {/* Search */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        background: 'var(--bg-input)',
        border: '1px solid var(--border-secondary)',
        borderRadius: 'var(--radius-md)',
        padding: '8px 14px',
        flex: '0 1 340px',
      }}>
        <HiOutlineSearch style={{ color: 'var(--text-tertiary)', fontSize: '1rem' }} />
        <input
          type="text"
          placeholder="Search projects, tasks..."
          style={{
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            width: '100%',
            fontFamily: 'var(--font-family)',
          }}
        />
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="btn-ghost btn-icon" style={{ position: 'relative' }}>
          <HiOutlineBell style={{ fontSize: '1.2rem' }} />
          <span style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '7px',
            height: '7px',
            background: 'var(--danger)',
            borderRadius: '50%',
          }}></span>
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 8px',
          borderRadius: 'var(--radius-md)',
          cursor: 'default',
        }}>
          <div className="avatar">{getInitials(user?.name)}</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{user?.name}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{user?.role}</span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn-ghost btn-icon"
          title="Logout"
          style={{ color: 'var(--text-secondary)' }}
        >
          <HiOutlineLogout style={{ fontSize: '1.1rem' }} />
        </button>
      </div>
    </nav>
  );
}
