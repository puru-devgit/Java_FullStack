import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

const MINS_PER_CLIENT = 2;

function useCountdown(position) {
  const [secondsLeft, setSecondsLeft] = useState(position * MINS_PER_CLIENT * 60);

  useEffect(() => {
    setSecondsLeft(position * MINS_PER_CLIENT * 60);
  }, [position]);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [secondsLeft]);

  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  return `${mins}m ${String(secs).padStart(2, '0')}s`;
}

export default function QueueStatus() {
  const { orgId } = useParams();
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [isNext, setIsNext] = useState(false);
  const [notification, setNotification] = useState(false);
  const socketRef = useRef(null);
  const countdown = useCountdown(status?.position ?? 0);
  const navigate = useNavigate();
  const [leaving, setLeaving] = useState(false);

  const handleLeave = async () => {
    setLeaving(true);
    try {
      await api.post(`/queue/leave/${orgId}`, {}, { headers });
      navigate('/client/home');
    } catch (err) {
      console.error(err);
      setLeaving(false);
    }
  };

  const headers = useMemo(() => ({ Authorization: `Bearer ${user?.token}` }), [user?.token]);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await api.get(`/queue/status/${orgId}`, { headers });
      setStatus(res.data);
      if (res.data.position === 0 && res.data.inQueue) setIsNext(true);
    } catch (err) {
      console.error(err);
    }
  }, [orgId, headers]);

  useEffect(() => {
    fetchStatus();

    // Push notification subscription
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(async (reg) => {
        const { data } = await api.get('/push/vapid-public-key');
        const urlBase64ToUint8Array = (base64String) => {
          const padding = '='.repeat((4 - base64String.length % 4) % 4);
          const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
          const rawData = atob(base64);
          return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
        };
        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(data.publicKey),
        });
        await api.post('/push/subscribe', { subscription }, { headers });
      }).catch(() => {});
    }

    // Socket
    const socket = io('http://localhost:5001');
    socketRef.current = socket;
    const userId = user?.userId || localStorage.getItem('userId');
    socket.emit('join_client_room', userId);
    socket.on('queue_updated', fetchStatus);
    socket.on('you_are_next', () => {
      setIsNext(true);
      setNotification(true);
      setTimeout(() => setNotification(false), 6000);
    });

    const interval = setInterval(fetchStatus, 10000);

    return () => {
      socket.disconnect();
      clearInterval(interval);
    };
  }, [fetchStatus, user?.userId]);

  if (!status) return (
    <div className="min-h-screen flex items-center justify-center text-slate-400">Loading...</div>
  );

  if (!status.inQueue) return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 text-center">
        <p className="text-white text-xl font-bold">You've been served! ✅</p>
        <p className="text-slate-400 mt-2">Thank you for using FlowQ</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      {/* Back button */}
      <button
        onClick={() => navigate('/client/home')}
        className="absolute top-6 left-6 glass px-4 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm flex items-center gap-2">
        ← Back
      </button>
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50
          bg-green-500 text-white px-6 py-4 rounded-2xl font-bold text-lg
          shadow-2xl shadow-green-500/30 animate-bounce">
          🎉 You are next! Get ready.
        </div>
      )}

      <div className="relative text-center">
        {isNext && (
          <div className="absolute inset-0 flex items-center justify-center -z-10">
            <div className="w-64 h-64 rounded-full bg-green-500/20 pulse-ring" />
          </div>
        )}

        <div className={`w-48 h-48 rounded-full flex flex-col items-center justify-center mx-auto mb-8
          ${isNext ? 'bg-green-500/20 border-2 border-green-500' : 'bg-sky-500/10 border-2 border-sky-500/30'}`}>
          <span className="text-6xl font-black text-white">{status.position}</span>
          <span className="text-slate-400 text-sm mt-1">
            {status.position === 1 ? 'person' : 'people'} ahead
          </span>
        </div>

        <h2 className={`text-2xl font-black mb-2 ${isNext ? 'text-green-400' : 'text-white'}`}>
          {isNext ? "You're Next! 🎉" : "You're in the Queue"}
        </h2>
        <p className="text-slate-400">
          {isNext
            ? 'Please proceed to the counter'
            : `${status.position} ${status.position === 1 ? 'person is' : 'people are'} ahead of you`}
        </p>

        {!isNext && status.position > 0 && (
          <div className="mt-4 glass rounded-2xl px-6 py-3 inline-block">
            <p className="text-sky-400 text-sm font-medium">⏱ Estimated wait: <span className="font-black text-white">{countdown}</span></p>
          </div>
        )}

        {isNext && (
          <div className="mt-6 glass rounded-2xl px-6 py-3 inline-block">
            <p className="text-green-400 text-sm font-medium">✅ Please approach the counter now</p>
          </div>
        )}

        {!isNext && (
          <button
            onClick={handleLeave}
            disabled={leaving}
            className="mt-8 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-semibold px-8 py-3 rounded-xl transition-all disabled:opacity-50 w-full max-w-xs">
            {leaving ? 'Leaving...' : 'Leave Queue'}
          </button>
        )}
      </div>
    </div>
  );
}
