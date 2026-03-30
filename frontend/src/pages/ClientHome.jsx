import { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const MINS_PER_CLIENT = 2;

export default function ClientHome() {
  const { user, logout } = useAuth();
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState('');
  const [activeQueues, setActiveQueues] = useState([]);
  const scannerRef = useRef(null);
  const isRunning = useRef(false);
  const navigate = useNavigate();

  const headers = { Authorization: `Bearer ${user?.token}` };

  const fetchQueues = useCallback(async () => {
    try {
      const res = await api.get('/queue/my-queues', { headers });
      setActiveQueues(res.data.queues);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchQueues();
  }, [fetchQueues]);

  useEffect(() => {
    if (!scanning) return;

    const scanner = new Html5Qrcode('qr-reader');
    scannerRef.current = scanner;

    scanner.start(
      { facingMode: 'environment' },
      { fps: 10, qrbox: { width: 250, height: 250 } },
      (decodedText) => {
        if (!isRunning.current) return;
        isRunning.current = false;
        scanner.stop().then(() => {
          setScanning(false);
          let token = null;
          try {
            const url = new URL(decodedText);
            const parts = url.pathname.split('/join/');
            if (parts.length > 1) token = parts[1].trim();
          } catch {
            if (decodedText.includes('/join/')) {
              token = decodedText.split('/join/').pop().trim();
            } else {
              token = decodedText.trim();
            }
          }
          if (token) navigate(`/join/${token}`);
          else setError('Could not read token from QR code.');
        }).catch(() => {});
      },
      () => {}
    ).then(() => {
      isRunning.current = true;
    }).catch(() => {
      setError('Camera access denied. Please allow camera permissions.');
      setScanning(false);
    });

    return () => {
      if (isRunning.current) {
        isRunning.current = false;
        scanner.stop().catch(() => {});
      }
    };
  }, [scanning]);

  const stopScanning = () => {
    if (isRunning.current) {
      isRunning.current = false;
      scannerRef.current?.stop().catch(() => {});
    }
    setScanning(false);
  };

  return (
    <div className="min-h-screen px-4 py-10 max-w-md mx-auto">
      <div className="absolute w-96 h-96 bg-sky-500/10 rounded-full blur-3xl top-0 left-0 pointer-events-none" />

      <div className="relative z-10">
        <h1 className="text-5xl font-black text-white mb-1">Flow<span className="text-sky-400">Q</span></h1>
        <p className="text-slate-400 mb-8">Welcome, {user?.name}</p>

        {error && (
          <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
            <button onClick={() => setError('')} className="ml-3 underline">Dismiss</button>
          </div>
        )}

        {/* Active Queues */}
        {activeQueues.length > 0 && (
          <div className="mb-8">
            <h2 className="text-white font-bold text-lg mb-3">Your Active Queues</h2>
            <div className="space-y-3">
              {activeQueues.map((q) => (
                <div
                  key={q.orgId}
                  onClick={() => navigate(`/queue/${q.orgId}`)}
                  className="glass rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-all"
                >
                  <div>
                    <p className="text-white font-semibold">{q.orgName}</p>
                    <p className="text-slate-400 text-sm">{q.purpose}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sky-400 font-black text-xl">{q.position}</p>
                    <p className="text-slate-500 text-xs">ahead</p>
                    <p className="text-slate-400 text-xs mt-1">~{q.position * MINS_PER_CLIENT}m wait</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Scan Button */}
        {!scanning ? (
          <button
            onClick={() => { setError(''); setScanning(true); }}
            className="bg-sky-500 hover:bg-sky-400 text-white font-bold px-8 py-4 rounded-2xl
              transition-all text-lg flex items-center gap-3 w-full justify-center"
          >
            <span className="text-2xl">📷</span> Scan QR Code
          </button>
        ) : (
          <div className="glass rounded-2xl p-6">
            <p className="text-slate-400 text-sm mb-4">Point your camera at the QR code</p>
            <div id="qr-reader" className="rounded-xl overflow-hidden w-full" />
            <button onClick={stopScanning} className="mt-4 text-sm text-red-400 hover:text-red-300 transition-all">
              Cancel
            </button>
          </div>
        )}

        <button onClick={logout} className="mt-8 text-sm text-slate-500 hover:text-slate-400 transition-all w-full text-center">
          Sign out
        </button>
      </div>
    </div>
  );
}
