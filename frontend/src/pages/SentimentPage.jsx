import { useNavigate } from 'react-router-dom';
import KPICard    from '../components/KPICard';
import DonutChart from '../components/DonutChart';
import RatingBars from '../components/RatingBars';
import Badge      from '../components/Badge';
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

export default function SentimentPage() {
  const nav = useNavigate();

  const confidenceBuckets = [
    { range: '0.5 – 0.6', count: 8  },
    { range: '0.6 – 0.7', count: 5  },
    { range: '0.7 – 0.8', count: 12 },
    { range: '0.8 – 0.9', count: 31 },
    { range: '0.9 – 1.0', count: 944 },
  ];

  return (
    <div style={{ background: '#0d1520', color: '#c8d0dc', minHeight: '100vh', fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      <div style={S.page}>
        <div style={S.back} onClick={() => nav('/dashboard')}>← Back to Dashboard</div>

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#00d4aa', letterSpacing: '0.15em', marginBottom: 6 }}>◎ SENTIMENT ANALYSIS</div>
        <h1 style={{ fontFamily: "'DM Mono', monospace", fontSize: 26, fontWeight: 700, color: '#e8edf5', marginBottom: 4 }}>Understanding Customer Opinion</h1>
        <div style={{ color: '#5a6475', fontSize: 13, fontFamily: "'DM Mono', monospace", marginBottom: 28 }}>DistilBERT model · 1,000 reviews analyzed · 97.4% average confidence</div>

        {/* KPI row */}
        <div style={S.g4}>
          <KPICard label="Positive Reviews" value={707}  suffix=""  decimals={0} color="#00d4aa" icon="▲" variant="left" />
          <KPICard label="Negative Reviews" value={293}  suffix=""  decimals={0} color="#ff4757" icon="▼" variant="left" />
          <KPICard label="Model Accuracy"   value={79.6} suffix="%" decimals={1} color="#3498db" icon="◈" variant="left" />
          <KPICard label="Avg Confidence"   value={97.4} suffix="%" decimals={1} color="#a29bfe" icon="◎" variant="left" />
        </div>

        <div style={S.g2}>
          {/* Donut */}
          <div style={S.card}>
            <div style={S.sec}>Sentiment Distribution</div>
            <div style={{ display:'flex', alignItems:'center', gap:32, justifyContent:'center' }}>
              <DonutChart positive={D.kpi.positivePct} negative={D.kpi.negativePct} size={200} />
              <div>
                {[['Positive',707,'70.7%','#00d4aa'],['Negative',293,'29.3%','#ff4757']].map(([l,c,p,col]) => (
                  <div key={l} style={{ marginBottom:20 }}>
                    <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:4 }}>
                      <div style={{ width:12, height:12, borderRadius:'50%', background:col }}/>
                      <span style={{ color:'#8892a4', fontSize:14 }}>{l}</span>
                    </div>
                    <div style={{ fontFamily:"'DM Mono', monospace", fontSize:28, fontWeight:700, color:col }}>{p}</div>
                    <div style={{ color:'#5a6475', fontSize:12, fontFamily:"'DM Mono', monospace" }}>{c} reviews</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Confidence histogram */}
          <div style={S.card}>
            <div style={S.sec}>Confidence Score Distribution</div>
            <p style={{ color:'#8892a4', fontSize:13, lineHeight:1.6, marginBottom:20 }}>
              97.4% of all predictions score above 80% confidence, indicating the model's high certainty in its classifications.
            </p>
            {confidenceBuckets.map(b => (
              <div key={b.range} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
                <span style={{ width:80, color:'#5a6475', fontSize:12, fontFamily:"'DM Mono', monospace", flexShrink:0 }}>{b.range}</span>
                <div style={{ flex:1, background:'#1a2535', borderRadius:3, height:18, overflow:'hidden' }}>
                  <div style={{ width:`${Math.max((b.count/1000)*100, 0.5)}%`, height:'100%', background: b.count > 100 ? '#00d4aa' : '#3498db', opacity:0.8 }}/>
                </div>
                <span style={{ width:40, color:'#8892a4', fontSize:12, fontFamily:"'DM Mono', monospace", textAlign:'right' }}>{b.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Rating vs Sentiment */}
        <div style={S.card}>
          <div style={S.sec}>Sentiment Score by Star Rating — Model Validation</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 2fr', gap:32, alignItems:'center' }}>
            <div>
              <p style={{ color:'#8892a4', fontSize:13, lineHeight:1.7, marginBottom:16 }}>
                The model's predictions align strongly with user star ratings, achieving 79.6% accuracy. Sentiment scores escalate predictably from 1★ to 5★.
              </p>
              {D.ratings.map(r => (
                <div key={r.stars} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:8 }}>
                  <span style={{ color:'#ffa502', fontSize:13, width:45 }}>{'★'.repeat(r.stars)}</span>
                  <div style={{ flex:1, background:'#1a2535', borderRadius:3, height:12, overflow:'hidden' }}>
                    <div style={{ width:`${Math.abs(r.sentiment)*100}%`, height:'100%', background: r.sentiment>0 ? '#00d4aa' : '#ff4757', opacity:0.8 }}/>
                  </div>
                  <span style={{ fontFamily:"'DM Mono', monospace", fontSize:12, color: r.sentiment>0 ? '#00d4aa' : '#ff4757', width:52, textAlign:'right' }}>
                    {r.sentiment>0?'+':''}{r.sentiment}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <RatingBars ratings={D.ratings} />
              <div style={{ marginTop:12, display:'flex', gap:16, flexWrap:'wrap' }}>
                {[['1–2★ Mostly negative','#ff4757'],['3★ Mixed','#a29bfe'],['4–5★ Mostly positive','#00d4aa']].map(([l,c]) => (
                  <div key={l} style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:c }}/>
                    <span style={{ color:'#5a6475', fontSize:11 }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews table */}
        <div style={S.card}>
          <div style={S.sec}>Review Explorer</div>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr>{['Date','Rating','Review Text','Sentiment','Confidence'].map(h => <th key={h} style={S.th}>{h}</th>)}</tr>
            </thead>
            <tbody>
              {D.sampleReviews.map((r,i) => (
                <tr key={i} style={{ background: i%2===0 ? 'transparent' : '#1a253510' }}>
                  <td style={{ ...S.td, fontFamily:"'DM Mono', monospace", fontSize:12, color:'#5a6475' }}>{r.date}</td>
                  <td style={S.td}><span style={{ color:'#ffa502' }}>{'★'.repeat(r.rating)}</span></td>
                  <td style={{ ...S.td, maxWidth:340, color:'#8892a4', fontSize:13 }}>{r.text}</td>
                  <td style={S.td}><Badge label={r.sentiment} type={r.sentiment}/></td>
                  <td style={{ ...S.td, fontFamily:"'DM Mono', monospace", fontSize:13, color:'#00d4aa' }}>{r.confidence}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}