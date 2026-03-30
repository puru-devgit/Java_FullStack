import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const MINS = 2;

function useCountdown(position) {
  const [secs, setSecs] = useState(position * MINS * 60);
  useEffect(() => { setSecs(position * MINS * 60); }, [position]);
  useEffect(() => {
    if (secs <= 0) return;
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secs]);
  const m = Math.floor(secs / 60), s = secs % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export default function QueueStatus() {
  const { orgId } = useParams();
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [isNext, setIsNext] = useState(false);
  const [notification, setNotification] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const socketRef = useRef(null);
  const navigate = useNavigate();
  const countdown = useCountdown(status?.position ?? 0);
  const headers = useMemo(() => ({ Authorization: `Bearer ${user?.token}` }), [user?.token]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await api.get(`/queue/status/${orgId}`, { headers });
      setStatus(res.data);
      if (res.data.position === 0 && res.data.inQueue) setIsNext(true);
    } catch (e) { console.error(e); }
  }, [orgId, headers]);

  const handleLeave = async () => {
    setLeaving(true);
    try { await api.post(`/queue/leave/${orgId}`, {}, { headers }); navigate('/client/home'); }
    catch (e) { console.error(e); setLeaving(false); }
  };

  useEffect(() => {
    fetchStatus();
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(async (reg) => {
        const { data } = await api.get('/push/vapid-public-key');
        const toUint8 = b => {
          const pad = '='.repeat((4 - b.length % 4) % 4);
          const base64 = (b + pad).replace(/-/g, '+').replace(/_/g, '/');
          return Uint8Array.from([...atob(base64)].map(c => c.charCodeAt(0)));
        };
        const sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: toUint8(data.publicKey) });
        await api.post('/push/subscribe', { subscription: sub }, { headers });
      }).catch(() => {});
    }
    const socket = io('http://localhost:5001');
    socketRef.current = socket;
    const userId = user?.userId || localStorage.getItem('userId');
    socket.emit('join_client_room', userId);
    socket.on('queue_updated', fetchStatus);
    socket.on('you_are_next', () => {
      setIsNext(true); setNotification(true);
      setTimeout(() => setNotification(false), 6000);
    });
    const interval = setInterval(fetchStatus, 10000);
    return () => { socket.disconnect(); clearInterval(interval); };
  }, [fetchStatus, user?.userId]);

  if (!status) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spin" style={{ margin: '0 auto 16px', width: 28, height: 28 }} />
        <p style={{ color: '#475569', fontSize: 14 }}>Loading queue status...</p>
      </div>
    </div>
  );

  if (!status.inQueue) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="surface-modal up" style={{ padding: '48px 40px', textAlign: 'center', maxWidth: 380, width: '100%' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: 24, color: 'white', marginBottom: 8 }}>You've been served!</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28 }}>Thank you for using FlowQ.</p>
        <button onClick={() => navigate('/client/home')} className="btn btn-blue" style={{ width: '100%', padding: '12px', fontSize: 14 }}>
          Back to Home
        </button>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav className="nav">
        <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ fontSize: 14, gap: 6 }}>
          ← Back
        </button>
        <span className="logo">Flow<span>Q</span></span>
      </nav>

      {/* Toast */}
      {notification && (
        <div className="slide-down" style={{
          position: 'fixed', top: 72, left: '50%', zIndex: 200,
          background: '#16a34a', color: 'white', padding: '12px 24px',
          borderRadius: 12, fontWeight: 600, fontSize: 14,
          boxShadow: '0 8px 32px rgba(22,163,74,0.4)',
          transform: 'translateX(-50%)',
        }}>
          You are next — please proceed to the counter
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px 40px' }}>
        <div className="up" style={{ width: '100%', maxWidth: 380 }}>

          {/* Position circle */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
            <div style={{ position: 'relative' }}>
              {isNext && (
                <>
                  <div className="ring" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(34,197,94,0.08)' }} />
                  <div className="ring-2" style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(34,197,94,0.05)' }} />
                </>
              )}
              <div style={{
                width: 160, height: 160, borderRadius: '50%',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                position: 'relative', zIndex: 1,
                background: isNext ? 'rgba(34,197,94,0.08)' : 'rgba(59,130,246,0.06)',
                border: `2px solid ${isNext ? 'rgba(34,197,94,0.35)' : 'rgba(59,130,246,0.25)'}`,
                boxShadow: isNext ? '0 0 40px rgba(34,197,94,0.12)' : '0 0 40px rgba(59,130,246,0.08)',
              }}>
                <span style={{ fontSize: 52, fontWeight: 900, color: 'white', letterSpacing: '-0.04em', lineHeight: 1 }}>{status.position}</span>
                <span style={{ fontSize: 11, color: '#475569', marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  {status.position === 1 ? 'person' : 'people'} ahead
                </span>
              </div>
            </div>
          </div>

          {/* Status text */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <h2 style={{ fontSize: 22, color: isNext ? '#86efac' : 'white', marginBottom: 6 }}>
              {isNext ? "You're Next" : "You're in the Queue"}
            </h2>
            <p style={{ color: '#64748b', fontSize: 14 }}>
              {isNext ? 'Please proceed to the counter now'
                : `${status.position} ${status.position === 1 ? 'person is' : 'people are'} ahead of you`}
            </p>
          </div>

          {/* Info cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
            {!isNext && status.position > 0 && (
              <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Estimated Wait</div>
                  <div style={{ fontSize: 24, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{countdown}</div>
                </div>
                <div style={{ fontSize: 11, color: '#334155' }}>min : sec</div>
              </div>
            )}

            {isNext && (
              <div style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.18)', borderRadius: 12, padding: '14px 18px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#86efac' }}>Please approach the counter now</div>
              </div>
            )}

            <div style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: '16px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Your Position</div>
                <div style={{ fontSize: 18, fontWeight: 700, color: 'white' }}>#{status.position + 1} in line</div>
              </div>
            </div>
          </div>

          {!isNext && (
            <button onClick={handleLeave} disabled={leaving} className="btn btn-danger" style={{ width: '100%', padding: '12px', fontSize: 14 }}>
              {leaving ? <><div className="spin" /> Leaving...</> : 'Leave Queue'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
