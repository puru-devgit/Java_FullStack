import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [role, setRole] = useState('client');
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '',
    orgName: '', purpose: ''
  });
  const [error, setError] = useState('');
  const [qrCode, setQrCode] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post('/auth/register', { ...form, role });
      if (role === 'organization' && res.data.qrCode) {
        setQrCode(res.data.qrCode);
        login(res.data);
      } else {
        login(res.data);
        navigate('/client/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  if (qrCode) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass rounded-2xl p-8 text-center max-w-md w-full">
          <h2 className="text-3xl font-black text-white mb-2">Your QR Code</h2>
          <p className="text-slate-400 mb-6">Share this with clients to let them join your queue</p>
          <img src={qrCode} alt="Organization QR" className="mx-auto rounded-xl mb-6 w-64 h-64" />
          <button onClick={() => navigate('/org/dashboard')}
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-3 rounded-xl transition-all">
            Go to Dashboard →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md glass rounded-2xl p-8">
        <h2 className="text-3xl font-black text-white mb-2">Create Account</h2>
        <p className="text-slate-400 mb-6">Join FlowQ</p>

        {/* Role Toggle */}
        <div className="flex bg-white/5 rounded-xl p-1 mb-6">
          {['client', 'organization'].map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize
                ${role === r ? 'bg-sky-500 text-white' : 'text-slate-400 hover:text-white'}`}>
              {r}
            </button>
          ))}
        </div>

        {error && <div className="bg-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'organization' && (
            <>
              <Field label="Organization Name" field="orgName" form={form} setForm={setForm} />
              <Field label="Purpose (e.g. Hospital, Bank)" field="purpose" form={form} setForm={setForm} />
            </>
          )}
          <Field label="Your Name" field="name" form={form} setForm={setForm} />
          <Field label="Email" field="email" type="email" form={form} setForm={setForm} />
          <Field label="Phone Number" field="phone" form={form} setForm={setForm} />
          <Field label="Password" field="password" type="password" form={form} setForm={setForm} />

          <button type="submit"
            className="w-full bg-sky-500 hover:bg-sky-400 text-white font-semibold py-3 rounded-xl transition-all mt-2">
            {role === 'organization' ? 'Register & Generate QR' : 'Create Account'}
          </button>
        </form>

        <p className="text-slate-400 text-sm text-center mt-6">
          Have an account? <Link to="/login" className="text-sky-400 hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, field, type = 'text', form, setForm }) {
  return (
    <div>
      <label className="block text-slate-400 text-sm mb-1">{label}</label>
      <input
        type={type}
        value={form[field]}
        onChange={e => setForm({ ...form, [field]: e.target.value })}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-sky-500 transition-all"
        required
      />
    </div>
  );
}