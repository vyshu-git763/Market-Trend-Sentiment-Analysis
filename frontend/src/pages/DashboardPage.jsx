import { useNavigate } from 'react-router-dom';
import KPICard       from '../components/KPICard';
import DonutChart    from '../components/DonutChart';
import HorizontalBar from '../components/HorizontalBar';
import RatingBars    from '../components/RatingBars';
import Badge         from '../components/Badge';
import { demoData as D } from '../data/demoData';

// ── Tiny sparkline (inline, no dependency) ───────────────────────────────────
function Sparkline() {
  const pts = [0.45,0.32,0.51,0.38,0.67,0.58,0.72,0.61,0.78,0.65,0.82,0.74];
  const w=120, h=60;
  const xs = pts.map((_,i) => (i/(pts.length-1))*w);
  const ys = pts.map(v => h - v*h);
  return (
    <svg width={w} height={h} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="sg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00d4aa" stopOpacity="0.3"/>
          <stop offset="100%" stopColor="#00d4aa" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon
        points={`${xs[0]},${h} ${xs.map((x,i)=>`${x},${ys[i]}`).join(' ')} ${xs[xs.length-1]},${h}`}
        fill="url(#sg)"
      />
      <polyline
        points={xs.map((x,i)=>`${x},${ys[i]}`).join(' ')}
        fill="none" stroke="#00d4aa" strokeWidth="2"
        strokeLinecap="round" strokeLinejoin="round"
      />
      <circle cx={xs[xs.length-1]} cy={ys[ys.length-1]} r="3" fill="#00d4aa"/>
    </svg>
  );
}

// ── Shared styles ─────────────────────────────────────────────────────────────
const S = {
  page:  { maxWidth: 1280, margin: '0 auto', padding: '32px 24px' },
  g4:    { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 },
  g3:    { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 24 },
  g2:    { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 24 },
  card:  { background: '#111d2e', border: '1px solid #1e2d42', borderRadius: 12, padding: 24 },
  sec:   { fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, color: '#3a4a60', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, borderBottom: '1px solid #1e2d42', paddingBottom: 10 },
  link:  { color: '#00d4aa', fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 12 },
  th:    { textAlign: 'left', padding: '8px 12px', fontSize: 11, fontFamily: "'DM Mono', monospace", color: '#3a4a60', borderBottom: '1px solid #1e2d42', letterSpacing: '0.08em' },
  td:    { padding: '10px 12px', fontSize: 13, borderBottom: '1px solid #1e2d4210', verticalAlign: 'middle' },
};

