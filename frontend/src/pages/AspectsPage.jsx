import { useNavigate } from 'react-router-dom';
import KPICard from '../components/KPICard';
import HorizontalBar from '../components/HorizontalBar';
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

export default function AspectsPage() {
  const nav = useNavigate();
  const D = useData();

  const aspects = D.aspects;
  const totalMentions = aspects.reduce((a, b) => a + b.mentions, 0);
  const maxMentions = Math.max(...aspects.map(a => a.mentions), 1);
  const mostDiscussed = aspects.reduce((a, b) => a.mentions > b.mentions ? a : b, aspects[0] || { name: 'N/A' });
  const bestRated = aspects.reduce((a, b) => a.positive > b.positive ? a : b, aspects[0] || { name: 'N/A' });

  const statusOf = (pct) => pct >= 80 ? 'STRONG' : pct >= 70 ? 'GOOD' : pct >= 65 ? 'MIXED' : 'WEAK';

  const keyInsights = aspects.length > 0 ? [
    `${mostDiscussed.name} is most discussed (${mostDiscussed.mentions} mentions) with ${mostDiscussed.positive}% positive${mostDiscussed.positive < 70 ? ' — priority improvement area' : ''}`,
    `${bestRated.name} is the strongest feature (${bestRated.positive}% positive)${bestRated.positive > 75 ? ' — key marketing differentiator' : ''}`,
    aspects.length > 2 ? `${aspects[aspects.length - 1].name} has fewest mentions (${aspects[aspects.length - 1].mentions}) — limited data available` : null,
    aspects.filter(a => a.positive < 65).length > 0
      ? `${aspects.filter(a => a.positive < 65).map(a => a.name).join(', ')} ${aspects.filter(a => a.positive < 65).length > 1 ? 'have' : 'has'} below 65% positive — needs attention`
      : `Overall aspect sentiment is healthy — all categories above 65% positive`,
  ].filter(Boolean) : ['Upload a CSV to see real aspect insights'];

  return (
    <div style={{ background: theme.colors.background, color: theme.colors.textPrimary, minHeight: '100vh', fontFamily: theme.font.sans }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={S.page}>

        <div style={S.back} onClick={() => nav('/dashboard')}>← Back to Dashboard</div>
        <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 11, color: '#00d4aa', letterSpacing: '0.15em', marginBottom: 6 }}>◈ ASPECT-BASED ANALYSIS</div>
        <h1 style={{ fontFamily: "'DM Mono',monospace", fontSize: 26, fontWeight: 700, color: '#e8edf5', marginBottom: 4 }}>What Customers Are Talking About</h1>
        <div style={{ color: '#5a6475', fontSize: 13, fontFamily: "'DM Mono',monospace", marginBottom: 28 }}>
          {aspects.length} product categories · Keyword-based extraction · Per-aspect sentiment scoring
        </div>

        {/* KPI Row — with bottom-right highlight on last 2 cards */}
        <div style={S.g4}>
          <KPICard label="Total Mentions" value={totalMentions} suffix="" decimals={0} color="#00d4aa" icon="◈" variant="left" />
          <KPICard label="Unique Aspects" value={aspects.length} suffix="" decimals={0} color="#3498db" icon="◎" variant="left" />

          {/* Most Discussed — with bottom-right highlight */}
          {/* Most Discussed — with icon */}
          <div style={{
            background: theme.colors.cardBg,
            border: '1px solid #1e2d42',
            borderRadius: 12,
            padding: '20px 24px',
            borderLeft: '3px solid #ffa502',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 700, color: '#ffa502', marginBottom: 4 }}>
                  {mostDiscussed.name}
                </div>
                <div style={{ color: '#5a6475', fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Most Discussed
                </div>
              </div>
              <div style={{ fontSize: 24, color: '#ffa502', opacity: 0.6 }}>◎</div>  {/* ICON ADDED */}
            </div>
            {/* Bottom-right highlight line */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 80,
              height: 3,
              background: 'linear-gradient(90deg, transparent, #ffa50240)',
              borderRadius: '0 0 12px 0'
            }} />
          </div>

          {/* Best Rated — with icon */}
          <div style={{
            background: theme.colors.cardBg,
            border: '1px solid #1e2d42',
            borderRadius: 12,
            padding: '20px 24px',
            borderLeft: '3px solid #00d4aa',
            boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontFamily: "'DM Mono',monospace", fontSize: 22, fontWeight: 700, color: '#00d4aa', marginBottom: 4 }}>
                  {bestRated.name}
                </div>
                <div style={{ color: '#5a6475', fontSize: 11, fontFamily: "'DM Mono',monospace", letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Best Rated
                </div>
              </div>
              <div style={{ fontSize: 24, color: '#00d4aa', opacity: 0.6 }}>★</div>  {/* ICON ADDED */}
            </div>
            {/* Bottom-right highlight line */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 80,
              height: 3,
              background: 'linear-gradient(90deg, transparent, #00d4aa40)',
              borderRadius: '0 0 12px 0'
            }} />
          </div>
        </div>

        {/* Charts Row */}
        <div style={S.g2}>
          <div style={S.card}>
            <div style={S.sec}>Mention Frequency</div>
            {aspects.map(a => (
              <HorizontalBar key={a.name} label={a.name} value={a.mentions} max={maxMentions} color="#00d4aa"
                subtitle={`${a.mentions} mentions (${totalMentions > 0 ? ((a.mentions / totalMentions) * 100).toFixed(1) : 0}% of total)`}
              />
            ))}
          </div>
          <div style={S.card}>
            <div style={S.sec}>Sentiment by Aspect</div>
            {aspects.map(a => (
              <div key={a.name} style={{ marginBottom: 14 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ color: '#c8d0dc', fontSize: 13 }}>{a.name}</span>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span style={{ color: '#00d4aa', fontSize: 12, fontFamily: "'DM Mono',monospace" }}>{a.positive}% ▲</span>
                    <span style={{ color: '#ff4757', fontSize: 12, fontFamily: "'DM Mono',monospace" }}>{a.negative}% ▼</span>
                  </div>
                </div>
                <div style={{ height: 12, borderRadius: 6, overflow: 'hidden', display: 'flex' }}>
                  <div style={{ width: `${a.positive}%`, background: 'linear-gradient(90deg,#00d4aa80,#00d4aa)' }} />
                  <div style={{ width: `${a.negative}%`, background: 'linear-gradient(90deg,#ff475780,#ff4757)' }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={S.card}>
          <div style={S.sec}>Aspect Details Table</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>{['Aspect', 'Mentions', 'Positive %', 'Negative %', 'Status'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {aspects.map((a, i) => {
                const st = statusOf(a.positive);
                const c = { STRONG: '#00d4aa', GOOD: '#00c896', MIXED: '#ffa502', WEAK: '#ff4757' }[st];
                return (
                  <tr key={a.name} style={{ background: i % 2 === 0 ? 'transparent' : '#1a253510' }}>
                    <td style={{ ...S.td, fontWeight: 600, color: '#c8d0dc' }}>{a.name}</td>
                    <td style={{ ...S.td, fontFamily: "'DM Mono',monospace", color: '#00d4aa' }}>{a.mentions}</td>
                    <td style={{ ...S.td, fontFamily: "'DM Mono',monospace", color: '#00d4aa' }}>{a.positive}%</td>
                    <td style={{ ...S.td, fontFamily: "'DM Mono',monospace", color: '#ff4757' }}>{a.negative}%</td>
                    <td style={S.td}><span style={{ color: c, fontFamily: "'DM Mono',monospace", fontSize: 11, fontWeight: 700 }}>{st}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Key Insights */}
        <div style={{ ...S.card, background: '#00d4aa08', border: '1px solid #00d4aa20' }}>
          <div style={S.sec}>Key Insights</div>
          {keyInsights.map((ins, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
              <span style={{ color: '#00d4aa', fontSize: 16, flexShrink: 0 }}>◈</span>
              <span style={{ color: '#8892a4', fontSize: 13, lineHeight: 1.5 }}>{ins}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}