// components/DonutChart.jsx
// Neutral segment uses #a29bfe (purple) to match theme.colors.neutral

export default function DonutChart({ positive = 70.7, negative = 21.8, neutral = 7.5, size = 180 }) {
  const r      = size * 0.39;
  const cx     = size / 2;
  const cy     = size / 2;
  const stroke = size * 0.12;
  const circ   = 2 * Math.PI * r;

  const posDash = (positive / 100) * circ;
  const neuDash = (neutral  / 100) * circ;

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      {/* Background track */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a2535" strokeWidth={stroke} />

      {/* Negative — full circle base (red) */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#ff4757" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={0}
        strokeLinecap="butt"
        transform={`rotate(-90 ${cx} ${cy})`}
      />

      {/* Neutral — drawn over negative (purple — matches theme.colors.neutral) */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#a29bfe" strokeWidth={stroke}
        strokeDasharray={`${posDash + neuDash} ${circ - posDash - neuDash}`}
        strokeDashoffset={0}
        strokeLinecap="butt"
        transform={`rotate(-90 ${cx} ${cy})`}
      />

      {/* Positive — drawn on top (teal) */}
      <circle
        cx={cx} cy={cy} r={r}
        fill="none" stroke="#00d4aa" strokeWidth={stroke}
        strokeDasharray={`${posDash} ${circ - posDash}`}
        strokeDashoffset={0}
        strokeLinecap="butt"
        transform={`rotate(-90 ${cx} ${cy})`}
      />

      {/* Center text */}
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#00d4aa"
        fontSize={size * 0.12} fontWeight="700" fontFamily="'DM Mono', monospace">
        {positive}%
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#8892a4"
        fontSize={size * 0.062} fontFamily="'DM Sans', sans-serif">
        POSITIVE
      </text>
    </svg>
  );
}
