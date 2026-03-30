import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [role, setRole] = useState('client');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', orgName: '', purpose: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const res = await api.post('/auth/register', { ...form, role });
      if (role === 'organization' && res.data.qrCode) { setQrCode(res.data.qrCode); login(res.data); }
      else { login(res.data); navigate('/client/home'); }
    } catch (err) { setError(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  if (qrCode) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, background: 'var(--bg)' }}>
      <div className="surface-modal up" style={{ padding: '48px 40px', textAlign: 'center', maxWidth: 420, width: '100%' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: 26, color: 'white', marginBottom: 8 }}>You're all set!</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>Share this QR code with clients so they can join your queue instantly.</p>
        <div style={{ background: 'white', borderRadius: 16, padding: 16, display: 'inline-block', marginBottom: 28 }}>
          <img src={qrCode} alt="QR" style={{ width: 200, height: 200, display: 'block' }} />
        </div>
        <button onClick={() => navigate('/org/dashboard')} className="btn btn-blue" style={{ width: '100%', padding: '12px', fontSize: 14 }}>
          Go to Dashboard →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>
      {/* Left panel */}
      <div className="hidden lg:flex" style={{ width: '44%', flexDirection: 'column', justifyContent: 'space-between', padding: 48, borderRight: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
        <div className="orb" style={{ width: 500, height: 500, background: 'rgba(139,92,246,0.07)', top: -150, right: -150 }} />
        <Link to="/" className="logo" style={{ position: 'relative', zIndex: 1 }}>Flow<span>Q</span></Link>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: 44, color: 'white', marginBottom: 16 }}>Join FlowQ<br />today.</h2>
          <p style={{ color: '#64748b', lineHeight: 1.7, marginBottom: 40, maxWidth: 300, fontSize: 15 }}>
            Whether you manage queues or wait in them — FlowQ makes it seamless.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[{ t: 'Organizations', d: 'Dashboard + QR code' }, { t: 'Clients', d: 'Scan & join queues' }].map(item => (
              <div key={item.t} className="surface" style={{ padding: 16, borderRadius: 14 }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: 'rgba(59,130,246,0.15)', marginBottom: 8 }} />
                <div style={{ fontSize: 13, fontWeight: 600, color: 'white', marginBottom: 4 }}>{item.t}</div>
                <div style={{ fontSize: 12, color: '#64748b' }}>{item.d}</div>
              </div>
            ))}
          </div>
        </div>
        <p style={{ color: '#1e293b', fontSize: 12, position: 'relative', zIndex: 1 }}>© 2025 FlowQ</p>
      </div>

      {/* Right panel */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', overflowY: 'auto' }}>
        <div className="up" style={{ width: '100%', maxWidth: 360 }}>
          <div className="lg:hidden" style={{ marginBottom: 40 }}>
            <Link to="/" className="logo">Flow<span>Q</span></Link>
          </div>

          <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ fontSize: 13, padding: '6px 0', marginBottom: 24, alignSelf: 'flex-start', gap: 6 }}>
            ← Back
          </button>

          <h2 style={{ fontSize: 28, color: 'white', marginBottom: 6 }}>Create account</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
            Already have one?{' '}
            <Link to="/login" style={{ color: '#60a5fa', textDecoration: 'none', fontWeight: 500 }}>Sign in</Link>
          </p>

          {/* Role toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 12, padding: 4, marginBottom: 24 }}>
            {[{ v: 'client', l: 'Client' }, { v: 'organization', l: 'Organization' }].map(r => (
              <button key={r.v} onClick={() => setRole(r.v)} className="btn"
                style={{ flex: 1, padding: '9px 8px', fontSize: 13, borderRadius: 8, transition: 'all 0.15s',
                  ...(role === r.v ? { background: '#3b82f6', color: 'white', boxShadow: '0 2px 8px rgba(59,130,246,0.4)' } : { background: 'transparent', color: '#64748b' }) }}>
                {r.l}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderRadius: 10, marginBottom: 20, fontSize: 13, color: '#fca5a5', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
              <span>⚠</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {role === 'organization' && <>
              <F label="Organization name" field="orgName" placeholder="e.g. City Hospital" form={form} setForm={setForm} />
              <F label="Purpose" field="purpose" placeholder="e.g. Hospital, Bank, Clinic" form={form} setForm={setForm} />
            </>}
            <F label="Full name" field="name" placeholder="Your full name" form={form} setForm={setForm} />
            <F label="Email address" field="email" type="email" placeholder="you@example.com" form={form} setForm={setForm} />
            <F label="Phone number" field="phone" placeholder="+91 00000 00000" form={form} setForm={setForm} />
            <F label="Password" field="password" type="password" placeholder="Min. 8 characters" form={form} setForm={setForm} />
            <button type="submit" disabled={loading} className="btn btn-blue" style={{ padding: '12px', marginTop: 4, fontSize: 14 }}>
              {loading ? <><div className="spin" /> Creating...</> : role === 'organization' ? 'Create organization →' : 'Create account →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function F({ label, field, type = 'text', placeholder, form, setForm }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input type={type} value={form[field]} placeholder={placeholder}
        onChange={e => setForm({ ...form, [field]: e.target.value })}
        className="input" required />
    </div>
  );
}
