import React, { useState } from 'react';

export default function Login({ nav, setUser }) {
  const [mode, setMode]     = useState('register'); // 'register' | 'login'
  const [form, setForm]     = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const set = (k, v) => {
    setForm(p => ({ ...p, [k]: v }));
    setErrors(p => ({ ...p, [k]: '' }));
  };

  const validate = () => {
    const e = {};
    if (mode === 'register') {
      if (!form.name.trim()) e.name = 'Please enter your full name.';
      if (!/^\d{10}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit phone number.';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Enter a valid email address.';
    if (form.password.length < 6) e.password = 'Password must be at least 6 characters.';
    return e;
  };

  const submit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setTimeout(() => {
      setUser({ name: form.name || form.email.split('@')[0], email: form.email });
      setLoading(false);
      nav('join-queue');
    }, 1000);
  };

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '3rem 1.5rem',
      background: 'radial-gradient(ellipse 80% 60% at 60% 20%, rgba(212,98,42,0.06) 0%, transparent 70%)',
    }}>

      {/* Left illustration panel */}
      <div style={{
        flex: '0 0 340px', display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '3rem', marginRight: '3rem',
        display: 'none', // hidden on small; shown via media query conceptually
      }} />

      {/* Card */}
      <div style={{
        width: '100%', maxWidth: 460,
        background: 'var(--surface)',
        borderRadius: 20, border: '1px solid var(--border)',
        boxShadow: 'var(--shadow-xl)',
        overflow: 'hidden',
        animation: 'fadeUp 0.6s ease both',
      }}>
        {/* Top strip */}
        <div style={{
          background: 'var(--ink)', padding: '2rem 2.5rem',
        }}>
          <div style={{
            fontFamily: 'Playfair Display, serif',
            fontSize: 26, fontWeight: 700, color: '#faf7f2',
            marginBottom: 6,
          }}>
            {mode === 'register' ? 'Create your account' : 'Welcome back'}
          </div>
          <p style={{ color: 'rgba(250,247,242,0.5)', fontSize: 13 }}>
            {mode === 'register'
              ? 'Join FlowQ and never stand in a line again.'
              : 'Sign in to continue managing your queue.'}
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{
          display: 'flex', background: 'var(--bg2)',
          borderBottom: '1px solid var(--border)',
        }}>
          {['register', 'login'].map(m => (
            <button key={m} onClick={() => { setMode(m); setErrors({}); }} style={{
              flex: 1, padding: '12px',
              background: mode === m ? 'var(--surface)' : 'transparent',
              border: 'none', borderBottom: mode === m ? '2px solid var(--primary)' : '2px solid transparent',
              color: mode === m ? 'var(--primary)' : 'var(--muted)',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              fontWeight: 600, fontSize: 13, cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}>
              {m === 'register' ? 'Register' : 'Login'}
            </button>
          ))}
        </div>

        {/* Form body */}
        <div style={{ padding: '2rem 2.5rem' }}>
          {mode === 'register' && (
            <Field
              label="Full Name" value={form.name}
              onChange={v => set('name', v)} error={errors.name}
              placeholder="e.g. Rahul Sharma"
            />
          )}
          <Field
            label="Email Address" type="email" value={form.email}
            onChange={v => set('email', v)} error={errors.email}
            placeholder="you@email.com"
          />
          {mode === 'register' && (
            <Field
              label="Phone Number" type="tel" value={form.phone}
              onChange={v => set('phone', v)} error={errors.phone}
              placeholder="10-digit mobile number"
              prefix="+91"
            />
          )}
          <Field
            label="Password" type={showPass ? 'text' : 'password'} value={form.password}
            onChange={v => set('password', v)} error={errors.password}
            placeholder="Minimum 6 characters"
            suffix={
              <button onClick={() => setShowPass(p => !p)} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--muted)', fontSize: 13, padding: '0 2px',
              }}>
                {showPass ? '🙈' : '👁'}
              </button>
            }
          />

          {/* Strength indicator */}
          {form.password.length > 0 && (
            <PasswordStrength password={form.password} />
          )}

          <button onClick={submit} disabled={loading} style={{
            width: '100%', padding: '14px',
            borderRadius: 10, border: 'none',
            background: loading ? 'var(--bg2)' : 'var(--primary)',
            color: loading ? 'var(--muted)' : '#fff',
            fontSize: 15, fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            marginTop: 8, transition: 'opacity 0.2s',
          }}>
            {loading && (
              <span style={{
                width: 16, height: 16,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff', borderRadius: '50%',
                animation: 'spin 0.6s linear infinite',
                display: 'inline-block',
              }} />
            )}
            {loading ? 'Please wait...' : mode === 'register' ? 'Create Account →' : 'Sign In →'}
          </button>

          <p style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted)' }}>
            {mode === 'register' ? 'Already have an account? ' : "Don't have an account? "}
            <span
              onClick={() => { setMode(mode === 'register' ? 'login' : 'register'); setErrors({}); }}
              style={{ color: 'var(--primary)', fontWeight: 600, cursor: 'pointer' }}
            >
              {mode === 'register' ? 'Sign In' : 'Register'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Field ─────────────────────────────────────────────────── */
function Field({ label, type = 'text', value, onChange, error, placeholder, prefix, suffix }) {
  const [focused, setFocused] = useState(false);

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{
        display: 'block', fontSize: 12, fontWeight: 600,
        color: 'var(--ink2)', marginBottom: 6,
        letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>{label}</label>

      <div style={{
        display: 'flex', alignItems: 'center',
        border: `1.5px solid ${error ? 'var(--red)' : focused ? 'var(--primary)' : 'var(--border)'}`,
        borderRadius: 9, overflow: 'hidden',
        background: 'var(--surface2)',
        transition: 'border-color 0.2s, box-shadow 0.2s',
        boxShadow: focused ? '0 0 0 3px rgba(212,98,42,0.10)' : 'none',
      }}>
        {prefix && (
          <span style={{
            padding: '0 10px 0 12px', fontSize: 13,
            color: 'var(--muted)', borderRight: '1px solid var(--border)',
            background: 'var(--bg2)', alignSelf: 'stretch',
            display: 'flex', alignItems: 'center',
          }}>{prefix}</span>
        )}
        <input
          type={type} value={value} placeholder={placeholder}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            flex: 1, padding: '12px 14px',
            background: 'transparent', border: 'none', outline: 'none',
            fontSize: 14, color: 'var(--ink)',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}
        />
        {suffix && <div style={{ padding: '0 12px' }}>{suffix}</div>}
      </div>

      {error && (
        <div style={{ fontSize: 11, color: 'var(--red)', marginTop: 5, display: 'flex', alignItems: 'center', gap: 5 }}>
          ⚠ {error}
        </div>
      )}
    </div>
  );
}

/* ── Password strength ─────────────────────────────────────── */
function PasswordStrength({ password }) {
  const score =
    (password.length >= 8 ? 1 : 0) +
    (/[A-Z]/.test(password) ? 1 : 0) +
    (/[0-9]/.test(password) ? 1 : 0) +
    (/[^A-Za-z0-9]/.test(password) ? 1 : 0);

  const labels = ['Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['var(--red)', 'var(--amber)', '#6a9e4e', 'var(--green)'];

  return (
    <div style={{ marginBottom: 18, marginTop: -10 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= score ? colors[score - 1] : 'var(--border)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <p style={{ fontSize: 11, color: score > 0 ? colors[score - 1] : 'var(--muted)', fontWeight: 500 }}>
        {score > 0 ? labels[score - 1] : ''}
      </p>
    </div>
  );
}