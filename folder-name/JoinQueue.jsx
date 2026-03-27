import React, { useState } from 'react';

const NEARBY = [
  { id: 'Q-HDFC-001', name: 'HDFC Bank Branch', address: 'MG Road, Bhubaneswar', wait: '~12 min', count: 9,  category: 'Banking' },
  { id: 'Q-AIIMS-002', name: 'AIIMS OPD Counter', address: 'Sijua, Bhubaneswar',  wait: '~34 min', count: 23, category: 'Healthcare' },
  { id: 'Q-RTO-003',  name: 'RTO Office',        address: 'Nayapalli, Bhubaneswar', wait: '~20 min', count: 15, category: 'Govt. Office' },
  { id: 'Q-SBI-004',  name: 'SBI Main Branch',   address: 'Janpath, Bhubaneswar',   wait: '~8 min',  count: 5,  category: 'Banking' },
];

const CATEGORY_COLORS = {
  Banking:      { bg: '#fff1eb', color: '#c4622a' },
  Healthcare:   { bg: '#eaf5ee', color: '#2a7a4b' },
  'Govt. Office': { bg: '#fdf3d9', color: '#c4890a' },
};

export default function JoinQueue({ nav, user, setQueue }) {
  const [phase, setPhase]       = useState('idle'); // idle | scanning | scanned
  const [manualId, setManualId] = useState('');
  const [joining, setJoining]   = useState(null);
  const [scanDot, setScanDot]   = useState(0);

  /* Simulated scan */
  const startScan = () => {
    setPhase('scanning');
    let dot = 0;
    const interval = setInterval(() => {
      dot = (dot + 1) % 3;
      setScanDot(dot);
    }, 400);
    setTimeout(() => {
      clearInterval(interval);
      setPhase('scanned');
    }, 2400);
  };

  const joinQueue = (loc) => {
    setJoining(loc.id);
    setTimeout(() => {
      setQueue(loc);
      nav('queue-status');
    }, 900);
  };

  const handleManualJoin = () => {
    const loc = NEARBY.find(l => l.id.toLowerCase() === manualId.trim().toLowerCase());
    if (loc) joinQueue(loc);
    else {
      // Create a generic entry
      joinQueue({ id: manualId, name: 'Custom Queue', address: 'Manual entry', wait: 'Unknown', count: '?' });
    }
  };

  return (
    <div style={{ minHeight: 'calc(100vh - 68px)', padding: '3rem 2rem' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>

        {/* Page header */}
        <div style={{ marginBottom: 40, animation: 'fadeUp 0.5s ease both' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 3, height: 28, background: 'var(--primary)', borderRadius: 2 }} />
            <h1 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', letterSpacing: '-1px' }}>
              Join a Queue
            </h1>
          </div>
          <p style={{ color: 'var(--muted)', fontSize: 15, paddingLeft: 13 }}>
            Scan the QR code at any FlowQ location, or browse nearby queues below.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>

          {/* ── QR Scanner card ── */}
          <div style={{
            background: 'var(--surface)', borderRadius: 18,
            border: '1px solid var(--border)', overflow: 'hidden',
            animation: 'fadeUp 0.5s 0.1s ease both',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <div style={{
              background: 'var(--bg2)', padding: '18px 22px',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <span style={{ fontSize: 20 }}>📷</span>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Scan QR Code</span>
              <div style={{
                marginLeft: 'auto', fontSize: 10, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: phase === 'scanning' ? 'var(--amber)' : phase === 'scanned' ? 'var(--green)' : 'var(--muted)',
                background: phase === 'scanning' ? 'var(--amber-bg)' : phase === 'scanned' ? 'var(--green-bg)' : 'var(--bg2)',
                border: `1px solid ${phase === 'scanning' ? '#e8c060' : phase === 'scanned' ? '#8cc4a4' : 'var(--border)'}`,
                borderRadius: 100, padding: '3px 10px',
              }}>
                {phase === 'scanning' ? '● Scanning' : phase === 'scanned' ? '✓ Detected' : '○ Ready'}
              </div>
            </div>

            <div style={{ padding: '22px' }}>
              {/* Scanner viewport */}
              <div style={{
                position: 'relative', borderRadius: 14,
                background: 'var(--bg2)', border: '1.5px solid var(--border)',
                aspectRatio: '1', overflow: 'hidden', marginBottom: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>

                {/* Corner brackets */}
                {[
                  { top: 10, left: 10, borderTop: true, borderLeft: true },
                  { top: 10, right: 10, borderTop: true, borderRight: true },
                  { bottom: 10, left: 10, borderBottom: true, borderLeft: true },
                  { bottom: 10, right: 10, borderBottom: true, borderRight: true },
                ].map((pos, i) => (
                  <div key={i} style={{
                    position: 'absolute', width: 22, height: 22,
                    ...pos,
                    borderTop:    pos.borderTop    ? `2.5px solid ${phase === 'scanned' ? 'var(--green)' : 'var(--primary)'}` : 'none',
                    borderLeft:   pos.borderLeft   ? `2.5px solid ${phase === 'scanned' ? 'var(--green)' : 'var(--primary)'}` : 'none',
                    borderBottom: pos.borderBottom ? `2.5px solid ${phase === 'scanned' ? 'var(--green)' : 'var(--primary)'}` : 'none',
                    borderRight:  pos.borderRight  ? `2.5px solid ${phase === 'scanned' ? 'var(--green)' : 'var(--primary)'}` : 'none',
                    top:    pos.top    !== undefined ? pos.top    : undefined,
                    left:   pos.left   !== undefined ? pos.left   : undefined,
                    bottom: pos.bottom !== undefined ? pos.bottom : undefined,
                    right:  pos.right  !== undefined ? pos.right  : undefined,
                  }} />
                ))}

                {/* Scan line */}
                {phase === 'scanning' && (
                  <div style={{
                    position: 'absolute', left: 0, right: 0,
                    height: 2, background: 'var(--primary)', opacity: 0.7,
                    top: `${30 + scanDot * 20}%`,
                    transition: 'top 0.4s ease', boxShadow: '0 0 12px var(--primary)',
                  }} />
                )}

                {/* Idle QR art */}
                {phase === 'idle' && (
                  <div style={{ opacity: 0.15 }}>
                    <FakeQR />
                  </div>
                )}

                {/* Scanning indicator */}
                {phase === 'scanning' && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      width: 52, height: 52, borderRadius: '50%',
                      border: '2px dashed var(--primary)', margin: '0 auto 12px',
                      animation: 'spin 2s linear infinite',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 22,
                    }}>📷</div>
                    <p style={{ fontSize: 13, color: 'var(--muted)', fontWeight: 500 }}>Scanning{'.'.repeat(scanDot + 1)}</p>
                  </div>
                )}

                {/* Scanned success */}
                {phase === 'scanned' && (
                  <div style={{ textAlign: 'center', animation: 'stampIn 0.5s ease both' }}>
                    <div style={{ fontSize: 52, marginBottom: 8 }}>✅</div>
                    <p style={{ fontWeight: 700, color: 'var(--green)', fontSize: 14 }}>QR Code Detected</p>
                    <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>HDFC Bank · Q-HDFC-001</p>
                  </div>
                )}
              </div>

              {phase !== 'scanned' ? (
                <button
                  onClick={startScan}
                  disabled={phase === 'scanning'}
                  style={{
                    width: '100%', padding: '13px', borderRadius: 10,
                    background: phase === 'scanning' ? 'var(--bg2)' : 'var(--ink)',
                    border: 'none', color: phase === 'scanning' ? 'var(--muted)' : '#faf7f2',
                    fontWeight: 700, fontSize: 14, cursor: phase === 'scanning' ? 'not-allowed' : 'pointer',
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    transition: 'background 0.2s',
                  }}>
                  {phase === 'scanning' ? 'Scanning in progress…' : '📷  Open Camera & Scan'}
                </button>
              ) : (
                <button
                  onClick={() => joinQueue(NEARBY[0])}
                  style={{
                    width: '100%', padding: '13px', borderRadius: 10,
                    background: 'var(--primary)', border: 'none',
                    color: '#fff', fontWeight: 700, fontSize: 14,
                    cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
                  }}>
                  {joining ? 'Joining…' : 'Join HDFC Bank Queue →'}
                </button>
              )}

              {/* Manual entry */}
              <div style={{
                marginTop: 20, paddingTop: 20,
                borderTop: '1px dashed var(--border)',
              }}>
                <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10, fontWeight: 500 }}>
                  Or enter Queue ID manually
                </p>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    value={manualId}
                    onChange={e => setManualId(e.target.value)}
                    placeholder="e.g. Q-HDFC-001"
                    onKeyDown={e => e.key === 'Enter' && manualId && handleManualJoin()}
                    style={{
                      flex: 1, padding: '10px 12px', borderRadius: 8,
                      border: '1px solid var(--border)', background: 'var(--surface2)',
                      fontSize: 13, color: 'var(--ink)', outline: 'none',
                      fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                    onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border)'}
                  />
                  <button
                    onClick={handleManualJoin}
                    disabled={!manualId}
                    style={{
                      padding: '10px 18px', borderRadius: 8,
                      background: manualId ? 'var(--primary)' : 'var(--bg2)',
                      border: 'none',
                      color: manualId ? '#fff' : 'var(--muted)',
                      fontWeight: 600, fontSize: 13, cursor: manualId ? 'pointer' : 'not-allowed',
                      transition: 'background 0.2s',
                    }}>Go</button>
                </div>
              </div>
            </div>
          </div>

          {/* ── Nearby queues ── */}
          <div style={{ animation: 'fadeUp 0.5s 0.2s ease both' }}>
            <div style={{
              background: 'var(--surface)', borderRadius: 18,
              border: '1px solid var(--border)',
              boxShadow: 'var(--shadow-sm)', overflow: 'hidden',
            }}>
              <div style={{
                background: 'var(--bg2)', padding: '18px 22px',
                borderBottom: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>📍</span>
                <span style={{ fontWeight: 600, fontSize: 15 }}>Nearby Queues</span>
                <span style={{
                  marginLeft: 'auto', background: 'var(--primary-bg)',
                  color: 'var(--primary)', fontSize: 11, fontWeight: 600,
                  padding: '2px 10px', borderRadius: 100,
                  border: '1px solid var(--primary-border)',
                }}>Bhubaneswar</span>
              </div>

              <div style={{ padding: '10px 0' }}>
                {NEARBY.map((loc, i) => {
                  const cat = CATEGORY_COLORS[loc.category] || { bg: 'var(--bg2)', color: 'var(--muted)' };
                  const isJoining = joining === loc.id;
                  return (
                    <div
                      key={i}
                      style={{
                        padding: '16px 22px',
                        borderBottom: i < NEARBY.length - 1 ? '1px solid var(--border)' : 'none',
                        display: 'flex', alignItems: 'center', gap: 14,
                        transition: 'background 0.2s', cursor: 'pointer',
                      }}
                      onMouseOver={e => e.currentTarget.style.background = 'var(--bg2)'}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                      onClick={() => !joining && joinQueue(loc)}
                    >
                      {/* Position badge */}
                      <div style={{
                        width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                        background: cat.bg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontWeight: 800, fontSize: 18, color: cat.color,
                        fontFamily: 'Playfair Display, serif',
                      }}>
                        {loc.count}
                      </div>

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--ink)', marginBottom: 2 }}>
                          {loc.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span>📍 {loc.address}</span>
                        </div>
                        {/* Crowd dots */}
                        <div style={{ display: 'flex', gap: 3, marginTop: 7 }}>
                          {[...Array(Math.min(loc.count, 15))].map((_, j) => (
                            <div key={j} style={{
                              width: 5, height: 5, borderRadius: '50%',
                              background: j < 4 ? 'var(--primary)' : 'var(--border2)',
                            }} />
                          ))}
                          {loc.count > 15 && <span style={{ fontSize: 9, color: 'var(--muted)', lineHeight: '5px' }}>+{loc.count - 15}</span>}
                        </div>
                      </div>

                      {/* Right */}
                      <div style={{ textAlign: 'right', flexShrink: 0 }}>
                        <div style={{
                          fontSize: 12, fontWeight: 600,
                          color: cat.color, background: cat.bg,
                          borderRadius: 6, padding: '4px 10px', marginBottom: 6,
                        }}>{loc.wait}</div>
                        <div style={{
                          fontSize: 11, color: 'var(--muted2)',
                          background: 'var(--bg2)', borderRadius: 4,
                          padding: '2px 7px', display: 'inline-block',
                        }}>{loc.category}</div>
                      </div>

                      {/* Arrow */}
                      <div style={{ color: isJoining ? 'var(--green)' : 'var(--muted2)', fontSize: 16, flexShrink: 0 }}>
                        {isJoining ? '⏳' : '→'}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Info box */}
            <div style={{
              marginTop: 16, background: 'var(--primary-bg)',
              border: '1px solid var(--primary-border)',
              borderRadius: 12, padding: '14px 18px',
              display: 'flex', gap: 12, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 18 }}>💡</span>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 3 }}>
                  Physical QR codes available at all locations
                </p>
                <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6 }}>
                  Look for the FlowQ poster at the entrance or service counter. Scan to join instantly — no typing needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Fake QR art ─────────────────────────────────────────────── */
function FakeQR() {
  const pattern = [
    [1,1,1,1,1,1,1,0,1,0,0,1,0,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,1,0,0,1,1,0,0,1,0,0,0,0,0,0,1],
    [1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1,1,1,0,0,1],
    [1,0,1,1,1,0,1,0,0,0,0,1,0,0,1,0,1,1,0,0,1],
    [1,0,0,0,0,0,1,0,1,1,0,0,1,1,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,1,1,1,1,1,1],
    [0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0],
    [1,1,0,1,0,1,1,1,0,0,1,0,0,1,1,0,1,0,1,1,0],
    [0,0,1,0,1,0,0,1,1,0,0,1,1,0,0,1,0,1,0,0,1],
    [1,0,1,1,0,1,1,0,0,1,0,0,1,1,0,1,1,0,1,0,0],
  ];

  return (
    <div style={{ display: 'grid', gridTemplateRows: `repeat(${pattern.length}, 8px)` }}>
      {pattern.map((row, r) => (
        <div key={r} style={{ display: 'flex' }}>
          {row.map((cell, c) => (
            <div key={c} style={{
              width: 8, height: 8,
              background: cell ? 'var(--ink)' : 'transparent',
            }} />
          ))}
        </div>
      ))}
    </div>
  );
}