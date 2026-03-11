// ─── GLOBAL THEME ────────────────────────────────────────────────────────────
// Import this in any component: import { theme } from '../styles/theme'

export const theme = {
  // Core colors
  bg:       '#0d1520',
  card:     '#111d2e',
  border:   '#1e2d42',
  accent:   '#00d4aa',
  red:      '#ff4757',
  blue:     '#3498db',
  purple:   '#a29bfe',
  orange:   '#ffa502',

  // Text colors
  textPrimary:   '#e8edf5',
  textSecondary: '#8892a4',
  textMuted:     '#5a6475',
  textDim:       '#3a4a60',

  // Fonts
  fontMono: "'DM Mono', monospace",
  fontSans: "'DM Sans', sans-serif",

  // Reusable style objects
  card: {
    background: '#111d2e',
    border:     '1px solid #1e2d42',
    borderRadius: 12,
    padding:    24,
  },

  sectionTitle: {
    fontFamily:    "'DM Mono', monospace",
    fontSize:      11,
    fontWeight:    700,
    color:         '#3a4a60',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    marginBottom:  16,
    borderBottom:  '1px solid #1e2d42',
    paddingBottom: 10,
  },
};

export default theme;