export default function DashboardPage() {
  const nav = useNavigate();

  return (
    <div style={{ background: '#0d1520', color: '#c8d0dc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div style={S.page}>
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#00d4aa', letterSpacing: '0.15em', marginBottom: 6 }}>◈ SMART ANALYTICAL SYSTEM — RESULTS</div>
          <h1 style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 700, color: '#e8edf5', marginBottom: 4 }}>Market Sentiment Dashboard</h1>
          <div style={{ color: '#5a6475', fontSize: 13, fontFamily: "'DM Mono', monospace" }}>Analyzing 1,000 Amazon Electronics reviews · 2000–2012 · DistilBERT Model</div>
        </div>

        {/* KPI Cards */}
        <div style={S.g4}>
          <KPICard label="Total Reviews"      value={1000}  suffix=""  decimals={0} color="#3498db" icon="◎" desc="Amazon Electronics"   />
          <KPICard label="Model Accuracy"     value={79.6}  suffix="%" decimals={1} color="#00d4aa" icon="◈" desc="vs user star ratings"  />
          <KPICard label="Positive Sentiment" value={70.7}  suffix="%" decimals={1} color="#00d4aa" icon="△" desc="707 of 1,000 reviews"  />
          <KPICard label="Days of Data"       value={729}   suffix=""  decimals={0} color="#a29bfe" icon="⬡" desc="Sentiment time series" />
        </div>

        {/* 3-column charts */}
        <div style={S.g3}>
          {/* Donut */}
          <div style={S.card}>
            <div style={S.sec}>Sentiment Distribution</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <DonutChart positive={D.kpi.positivePct} negative={D.kpi.negativePct} />
              <div>
                {[['Positive', D.sentiment.positive, '#00d4aa'], ['Negative', D.sentiment.negative, '#ff4757']].map(([l,v,c]) => (
                  <div key={l} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
                      <div style={{ width:10, height:10, borderRadius:'50%', background:c }}/>
                      <span style={{ fontSize:13, color:'#8892a4' }}>{l}</span>
                    </div>
                    <div style={{ fontFamily:"'DM Mono', monospace", fontSize:22, fontWeight:700, color:c }}>{v}</div>
                  </div>
                ))}
                <div style={{ background:'#1a2535', borderRadius:8, padding:'8px 12px' }}>
                  <div style={{ color:'#5a6475', fontSize:10, fontFamily:"'DM Mono', monospace", marginBottom:2 }}>AVG CONFIDENCE</div>
                  <div style={{ color:'#00d4aa', fontSize:18, fontFamily:"'DM Mono', monospace", fontWeight:700 }}>97.4%</div>
                </div>
              </div>
            </div>
            <div style={S.link} onClick={() => nav('/sentiment')}>View Full Analysis →</div>
          </div>

          {/* Aspects */}
          <div style={S.card}>
            <div style={S.sec}>Top Aspects Mentioned</div>
            {D.aspects.slice(0,5).map(a => (
              <HorizontalBar
                key={a.name} label={a.name} value={a.mentions} max={392}
                color={a.positive > 70 ? '#00d4aa' : a.positive > 65 ? '#ffa502' : '#ff4757'}
                subtitle={`${a.positive}% positive`}
              />
            ))}
            <div style={S.link} onClick={() => nav('/aspects')}>View Aspect Details →</div>
          </div>

          {/* Trend */}
          <div style={S.card}>
            <div style={S.sec}>Sentiment Trend</div>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12 }}>
              <div>
                <div style={{ fontFamily:"'DM Mono', monospace", fontSize:22, fontWeight:700, color:'#00d4aa' }}>IMPROVING</div>
                <div style={{ color:'#5a6475', fontSize:11, fontFamily:"'DM Mono', monospace" }}>Slope: +0.012 over 13 years</div>
              </div>
              <div style={{ background:'#00d4aa15', border:'1px solid #00d4aa30', borderRadius:6, padding:'4px 10px', color:'#00d4aa', fontSize:11, fontFamily:"'DM Mono', monospace" }}>↑ TREND</div>
            </div>
            <Sparkline />
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:12 }}>
              {[['Best Period','2000–2002','#00d4aa'],['Worst Period','2005–2006','#ff4757']].map(([l,v,c]) => (
                <div key={l} style={{ background:'#1a2535', borderRadius:6, padding:'8px 10px' }}>
                  <div style={{ color:'#3a4a60', fontSize:10, fontFamily:"'DM Mono', monospace", marginBottom:2 }}>{l}</div>
                  <div style={{ color:c, fontSize:13, fontFamily:"'DM Mono', monospace", fontWeight:600 }}>{v}</div>
                </div>
              ))}
            </div>
            <div style={S.link} onClick={() => nav('/trends')}>View Trend Details →</div>
          </div>
        </div>

        {/* Quick Insights + Sample Reviews */}
        <div style={S.g2}>
          <div style={S.card}>
            <div style={S.sec}>Quick Insights</div>
            {[
              { icon:'◈', color:'#00d4aa', label:'Top Strength',  text:'Performance is strongest feature (85.1% positive)' },
              { icon:'◎', color:'#ff4757', label:'Top Weakness',  text:'Software most discussed but only 64.8% positive' },
              { icon:'△', color:'#ffa502', label:'Trend Status',  text:'Overall sentiment trend: IMPROVING (+0.012 slope)' },
              { icon:'⊕', color:'#a29bfe', label:'Market Corr.', text:'Weak correlation (r=0.034) — not predictive' },
            ].map(item => (
              <div key={item.label} style={{ display:'flex', gap:12, marginBottom:14, alignItems:'flex-start' }}>
                <div style={{ width:28, height:28, borderRadius:6, background:`${item.color}15`, border:`1px solid ${item.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, color:item.color, flexShrink:0 }}>{item.icon}</div>
                <div>
                  <div style={{ color:'#3a4a60', fontSize:10, fontFamily:"'DM Mono', monospace", letterSpacing:'0.1em', marginBottom:2 }}>{item.label}</div>
                  <div style={{ color:'#8892a4', fontSize:13 }}>{item.text}</div>
                </div>
              </div>
            ))}
            <div style={S.link} onClick={() => nav('/insights')}>View Full Business Intelligence →</div>
          </div>

          <div style={S.card}>
            <div style={S.sec}>Sample Reviews</div>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>{['Review','Rating','Sentiment','Conf.'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
              </thead>
              <tbody>
                {D.sampleReviews.slice(0,5).map((r,i) => (
                  <tr key={i}>
                    <td style={{ ...S.td, maxWidth:200 }}>
                      <div style={{ color:'#8892a4', fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:180 }}>
                        {r.text.slice(0,55)}…
                      </div>
                    </td>
                    <td style={S.td}><span style={{ color:'#ffa502', fontSize:12 }}>{'★'.repeat(r.rating)}</span></td>
                    <td style={S.td}><Badge label={r.sentiment} type={r.sentiment} /></td>
                    <td style={S.td}><span style={{ fontFamily:"'DM Mono', monospace", fontSize:12, color:'#00d4aa' }}>{r.confidence}%</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rating Distribution */}
        <div style={S.card}>
          <div style={S.sec}>Rating Distribution & Sentiment Alignment</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:32, alignItems:'center' }}>
            <div>
              {[['Avg Rating','4.15 / 5','#ffa502'],['1-2★ Negative','150 reviews','#ff4757'],['4-5★ Positive','775 reviews','#00d4aa'],['Neutral (3★)','75 reviews','#a29bfe']].map(([l,v,c]) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', marginBottom:10, paddingBottom:10, borderBottom:'1px solid #1e2d42' }}>
                  <span style={{ color:'#5a6475', fontSize:13 }}>{l}</span>
                  <span style={{ fontFamily:"'DM Mono', monospace", fontSize:13, fontWeight:600, color:c }}>{v}</span>
                </div>
              ))}
            </div>
            <RatingBars ratings={D.ratings} />
          </div>
        </div>
      </div>
    </div>
  );
}