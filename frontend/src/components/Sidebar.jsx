import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineViewGrid,
  HiOutlineFolder,
  HiOutlinePlusCircle,
  HiOutlineCog,
} from 'react-icons/hi';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: HiOutlineViewGrid },
    { path: '/projects', label: 'Projects', icon: HiOutlineFolder },
  ];

  if (user?.role === 'admin') {
    navItems.push({ path: '/projects/new', label: 'New Project', icon: HiOutlinePlusCircle });
  }

  const isActive = (path) => {
    if (path === '/projects') {
      return location.pathname === '/projects';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: 'var(--sidebar-width)',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-secondary)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 200,
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{
        padding: '20px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--border-secondary)',
        height: 'var(--navbar-height)',
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.1rem',
          flexShrink: 0,
        }}>
          ⚡
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', lineHeight: 1.2 }}>TaskFlow</div>
          <div style={{ fontSize: '0.7rem', color: 'var(--text-tertiary)' }}>Team Manager</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '16px 12px', flex: 1 }}>
        <div style={{
          fontSize: '0.68rem',
          fontWeight: 600,
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '0 10px 8px',
        }}>
          Navigation
        </div>

        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 12px',
              borderRadius: 'var(--radius-md)',
              color: isActive(item.path) ? 'var(--text-primary)' : 'var(--text-secondary)',
              background: isActive(item.path) ? 'var(--accent-primary-glow)' : 'transparent',
              fontWeight: isActive(item.path) ? 600 : 400,
              fontSize: '0.9rem',
              marginBottom: '2px',
              transition: 'all 150ms ease',
              textDecoration: 'none',
            }}
          >
            <item.icon style={{
              fontSize: '1.15rem',
              color: isActive(item.path) ? 'var(--accent-primary)' : 'var(--text-tertiary)',
            }} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom user info */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border-secondary)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
      }}>
        <div className="avatar-sm avatar"
          style={{ width: '30px', height: '30px', fontSize: '0.7rem' }}>
          {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.82rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>{user?.name}</div>
          <div style={{
            fontSize: '0.7rem',
            color: 'var(--text-tertiary)',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>{user?.email}</div>
        </div>
      </div>
    </aside>
  );
}
