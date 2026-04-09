import React, { useState, useEffect } from 'react';

/* ─── Button ─────────────────────────────────────────────── */
export const Button = ({ children, variant = 'primary', size = 'md', loading, disabled, style, ...props }) => {
  const base = {
    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    fontFamily: 'var(--font-body)', fontWeight: 500, border: 'none',
    borderRadius: 'var(--radius-sm)', cursor: disabled || loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.18s', opacity: disabled || loading ? 0.65 : 1,
    padding: size === 'sm' ? '7px 14px' : size === 'lg' ? '13px 28px' : '10px 20px',
    fontSize: size === 'sm' ? 13 : 14,
  };
  const variants = {
    primary: { background: 'var(--accent)', color: '#0b0f1a' },
    secondary: { background: 'var(--bg3)', color: 'var(--text)', border: '1.5px solid var(--border)' },
    danger: { background: 'var(--red)', color: '#fff' },
    ghost: { background: 'transparent', color: 'var(--text2)', border: '1.5px solid var(--border)' },
    success: { background: 'var(--green)', color: '#fff' },
  };
  return (
    <button style={{ ...base, ...variants[variant], ...style }} disabled={disabled || loading} {...props}>
      {loading && <span style={{ width: 14, height: 14, border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.7s linear infinite' }} />}
      {children}
    </button>
  );
};

/* ─── Input ─────────────────────────────────────────────── */
export const Input = ({ label, error, hint, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)' }}>{label}</label>}
    <input style={{ borderColor: error ? 'var(--red)' : undefined }} {...props} />
    {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
    {hint && !error && <span style={{ fontSize: 12, color: 'var(--text3)' }}>{hint}</span>}
  </div>
);

/* ─── Textarea ───────────────────────────────────────────── */
export const Textarea = ({ label, error, rows = 3, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)' }}>{label}</label>}
    <textarea rows={rows} style={{ resize: 'vertical', borderColor: error ? 'var(--red)' : undefined }} {...props} />
    {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
  </div>
);

/* ─── Select ─────────────────────────────────────────────── */
export const Select = ({ label, error, children, ...props }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text2)' }}>{label}</label>}
    <select style={{ borderColor: error ? 'var(--red)' : undefined }} {...props}>{children}</select>
    {error && <span style={{ fontSize: 12, color: 'var(--red)' }}>{error}</span>}
  </div>
);

/* ─── Card ───────────────────────────────────────────────── */
export const Card = ({ children, style, ...props }) => (
  <div style={{
    background: 'var(--surface)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius)', padding: 24, ...style,
  }} {...props}>{children}</div>
);

/* ─── Badge ──────────────────────────────────────────────── */
export const Badge = ({ children, color = 'default' }) => {
  const colors = {
    default: { bg: 'var(--bg3)', text: 'var(--text2)' },
    gold: { bg: 'rgba(245,158,11,0.15)', text: 'var(--accent)' },
    blue: { bg: 'rgba(59,130,246,0.15)', text: 'var(--blue)' },
    green: { bg: 'rgba(16,185,129,0.15)', text: 'var(--green)' },
    red: { bg: 'rgba(239,68,68,0.15)', text: 'var(--red)' },
    purple: { bg: 'rgba(139,92,246,0.15)', text: 'var(--purple)' },
  };
  const c = colors[color] || colors.default;
  return (
    <span style={{
      background: c.bg, color: c.text, borderRadius: 20,
      padding: '3px 10px', fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap',
    }}>{children}</span>
  );
};

/* ─── RoleBadge ──────────────────────────────────────────── */
export const RoleBadge = ({ role }) => {
  const map = { admin: ['gold', 'Admin'], user: ['blue', 'User'], store_owner: ['green', 'Store Owner'] };
  const [color, label] = map[role] || ['default', role];
  return <Badge color={color}>{label}</Badge>;
};

/* ─── StarRating ─────────────────────────────────────────── */
export const StarRating = ({ value, onChange, size = 20, readonly }) => (
  <div style={{ display: 'flex', gap: 4 }}>
    {[1, 2, 3, 4, 5].map((star) => (
      <span key={star}
        onClick={() => !readonly && onChange && onChange(star)}
        style={{
          fontSize: size, color: star <= value ? 'var(--accent)' : 'var(--border)',
          cursor: readonly ? 'default' : 'pointer', transition: 'color 0.15s',
          userSelect: 'none',
        }}>★</span>
    ))}
  </div>
);

/* ─── Table ──────────────────────────────────────────────── */
export const Table = ({ columns, data, onSort, sortBy, sortOrder, loading, emptyMsg = 'No data found' }) => (
  <div style={{ overflowX: 'auto' }}>
    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
      <thead>
        <tr style={{ borderBottom: '1px solid var(--border)' }}>
          {columns.map((col) => (
            <th key={col.key} onClick={() => col.sortable && onSort && onSort(col.key)}
              style={{
                padding: '12px 16px', textAlign: 'left', fontSize: 12, fontWeight: 600,
                color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '0.08em',
                cursor: col.sortable ? 'pointer' : 'default', whiteSpace: 'nowrap',
                userSelect: 'none',
              }}>
              {col.label}
              {col.sortable && sortBy === col.key && (
                <span style={{ marginLeft: 4 }}>{sortOrder === 'ASC' ? '↑' : '↓'}</span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr><td colSpan={columns.length} style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>
            Loading...
          </td></tr>
        ) : data.length === 0 ? (
          <tr><td colSpan={columns.length} style={{ padding: 40, textAlign: 'center', color: 'var(--text3)' }}>
            {emptyMsg}
          </td></tr>
        ) : data.map((row, i) => (
          <tr key={row.id || i} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg3)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            {columns.map((col) => (
              <td key={col.key} style={{ padding: '14px 16px', fontSize: 14, color: 'var(--text)', verticalAlign: 'middle' }}>
                {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

/* ─── Modal ──────────────────────────────────────────────── */
export const Modal = ({ open, onClose, title, children, width = 480 }) => {
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20,
    }} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
        width: '100%', maxWidth: width, maxHeight: '90vh', overflow: 'auto',
        boxShadow: 'var(--shadow-lg)', animation: 'fadeIn 0.2s ease',
      }}>
        <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text3)', fontSize: 22, lineHeight: 1, cursor: 'pointer' }}>×</button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  );
};

/* ─── Toast ──────────────────────────────────────────────── */
let toastCallback = null;
export const toast = {
  success: (msg) => toastCallback && toastCallback({ msg, type: 'success' }),
  error:   (msg) => toastCallback && toastCallback({ msg, type: 'error' }),
  info:    (msg) => toastCallback && toastCallback({ msg, type: 'info' }),
};

export const ToastProvider = () => {
  const [toasts, setToasts] = useState([]);
  useEffect(() => {
    toastCallback = ({ msg, type }) => {
      const id = Date.now();
      setToasts(prev => [...prev, { id, msg, type }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    };
  }, []);

  const colors = { success: 'var(--green)', error: 'var(--red)', info: 'var(--blue)' };
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 10 }}>
      {toasts.map(t => (
        <div key={t.id} style={{
          background: 'var(--surface2)', border: `1px solid ${colors[t.type]}`, borderLeft: `4px solid ${colors[t.type]}`,
          color: 'var(--text)', padding: '12px 18px', borderRadius: 'var(--radius-sm)',
          boxShadow: 'var(--shadow)', fontSize: 14, maxWidth: 320, animation: 'fadeIn 0.25s ease',
        }}>{t.msg}</div>
      ))}
    </div>
  );
};

/* ─── Stat Card ──────────────────────────────────────────── */
export const StatCard = ({ icon, label, value, color = 'var(--accent)' }) => (
  <Card style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
    <div style={{
      width: 52, height: 52, borderRadius: 14, background: `${color}22`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 24, flexShrink: 0,
    }}>{icon}</div>
    <div>
      <div style={{ fontSize: 28, fontWeight: 800, fontFamily: 'var(--font-display)', color }}>{value ?? '—'}</div>
      <div style={{ fontSize: 13, color: 'var(--text2)', marginTop: 2 }}>{label}</div>
    </div>
  </Card>
);
