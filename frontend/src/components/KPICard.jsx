import { useState, useEffect } from 'react';

function Counter({ value, suffix = '', decimals = 0 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const end      = parseFloat(value);
    const duration = 1200;
    const step     = 16;
    const inc      = end / (duration / step);
    let current    = 0;

    const timer = setInterval(() => {
      current += inc;
      if (current >= end) { setDisplay(end); clearInterval(timer); }
      else setDisplay(current);
    }, step);

    return () => clearInterval(timer);
  }, [value]);

  return <>{decimals > 0 ? display.toFixed(decimals) : Math.floor(display)}{suffix}</>;
}

// ─── KPI CARD ─────────────────────────────────────────────────────────────────
// Props:
//   label   - string  e.g. "Total Reviews"
//   value   - number  e.g. 1000
//   suffix  - string  e.g. "%" or ""
//   decimals- number  e.g. 1 for 79.6%
//   color   - hex     e.g. "#00d4aa"
//   icon    - string  e.g. "◎"
//   desc    - string  e.g. "Amazon Electronics"
//   variant - 'top' | 'left'  (which side the color bar appears)

export default function KPICard({ label, value, suffix = '', decimals = 0, color = '#00d4aa', icon = '◈', desc = '', variant = 'top' }) {
  const borderStyle = variant === 'left'
    ? { borderLeft: `3px solid ${color}` }
    : { borderTop:  `3px solid ${color}30` };

  return (
    <div style={{
      background:    '#111d2e',
      border:        '1px solid #1e2d42',
      borderRadius:  12,
      padding:       '20px 24px',
      position:      'relative',
      overflow:      'hidden',
      ...borderStyle,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize:   38,
            fontWeight: 700,
            lineHeight: 1,
            color,
            marginBottom: 6,
          }}>
            <Counter value={value} suffix={suffix} decimals={decimals} />
          </div>
          <div style={{
            color:         '#5a6475',
            fontSize:      11,
            fontFamily:    "'DM Mono', monospace",
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}>
            {label}
          </div>
        </div>
        <div style={{ fontSize: 24, opacity: 0.3, color }}>{icon}</div>
      </div>
      {desc && (
        <div style={{
          color:      '#3a4a60',
          fontSize:   11,
          fontFamily: "'DM Mono', monospace",
          marginTop:  10,
        }}>
          {desc}
        </div>
      )}
      {/* Decorative bottom-right accent */}
      <div style={{
        position:     'absolute',
        bottom:       0,
        right:        0,
        width:        80,
        height:       3,
        background:   `linear-gradient(90deg, transparent, ${color}40)`,
        borderRadius: '0 0 12px 0',
      }} />
    </div>
  );
}