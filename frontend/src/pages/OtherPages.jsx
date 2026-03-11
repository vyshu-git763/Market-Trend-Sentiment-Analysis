import { useNavigate } from 'react-router-dom';
import KPICard       from '../components/KPICard';
import HorizontalBar from '../components/HorizontalBar';
import Badge         from '../components/Badge';
import { demoData as D } from '../data/demoData';

const S = {
  page: { maxWidth: 1280, margin: '0 auto', padding: '32px 24px' },
  g4:   { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 },
  g2:   { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20, marginBottom: 24 },
  card: { background: '#111d2e', border: '1px solid #1e2d42', borderRadius: 12, padding: 24, marginBottom: 24 },
  sec:  { fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 700, color: '#3a4a60', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16, borderBottom: '1px solid #1e2d42', paddingBottom: 10 },
  back: { display: 'inline-flex', alignItems: 'center', gap: 8, color: '#5a6475', fontSize: 12, fontFamily: "'DM Mono', monospace", cursor: 'pointer', marginBottom: 20, padding: '6px 12px', borderRadius: 6, border: '1px solid #1e2d42', background: '#111d2e' },
  th:   { textAlign: 'left', padding: '8px 12px', fontSize: 11, fontFamily: "'DM Mono', monospace", color: '#3a4a60', borderBottom: '1px solid #1e2d42', letterSpacing: '0.08em' },
  td:   { padding: '10px 12px', fontSize: 13, borderBottom: '1px solid #1e2d4210', verticalAlign: 'middle' },
};

