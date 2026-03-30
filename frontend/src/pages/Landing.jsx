import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FEATURES = [
  { title: 'Real-Time Updates', desc: 'Queue positions sync instantly via WebSockets. No refresh needed.' },
  { title: 'QR Code Joining', desc: 'Clients scan once and join — no app, no signup friction.' },
  { title: 'Push Notifications', desc: 'Get alerted the moment it\'s your turn, even with the tab closed.' },
  { title: 'Live Wait Estimate', desc: 'A countdown timer shows exactly how long until you\'re called.' },
  { title: 'Multi-Queue', desc: 'Join several organization queues simultaneously from one screen.' },
  { title: 'Secure Auth', desc: 'JWT tokens and role-based access protect every endpoint.' },
];

const HOW = [
  { step: '01', title: 'Register your org', desc: 'Create an organization account and get your unique QR code instantly.' },
  { step: '02', title: 'Share the QR', desc: 'Display it at your counter, on a screen, or send it digitally.' },
  { step: '03', title: 'Clients join & wait', desc: 'They scan, join, and track their position from anywhere.' },
  { step: '04', title: 'Serve & notify', desc: 'Click Mark Served — the next person gets a push notification.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const go = () => {
    if (!user) navigate('/login');
    else navigate(user.role === 'organization' ? '/org/dashboard' : '/client/home');
  };

  return (
    <div className="page">
      {/* Background */}
      <div className="orb" style={{ width: 800, height: 800, background: 'rgba(59,130,246,0.06)', top: -300, left: -200 }} />
      <div className="orb" style={{ width: 600, height: 600, background: 'rgba(139,92,246,0.05)', bottom: -200, right: -100 }} />

      {/* Nav */}
      <nav className="nav">
        <span className="logo">Flow<span>Q</span></span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => navigate('/login')} className="btn btn-outline" style={{ padding: '7px 16px' }}>Sign in</button>
          <button onClick={() => navigate('/register')} className="btn btn-blue" style={{ padding: '7px 16px' }}>Get started</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '100px 24px 80px' }}>
        <div className="badge badge-blue up" style={{ marginBottom: 24 }}>
          <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#60a5fa', display: 'inline-block' }} />
          Queue management, reimagined
        </div>

        <h1 className="up-1" style={{ fontSize: 'clamp(44px,7vw,84px)', color: 'white', maxWidth: 800, margin: '0 auto 24px' }}>
          The smarter way<br />
          <span style={{ background: 'linear-gradient(135deg,#60a5fa 0%,#a78bfa 50%,#f472b6 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            to manage queues
          </span>
        </h1>

        <p className="up-2" style={{ color: '#64748b', fontSize: 18, maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.7 }}>
          FlowQ replaces physical lines with a digital queue system. Clients join by scanning a QR code and get notified when it's their turn.
        </p>

        <div className="up-3" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}>
          <button onClick={go} className="btn btn-blue" style={{ padding: '13px 32px', fontSize: 15 }}>
            Start for free →
          </button>
          <button onClick={() => navigate('/register')} className="btn btn-outline" style={{ padding: '13px 32px', fontSize: 15 }}>
            Register organization
          </button>
        </div>

        {/* Social proof strip */}
        <div className="up-4" style={{ display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap', paddingTop: 40, borderTop: '1px solid rgba(255,255,255,0.05)', width: '100%', maxWidth: 600 }}>
          {[['Zero', 'App downloads'], ['Real-time', 'Live updates'], ['Instant', 'Notifications']].map(([v, l]) => (
            <div key={l} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{v}</div>
              <div style={{ fontSize: 13, color: '#475569', marginTop: 4 }}>{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="badge badge-purple" style={{ marginBottom: 16 }}>Features</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', color: 'white', marginBottom: 12 }}>Built for real workflows</h2>
          <p style={{ color: '#64748b', maxWidth: 420, margin: '0 auto' }}>Everything you need to run a smooth, professional queue operation.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: 12 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title} className="surface up" style={{ padding: '24px', animationDelay: `${i * 0.06}s`, transition: 'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.25)', marginBottom: 14 }} />
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 100px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 60 }}>
          <div className="badge badge-green" style={{ marginBottom: 16 }}>How it works</div>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', color: 'white' }}>Up and running in minutes</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 24 }}>
          {HOW.map((h, i) => (
            <div key={h.step} className="up" style={{ animationDelay: `${i * 0.08}s` }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#3b82f6', letterSpacing: '0.1em', marginBottom: 12 }}>{h.step}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 8 }}>{h.title}</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{h.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '0 24px 100px', maxWidth: 800, margin: '0 auto' }}>
        <div className="surface-raised" style={{ padding: '64px 48px', textAlign: 'center', borderColor: 'rgba(59,130,246,0.15)', boxShadow: '0 0 80px rgba(59,130,246,0.06)' }}>
          <h2 style={{ fontSize: 'clamp(28px,4vw,40px)', color: 'white', marginBottom: 12 }}>Ready to eliminate the wait?</h2>
          <p style={{ color: '#64748b', marginBottom: 32, maxWidth: 360, margin: '0 auto 32px' }}>Set up your organization queue in under 2 minutes. Free forever.</p>
          <button onClick={() => navigate('/register')} className="btn btn-blue" style={{ padding: '13px 32px', fontSize: 15 }}>
            Create free account →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 1, padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p style={{ color: '#1e293b', fontSize: 13 }}>© 2025 <span style={{ color: '#334155' }}>FlowQ</span></p>
      </footer>
    </div>
  );
}
