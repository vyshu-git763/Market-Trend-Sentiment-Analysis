import { useNavigate } from 'react-router-dom';
import Badge from '../components/Badge';
import useData from '../data/useData';
import theme from '../styles/theme';

const S = {
  page: { maxWidth:1280, margin:'0 auto', padding:'32px 24px' },
  g2:   { display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:16, marginBottom:24 },
  card: { ...theme.cardStyle, marginBottom:24 },
  sec:  { ...theme.sectionTitle },
  back: { display:'inline-flex', alignItems:'center', gap:8, color:'#5a6475', fontSize:12, fontFamily:"'DM Mono',monospace", cursor:'pointer', marginBottom:20, padding:'6px 12px', borderRadius:6, border:'1px solid #1e2d42', background:'#111d2e' },
};

export default function InsightsPage() {
  const nav = useNavigate();
  const D = useData();

  const total    = D.kpi.totalReviews;
  const posP     = D.kpi.positivePct;
  const acc      = D.kpi.accuracy;
  const dir      = D.trend.direction;
  const slope    = D.trend.slope;
  const slopeStr = `${slope>=0?'+':''}${slope}`;
  const r        = D.correlation.r ?? 'N/A';
  const p        = D.correlation.pValue ?? 'N/A';

  const bestAspect  = D.aspects.length > 0 ? D.aspects.reduce((a,b)=>a.positive>b.positive?a:b) : null;
  const worstAspect = D.aspects.length > 0 ? D.aspects.reduce((a,b)=>a.mentions>b.mentions?a:b) : null;

  // Fully dynamic executive summary
  const execSummary = `Analysis of ${total.toLocaleString()} reviews reveals a broadly ${posP>=60?'positive':'mixed'} sentiment landscape (${posP}% positive) with a DistilBERT model accuracy of ${acc}%.${bestAspect ? ` The ${bestAspect.name} aspect is the clear product strength at ${bestAspect.positive}% positive` : ''}${worstAspect && worstAspect.name !== bestAspect?.name ? `, while ${worstAspect.name} — the most discussed feature at ${worstAspect.mentions} mentions — presents the primary improvement opportunity at only ${worstAspect.positive}% positive` : ''}. The sentiment trend is ${dir} (${slopeStr} slope). Market correlation (r=${r}, p=${p}) is weak, indicating sentiment should drive product strategy rather than market timing.`;

  const dirColor = dir === 'IMPROVING' ? '#00d4aa' : dir === 'DECLINING' ? '#ff4757' : '#ffa502';

  return (
    <div style={{ background:theme.colors.background, color:'#c8d0dc', minHeight:'100vh', fontFamily:theme.font.sans }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <div style={S.page}>

        <div style={S.back} onClick={() => nav('/dashboard')}>← Back to Dashboard</div>
        <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#00d4aa', letterSpacing:'0.15em', marginBottom:6 }}>◇ BUSINESS INTELLIGENCE</div>
        <h1 style={{ fontFamily:"'DM Mono',monospace", fontSize:26, fontWeight:700, color:'#e8edf5', marginBottom:4 }}>What These Numbers Mean For You</h1>
        <div style={{ color:'#5a6475', fontSize:13, fontFamily:"'DM Mono',monospace", marginBottom:28 }}>
          SWOT Analysis · Actionable Recommendations · Strategic Priorities
        </div>

        {/* Executive Summary — fully dynamic */}
        <div style={{ ...S.card, background:'linear-gradient(135deg,#111d2e,#0d1f30)', border:'1px solid #00d4aa30' }}>
          <div style={S.sec}>Executive Summary</div>
          <p style={{ color:'#8892a4', fontSize:14, lineHeight:1.8 }}>{execSummary}</p>
        </div>

        {/* SWOT — from real API data */}
        <div style={S.g2}>
          {[
            { title:'STRENGTHS',     items: D.swot.strengths,     color:'#00d4aa', icon:'▲' },
            { title:'WEAKNESSES',    items: D.swot.weaknesses,    color:'#ff4757', icon:'▼' },
            { title:'OPPORTUNITIES', items: D.swot.opportunities, color:'#3498db', icon:'◎' },
            { title:'THREATS',       items: D.swot.threats,       color:'#ffa502', icon:'⚠' },
          ].map(s => (
            <div key={s.title} style={{ ...S.card, border:`1px solid ${s.color}30`, background:`${s.color}06` }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
                <span style={{ color:s.color, fontSize:16 }}>{s.icon}</span>
                <span style={{ fontFamily:"'DM Mono',monospace", fontSize:12, fontWeight:700, color:s.color, letterSpacing:'0.15em' }}>{s.title}</span>
              </div>
              {s.items && s.items.length > 0 ? s.items.map((item,i) => (
                <div key={i} style={{ display:'flex', gap:8, marginBottom:10, alignItems:'flex-start' }}>
                  <span style={{ color:s.color, fontSize:12, flexShrink:0, marginTop:2 }}>•</span>
                  <span style={{ color:'#8892a4', fontSize:13, lineHeight:1.5 }}>{item}</span>
                </div>
              )) : (
                <div style={{ color:'#3a4a60', fontSize:13 }}>No {s.title.toLowerCase()} identified yet.</div>
              )}
            </div>
          ))}
        </div>

        {/* Recommendations — from real API data */}
        <div style={S.card}>
          <div style={S.sec}>Actionable Recommendations</div>
          {D.recommendations && D.recommendations.length > 0 ? D.recommendations.map((r,i) => (
            <div key={i} style={{ display:'flex', gap:16, padding:'14px 0', borderBottom:'1px solid #1e2d42', alignItems:'center' }}>
              <div style={{ fontFamily:"'DM Mono',monospace", fontSize:11, color:'#3a4a60', width:24, textAlign:'center', flexShrink:0 }}>{String(i+1).padStart(2,'0')}</div>
              <Badge label={r.priority} type={r.priority}/>
              <span style={{ color:'#8892a4', fontSize:14, lineHeight:1.5 }}>{r.text}</span>
            </div>
          )) : (
            <div style={{ color:'#3a4a60', fontSize:13, fontFamily:"'DM Mono',monospace" }}>
              No recommendations available. Upload a CSV to generate insights.
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
