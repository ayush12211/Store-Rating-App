import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Button } from './index';

const navItems = {
  admin: [
    { label: 'Dashboard', icon: '⬡', path: '/admin/dashboard' },
    { label: 'Users', icon: '👥', path: '/admin/users' },
    { label: 'Stores', icon: '🏪', path: '/admin/stores' },
  ],
  user: [
    { label: 'Stores', icon: '🏪', path: '/user/stores' },
    { label: 'Settings', icon: '⚙️', path: '/user/settings' },
  ],
  store_owner: [
    { label: 'Dashboard', icon: '⬡', path: '/owner/dashboard' },
    { label: 'Settings', icon: '⚙️', path: '/owner/settings' },
  ],
};

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const items = navItems[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: collapsed ? 64 : 220, flexShrink: 0,
        background: 'var(--bg2)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column',
        transition: 'width 0.25s', overflow: 'hidden',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{
          padding: collapsed ? '20px 0' : '24px 20px',
          borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 10,
          justifyContent: collapsed ? 'center' : 'flex-start',
        }}>
          <span style={{ fontSize: 22 }}>★</span>
          {!collapsed && (
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 17, color: 'var(--accent)' }}>
              StoreRate
            </span>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
          {items.map((item) => {
            const active = location.pathname === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center',
                  gap: 10, padding: collapsed ? '11px 0' : '11px 14px',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  background: active ? 'rgba(245,158,11,0.12)' : 'transparent',
                  border: active ? '1px solid rgba(245,158,11,0.25)' : '1px solid transparent',
                  borderRadius: 'var(--radius-sm)', color: active ? 'var(--accent)' : 'var(--text2)',
                  fontWeight: active ? 600 : 400, fontSize: 14,
                  cursor: 'pointer', transition: 'all 0.15s', width: '100%',
                }}>
                <span style={{ fontSize: 17 }}>{item.icon}</span>
                {!collapsed && item.label}
              </button>
            );
          })}
        </nav>

        {/* User info + logout */}
        <div style={{ padding: '12px 8px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {!collapsed && user && (
            <div style={{ padding: '8px 14px' }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 2, textTransform: 'capitalize' }}>{user.role.replace('_', ' ')}</div>
            </div>
          )}
          <button onClick={handleLogout} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            justifyContent: collapsed ? 'center' : 'flex-start',
            padding: collapsed ? '10px 0' : '10px 14px',
            background: 'transparent', border: '1px solid transparent',
            borderRadius: 'var(--radius-sm)', color: 'var(--red)',
            cursor: 'pointer', fontSize: 14, width: '100%', transition: 'all 0.15s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span>🚪</span>{!collapsed && 'Log out'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto', background: 'var(--bg)' }}>
        {/* Top bar */}
        <div style={{
          padding: '14px 24px', borderBottom: '1px solid var(--border)',
          background: 'var(--bg2)', display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <button onClick={() => setCollapsed(c => !c)} style={{
            background: 'none', border: 'none', color: 'var(--text2)',
            fontSize: 18, cursor: 'pointer', padding: 4, borderRadius: 6,
          }}>☰</button>
          <span style={{ color: 'var(--text3)', fontSize: 13 }}>
            {items.find(i => i.path === location.pathname)?.label || 'Page'}
          </span>
        </div>
        <div style={{ padding: 28 }}>{children}</div>
      </main>
    </div>
  );
}
