import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export default function OrgHome() {
  const { user, logout } = useAuth();
  const [data, setData] = useState({ org: null, queue: [], totalInQueue: 0 });
  const [serving, setServing] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const initRef = useRef(false);
  const socketRef = useRef(null);
  const headers = useMemo(() => ({ Authorization: `Bearer ${user?.token}` }), [user?.token]);

  const fetchData = useCallback(async () => {
    if (!user?.token) return;
    try {
      const res = await api.get('/org/dashboard', { headers });
      setData(res.data);
      if (!socketRef.current) {
        socketRef.current = io('http://localhost:5001');
        socketRef.current.emit('join_org_room', res.data.org._id);
        socketRef.current.on('queue_updated', ({ queue }) =>
          setData(p => ({ ...p, queue, totalInQueue: queue.length })));
      }
    } catch (e) { console.error(e); }
  }, [headers, user?.token]);

  useEffect(() => {
    if (!user?.token || initRef.current) return;
    initRef.current = true; fetchData();
    return () => { socketRef.current?.disconnect(); socketRef.current = null; };
  }, [fetchData, user?.token]);

  const handleServe = async () => {
    setServing(true);
    try { await api.post('/org/serve', {}, { headers }); await fetchData(); }
    catch (e) { console.error(e); }
    setServing(false);
  };

  const S = {
    stat: { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '20px 20px 16px' },
    row: { background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 14, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 14, transition: 'border-color 0.15s' },
  };

  return (
    <div className="page" style={{ paddingTop: 60 }}>
      {/* Nav */}
      <nav className="nav">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="logo">Flow<span>Q</span></span>
          {data.org?.name && <>
            <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: 18 }}>/</span>
            <span style={{ color: '#64748b', fontSize: 14, fontWeight: 500 }}>{data.org.name}</span>
          </>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowQR(!showQR)} className="btn btn-outline" style={{ padding: '7px 14px', fontSize: 13 }}>
            {showQR ? 'Hide QR' : 'Show QR'}
          </button>
          <button onClick={logout} className="btn btn-danger" style={{ padding: '7px 14px', fontSize: 13 }}>Logout</button>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header */}
        <div className="up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, color: 'white', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: '#475569', fontSize: 14 }}>Manage your live queue</p>
        </div>

        {/* QR Panel */}
        {showQR && data.org?.qrCode && (
          <div className="up" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 16, padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ background: 'white', borderRadius: 12, padding: 10, flexShrink: 0 }}>
              <img src={data.org.qrCode} alt="QR" style={{ width: 88, height: 88, display: 'block' }} />
            </div>
            <div>
              <div className="badge badge-blue" style={{ marginBottom: 8 }}>Active</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 4 }}>Queue QR Code</div>
              <div style={{ fontSize: 13, color: '#64748b' }}>Clients scan this to join your queue. No app needed.</div>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="up-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 28 }}>
          <div style={S.stat}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>In Queue</div>
            <div style={{ fontSize: 32, fontWeight: 800, color: '#60a5fa', letterSpacing: '-0.03em' }}>{data.totalInQueue}</div>
            <div style={{ fontSize: 12, color: '#334155', marginTop: 4 }}>people waiting</div>
          </div>
          <div style={S.stat}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Purpose</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#a78bfa', letterSpacing: '-0.02em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{data.org?.purpose || '—'}</div>
            <div style={{ fontSize: 12, color: '#334155', marginTop: 4 }}>organization type</div>
          </div>
          <div style={S.stat}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Status</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', display: 'inline-block' }} />
              <span style={{ fontSize: 18, fontWeight: 700, color: '#86efac' }}>Live</span>
            </div>
            <div style={{ fontSize: 12, color: '#334155', marginTop: 4 }}>accepting clients</div>
          </div>
        </div>

        {/* Queue */}
        <div className="up-2">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'white' }}>Live Queue</div>
              <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>{data.totalInQueue} {data.totalInQueue === 1 ? 'person' : 'people'} waiting</div>
            </div>
            <button onClick={handleServe} disabled={serving || data.totalInQueue === 0} className="btn btn-green"
              style={{ padding: '9px 18px', fontSize: 13 }}>
              {serving ? <><div className="spin" /> Processing</> : 'Mark Served'}
            </button>
          </div>

          {data.queue.length === 0 ? (
            <div style={{ ...S.row, justifyContent: 'center', flexDirection: 'column', padding: '56px 24px', gap: 8 }}>
              <div style={{ fontSize: 28, marginBottom: 12 }}>—</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'white' }}>Queue is empty</div>
              <div style={{ fontSize: 13, color: '#475569' }}>Share your QR code to start receiving clients</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.queue.map((entry, i) => (
                <div key={entry._id} style={{ ...S.row, ...(i === 0 ? { borderColor: 'rgba(59,130,246,0.2)', background: 'rgba(59,130,246,0.03)' } : {}) }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, flexShrink: 0,
                    ...(i === 0 ? { background: '#3b82f6', color: 'white' } : { background: 'rgba(255,255,255,0.05)', color: '#475569' }) }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'white', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.clientName}</div>
                    <div style={{ fontSize: 12, color: '#475569', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{entry.clientEmail} · {entry.clientPhone}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    <span style={{ fontSize: 12, color: '#334155' }}>{new Date(entry.joinedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {i === 0 && <span className="badge badge-blue">Next</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