const fonts = <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />;
const wrap  = (children) => <div style={{ background: '#0d1520', color: '#c8d0dc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>{fonts}<div style={S.page}>{children}</div></div>;

// ─── ASPECTS PAGE ─────────────────────────────────────────────────────────────
export function AspectsPage() {
  const nav = useNavigate();
  const totalMentions = D.aspects.reduce((a, b) => a + b.mentions, 0);

  const statusOf = (pct) => pct >= 80 ? 'STRONG' : pct >= 70 ? 'GOOD' : pct >= 65 ? 'MIXED' : 'WEAK';
  const interp   = { Software: 'Most discussed, needs improvement', Price: 'Value perception mixed', Design: 'Acceptable but improvable', Performance: 'Key product strength', Battery: 'Limited mentions, acceptable', Screen: 'Low data, acceptable', Camera: 'Low data, acceptable' };

  return wrap(<>
    <div style={S.back} onClick={() => nav('/dashboard')}>← Back to Dashboard</div>
    <div style={{ fontFamily:"'DM Mono', monospace", fontSize:11, color:'#00d4aa', letterSpacing:'0.15em', marginBottom:6 }}>◈ ASPECT-BASED ANALYSIS</div>
    <h1 style={{ fontFamily:"'DM Mono', monospace", fontSize:26, fontWeight:700, color:'#e8edf5', marginBottom:4 }}>What Customers Are Talking About</h1>
    <div style={{ color:'#5a6475', fontSize:13, fontFamily:"'DM Mono', monospace", marginBottom:28 }}>7 product categories · Keyword-based extraction · Per-aspect sentiment scoring</div>

    <div style={S.g4}>
      <KPICard label="Total Mentions"  value={totalMentions} suffix=""  decimals={0} color="#00d4aa" icon="◈" variant="left"/>
      <KPICard label="Unique Aspects"  value={7}             suffix=""  decimals={0} color="#3498db" icon="◎" variant="left"/>
      <div style={{ background:'#111d2e', border:'1px solid #1e2d42', borderRadius:12, padding:'20px 24px', borderLeft:'3px solid #ffa502' }}>
        <div style={{ fontFamily:"'DM Mono', monospace", fontSize:22, fontWeight:700, color:'#ffa502', marginBottom:4 }}>Software</div>
        <div style={{ color:'#5a6475', fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:'0.1em', textTransform:'uppercase' }}>Most Discussed</div>
      </div>
      <div style={{ background:'#111d2e', border:'1px solid #1e2d42', borderRadius:12, padding:'20px 24px', borderLeft:'3px solid #00d4aa' }}>
        <div style={{ fontFamily:"'DM Mono', monospace", fontSize:22, fontWeight:700, color:'#00d4aa', marginBottom:4 }}>Performance</div>
        <div style={{ color:'#5a6475', fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:'0.1em', textTransform:'uppercase' }}>Best Rated</div>
      </div>
    </div>

    <div style={S.g2}>
      <div style={S.card}>
        <div style={S.sec}>Mention Frequency</div>
        {D.aspects.map(a => (
          <HorizontalBar key={a.name} label={a.name} value={a.mentions} max={392} color="#00d4aa"
            subtitle={`${a.mentions} mentions (${((a.mentions/totalMentions)*100).toFixed(1)}% of total)`}
          />
        ))}
      </div>
      <div style={S.card}>
        <div style={S.sec}>Sentiment by Aspect</div>
        {D.aspects.map(a => (
          <div key={a.name} style={{ marginBottom:14 }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:4 }}>
              <span style={{ color:'#c8d0dc', fontSize:13 }}>{a.name}</span>
              <div style={{ display:'flex', gap:8 }}>
                <span style={{ color:'#00d4aa', fontSize:12, fontFamily:"'DM Mono', monospace" }}>{a.positive}% ▲</span>
                <span style={{ color:'#ff4757', fontSize:12, fontFamily:"'DM Mono', monospace" }}>{a.negative}% ▼</span>
              </div>
            </div>
            <div style={{ height:12, borderRadius:6, overflow:'hidden', display:'flex' }}>
              <div style={{ width:`${a.positive}%`, background:'linear-gradient(90deg,#00d4aa80,#00d4aa)' }}/>
              <div style={{ width:`${a.negative}%`, background:'linear-gradient(90deg,#ff475780,#ff4757)' }}/>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div style={S.card}>
      <div style={S.sec}>Aspect Details Table</div>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead><tr>{['Aspect','Mentions','Positive %','Negative %','Status','Interpretation'].map(h=><th key={h} style={S.th}>{h}</th>)}</tr></thead>
        <tbody>
          {D.aspects.map((a,i) => {
            const st = statusOf(a.positive);
            const c  = {STRONG:'#00d4aa',GOOD:'#00c896',MIXED:'#ffa502',WEAK:'#ff4757'}[st];
            return (
              <tr key={a.name} style={{ background: i%2===0?'transparent':'#1a253510' }}>
                <td style={{ ...S.td, fontWeight:600, color:'#c8d0dc' }}>{a.name}</td>
                <td style={{ ...S.td, fontFamily:"'DM Mono', monospace", color:'#00d4aa' }}>{a.mentions}</td>
                <td style={{ ...S.td, fontFamily:"'DM Mono', monospace", color:'#00d4aa' }}>{a.positive}%</td>
                <td style={{ ...S.td, fontFamily:"'DM Mono', monospace", color:'#ff4757' }}>{a.negative}%</td>
                <td style={S.td}><span style={{ color:c, fontFamily:"'DM Mono', monospace", fontSize:11, fontWeight:700 }}>{st}</span></td>
                <td style={{ ...S.td, color:'#5a6475', fontSize:12 }}>{interp[a.name]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>

    <div style={{ ...S.card, background:'#00d4aa08', border:'1px solid #00d4aa20' }}>
      <div style={S.sec}>Key Insights</div>
      {[
        'Software is most discussed (392 mentions) but only 64.8% positive — priority improvement area',
        'Performance is the strongest feature (85.1% positive) — key marketing differentiator',
        'Battery has fewest mentions (23) — not currently a primary customer concern',
        'Price sentiment (66.7% positive) suggests value perception is mixed',
      ].map((ins,i) => (
        <div key={i} style={{ display:'flex', gap:12, marginBottom:12, alignItems:'flex-start' }}>
          <span style={{ color:'#00d4aa', fontSize:16, flexShrink:0 }}>◈</span>
          <span style={{ color:'#8892a4', fontSize:13, lineHeight:1.5 }}>{ins}</span>
        </div>
      ))}
    </div>
  </>);
}

// ─── TRENDS PAGE ──────────────────────────────────────────────────────────────
export function TrendsPage() {
  const nav = useNavigate();

  return wrap(<>
    <div style={S.back} onClick={() => nav('/dashboard')}>← Back to Dashboard</div>
    <div style={{ fontFamily:"'DM Mono', monospace", fontSize:11, color:'#00d4aa', letterSpacing:'0.15em', marginBottom:6 }}>△ TREND ANALYSIS</div>
    <h1 style={{ fontFamily:"'DM Mono', monospace", fontSize:26, fontWeight:700, color:'#e8edf5', marginBottom:4 }}>How Sentiment Changes Over Time</h1>
    <div style={{ color:'#5a6475', fontSize:13, fontFamily:"'DM Mono', monospace", marginBottom:28 }}>13-year temporal analysis · 2000–2012 · Monthly/quarterly aggregation</div>

    <div style={S.g4}>
      {[
        { label:'Overall Direction', value:'IMPROVING', color:'#00d4aa' },
        { label:'Trend Slope',       value:'+0.012',    color:'#00d4aa' },
        { label:'Best Period',       value:'2000–02',   color:'#3498db' },
        { label:'Worst Period',      value:'2005–06',   color:'#ff4757' },
      ].map(k => (
        <div key={k.label} style={{ background:'#111d2e', border:'1px solid #1e2d42', borderRadius:12, padding:'20px 24px', borderLeft:`3px solid ${k.color}` }}>
          <div style={{ fontFamily:"'DM Mono', monospace", fontSize:22, fontWeight:700, color:k.color, marginBottom:4 }}>{k.value}</div>
          <div style={{ color:'#5a6475', fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:'0.1em', textTransform:'uppercase' }}>{k.label}</div>
        </div>
      ))}
    </div>

    {/* SVG Trend Chart */}
    <div style={S.card}>
      <div style={S.sec}>Sentiment Score Over Time (2000–2012)</div>
      <div style={{ position:'relative', overflow:'hidden', height:220 }}>
        <svg width="100%" height="200" viewBox="0 0 900 200" preserveAspectRatio="none">
          <defs>
            <linearGradient id="tg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#00d4aa" stopOpacity="0.3"/>
              <stop offset="100%" stopColor="#00d4aa" stopOpacity="0"/>
            </linearGradient>
          </defs>
          {[0,50,100,150,200].map(y => <line key={y} x1="0" y1={y} x2="900" y2={y} stroke="#1e2d42" strokeWidth="1"/>)}
          <path d="M0,120 C50,110 80,140 120,100 C160,60 180,130 230,90 C280,50 300,120 350,80 C400,40 420,110 470,70 C520,30 550,100 600,60 C640,30 670,80 720,50 C760,25 800,55 850,35 L900,30 L900,200 L0,200Z" fill="url(#tg)"/>
          <path d="M0,120 C50,110 80,140 120,100 C160,60 180,130 230,90 C280,50 300,120 350,80 C400,40 420,110 470,70 C520,30 550,100 600,60 C640,30 670,80 720,50 C760,25 800,55 850,35 L900,30" fill="none" stroke="#00d4aa" strokeWidth="2.5"/>
          <line x1="0" y1="140" x2="900" y2="30" stroke="#00d4aa60" strokeWidth="1.5" strokeDasharray="6,4"/>
          <circle cx="60"  cy="108" r="5" fill="#ffa502"/>
          <text x="68" y="98"  fill="#ffa502" fontSize="10" fontFamily="monospace">Peak 2000</text>
          <circle cx="460" cy="175" r="5" fill="#ff4757"/>
          <text x="468" y="188" fill="#ff4757" fontSize="10" fontFamily="monospace">Low 2005</text>
        </svg>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', paddingLeft:20 }}>
        {['2000','2001','2002','2003','2004','2005','2006','2007','2008','2009','2010','2011','2012'].map(y => (
          <span key={y} style={{ color:'#3a4a60', fontSize:10, fontFamily:"'DM Mono', monospace" }}>{y}</span>
        ))}
      </div>
    </div>

    <div style={S.g2}>
      <div style={S.card}>
        <div style={S.sec}>Quarterly Summary</div>
        {D.trend.quarterly.map(q => {
          const c = q.sentiment > 0.6 ? '#00d4aa' : q.sentiment > 0.3 ? '#ffa502' : '#ff4757';
          return (
            <div key={q.period} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, paddingBottom:12, borderBottom:'1px solid #1e2d42' }}>
              <div>
                <div style={{ color:'#c8d0dc', fontSize:13, fontFamily:"'DM Mono', monospace" }}>{q.period}</div>
                <div style={{ color:'#5a6475', fontSize:11 }}>{q.trend}</div>
              </div>
              <div style={{ fontFamily:"'DM Mono', monospace", fontSize:20, fontWeight:700, color:c }}>{q.sentiment.toFixed(2)}</div>
            </div>
          );
        })}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
        <div style={S.card}>
          <div style={S.sec}>Key Events</div>
          {[
            { icon:'▲', color:'#00d4aa', label:'Highest Sentiment', value:'June 2000 (score: 1.0)'         },
            { icon:'▼', color:'#ff4757', label:'Lowest Sentiment',  value:'September 2005 (score: −1.0)'   },
            { icon:'↗', color:'#ffa502', label:'Trend Slope',       value:'+0.012 per year (13-year period)'},
          ].map(e => (
            <div key={e.label} style={{ display:'flex', gap:12, marginBottom:14, alignItems:'center' }}>
              <div style={{ width:32, height:32, borderRadius:8, background:`${e.color}15`, border:`1px solid ${e.color}30`, display:'flex', alignItems:'center', justifyContent:'center', color:e.color, fontWeight:700 }}>{e.icon}</div>
              <div>
                <div style={{ color:'#5a6475', fontSize:11, fontFamily:"'DM Mono', monospace" }}>{e.label}</div>
                <div style={{ color:'#c8d0dc', fontSize:13 }}>{e.value}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ ...S.card, background:'#00d4aa08', border:'1px solid #00d4aa20' }}>
          <div style={S.sec}>Business Interpretation</div>
          <p style={{ color:'#8892a4', fontSize:13, lineHeight:1.7 }}>
            The improving trend (+0.012 slope) suggests steady product improvements over 13 years. The 2005–2006 dip likely correlates with product update cycles. Current trajectory is positive — capitalize on this momentum in marketing.
          </p>
        </div>
      </div>
    </div>
  </>);
}

// ─── INSIGHTS PAGE ────────────────────────────────────────────────────────────
export function InsightsPage() {
  const nav = useNavigate();

  return wrap(<>
    <div style={S.back} onClick={() => nav('/dashboard')}>← Back to Dashboard</div>
    <div style={{ fontFamily:"'DM Mono', monospace", fontSize:11, color:'#00d4aa', letterSpacing:'0.15em', marginBottom:6 }}>◇ BUSINESS INTELLIGENCE</div>
    <h1 style={{ fontFamily:"'DM Mono', monospace", fontSize:26, fontWeight:700, color:'#e8edf5', marginBottom:4 }}>What These Numbers Mean For You</h1>
    <div style={{ color:'#5a6475', fontSize:13, fontFamily:"'DM Mono', monospace", marginBottom:28 }}>SWOT Analysis · Actionable Recommendations · Strategic Priorities</div>

    {/* Executive Summary */}
    <div style={{ ...S.card, background:'linear-gradient(135deg,#111d2e,#0d1f30)', border:'1px solid #00d4aa30' }}>
      <div style={S.sec}>Executive Summary</div>
      <p style={{ color:'#8892a4', fontSize:14, lineHeight:1.8 }}>
        Analysis of 1,000 Amazon Electronics reviews reveals a broadly positive sentiment landscape (70.7% positive) with a DistilBERT model accuracy of 79.6%. The performance aspect is the clear product strength at 85.1% positive, while software — the most discussed feature at 392 mentions — presents the primary improvement opportunity at only 64.8% positive. The 13-year sentiment trend is improving (+0.012 slope). Market correlation (r=0.034, p=0.355) is weak, indicating sentiment should drive product strategy rather than market timing.
      </p>
    </div>

    {/* SWOT */}
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:24 }}>
      {[
        { title:'STRENGTHS',     items:D.swot.strengths,     color:'#00d4aa', icon:'▲' },
        { title:'WEAKNESSES',    items:D.swot.weaknesses,    color:'#ff4757', icon:'▼' },
        { title:'OPPORTUNITIES', items:D.swot.opportunities, color:'#3498db', icon:'◎' },
        { title:'THREATS',       items:D.swot.threats,       color:'#ffa502', icon:'⚠' },
      ].map(s => (
        <div key={s.title} style={{ ...S.card, border:`1px solid ${s.color}30`, background:`${s.color}06` }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16 }}>
            <span style={{ color:s.color, fontSize:16 }}>{s.icon}</span>
            <span style={{ fontFamily:"'DM Mono', monospace", fontSize:12, fontWeight:700, color:s.color, letterSpacing:'0.15em' }}>{s.title}</span>
          </div>
          {s.items.map((item,i) => (
            <div key={i} style={{ display:'flex', gap:8, marginBottom:10, alignItems:'flex-start' }}>
              <span style={{ color:s.color, fontSize:12, flexShrink:0, marginTop:2 }}>•</span>
              <span style={{ color:'#8892a4', fontSize:13, lineHeight:1.5 }}>{item}</span>
            </div>
          ))}
        </div>
      ))}
    </div>

    {/* Recommendations */}
    <div style={S.card}>
      <div style={S.sec}>Actionable Recommendations</div>
      {D.recommendations.map((r,i) => (
        <div key={i} style={{ display:'flex', gap:16, padding:'14px 0', borderBottom:'1px solid #1e2d42', alignItems:'center' }}>
          <div style={{ fontFamily:"'DM Mono', monospace", fontSize:11, color:'#3a4a60', width:24, textAlign:'center', flexShrink:0 }}>{String(i+1).padStart(2,'0')}</div>
          <Badge label={r.priority} type={r.priority}/>
          <span style={{ color:'#8892a4', fontSize:14, lineHeight:1.5 }}>{r.text}</span>
        </div>
      ))}
    </div>
  </>);
}

// ─── CORRELATION PAGE ─────────────────────────────────────────────────────────
export function CorrelationPage() {
  const nav = useNavigate();

  return wrap(<>
    <div style={S.back} onClick={() => nav('/dashboard')}>← Back to Dashboard</div>
    <div style={{ fontFamily:"'DM Mono', monospace", fontSize:11, color:'#00d4aa', letterSpacing:'0.15em', marginBottom:6 }}>⊕ CORRELATION ANALYSIS</div>
    <h1 style={{ fontFamily:"'DM Mono', monospace", fontSize:26, fontWeight:700, color:'#e8edf5', marginBottom:4 }}>Does Sentiment Affect Market Performance?</h1>
    <div style={{ color:'#5a6475', fontSize:13, fontFamily:"'DM Mono', monospace", marginBottom:28 }}>Pearson correlation · 729 days · 2000–2012 · Simulated market data</div>

    <div style={S.g4}>
      {[
        { label:'Pearson r',   value:'0.034', color:'#ffa502', desc:'Very weak'       },
        { label:'p-value',     value:'0.355', color:'#ff4757', desc:'Not significant' },
        { label:'R-squared',   value:'0.001', color:'#5a6475', desc:'0.1% explained'  },
        { label:'Sample Size', value:'729',   color:'#3498db', desc:'Days of overlap' },
      ].map(k => (
        <div key={k.label} style={{ background:'#111d2e', border:'1px solid #1e2d42', borderRadius:12, padding:'20px 24px' }}>
          <div style={{ fontFamily:"'DM Mono', monospace", fontSize:32, fontWeight:700, color:k.color, marginBottom:4 }}>{k.value}</div>
          <div style={{ color:'#5a6475', fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:4 }}>{k.label}</div>
          <div style={{ color:'#3a4a60', fontSize:11, fontFamily:"'DM Mono', monospace" }}>{k.desc}</div>
        </div>
      ))}
    </div>

    {/* Scatter Plot */}
    <div style={S.card}>
      <div style={S.sec}>Sentiment vs Stock Price Scatter Plot</div>
      <div style={{ height:280 }}>
        <svg width="100%" height="280" viewBox="0 0 800 280">
          {[0,70,140,210,280].map(y  => <line key={`gy${y}`} x1="60" y1={y} x2="780" y2={y} stroke="#1e2d42" strokeWidth="1"/>)}
          {[-1,-0.5,0,0.5,1].map((v,i) => { const x=60+(v+1)*360; return <line key={`gx${v}`} x1={x} y1="0" x2={x} y2="280" stroke="#1e2d42" strokeWidth="1"/>; })}
          {['14K','10K','7K','3K','0'].map((v,i) => <text key={v} x="50" y={i*70+5} fill="#3a4a60" fontSize="10" textAnchor="end" fontFamily="monospace">{v}</text>)}
          {['-1.0','-0.5','0.0','0.5','1.0'].map((v,i) => <text key={v} x={60+i*180} y="275" fill="#3a4a60" fontSize="10" textAnchor="middle" fontFamily="monospace">{v}</text>)}
          {/* Neg cluster */}
          {Array.from({length:80},(_,i)=>({x:60+Math.abs(Math.sin(i*7))*18,y:30+Math.abs(Math.sin(i*13))*230})).map((p,i)=><circle key={`n${i}`} cx={p.x} cy={p.y} r="4" fill="#ff4757" opacity="0.55"/>)}
          {/* Pos cluster */}
          {Array.from({length:200},(_,i)=>({x:710+Math.abs(Math.sin(i*5))*22,y:20+Math.abs(Math.sin(i*11))*250})).map((p,i)=><circle key={`p${i}`} cx={p.x} cy={p.y} r="4" fill="#00d4aa" opacity="0.45"/>)}
          {/* Mixed */}
          {Array.from({length:30},(_,i)=>({x:200+Math.sin(i*9)*180+180,y:60+Math.abs(Math.sin(i*7))*160})).map((p,i)=><circle key={`m${i}`} cx={p.x} cy={p.y} r="5" fill="#ffa502" opacity="0.65"/>)}
          {/* Regression line */}
          <line x1="60" y1="148" x2="780" y2="136" stroke="#ff4757" strokeWidth="2"/>
          {/* Stats box */}
          <rect x="70" y="10" width="140" height="48" rx="6" fill="#111d2e" stroke="#1e2d42"/>
          <text x="80" y="30" fill="#8892a4" fontSize="11" fontFamily="monospace">n = 729</text>
          <text x="80" y="48" fill="#8892a4" fontSize="11" fontFamily="monospace">R² = 0.001</text>
          <text x="70" y="268" fill="#ff4757" fontSize="11" fontFamily="monospace">r = 0.034  p = 0.355</text>
        </svg>
      </div>
      <div style={{ display:'flex', gap:20, flexWrap:'wrap', marginTop:8 }}>
        {[['Negative cluster (score ≈ -1)','#ff4757'],['Positive cluster (score ≈ +1)','#00d4aa'],['Mixed days','#ffa502']].map(([l,c]) => (
          <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
            <div style={{ width:10, height:10, borderRadius:'50%', background:c }}/>
            <span style={{ color:'#5a6475', fontSize:11 }}>{l}</span>
          </div>
        ))}
      </div>
    </div>

    <div style={S.g2}>
      <div style={{ ...S.card, border:'1px solid #ffa50230', background:'#ffa50208' }}>
        <div style={S.sec}>Statistical Interpretation</div>
        <p style={{ color:'#8892a4', fontSize:14, lineHeight:1.8 }}>
          The Pearson correlation of <strong style={{ color:'#ffa502' }}>r = 0.034</strong> indicates a very weak positive relationship. The p-value of <strong style={{ color:'#ff4757' }}>0.355</strong> is well above the α = 0.05 threshold — this correlation is <strong style={{ color:'#ff4757' }}>not statistically significant</strong>. R² of 0.001 shows sentiment explains only 0.1% of market price variation.
        </p>
      </div>
      <div style={{ ...S.card, border:'1px solid #00d4aa20', background:'#00d4aa06' }}>
        <div style={S.sec}>Business Implication</div>
        <p style={{ color:'#8892a4', fontSize:14, lineHeight:1.8 }}>
          This is an <strong style={{ color:'#00d4aa' }}>honest and important finding</strong>: customer review sentiment alone cannot predict market movements. The system should be positioned as a <strong style={{ color:'#00d4aa' }}>product intelligence tool</strong> rather than a market prediction engine.
        </p>
      </div>
    </div>
  </>);
}