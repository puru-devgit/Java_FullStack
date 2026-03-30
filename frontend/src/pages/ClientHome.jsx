import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function ClientHome() {
  const { user, logout } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const scannerRef = useRef(null);
  const isRunning = useRef(false);
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${user?.token}` };

  const fetchQueues = useCallback(async () => {
    try { const res = await api.get('/queue/my-queues', { headers }); setQueues(res.data.queues); }
    catch (e) { console.error(e); } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchQueues(); }, [fetchQueues]);

  useEffect(() => {
    if (!scanning) return;
    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;
    scanner.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 250, height: 250 } },
      (text) => {
        if (!isRunning.current) return;
        isRunning.current = false;
        scanner.stop().then(() => {
          setScanning(false);
          let token = null;
          try { const u = new URL(text); const p = u.pathname.split('/join/'); if (p.length > 1) token = p[1].trim(); }
          catch { token = text.includes('/join/') ? text.split('/join/').pop().trim() : text.trim(); }
          if (token) navigate(`/join/${token}`); else setError('Could not read QR code.');
        }).catch(() => {});
      }, () => {}
    ).then(() => { isRunning.current = true; })
     .catch(() => { setError('Camera access denied.'); setScanning(false); });
    return () => { if (isRunning.current) { isRunning.current = false; scanner.stop().catch(() => {}); } };
  }, [scanning]);

  const stopScanning = () => {
    if (isRunning.current) { isRunning.current = false; scannerRef.current?.stop().catch(() => {}); }
    setScanning(false);
  };

  const S = {
    qCard: { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.15s' },
  };

  return (
    <div className="page" style={{ paddingTop: 60 }}>
      <nav className="nav">
        <span className="logo">Flow<span>Q</span></span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ color: '#475569', fontSize: 14 }}>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn btn-outline" style={{ padding: '7px 14px', fontSize: 13 }}>Sign out</button>
        </div>
      </nav>

      <div style={{ maxWidth: 520, margin: '0 auto', padding: '32px 24px' }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 14px', borderRadius: 10, marginBottom: 20, fontSize: 13, color: '#fca5a5', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.18)' }}>
            ⚠ {error} <button onClick={() => setError('')} style={{ marginLeft: 'auto', color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', fontSize: 12 }}>Dismiss</button>
          </div>
        )}

        {/* Active queues */}
        {!loading && queues.length > 0 && (
          <div className="up" style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active Queues</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {queues.map(q => (
                <div key={q.orgId} style={S.qCard}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'; e.currentTarget.style.background = 'rgba(255,255,255,0.025)'; }}
                  onClick={() => navigate(`/queue/${q.orgId}`)}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.15)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{q.orgName}</div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{q.purpose}</div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: '#60a5fa', letterSpacing: '-0.03em', lineHeight: 1 }}>{q.position}</div>
                    <div style={{ fontSize: 11, color: '#475569', marginTop: 2 }}>ahead</div>
                    {q.position > 0 && <div style={{ fontSize: 11, color: '#334155', marginTop: 1 }}>~{q.position * 2}m</div>}
                  </div>
                  <span style={{ color: '#334155', fontSize: 16 }}>›</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scan */}
        {!scanning ? (
          <div className="up">
            {queues.length === 0 && !loading && (
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)', margin: '0 auto 16px' }} />
                <div style={{ fontSize: 20, fontWeight: 700, color: 'white', marginBottom: 8 }}>Join a Queue</div>
                <div style={{ fontSize: 14, color: '#64748b', maxWidth: 280, margin: '0 auto', lineHeight: 1.6 }}>Scan an organization's QR code to join their queue instantly.</div>
              </div>
            )}
            <button onClick={() => { setError(''); setScanning(true); }} className="btn btn-blue"
              style={{ width: '100%', padding: '14px', fontSize: 15 }}>
              {queues.length > 0 ? 'Scan Another QR Code' : 'Scan QR Code'}
            </button>
          </div>
        ) : (
          <div className="up surface-raised" style={{ overflow: 'hidden', padding: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'white' }}>Scanning QR Code</span>
              <button onClick={stopScanning} className="btn btn-ghost" style={{ fontSize: 13, padding: '4px 8px' }}>✕ Cancel</button>
            </div>
            <div id="qr-reader" style={{ width: '100%' }} />
            <p style={{ textAlign: 'center', padding: '12px', fontSize: 12, color: '#475569' }}>Point your camera at the organization's QR code</p>
          </div>
        )}
      </div>
    </div>
  );
}
