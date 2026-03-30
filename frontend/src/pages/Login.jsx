import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      navigate(res.data.role === 'organization' ? '/org/dashboard' : '/client/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally { setLoading(false); }
  };

  const S = {
    page: { minHeight: '100vh', display: 'flex', background: '#020817' },
    left: { width: '42%', padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', borderRight: '1px solid rgba(255,255,255,0.05)', position: 'relative', overflow: 'hidden' },
    right: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' },
    form: { width: '100%', maxWidth: 360 },
    label: { display: 'block', color: '#64748b', fontSize: 11, fontWeight: 600, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.1em' },
    error: { display: 'flex', alignItems: 'center', gap: 8, padding: '12px 16px', borderRadius: 12, marginBottom: 24, fontSize: 13, color: '#f87171', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' },
    check: { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 },
    dot: { width: 20, height: 20, borderRadius: '50%', background: 'rgba(14,165,233,0.15)', border: '1px solid rgba(14,165,233,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
    innerDot: { width: 6, height: 6, borderRadius: '50%', background: '#38bdf8' },
  };

  return (
    <div style={S.page}>
      {/* Left panel — hidden on mobile */}
      <div style={S.left} className="hidden lg:flex lg:flex-col">
        <div className="orb" style={{ width: 400, height: 400, background: 'rgba(14,165,233,0.08)', top: -100, left: -100 }} />
        <Link to="/" className="logo-text" style={{ position: 'relative', zIndex: 1 }}>Flow<span className="logo-q">Q</span></Link>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 48, fontWeight: 900, color: 'white', lineHeight: 1.1, marginBottom: 16 }}>Welcome<br />back.</h2>
          <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: 40, maxWidth: 280 }}>Sign in to manage your queue or check your real-time position.</p>
          {['Real-time queue updates via WebSockets', 'Push notifications when you\'re next', 'Join multiple queues simultaneously'].map(f => (
            <div key={f} style={S.check}>
              <div style={S.dot}><div style={S.innerDot} /></div>
              <span style={{ color: '#94a3b8', fontSize: 13 }}>{f}</span>
            </div>
          ))}
        </div>
        <p style={{ color: '#1e293b', fontSize: 12, position: 'relative', zIndex: 1 }}>© 2025 FlowQ</p>
      </div>

      {/* Right panel */}
      <div style={S.right}>
        <div style={S.form} className="fade-up">
          <div className="lg:hidden" style={{ marginBottom: 40 }}>
            <Link to="/" className="logo-text">Flow<span className="logo-q">Q</span></Link>
          </div>
          <h2 style={{ fontSize: 30, fontWeight: 900, color: 'white', marginBottom: 4 }}>Sign in</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 32 }}>
            No account?{' '}
            <Link to="/register" style={{ color: '#38bdf8', textDecoration: 'none' }}>Create one free</Link>
          </p>

          {error && <div style={S.error}>⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Email address</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="field" placeholder="you@example.com" required />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={S.label}>Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="field" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-primary"
              style={{ width: '100%', padding: '14px', fontSize: 14, gap: 8 }}>
              {loading ? <><div className="spinner" /> Signing in...</> : 'Sign In →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
