import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import api from '../services/api';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

export default function OrgHome() {
  const { user, logout } = useAuth();

  const [data, setData] = useState({
    org: null,
    queue: [],
    totalInQueue: 0
  });

  const [serving, setServing] = useState(false);
  const [showQR, setShowQR] = useState(false);

  const initializedRef = useRef(false);
  const socketRef = useRef(null);

  // ✅ Safe headers (only when token exists)
  const headers = useMemo(() => {
    if (!user?.token) return {};
    return { Authorization: `Bearer ${user.token}` };
  }, [user?.token]);

  // ✅ Fetch Data
  const fetchData = useCallback(async () => {
    if (!user?.token) return; // 🔥 prevent invalid API call

    try {
      const res = await api.get('/org/dashboard', { headers });

      setData(res.data);

      // ✅ Setup socket only once
      if (!socketRef.current) {
        socketRef.current = io('http://localhost:5001');

        socketRef.current.emit('join_org_room', res.data.org._id);

        socketRef.current.on('queue_updated', ({ queue }) => {
          setData(prev => ({
            ...prev,
            queue,
            totalInQueue: queue.length
          }));
        });
      }
    } catch (err) {
      console.error('Fetch error:', err);
    }
  }, [headers, user?.token]);

  // ✅ useEffect (proper lifecycle handling)
  useEffect(() => {
    if (!user?.token) return;

    if (initializedRef.current) return;
    initializedRef.current = true;

    fetchData();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [fetchData, user?.token]);

  // ✅ Serve Handler
  const handleServe = async () => {
    setServing(true);
    try {
      await api.post('/org/serve', {}, { headers });
      await fetchData();
    } catch (err) {
      console.error('Serve error:', err);
    }
    setServing(false);
  };

  return (
    <div className="min-h-screen p-6 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-black text-white">
            Flow<span className="text-sky-400">Q</span>
          </h1>
          <p className="text-slate-400">{data.org?.name}</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setShowQR(!showQR)}
            className="glass px-4 py-2 rounded-xl text-sm text-sky-400 hover:bg-white/10 transition-all"
          >
            {showQR ? 'Hide QR' : 'Show QR'}
          </button>

          <button
            onClick={logout}
            className="glass px-4 py-2 rounded-xl text-sm text-red-400 hover:bg-white/10 transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* QR Code */}
      {showQR && data.org?.qrCode && (
        <div className="glass rounded-2xl p-6 mb-6 flex items-center gap-6">
          <img
            src={data.org.qrCode}
            alt="QR"
            className="w-32 h-32 rounded-xl"
          />
          <div>
            <h3 className="text-white font-bold text-lg mb-1">
              Your Organization QR
            </h3>
            <p className="text-slate-400 text-sm">
              Clients scan this to join your queue
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <StatCard label="In Queue" value={data.totalInQueue} color="text-sky-400" />
        <StatCard label="Purpose" value={data.org?.purpose || '—'} color="text-indigo-400" />
        <StatCard label="Status" value="Active" color="text-green-400" />
      </div>

      {/* Serve Button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Queue</h2>

        <button
          onClick={handleServe}
          disabled={serving || data.totalInQueue === 0}
          className="bg-green-500 hover:bg-green-400 disabled:opacity-40 disabled:cursor-not-allowed
          text-white font-bold px-6 py-2 rounded-xl transition-all flex items-center gap-2"
        >
          {serving ? 'Processing...' : '✅ Mark Served'}
        </button>
      </div>

      {/* Queue List */}
      <div className="space-y-3">
        {data.queue.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center text-slate-500">
            No one in queue right now
          </div>
        ) : (
          data.queue.map((entry, i) => (
            <div
              key={entry._id}
              className={`glass rounded-2xl p-4 flex items-center gap-4
              ${i === 0 ? 'border-sky-500/50' : ''}`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                ${i === 0 ? 'bg-sky-500 text-white' : 'bg-white/10 text-slate-300'}`}
              >
                {i + 1}
              </div>

              <div className="flex-1">
                <p className="text-white font-semibold">{entry.clientName}</p>
                <p className="text-slate-400 text-sm">
                  {entry.clientEmail} · {entry.clientPhone}
                </p>
              </div>

              {i === 0 && (
                <span className="text-xs bg-sky-500/20 text-sky-400 px-3 py-1 rounded-full">
                  Next
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-slate-400 text-sm mb-1">{label}</p>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
  );
}