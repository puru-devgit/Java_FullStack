import React, { useEffect, useRef } from 'react';

const FEATURES = [
  { icon: '⚡', title: 'Instant Join', desc: 'Scan the QR code at any registered location and you\'re in. No downloads required.' },
  { icon: '📍', title: 'Live Position', desc: 'Watch your queue position update in real time — always know exactly where you stand.' },
  { icon: '⏱', title: 'Wait Estimates', desc: 'Smart predictions based on current service speed. Plan your time, not your stress.' },
  { icon: '🔔', title: 'Your-Turn Alerts', desc: 'Get notified the moment you\'re next so you can arrive at exactly the right moment.' },
];

const STATS = [
  { n: '18K+', label: 'Daily Users' },
  { n: '97%',  label: 'On-time Alerts' },
  { n: '< 4s', label: 'Join Time' },
  { n: '340+', label: 'Locations' },
];

export default function Home({ nav }) {
  const tickerRef = useRef(null);

  return (
    <div>
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section style={{
        minHeight: 'calc(100vh - 68px)',
        display: 'flex', alignItems: 'center',
        padding: '4rem 2rem',
        maxWidth: 1200, margin: '0 auto',
        gap: '4rem',
      }}>
        {/* Left copy */}
        <div style={{ flex: '1 1 520px', animation: 'fadeUp 0.7s ease both' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--primary-bg)', border: '1px solid var(--primary-border)',
            borderRadius: 100, padding: '5px 16px', marginBottom: 32,
            fontSize: 12, fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--primary)', display: 'inline-block',
              animation: 'pulse 1.4s ease infinite',
            }} />
            Queue smarter, not harder
          </div>

          <h1 style={{
            fontSize: 'clamp(3rem, 6vw, 5.2rem)',
            fontWeight: 800, letterSpacing: '-2px',
            marginBottom: 24, lineHeight: 1.08,
          }}>
            Skip the wait,<br />
            <em style={{ fontStyle: 'italic', color: 'var(--primary)' }}>not the place.</em>
          </h1>

          <p style={{
            fontSize: 17, color: 'var(--muted)', lineHeight: 1.75,
            maxWidth: 440, marginBottom: 40, fontWeight: 400,
          }}>
            FlowQ replaces physical queues with a live digital system.
            Join from your phone, track your position, and show up right on time.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 56 }}>
            <button onClick={() => nav('login')} style={heroBtn('primary')}>
              Create Free Account →
            </button>
            <button onClick={() => nav('join-queue')} style={heroBtn('outline')}>
              Join a Queue Now
            </button>
          </div>

          {/* Trust row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex' }}>
              {['#E86C3A','#D4622A','#BE5422','#A84718','#923B0E'].map((c, i) => (
                <div key={i} style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: c, border: '2px solid var(--bg)',
                  marginLeft: i === 0 ? 0 : -10,
                  fontSize: 13, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', color: '#fff', fontWeight: 700,
                }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              <strong style={{ color: 'var(--ink)' }}>18,000+</strong> people queued today
            </div>
          </div>
        </div>

        {/* Right — decorative queue card */}
        <div style={{
          flex: '0 0 360px', display: 'flex', flexDirection: 'column', gap: 16,
          animation: 'fadeUp 0.7s 0.2s ease both',
        }}>
          <MockQueueCard position={3} name="Rahul S." location="HDFC Bank, MG Road" wait="~10 min" token="107" />
          <MockQueueCard position={1} name="Priya M." location="AIIMS OPD" wait="You're next!" token="042" highlight />
          <MockQueueCard position={6} name="Arjun K." location="RTO Office" wait="~22 min" token="219" />
        </div>
      </section>

      {/* ── Ticker ─────────────────────────────────────────────────── */}
      <div style={{
        overflow: 'hidden',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        background: 'var(--bg2)',
        padding: '11px 0',
      }}>
        <div style={{ display: 'flex', animation: 'ticker 28s linear infinite', width: 'max-content' }}>
          {Array(4).fill([
            '⚡ Real-time queue tracking',
            '📲 QR code join — 4 seconds',
            '🔔 You\'re-next notifications',
            '⏱ Smart wait estimates',
            '✅ Leave anytime, no hassle',
            '💬 Post-service feedback',
            '📍 340+ registered locations',
          ]).flat().map((t, i) => (
            <span key={i} style={{
              padding: '0 36px', fontSize: 12, fontWeight: 500,
              color: 'var(--muted)', whiteSpace: 'nowrap',
              letterSpacing: '0.03em',
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────────────── */}
      <section style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '5rem 2rem',
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: 2,
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{
            textAlign: 'center', padding: '2rem 1.5rem',
            borderRight: i < STATS.length - 1 ? '1px solid var(--border)' : 'none',
            animation: `fadeUp 0.5s ${i * 0.08}s ease both`,
          }}>
            <div style={{
              fontSize: 'clamp(2.2rem, 4vw, 3rem)', fontWeight: 800,
              fontFamily: 'Playfair Display, serif',
              color: 'var(--primary)', marginBottom: 6,
            }}>{s.n}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {s.label}
            </div>
          </div>
        ))}
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section style={{
        background: 'var(--bg2)',
        borderTop: '1px solid var(--border)',
        borderBottom: '1px solid var(--border)',
        padding: '5rem 2rem',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ marginBottom: 48, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', letterSpacing: '-1px', maxWidth: 480 }}>
              Everything a queue needs —<em style={{ color: 'var(--primary)' }}> and nothing it doesn't.</em>
            </h2>
            <p style={{ maxWidth: 280, color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>
              A focused feature set designed around one goal: getting you in and out as smoothly as possible.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 20 }}>
            {FEATURES.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section style={{ padding: '5rem 2rem', maxWidth: 960, margin: '0 auto' }}>
        <h2 style={{ textAlign: 'center', fontSize: 'clamp(2rem, 4vw, 2.8rem)', letterSpacing: '-1px', marginBottom: 56 }}>
          Three steps. That's it.
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 40 }}>
          {[
            { step: '01', title: 'Register Once', body: 'Create a free account with your name, email, and phone number.' },
            { step: '02', title: 'Scan & Join', body: 'Scan the QR code posted at the location or enter the queue ID manually.' },
            { step: '03', title: 'Arrive on Time', body: 'Watch your position live. Get notified when you\'re up. Walk in, skip the line.' },
          ].map((s, i) => (
            <div key={i} style={{ animation: `fadeUp 0.5s ${i * 0.12}s ease both` }}>
              <div style={{
                fontSize: '3.5rem', fontFamily: 'Playfair Display, serif',
                fontWeight: 800, color: 'var(--border2)', lineHeight: 1, marginBottom: 16,
              }}>{s.step}</div>
              <h3 style={{ fontSize: 18, marginBottom: 10 }}>{s.title}</h3>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.7 }}>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <section style={{
        margin: '0 2rem 4rem',
        maxWidth: 1100, marginLeft: 'auto', marginRight: 'auto',
        background: 'var(--ink)', borderRadius: 20, padding: '4rem 3rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 32,
      }}>
        <div>
          <h2 style={{ color: '#faf7f2', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', letterSpacing: '-1px', marginBottom: 10 }}>
            Done waiting in line?
          </h2>
          <p style={{ color: 'rgba(250,247,242,0.55)', fontSize: 15 }}>Join thousands using FlowQ every day.</p>
        </div>
        <button onClick={() => nav('login')} style={{
          padding: '15px 40px', borderRadius: 10,
          background: 'var(--primary)', border: 'none',
          color: '#fff', fontSize: 15, fontWeight: 700, cursor: 'pointer',
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          transition: 'opacity 0.2s, transform 0.2s',
          whiteSpace: 'nowrap',
        }}
          onMouseOver={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseOut={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = ''; }}
        >
          Get Started Free →
        </button>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '1.8rem 2rem',
        textAlign: 'center',
        color: 'var(--muted2)', fontSize: 12, letterSpacing: '0.03em',
      }}>
        © 2025 FlowQ · Smart Queue Management · Built with care
      </footer>
    </div>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

function heroBtn(type) {
  const base = {
    padding: '13px 28px', borderRadius: 10, fontSize: 14,
    fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s',
    fontFamily: 'Plus Jakarta Sans, sans-serif',
  };
  if (type === 'primary') return {
    ...base, background: 'var(--primary)', color: '#fff', border: 'none',
    boxShadow: '0 4px 18px rgba(212,98,42,0.35)',
  };
  return {
    ...base, background: 'var(--surface)', color: 'var(--ink)',
    border: '1px solid var(--border2)',
  };
}

function MockQueueCard({ position, name, location, wait, token, highlight }) {
  return (
    <div style={{
      background: highlight ? 'var(--ink)' : 'var(--surface)',
      border: highlight ? 'none' : '1px solid var(--border)',
      borderRadius: 14, padding: '16px 18px',
      boxShadow: highlight ? '0 8px 32px rgba(26,18,8,0.18)' : 'var(--shadow-sm)',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 10, flexShrink: 0,
        background: highlight ? 'var(--primary)' : 'var(--bg2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Playfair Display, serif', fontWeight: 800, fontSize: 20,
        color: highlight ? '#fff' : 'var(--primary)',
      }}>{position}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: highlight ? '#faf7f2' : 'var(--ink)', marginBottom: 2 }}>{name}</div>
        <div style={{ fontSize: 11, color: highlight ? 'rgba(250,247,242,0.5)' : 'var(--muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{location}</div>
      </div>

      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{
          fontSize: 11, fontWeight: 700,
          color: highlight ? 'var(--primary)' : 'var(--muted)',
          background: highlight ? 'rgba(212,98,42,0.18)' : 'var(--bg2)',
          borderRadius: 6, padding: '3px 9px', marginBottom: 4,
        }}>{wait}</div>
        <div style={{ fontSize: 10, color: highlight ? 'rgba(250,247,242,0.4)' : 'var(--muted2)' }}>#{token}</div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, delay }) {
  return (
    <div
      style={{
        background: 'var(--surface)', borderRadius: 14,
        border: '1px solid var(--border)', padding: '24px',
        transition: 'transform 0.25s, box-shadow 0.25s, border-color 0.25s',
        animation: `fadeUp 0.5s ${delay}s ease both`, cursor: 'default',
      }}
      onMouseOver={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
        e.currentTarget.style.borderColor = 'var(--primary-border)';
      }}
      onMouseOut={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: 10,
        background: 'var(--primary-bg)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 20, marginBottom: 16,
      }}>{icon}</div>
      <h3 style={{ fontSize: 16, marginBottom: 8 }}>{title}</h3>
      <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>{desc}</p>
    </div>
  );
}