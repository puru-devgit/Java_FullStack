import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      login(res.data);
      if (res.data.role === 'organization') navigate('/org/dashboard');
      else navigate('/client/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <h2 className="text-3xl font-black text-white mb-2">Welcome back</h2>
        <p className="text-slate-400 mb-8">Sign in to FlowQ</p>

        {error && <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {['email', 'password'].map(field => (
            <div key={field}>
              <label className="block text-slate-400 text-sm mb-1 capitalize">{field}</label>
              <input
                type={field}
                value={form[field]}
                onChange={e => setForm({ ...form, [field]: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-500 transition-all"
                required
              />
            </div>
          ))}
          <button type="submit"
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-3 rounded-xl transition-all mt-2">
            Sign In
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          No account? <Link to="/register" className="text-sky-400 hover:underline">Register here</Link>
        </p>
      </div>
    </div>
  );
}