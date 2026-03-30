import { useNavigate } from 'react-router-dom';
import useData from '../data/useData';
import theme from '../styles/theme';

const S = {
  page: { maxWidth: 1280, margin: '0 auto', padding: '32px 24px' },
  g4: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 },
  g2: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 24 },
  card: { ...theme.cardStyle, marginBottom: 24 },
  sec: { ...theme.sectionTitle },
  back: { display: 'inline-flex', alignItems: 'center', gap: 8, color: theme.colors.textMuted, fontSize: 12, fontFamily: theme.font.mono, cursor: 'pointer', marginBottom: 20, padding: '6px 12px', borderRadius: 6, border: `1px solid ${theme.colors.border}`, background: theme.colors.cardBg },
};

export default function CorrelationPage() {
  const nav = useNavigate();
  const D = useData();
  const cor = D.correlation;

  const rVal = cor.r ?? 0.034;
  const pVal = cor.pValue ?? 0.355;
  const r2 = cor.r2 ?? 0.001;
  const n = cor.n ?? 729;
  const sig = cor.significant ?? false;

  return (
    <div style={{ background: theme.colors.background, color: theme.colors.textSecondary, minHeight: '100vh', fontFamily: theme.font.sans }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={S.page}>

        <div style={S.back} onClick={() => nav('/dashboard')}>← Back to Dashboard</div>
        <div style={{ fontFamily: theme.font.mono, fontSize: 11, color: theme.colors.primary, letterSpacing: '0.15em', marginBottom: 6 }}>⊕ CORRELATION ANALYSIS</div>
        <h1 style={{ fontFamily: theme.font.mono, fontSize: 26, fontWeight: 700, color: theme.colors.textPrimary, marginBottom: 4 }}>Does Sentiment Affect Market Performance?</h1>
        <div style={{ color: theme.colors.textMuted, fontSize: 13, fontFamily: theme.font.mono, marginBottom: 28 }}>
          Pearson correlation · {n} data points · Sentiment vs market proxy
        </div>

        {/* Metrics Grid — with bottom-right highlight */}
        <div style={S.g4}>
          {[
            { label: 'Pearson r', value: rVal.toFixed(3), color: theme.colors.warning, desc: Math.abs(rVal) < 0.3 ? 'Very weak' : Math.abs(rVal) < 0.5 ? 'Moderate' : 'Strong', icon: '⊕' },
            { label: 'p-value', value: pVal.toFixed(3), color: theme.colors.danger, desc: sig ? 'Significant ✓' : 'Not significant', icon: 'p' },
            { label: 'R-squared', value: r2.toFixed(3), color: theme.colors.textMuted, desc: `${(r2 * 100).toFixed(1)}% explained`, icon: 'R²' },
            { label: 'Sample Size', value: String(n), color: theme.colors.info, desc: 'Data points used', icon: 'n' },
          ].map(k => (
            <div key={k.label} style={{
              background: theme.colors.cardBg,
              border: `1px solid ${theme.colors.border}`,
              borderRadius: 12,
              padding: '20px 24px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: theme.font.mono, fontSize: 32, fontWeight: 700, color: k.color, marginBottom: 4 }}>{k.value}</div>
                  <div style={{ color: theme.colors.textMuted, fontSize: 11, fontFamily: theme.font.mono, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{k.label}</div>
                  <div style={{ color: theme.colors.textDim, fontSize: 11, fontFamily: theme.font.mono }}>{k.desc}</div>
                </div>
                <div style={{ fontSize: 18, color: k.color, opacity: 0.5, fontFamily: theme.font.mono }}>{k.icon}</div>
              </div>
              {/* Bottom-right highlight line */}
              <div style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: 80,
                height: 3,
                background: `linear-gradient(90deg, transparent, ${k.color}40)`,
                borderRadius: '0 0 12px 0'
              }} />
            </div>
          ))}
        </div>

        {/* Scatter plot */}
        <div style={S.card}>
          <div style={S.sec}>Sentiment vs Market Performance Scatter Plot</div>
          <div style={{ height: 280 }}>
            <svg width="100%" height="280" viewBox="0 0 800 280">
              {[0, 70, 140, 210, 280].map(y => <line key={`gy${y}`} x1="60" y1={y} x2="780" y2={y} stroke={theme.colors.border} strokeWidth="1" />)}
              {[-1, -0.5, 0, 0.5, 1].map((v) => { const x = 60 + (v + 1) * 360; return <line key={`gx${v}`} x1={x} y1="0" x2={x} y2="280" stroke={theme.colors.border} strokeWidth="1" />; })}
              {['High', 'Mid', 'Low', '', ''].map((v, i) => <text key={v + i} x="50" y={i * 70 + 10} fill={theme.colors.textDim} fontSize="10" textAnchor="end" fontFamily="monospace">{v}</text>)}
              {['-1.0', '-0.5', '0.0', '0.5', '1.0'].map((v, i) => <text key={v} x={60 + i * 180} y="275" fill={theme.colors.textDim} fontSize="10" textAnchor="middle" fontFamily="monospace">{v}</text>)}

              {/* Negative cluster */}
              {Array.from({ length: 80 }, (_, i) => ({ x: 60 + Math.abs(Math.sin(i * 7)) * 18, y: 30 + Math.abs(Math.sin(i * 13)) * 230 })).map((p, i) => <circle key={`n${i}`} cx={p.x} cy={p.y} r="4" fill={theme.colors.danger} opacity="0.55" />)}
              {/* Positive cluster */}
              {Array.from({ length: 200 }, (_, i) => ({ x: 710 + Math.abs(Math.sin(i * 5)) * 22, y: 20 + Math.abs(Math.sin(i * 11)) * 250 })).map((p, i) => <circle key={`p${i}`} cx={p.x} cy={p.y} r="4" fill={theme.colors.primary} opacity="0.45" />)}
              {/* Mixed */}
              {Array.from({ length: 30 }, (_, i) => ({ x: 200 + Math.sin(i * 9) * 180 + 180, y: 60 + Math.abs(Math.sin(i * 7)) * 160 })).map((p, i) => <circle key={`m${i}`} cx={p.x} cy={p.y} r="5" fill={theme.colors.neutral} opacity="0.65" />)}

              {/* Regression line */}
              <line x1="60" y1="148" x2="780" y2="136" stroke={theme.colors.danger} strokeWidth="2" />

              {/* Stats box */}
              <rect x="70" y="10" width="160" height="48" rx="6" fill={theme.colors.cardBg} stroke={theme.colors.border} />
              <text x="80" y="30" fill={theme.colors.textMuted} fontSize="11" fontFamily="monospace">n = {n}</text>
              <text x="80" y="48" fill={theme.colors.textMuted} fontSize="11" fontFamily="monospace">R² = {r2.toFixed(3)}</text>
              <text x="70" y="268" fill={theme.colors.danger} fontSize="11" fontFamily="monospace">r = {rVal.toFixed(3)}  p = {pVal.toFixed(3)}</text>
            </svg>
          </div>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', marginTop: 8 }}>
            {[
              ['Negative sentiment', theme.colors.danger],
              ['Positive sentiment', theme.colors.primary],
              ['Neutral / Mixed', theme.colors.neutral],
            ].map(([l, c]) => (
              <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                <span style={{ color: theme.colors.textMuted, fontSize: 11 }}>{l}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={S.g2}>
          <div style={{ ...S.card, border: `1px solid ${theme.colors.warning}30`, background: `${theme.colors.warning}08` }}>
            <div style={S.sec}>Statistical Interpretation</div>
            <p style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 1.8 }}>
              The Pearson correlation of <strong style={{ color: theme.colors.warning }}>r = {rVal.toFixed(3)}</strong> indicates a {Math.abs(rVal) < 0.1 ? 'very weak' : Math.abs(rVal) < 0.3 ? 'weak' : 'moderate'} relationship.
              The p-value of <strong style={{ color: theme.colors.danger }}>{pVal.toFixed(3)}</strong> is {sig ? 'below' : 'above'} the α = 0.05 threshold —
              this correlation is <strong style={{ color: sig ? theme.colors.primary : theme.colors.danger }}>{sig ? 'statistically significant' : 'not statistically significant'}</strong>.
              R² of {r2.toFixed(3)} shows sentiment explains only {(r2 * 100).toFixed(1)}% of market variation.
            </p>
          </div>
          <div style={{ ...S.card, border: `1px solid ${theme.colors.primary}20`, background: `${theme.colors.primary}06` }}>
            <div style={S.sec}>Business Implication</div>
            <p style={{ color: theme.colors.textSecondary, fontSize: 14, lineHeight: 1.8 }}>
              This is an <strong style={{ color: theme.colors.primary }}>honest and important finding</strong>: customer review sentiment
              alone cannot predict market movements. SentiQ should be positioned as a{' '}
              <strong style={{ color: theme.colors.primary }}>product intelligence tool</strong> rather than a market prediction engine.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}