import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function JoinQueue() {
  const { token } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [org, setOrg] = useState(null);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState('');
  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    api.get(`/org/by-token/${token}`)
      .then(res => setOrg(res.data))
      .catch(() => setError('Invalid or expired QR code'));
  }, [token]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await api.post(`/queue/join/${org.orgId}`, {}, { headers });
      navigate(`/queue/${org.orgId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join queue');
      setJoining(false);
    }
  };

  if (error) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="surface-modal up" style={{ padding: '48px 40px', textAlign: 'center', maxWidth: 380, width: '100%' }}>
        <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)', margin: '0 auto 20px' }} />
        <h2 style={{ fontSize: 22, color: 'white', marginBottom: 8 }}>Invalid QR Code</h2>
        <p style={{ color: '#f87171', fontSize: 14, marginBottom: 28 }}>{error}</p>
        <button onClick={() => navigate('/client/home')} className="btn btn-blue" style={{ width: '100%', padding: '12px', fontSize: 14 }}>
          Go Back
        </button>
      </div>
    </div>
  );

  if (!org) return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div className="spin" style={{ margin: '0 auto 16px', width: 28, height: 28 }} />
        <p style={{ color: '#475569', fontSize: 14 }}>Loading...</p>
      </div>
    </div>
  );

  return (
    <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div className="orb" style={{ width: 500, height: 500, background: 'rgba(59,130,246,0.06)', top: -150, left: '50%', transform: 'translateX(-50%)' }} />

      <nav className="nav">
        <button onClick={() => navigate(-1)} className="btn btn-ghost" style={{ fontSize: 14, gap: 6 }}>
          ← Back
        </button>
        <span className="logo">Flow<span>Q</span></span>
      </nav>

      <div className="surface-modal up" style={{ padding: '40px', textAlign: 'center', maxWidth: 400, width: '100%', position: 'relative', zIndex: 1, marginTop: 60 }}>
        {/* Org icon */}
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.18)', margin: '0 auto 20px' }} />

        <div className="badge badge-blue" style={{ marginBottom: 14 }}>{org.purpose}</div>
        <h2 style={{ fontSize: 26, color: 'white', marginBottom: 8 }}>{org.name}</h2>
        <p style={{ color: '#64748b', fontSize: 14, marginBottom: 28, lineHeight: 1.6 }}>
          Join the queue and get notified when it's your turn. No need to wait in person.
        </p>

        {/* Steps */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 28, paddingBottom: 28, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {['Scan', 'Get Notified', 'Get Served'].map((label, i, arr) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', margin: '0 auto 4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#60a5fa' }}>{i + 1}</span>
                </div>
                <span style={{ fontSize: 11, color: '#475569' }}>{label}</span>
              </div>
              {i < arr.length - 1 && <span style={{ color: '#1e293b', fontSize: 14, marginBottom: 16 }}>›</span>}
            </div>
          ))}
        </div>

        <button onClick={handleJoin} disabled={joining} className="btn btn-blue" style={{ width: '100%', padding: '13px', fontSize: 15 }}>
          {joining ? <><div className="spin" /> Joining...</> : 'Join Queue'}
        </button>
        <button onClick={() => navigate('/client/home')} className="btn btn-ghost" style={{ width: '100%', padding: '10px', fontSize: 13, marginTop: 8 }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
