// components/Badge.jsx
// Consistent color map — neutral/mixed uses purple (#a29bfe) to match theme

const colorMap = {
  POSITIVE: { bg: '#00d4aa20', text: '#00d4aa', border: '#00d4aa40' },
  NEGATIVE: { bg: '#ff475720', text: '#ff4757', border: '#ff475740' },
  NEUTRAL:  { bg: '#a29bfe20', text: '#a29bfe', border: '#a29bfe40' },  // purple — matches theme.colors.neutral
  HIGH:     { bg: '#ff475720', text: '#ff4757', border: '#ff475740' },
  MEDIUM:   { bg: '#ffa50220', text: '#ffa502', border: '#ffa50240' },
  LOW:      { bg: '#3498db20', text: '#3498db', border: '#3498db40' },
  STRONG:   { bg: '#00d4aa20', text: '#00d4aa', border: '#00d4aa40' },
  GOOD:     { bg: '#00c89620', text: '#00c896', border: '#00c89640' },
  MIXED:    { bg: '#a29bfe20', text: '#a29bfe', border: '#a29bfe40' },  // purple — matches theme.colors.neutral
  WEAK:     { bg: '#ff475720', text: '#ff4757', border: '#ff475740' },
  STABLE:   { bg: '#3498db20', text: '#3498db', border: '#3498db40' },
};

export default function Badge({ label, type }) {
  const key = (type || label || '').toString().toUpperCase();
  const c = colorMap[key] || colorMap.MEDIUM;
  return (
    <span style={{
      background:    c.bg,
      color:         c.text,
      border:        `1px solid ${c.border}`,
      borderRadius:  4,
      padding:       '2px 8px',
      fontSize:      11,
      fontFamily:    "'DM Mono', monospace",
      fontWeight:    700,
      letterSpacing: '0.05em',
      whiteSpace:    'nowrap',
    }}>
      {label}
    </span>
  );
}
