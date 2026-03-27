import React, { useState, useEffect, useRef } from 'react';

export default function QueueStatus({ nav, user, queue }) {
  const [position, setPosition]   = useState(7);
  const [total, setTotal]         = useState(12);
  const [notification, setNotif]  = useState(null);
  const [notifQueue, setNotifQ]   = useState([]);
  const [elapsed, setElapsed]     = useState(0);
  const timerRef  = useRef(null);
  const clockRef  = useRef(null);

  const queueName = queue?.name    || 'HDFC Bank Branch';
  const queueAddr = queue?.address || 'MG Road, Bhubaneswar';
  const token     = String(100 + position).padStart(3, '0');
  const waitMins  = Math.max(0, (position - 1) * 4);

  /* Auto-advance every 5 s */
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setPosition(p => {
        const next = Math.max(1, p - 1);
        if (next === 3) pushNotif('🎯 Almost there! Only 3 people ahead of you.');
        if (next === 1) pushNotif('🔔 You\'re NEXT — please proceed to the counter now!');
        return next;
      });
      setTotal(t => Math.max(1, t - 1));
    }, 5000);

    clockRef.current = setInterval(() => setElapsed(e => e + 1), 1000);

    return () => {
      clearInterval(timerRef.current);
      clearInterval(clockRef.current);
    };
  }, []);

  const pushNotif = (msg) => {
    const id = Date.now();
    setNotifQ(q => [...q, { id, msg }]);
    setNotif({ id, msg });
    setTimeout(() => setNotif(null), 5000);
  };

  const leaveQueue = () => {
    clearInterval(timerRef.current);
    clearInterval(clockRef.current);
    nav('feedback');
  };

  const progress = Math.round(((total - position + 1) / total) * 100);
  const elapsedStr = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', padding: '2.5rem 2rem', background: 'var(--bg)' }}>

      {/* Notification toast */}
      {notification && (
        <div style={{
          position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
          zIndex: 999, minWidth: 320, maxWidth: 440,
          background: 'var(--ink)', borderRadius: 12,
          border: '1px solid rgba(250,247,242,0.1)',
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', gap: 12,
          boxShadow: 'var(--shadow-xl)',
          animation: 'notifDrop 0.4s ease',
        }}>
          <span style={{ fontSize: 20 }}>{notification.msg.split(' ')[0]}</span>
          <span style={{ fontSize: 13, color: '#faf7f2', lineHeight: 1.5 }}>
            {notification.msg.slice(notification.msg.indexOf(' ') + 1)}
          </span>
          <button onClick={() => setNotif(null)} style={{
            marginLeft: 'auto', background: 'none', border: 'none',
            color: 'rgba(250,247,242,0.4)', cursor: 'pointer', fontSize: 18, lineHeight: 1,
          }}>×</button>
        </div>
      )}

      <div style={{ maxWidth: 960, margin: '0 auto' }}>

        {/* Header row */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 16, marginBottom: 32,
          animation: 'fadeUp 0.5s ease both',
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <div style={{ width: 3, height: 28, background: 'var(--primary)', borderRadius: 2 }} />
              <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', letterSpacing: '-1px' }}>Queue Status</h1>
            </div>
            <p style={{ color: 'var(--muted)', fontSize: 14, paddingLeft: 13 }}>
              📍 {queueName} · {queueAddr}
            </p>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'var(--green-bg)', border: '1px solid #a0d4b0',
              borderRadius: 100, padding: '6px 14px', fontSize: 12, fontWeight: 600, color: 'var(--green)',
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', animation: 'pulse 1s infinite', display: 'inline-block' }} />
              Live
            </div>
            <div style={{
              background: 'var(--bg2)', border: '1px solid var(--border)',
              borderRadius: 100, padding: '6px 14px', fontSize: 12, color: 'var(--muted)', fontWeight: 500,
            }}>
              ⏱ {elapsedStr}
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>

          {/* ── Left column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Position hero card */}
            <div style={{
              background: 'var(--ink)', borderRadius: 18, padding: '2rem',
              textAlign: 'center', position: 'relative', overflow: 'hidden',
              animation: 'fadeUp 0.5s 0.1s ease both',
            }}>
              {/* Decorative circle */}
              <div style={{
                position: 'absolute', top: -40, right: -40,
                width: 160, height: 160, borderRadius: '50%',
                background: 'rgba(212,98,42,0.12)',
              }} />
              <div style={{
                position: 'absolute', bottom: -30, left: -30,
                width: 120, height: 120, borderRadius: '50%',
                background: 'rgba(212,98,42,0.08)',
              }} />

              <p style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,247,242,0.45)', marginBottom: 10 }}>
                Your Position
              </p>

              {/* Number */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 14 }}>
                <div style={{ position: 'absolute', inset: -14, borderRadius: '50%', border: '1px solid rgba(212,98,42,0.3)', animation: 'ripple 2s ease infinite' }} />
                <div style={{ position: 'absolute', inset: -7, borderRadius: '50%', border: '1px solid rgba(212,98,42,0.2)' }} />
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: 'var(--primary)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 46, fontWeight: 800, fontFamily: 'Playfair Display, serif',
                  color: '#fff', animation: 'countFlip 0.4s ease',
                }}>{position}</div>
              </div>

              <p style={{ fontSize: 14, color: 'rgba(250,247,242,0.7)', marginBottom: 20 }}>
                {position === 1
                  ? '🎉 Head to the counter now!'
                  : `${position - 1} person${position - 1 !== 1 ? 's' : ''} ahead of you`}
              </p>

              {/* Progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 11 }}>
                  <span style={{ color: 'rgba(250,247,242,0.4)' }}>Queue progress</span>
                  <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{progress}%</span>
                </div>
                <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{
                    height: '100%', background: 'var(--primary)',
                    width: `${progress}%`, borderRadius: 100,
                    transition: 'width 1.2s ease',
                  }} />
                </div>
              </div>
            </div>

            {/* Stats trio */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12,
              animation: 'fadeUp 0.5s 0.2s ease both',
            }}>
              {[
                { label: 'Wait Time',    value: waitMins === 0 ? 'Now!' : `~${waitMins}m`, icon: '⏱',  color: 'var(--amber)',   bg: 'var(--amber-bg)' },
                { label: 'In Queue',     value: total,                                     icon: '👥', color: 'var(--primary)', bg: 'var(--primary-bg)' },
                { label: 'Your Token',   value: `#${token}`,                               icon: '🎫', color: 'var(--green)',   bg: 'var(--green-bg)' },
              ].map((s, i) => (
                <div key={i} style={{
                  background: s.bg, borderRadius: 12,
                  border: '1px solid var(--border)',
                  padding: '14px 10px', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'Playfair Display, serif', color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3, fontWeight: 500, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: 12, animation: 'fadeUp 0.5s 0.4s ease both' }}>
              <button onClick={leaveQueue} style={{
                flex: 1, padding: '13px', borderRadius: 10,
                background: 'transparent', border: '1.5px solid var(--border2)',
                color: 'var(--muted)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                transition: 'border-color 0.2s, color 0.2s',
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)'; }}
              >
                🚪 Leave Queue
              </button>
              <button
                onClick={() => pushNotif('📤 Queue status link sent to your phone!')}
                style={{
                  flex: 1, padding: '13px', borderRadius: 10,
                  background: 'var(--bg2)', border: '1px solid var(--border)',
                  color: 'var(--ink2)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
                  fontFamily: 'Plus Jakarta Sans, sans-serif',
                  transition: 'background 0.2s',
                }}
                onMouseOver={e => e.currentTarget.style.background = 'var(--primary-bg)'}
                onMouseOut={e => e.currentTarget.style.background = 'var(--bg2)'}
              >
                📤 Share Status
              </button>
            </div>
          </div>

          {/* ── Right column ── */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* Queue visualizer */}
            <div style={{
              background: 'var(--surface)', borderRadius: 18,
              border: '1px solid var(--border)', overflow: 'hidden',
              animation: 'fadeUp 0.5s 0.15s ease both',
            }}>
              <div style={{
                padding: '14px 20px', borderBottom: '1px solid var(--border)',
                background: 'var(--bg2)', display: 'flex', alignItems: 'center', gap: 8,
              }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Queue Visualizer</span>
                <span style={{ marginLeft: 'auto', fontSize: 12, color: 'var(--muted)' }}>{total} people</span>
              </div>
              <div style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {[...Array(total)].map((_, i) => {
                    const isMe = i === position - 1;
                    const done = i < position - 1;
                    return (
                      <div
                        key={i}
                        title={isMe ? 'You' : done ? 'Served' : `Position ${i + 1}`}
                        style={{
                          width: 36, height: 36, borderRadius: 9,
                          background: isMe ? 'var(--primary)' : done ? 'var(--green-bg)' : 'var(--bg2)',
                          border: `1.5px solid ${isMe ? 'var(--primary)' : done ? '#a0d4b0' : 'var(--border)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: isMe ? 15 : 11, fontWeight: 700,
                          color: isMe ? '#fff' : done ? 'var(--green)' : 'var(--muted)',
                          fontFamily: 'Playfair Display, serif',
                          transition: 'all 0.4s',
                          transform: isMe ? 'scale(1.12)' : 'scale(1)',
                          boxShadow: isMe ? '0 4px 14px rgba(212,98,42,0.4)' : 'none',
                        }}
                      >
                        {isMe ? '👤' : done ? '✓' : i + 1}
                      </div>
                    );
                  })}
                </div>
                <div style={{ display: 'flex', gap: 16, marginTop: 14, fontSize: 11, color: 'var(--muted)' }}>
                  <span>🟠 You</span>
                  <span>🟢 Served</span>
                  <span>⬜ Waiting</span>
                </div>
              </div>
            </div>

            {/* Activity log */}
            <div style={{
              background: 'var(--surface)', borderRadius: 18,
              border: '1px solid var(--border)', overflow: 'hidden',
              animation: 'fadeUp 0.5s 0.25s ease both',
            }}>
              <div style={{
                padding: '14px 20px', borderBottom: '1px solid var(--border)',
                background: 'var(--bg2)',
              }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Activity</span>
              </div>
              <div style={{ padding: '6px 0' }}>
                {[
                  { icon: '🟢', msg: `You joined ${queueName}`, sub: 'Just now', dot: 'var(--green)' },
                  { icon: '⚡', msg: '2 people served in last 8 min', sub: '3 min ago', dot: 'var(--amber)' },
                  { icon: '📊', msg: 'Avg service time: ~4 min/person', sub: '5 min ago', dot: 'var(--primary)' },
                  { icon: '📍', msg: 'Counter 2 is now open', sub: '7 min ago', dot: 'var(--muted2)' },
                ].map((a, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 12, padding: '12px 20px',
                    borderBottom: i < 3 ? '1px solid var(--border)' : 'none',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: a.dot, marginTop: 5, flexShrink: 0,
                    }} />
                    <div>
                      <p style={{ fontSize: 13, color: 'var(--ink)', fontWeight: 500 }}>{a.msg}</p>
                      <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>{a.sub}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}