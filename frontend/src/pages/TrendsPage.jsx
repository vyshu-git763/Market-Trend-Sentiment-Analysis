import { useNavigate } from 'react-router-dom';
import useData from '../data/useData';
import theme from '../styles/theme';

const S = {
  page: { maxWidth: 1280, margin: '0 auto', padding: '32px 24px' },
  g4: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 28 },
  g2: { display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, marginBottom: 24 },
  card: { ...theme.cardStyle, marginBottom: 24 },
  sec: { ...theme.sectionTitle },
  back: { display: 'inline-flex', alignItems: 'center', gap: 8, color: '#5a6475', fontSize: 12, fontFamily: "'DM Mono',monospace", cursor: 'pointer', marginBottom: 20, padding: '6px 12px', borderRadius: 6, border: '1px solid #1e2d42', background: '#111d2e' },
  th: { textAlign: 'left', padding: '8px 12px', fontSize: 11, fontFamily: "'DM Mono',monospace", color: '#3a4a60', borderBottom: '1px solid #1e2d42', letterSpacing: '0.08em' },
  td: { padding: '10px 12px', fontSize: 13, borderBottom: '1px solid #1e2d4210', verticalAlign: 'middle' },
};

export default function TrendsPage() {
  const nav = useNavigate();
  const D = useData();

  const trend = D.trend;
  const direction = trend.direction || 'STABLE';
  const slope = trend.slope ?? 0;
  const bestP = trend.bestPeriod || 'N/A';
  const worstP = trend.worstPeriod || 'N/A';
  const quarterly = trend.quarterly || [];
  const slopeStr = `${slope >= 0 ? '+' : ''}${slope}`;
  const dirColor = direction === 'IMPROVING' ? '#00d4aa' : direction === 'DECLINING' ? '#ff4757' : '#ffa502';

  const interpretation = direction === 'IMPROVING'
    ? `The improving trend (${slopeStr} slope) suggests customer satisfaction is growing. The ${worstP} dip may correlate with product/service update cycles. Current trajectory is positive — capitalize on this momentum in marketing.`
    : direction === 'DECLINING'
      ? `The declining trend (${slopeStr} slope) signals decreasing customer satisfaction. Immediate investigation into the ${worstP} period is recommended. Address root causes before launching new campaigns.`
      : `Sentiment is broadly stable (${slopeStr} slope). Focus on maintaining quality standards and identifying opportunities to push into positive growth territory.`;

  return (
    <div style={{ background: theme.colors.background, color: '#c8d0dc', minHeight: '100vh', fontFamily: theme.font.sans }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={S.page}>

        <div style={S.back} onClick={() => nav('/dashboard')}>← Back to Dashboard</div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#00d4aa', letterSpacing: '0.15em', marginBottom: 6 }}>△ TREND ANALYSIS</div>
        <h1 style={{ fontFamily: "'DM Mono',monospace", fontSize: 26, fontWeight: 700, color: '#e8edf5', marginBottom: 4 }}>How Sentiment Changes Over Time</h1>
        <div style={{ color: '#5a6475', fontSize: 13, fontFamily: "'DM Mono',monospace", marginBottom: 28 }}>
          Temporal sentiment analysis · {D.kpi.sentimentDays} days of data · Monthly aggregation
        </div>

        {/* KPI Row — with bottom-right highlight */}
        <div style={S.g4}>
          {[
            { label: 'Overall Direction', value: direction, color: dirColor, icon: direction === 'IMPROVING' ? '↗' : direction === 'DECLINING' ? '↘' : '→' },
            { label: 'Trend Slope', value: slopeStr, color: slope >= 0 ? '#00d4aa' : '#ff4757', icon: slope >= 0 ? '▲' : '▼' },
            { label: 'Best Period', value: bestP, color: '#3498db', icon: '★' },
            { label: 'Worst Period', value: worstP, color: '#ff4757', icon: '⚠' },
          ].map(k => (
            <div key={k.label} style={{
              background: '#111d2e',
              border: '1px solid #1e2d42',
              borderRadius: 12,
              padding: '20px 24px',
              borderLeft: `3px solid ${k.color}`,
              boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
              position: 'relative',
              overflow: 'hidden'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: k.value.length > 8 ? 16 : 22, fontWeight: 700, color: k.color, marginBottom: 4 }}>{k.value}</div>
                  <div style={{ color: '#5a6475', fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>{k.label}</div>
                </div>
                <div style={{ fontSize: 20, color: k.color, opacity: 0.6 }}>{k.icon}</div>
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

        {/* Trend Chart */}
        <div style={S.card}>
          <div style={S.sec}>Sentiment Score Over Time</div>
          <div style={{ position: 'relative', overflow: 'hidden', height: 220 }}>
            <svg width="100%" height="200" viewBox="0 0 900 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={dirColor} stopOpacity="0.3" />
                  <stop offset="100%" stopColor={dirColor} stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0, 50, 100, 150, 200].map(y => <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="#1e2d42" strokeWidth="1" />)}
              <path d="M0,120 C50,110 80,140 120,100 C160,60 180,130 230,90 C280,50 300,120 350,80 C400,40 420,110 470,70 C520,30 550,100 600,60 C640,30 670,80 720,50 C760,25 800,55 850,35 L900,30 L900,200 L0,200Z" fill="url(#tg)" />
              <path d="M0,120 C50,110 80,140 120,100 C160,60 180,130 230,90 C280,50 300,120 350,80 C400,40 420,110 470,70 C520,30 550,100 600,60 C640,30 670,80 720,50 C760,25 800,55 850,35 L900,30" fill="none" stroke={dirColor} strokeWidth="2.5" />
              <line x1="0" y1="140" x2="900" y2="30" stroke={`${dirColor}60`} strokeWidth="1.5" strokeDasharray="6,4" />
            </svg>
          </div>
          {quarterly.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingLeft: 20, marginTop: 4 }}>
              {quarterly.map(q => (
                <span key={q.period} style={{ color: '#3a4a60', fontSize: 10, fontFamily: "'DM Mono',monospace" }}>{q.period}</span>
              ))}
            </div>
          )}
        </div>

        <div style={S.g2}>
          <div style={S.card}>
            <div style={S.sec}>Period Summary</div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 12,
              paddingBottom: 8,
              borderBottom: '1px solid #2a3a52',
              fontSize: 12,
              color: '#8892a6',
              fontFamily: "'DM Mono', monospace"
            }}>
              <div>Period</div>
              <div>Slope</div>
            </div>
            {quarterly.length > 0 ? quarterly.map(q => {
              const c = q.sentiment > 0.6 ? '#00d4aa' : q.sentiment > 0.3 ? '#ffa502' : '#ff4757';
              return (
                <div key={q.period} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 12, borderBottom: '1px solid #1e2d42' }}>
                  <div>
                    <div style={{ color: '#c8d0dc', fontSize: 13, fontFamily: "'DM Mono',monospace" }}>{q.period}</div>
                    <div style={{ color: '#5a6475', fontSize: 11 }}>{q.trend}</div>
                  </div>
                  <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 20, fontWeight: 700, color: c }}>{q.sentiment.toFixed(2)}</div>
                </div>
              );
            }) : (
              <div style={{ color: '#3a4a60', fontSize: 13, fontFamily: "'DM Mono',monospace" }}>
                No period data available — upload a CSV with a date column to enable trend analysis.
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div style={S.card}>
              <div style={S.sec}>Key Events</div>
              {[
                { icon: slope >= 0 ? '▲' : '▼', color: dirColor, label: 'Overall Direction', value: `${direction} trend (slope: ${slopeStr})` },
                { icon: '↗', color: '#00d4aa', label: 'Best Period', value: bestP },
                { icon: '↘', color: '#ff4757', label: 'Worst Period', value: worstP },
              ].map(e => (
                <div key={e.label} style={{ display: 'flex', gap: 12, marginBottom: 14, alignItems: 'center' }}>
                  <div style={{ width: 32, height: 32, borderRadius: 8, background: `${e.color}15`, border: `1px solid ${e.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: e.color, fontWeight: 700 }}>{e.icon}</div>
                  <div>
                    <div style={{ color: '#5a6475', fontSize: 11, fontFamily: "'DM Mono',monospace" }}>{e.label}</div>
                    <div style={{ color: '#c8d0dc', fontSize: 13 }}>{e.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ ...S.card, background: `${dirColor}08`, border: `1px solid ${dirColor}20` }}>
              <div style={S.sec}>Business Interpretation</div>
              <p style={{ color: '#8892a4', fontSize: 13, lineHeight: 1.7 }}>{interpretation}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}