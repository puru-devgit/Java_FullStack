import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { icon: '📱', title: 'QR Code Joining', desc: 'Clients scan a QR code to join any queue instantly — no app download required.' },
  { icon: '⚡', title: 'Real-Time Updates', desc: 'Queue positions sync live via WebSockets so everyone stays informed.' },
  { icon: '🔔', title: 'Push Notifications', desc: 'Clients get notified the moment it\'s their turn, even in the background.' },
  { icon: '⏱', title: 'Wait Time Estimate', desc: 'A live countdown shows exactly how long until your number is called.' },
  { icon: '🏢', title: 'Multi-Queue Support', desc: 'Join multiple organization queues at the same time from one place.' },
  { icon: '🔒', title: 'Secure by Default', desc: 'JWT authentication and role-based access keep your data protected.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (!user) navigate('/login');
    else if (user.role === 'organization') navigate('/org/dashboard');
    else navigate('/client/home');
  };

  return (
    <div className="page">
      <div className="orb" style={{ width: 700, height: 700, background: 'rgba(14,165,233,0.07)', top: -200, left: -200 }} />
      <div className="orb" style={{ width: 500, height: 500, background: 'rgba(99,102,241,0.06)', bottom: -100, right: -100 }} />

      {/* Navbar */}
      <nav className="navbar">
        <span className="logo-text">Flow<span className="logo-q">Q</span></span>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={() => navigate('/login')} className="btn-ghost" style={{ padding: '8px 20px', fontSize: 14 }}>Sign In</button>
          <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '8px 20px', fontSize: 14 }}>Get Started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 24px 80px' }}>
        <div className="fade-up" style={{ maxWidth: 720, margin: '0 auto' }}>
          <div className="badge badge-blue fade-up" style={{ marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#38bdf8', animation: 'spin 2s linear infinite', display: 'inline-block' }} />
            Smart Queue Management Platform
          </div>

          <h1 className="fade-up-2" style={{ fontSize: 'clamp(48px, 8vw, 88px)', fontWeight: 900, color: 'white', lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24 }}>
            Queue smarter.<br />
            <span style={{ background: 'linear-gradient(135deg,#38bdf8,#818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              Wait less.
            </span>
          </h1>

          <p className="fade-up-3" style={{ color: '#94a3b8', fontSize: 18, lineHeight: 1.7, maxWidth: 520, margin: '0 auto 48px' }}>
            FlowQ lets organizations manage queues digitally. Clients join by scanning a QR code and get real-time updates — no more standing in line.
          </p>

          <div className="fade-up-3" style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 72 }}>
            <button onClick={handleStart} className="btn-primary" style={{ padding: '16px 40px', fontSize: 16 }}>
              Start for Free →
            </button>
            <button onClick={() => navigate('/register')} className="btn-ghost" style={{ padding: '16px 40px', fontSize: 16 }}>
              Register Organization
            </button>
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap', paddingTop: 48, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            {[['Zero', 'App downloads needed'], ['Real-time', 'Queue updates'], ['Instant', 'Push notifications']].map(([val, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: 28, fontWeight: 900, color: 'white', fontFamily: 'Syne, sans-serif' }}>{val}</p>
                <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '0 24px 96px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: 'white', marginBottom: 12 }}>Everything you need</h2>
          <p style={{ color: '#64748b', maxWidth: 400, margin: '0 auto' }}>Built for organizations that value their customers' time.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="card fade-up" style={{ borderRadius: 20, padding: 24, animationDelay: `${i * 0.07}s` }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, marginBottom: 16 }}>
                {f.icon}
              </div>
              <h3 style={{ color: 'white', fontWeight: 700, marginBottom: 8, fontSize: 15 }}>{f.title}</h3>
              <p style={{ color: '#64748b', fontSize: 13, lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '0 24px 96px', maxWidth: 900, margin: '0 auto' }}>
        <div className="card-md" style={{ borderRadius: 28, padding: '64px 48px', textAlign: 'center', border: '1px solid rgba(14,165,233,0.1)', boxShadow: '0 0 60px rgba(14,165,233,0.05)' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: 'white', marginBottom: 12 }}>Ready to get started?</h2>
          <p style={{ color: '#94a3b8', marginBottom: 32, maxWidth: 360, margin: '0 auto 32px' }}>Set up your organization queue in under 2 minutes. Free forever.</p>
          <button onClick={() => navigate('/register')} className="btn-primary" style={{ padding: '16px 40px', fontSize: 16 }}>
            Create Free Account →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ color: '#334155', fontSize: 13 }}>© 2025 <span style={{ color: '#64748b', fontWeight: 500 }}>FlowQ</span> — Smart Queue Management</p>
      </footer>
    </div>
  );
}
