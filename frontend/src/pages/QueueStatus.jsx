import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { io } from 'socket.io-client';
import { useAuth } from '../context/AuthContext';

let socket;

export default function QueueStatus() {
  const { orgId } = useParams();
  const { user } = useAuth();
  const [status, setStatus] = useState(null);
  const [isNext, setIsNext] = useState(false);
  const [notification, setNotification] = useState(false);
  const initializedRef = useRef(false);

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
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Register service worker & subscribe to push
    if ('serviceWorker' in navigator && 'PushManager' in window) {
      navigator.serviceWorker.register('/sw.js').then(async (reg) => {
        const { data } = await api.get('/push/vapid-public-key');
        const publicKey = data.publicKey;

        const urlBase64ToUint8Array = (base64String) => {
          const padding = '='.repeat((4 - base64String.length % 4) % 4);
          const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
          const rawData = atob(base64);
          return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
        };

        const subscription = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(publicKey),
        });

        await api.post('/push/subscribe', { subscription }, { headers });
      }).catch(() => {});
    }

    socket = io('http://localhost:5001');
    const userId = localStorage.getItem('userId') || user?.userId;

    socket.emit('join_client_room', userId);
    socket.on('queue_updated', fetchStatus);
    socket.on('you_are_next', () => {
      setIsNext(true);
      setNotification(true);
      setTimeout(() => setNotification(false), 6000);
    });

    const interval = setInterval(fetchStatus, 10000); // Polling fallback
    
    // Fetch initial status
    fetchStatus();

    return () => {
      if (socket) {
        socket.disconnect();
        socket = null;
      }
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
      {/* "You are next" notification */}
      {notification && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50
          bg-green-500 text-white px-6 py-4 rounded-2xl font-bold text-lg
          shadow-2xl shadow-green-500/30 animate-bounce">
          🎉 You are next! Get ready.
        </div>
      )}

      <div className="relative text-center">
        {/* Pulse circle */}
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

        {isNext && (
          <div className="mt-6 glass rounded-2xl px-6 py-3 inline-block">
            <p className="text-green-400 text-sm font-medium">✅ Please approach the counter now</p>
          </div>
        )}
      </div>
    </div>
  );
}