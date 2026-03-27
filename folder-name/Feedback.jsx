import React, { useState } from 'react';

const ASPECTS = [
  { key: 'speed',    label: 'Queue Speed',     icon: '⚡' },
  { key: 'staff',    label: 'Staff Behaviour',  icon: '🤝' },
  { key: 'facility', label: 'Facility Comfort', icon: '🏢' },
];

const EMOJI_SCALE = [
  { emoji: '😞', label: 'Poor' },
  { emoji: '😐', label: 'Okay' },
  { emoji: '🙂', label: 'Good' },
  { emoji: '😊', label: 'Great' },
  { emoji: '🤩', label: 'Excellent' },
];

const QUICK_TAGS = [
  'Staff was helpful', 'Too long a wait', 'Smooth experience',
  'Clean facility',    'Staff unfriendly', 'Fast service',
  'Confusing process', 'Easy to use FlowQ',
];

export default function Feedback({ nav, user }) {
  const [rating,   setRating]   = useState(0);
  const [hovered,  setHovered]  = useState(0);
  const [aspects,  setAspects]  = useState({});
  const [tags,     setTags]     = useState([]);
  const [comment,  setComment]  = useState('');
  const [loading,  setLoading]  = useState(false);
  const [submitted, setDone]    = useState(false);
  const [step,     setStep]     = useState(1); // 1 = rating, 2 = details

  const activeRating = hovered || rating;

  const ratingLabels = ['', 'Terrible', 'Poor', 'Okay', 'Good', 'Excellent'];
  const ratingColors = ['', 'var(--red)', 'var(--red)', 'var(--amber)', 'var(--green)', 'var(--green)'];

  const toggleTag = (t) =>
    setTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const submit = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setDone(true); }, 1000);
  };

  /* ── Success ── */
  if (submitted) return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '3rem 2rem',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 420, animation: 'fadeUp 0.6s ease both' }}>
        {/* Stamp */}
        <div style={{
          width: 96, height: 96, borderRadius: '50%',
          background: 'var(--green-bg)', border: '3px solid #a0d4b0',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, margin: '0 auto 24px',
          animation: 'stampIn 0.5s ease both',
        }}>✓</div>

        <h2 style={{ fontSize: 30, fontWeight: 700, letterSpacing: '-0.5px', marginBottom: 12 }}>
          Feedback received!
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 15, lineHeight: 1.7, marginBottom: 36 }}>
          Thank you{user?.name ? `, ${user.name.split(' ')[0]}` : ''}! Your feedback helps us make FlowQ and our partner locations better for everyone.
        </p>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => nav('join-queue')} style={{
            padding: '12px 28px', borderRadius: 10,
            background: 'var(--ink)', color: '#faf7f2',
            border: 'none', fontWeight: 700, fontSize: 14, cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans, sans-serif',
          }}>Join Another Queue</button>
          <button onClick={() => nav('home')} style={{
            padding: '12px 24px', borderRadius: 10,
            background: 'transparent', color: 'var(--muted)',
            border: '1px solid var(--border2)', fontWeight: 600, fontSize: 14, cursor: 'pointer',
          }}>Back to Home</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: 'calc(100vh - 68px)',
      padding: '3rem 2rem',
      display: 'flex', justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 560 }}>

        {/* Page header */}
        <div style={{ textAlign: 'center', marginBottom: 36, animation: 'fadeUp 0.5s ease both' }}>
          <div style={{ fontSize: 40, marginBottom: 14 }}>💬</div>
          <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', letterSpacing: '-0.5px', marginBottom: 10 }}>
            How was your experience?
          </h1>
          <p style={{ color: 'var(--muted)', fontSize: 15 }}>
            Your honest feedback shapes the future of FlowQ.
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
          {[1, 2].map(s => (
            <React.Fragment key={s}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: step >= s ? 'var(--primary)' : 'var(--bg2)',
                border: `1.5px solid ${step >= s ? 'var(--primary)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 12, fontWeight: 700,
                color: step >= s ? '#fff' : 'var(--muted)',
                transition: 'all 0.3s',
              }}>{s}</div>
              {s < 2 && <div style={{ width: 40, height: 1.5, background: step > s ? 'var(--primary)' : 'var(--border)', transition: 'background 0.3s' }} />}
            </React.Fragment>
          ))}
        </div>

        {/* ── Step 1: Star rating ── */}
        {step === 1 && (
          <div style={{ animation: 'fadeUp 0.4s ease both' }}>
            <div style={{
              background: 'var(--surface)', borderRadius: 18,
              border: '1px solid var(--border)', padding: '2rem',
              textAlign: 'center', marginBottom: 20,
            }}>
              <p style={{ fontSize: 14, color: 'var(--muted)', marginBottom: 24, fontWeight: 500 }}>
                Overall experience at this location
              </p>

              {/* Stars */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 16 }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button key={n}
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer', padding: 4,
                      fontSize: 40,
                      filter: activeRating >= n ? 'none' : 'grayscale(1) opacity(0.3)',
                      transform: activeRating >= n ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.15s, filter 0.15s',
                    }}>⭐</button>
                ))}
              </div>

              {activeRating > 0 && (
                <div style={{
                  display: 'inline-block', padding: '6px 20px', borderRadius: 100,
                  background: `${ratingColors[activeRating]}22`,
                  border: `1px solid ${ratingColors[activeRating]}44`,
                  fontSize: 14, fontWeight: 700, color: ratingColors[activeRating],
                  animation: 'fadeIn 0.2s ease',
                }}>{ratingLabels[activeRating]}</div>
              )}
            </div>

            <button
              onClick={() => { if (rating) setStep(2); }}
              disabled={!rating}
              style={{
                width: '100%', padding: '14px', borderRadius: 10,
                background: rating ? 'var(--ink)' : 'var(--bg2)',
                border: 'none', color: rating ? '#faf7f2' : 'var(--muted)',
                fontSize: 15, fontWeight: 700, cursor: rating ? 'pointer' : 'not-allowed',
                fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'background 0.2s',
              }}>
              {rating ? 'Continue →' : 'Please select a rating'}
            </button>
          </div>
        )}

        {/* ── Step 2: Details ── */}
        {step === 2 && (
          <div style={{ animation: 'slideRight 0.4s ease both' }}>

            {/* Aspect ratings */}
            <div style={{
              background: 'var(--surface)', borderRadius: 18,
              border: '1px solid var(--border)', padding: '1.5rem',
              marginBottom: 20,
            }}>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 18, color: 'var(--ink2)' }}>Rate specific aspects</p>
              {ASPECTS.map(({ key, label, icon }) => (
                <div key={key} style={{ marginBottom: 18 }}>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>
                    {icon} {label}
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {EMOJI_SCALE.map((e, i) => (
                      <button key={i}
                        onClick={() => setAspects(p => ({ ...p, [key]: i }))}
                        title={e.label}
                        style={{
                          flex: 1, padding: '10px 0', borderRadius: 9,
                          background: aspects[key] === i ? 'var(--primary-bg)' : 'var(--bg2)',
                          border: `1.5px solid ${aspects[key] === i ? 'var(--primary-border)' : 'var(--border)'}`,
                          fontSize: 20, cursor: 'pointer',
                          transform: aspects[key] === i ? 'scale(1.12)' : 'scale(1)',
                          transition: 'all 0.15s',
                        }}>{e.emoji}</button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick tags */}
            <div style={{
              background: 'var(--surface)', borderRadius: 18,
              border: '1px solid var(--border)', padding: '1.5rem',
              marginBottom: 20,
            }}>
              <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 14, color: 'var(--ink2)' }}>
                Quick tags <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(select all that apply)</span>
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {QUICK_TAGS.map(t => {
                  const active = tags.includes(t);
                  return (
                    <button key={t} onClick={() => toggleTag(t)} style={{
                      padding: '7px 14px', borderRadius: 100,
                      background: active ? 'var(--primary)' : 'var(--bg2)',
                      border: `1px solid ${active ? 'var(--primary)' : 'var(--border)'}`,
                      color: active ? '#fff' : 'var(--ink2)',
                      fontSize: 12, fontWeight: 500, cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}>{t}</button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <div style={{
              background: 'var(--surface)', borderRadius: 18,
              border: '1px solid var(--border)', padding: '1.5rem',
              marginBottom: 24,
            }}>
              <label style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink2)', display: 'block', marginBottom: 10 }}>
                Additional comments <span style={{ color: 'var(--muted)', fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Tell us anything that could help us improve…"
                rows={4}
                style={{
                  width: '100%', padding: '12px 14px', borderRadius: 9,
                  border: '1.5px solid var(--border)', background: 'var(--surface2)',
                  color: 'var(--ink)', fontSize: 14, outline: 'none',
                  resize: 'vertical', fontFamily: 'Plus Jakarta Sans, sans-serif',
                  lineHeight: 1.6, transition: 'border-color 0.2s',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>

            {/* Submit / back */}
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setStep(1)} style={{
                padding: '13px 20px', borderRadius: 10,
                background: 'transparent', border: '1px solid var(--border2)',
                color: 'var(--muted)', fontSize: 14, fontWeight: 500, cursor: 'pointer',
              }}>← Back</button>
              <button onClick={submit} disabled={loading} style={{
                flex: 1, padding: '13px', borderRadius: 10,
                background: loading ? 'var(--bg2)' : 'var(--primary)',
                border: 'none', color: loading ? 'var(--muted)' : '#fff',
                fontSize: 15, fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              }}>
                {loading && (
                  <span style={{
                    width: 16, height: 16,
                    border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: '#fff', borderRadius: '50%',
                    animation: 'spin 0.6s linear infinite', display: 'inline-block',
                  }} />
                )}
                {loading ? 'Submitting…' : 'Submit Feedback ✓'}
              </button>
            </div>

            <p style={{ textAlign: 'center', marginTop: 16, fontSize: 12, color: 'var(--muted)' }}>
              <span onClick={() => nav('home')} style={{ cursor: 'pointer', textDecoration: 'underline' }}>
                Skip and go home
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}