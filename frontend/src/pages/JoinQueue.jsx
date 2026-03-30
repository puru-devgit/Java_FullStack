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
      .catch((err) => {
        console.error('by-token error:', err.response?.data || err.message);
        setError('Invalid or expired QR code');
      });
  }, [token]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await api.post(`/queue/join/${org.orgId}`, {}, { headers });
      navigate(`/queue/${org.orgId}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to join');
      setJoining(false);
    }
  };

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-red-400 text-lg">{error}</p>
      </div>
    </div>
  );

  if (!org) return (
    <div className="min-h-screen flex items-center justify-center text-slate-400">
      Loading...
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 text-center max-w-sm w-full">
        <div className="w-16 h-16 bg-sky-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl">🏢</span>
        </div>
        <h2 className="text-2xl font-black text-white mb-1">{org.name}</h2>
        <p className="text-slate-400 text-sm mb-8">{org.purpose}</p>

        <button onClick={handleJoin} disabled={joining}
          className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-white font-bold
            py-4 rounded-xl transition-all text-lg">
          {joining ? 'Joining...' : '➕ Join Queue'}
        </button>
      </div>
    </div>
  );
}