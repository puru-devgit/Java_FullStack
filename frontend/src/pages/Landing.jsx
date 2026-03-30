import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Landing() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStart = () => {
    if (!user) navigate('/login');
    else if (user.role === 'organization') navigate('/org/dashboard');
    else navigate('/client/home');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute w-96 h-96 bg-sky-500/20 rounded-full blur-3xl -top-20 -left-20" />
      <div className="absolute w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl bottom-10 right-10" />

      <div className="relative z-10 text-center px-6 max-w-2xl">
        <div className="inline-block px-4 py-1 rounded-full glass text-sky-400 text-sm font-medium mb-6">
          Smart Queue Management
        </div>
        <h1 className="text-7xl font-black text-white mb-4 tracking-tight">
          Flow<span className="text-sky-400">Q</span>
        </h1>
        <p className="text-slate-400 text-lg mb-10 leading-relaxed">
          Eliminate waiting chaos. Let your customers queue smart — from anywhere, in real time.
        </p>
        <div className="flex gap-4 justify-center">
          <button onClick={handleStart}
            className="bg-sky-500 hover:bg-sky-400 text-white font-semibold px-8 py-3 rounded-xl transition-all">
            Get Started
          </button>
          <button onClick={() => navigate('/register')}
            className="glass text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-all">
            Register
          </button>
        </div>
      </div>
    </div>
  );
}