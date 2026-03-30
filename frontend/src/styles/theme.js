// styles/theme.js
// Single source of truth for all colors, fonts, and card styles

export const theme = {
  colors: {
    background: '#0d1520',
    cardBg:     '#111d2e',
    border:     '#1e2d42',

    primary:  '#00d4aa',   // Positive / Strong  — teal
    neutral:  '#a29bfe',   // Neutral / Mixed     — purple (STANDARDIZED)
    warning:  '#ffa502',   // Caution / Orange
    danger:   '#ff4757',   // Negative / Weak     — red
    info:     '#3498db',   // Info                — blue

    textPrimary:   '#e8edf5',
    textSecondary: '#8892a4',
    textMuted:     '#5a6475',
    textDim:       '#3a4a60',
  },

  font: {
    mono: "'DM Mono', monospace",
    sans: "'DM Sans', sans-serif",
  },

  cardStyle: {
    background:   '#111d2e',
    border:       '1px solid #1e2d42',
    borderRadius: 12,
    padding:      24,
    boxShadow:    '0 4px 24px rgba(0,0,0,0.18)',
  },

  sectionTitle: {
    fontFamily:    "'DM Mono', monospace",
    fontSize:      11,
    fontWeight:    700,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginBottom:  16,
    paddingBottom: 10,
    borderBottom:  '1px solid #1e2d42',
    color:         '#3a4a60',
  },
};

export default theme;
