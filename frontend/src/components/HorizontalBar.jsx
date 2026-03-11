// ─── HORIZONTAL BAR ──────────────────────────────────────────────────────────
// Props:
//   label    - string
//   value    - number
//   max      - number  (used to calculate fill %)
//   color    - hex
//   subtitle - string (optional small text below bar)

export default function HorizontalBar({ label, value, max, color = '#00d4aa', subtitle = '' }) {
  const pct = Math.min((value / max) * 100, 100);

  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ color: '#c8d0dc', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
          {label}
        </span>
        <span style={{ color, fontSize: 13, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>
          {value}
        </span>
      </div>

      <div style={{ background: '#1a2535', borderRadius: 4, height: 8, overflow: 'hidden' }}>
        <div style={{
          width:        `${pct}%`,
          height:       '100%',
          background:   `linear-gradient(90deg, ${color}aa, ${color})`,
          borderRadius: 4,
          transition:   'width 1s ease',
        }} />
      </div>

      {subtitle && (
        <div style={{ color: '#5a6475', fontSize: 11, marginTop: 3, fontFamily: "'DM Mono', monospace" }}>
          {subtitle}
        </div>
      )}
    </div>
  );
}