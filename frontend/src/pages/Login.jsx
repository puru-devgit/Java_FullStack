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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex" style={{ width: '44%', flexDirection: 'column', justifyContent: 'space-between', padding: 48, borderRight: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: 500, height: 500, background: 'rgba(59,130,246,0.07)', top: -150, left: -150 }} />
        <Link to="/" className="logo" style={{ position: 'relative', zIndex: 1 }}>Flow<span>Q</span></Link>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 44, color: 'white', marginBottom: 16 }}>Good to<br />see you.</h2>
          <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: 40, maxWidth: 300, fontSize: 15 }}>
            Sign in to manage your queue or track your position in real time.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Real-time queue updates', 'Push notifications when you\'re next', 'Multi-queue support'].map(f => (
              <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa' }} />
                </div>
                <span style={{ color: '#94a3b8', fontSize: 13 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color: '#1e293b', fontSize: 12, position: 'relative', zIndex: 1 }}>© 2025 FlowQ</p>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px' }}>
        <div className="up" style={{ width: '100%', maxWidth: 360 }}>
          <div className="lg:hidden" style={{ marginBottom: 40 }}>
            <Link to="/" className="logo">Flow<span>Q</span></Link>
          </div>

          <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 0', marginBottom: 24, alignSelf: 'flex-start', gap: 6 }}>
            ← Back
          </button>

          <h2 style={{ fontSize: 28, color: 'white', marginBottom: 6 }}>Sign in</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 500 }}>Create one</Link>
          </p>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderRadius: 10, marginBottom: 20, fontSize: 13, color: '#fca5a5', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label className="label">Email address</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="input" placeholder="you@example.com" required />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                className="input" placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn btn-blue" style={{ padding: '12px', marginTop: 4, fontSize: 14 }}>
              {loading ? <><div className="spin" /> Signing in...</> : 'Sign in →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
