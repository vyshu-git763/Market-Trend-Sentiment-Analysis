import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { demoData } from '../data/demoData';

const S = {
  page:    { minHeight:'100vh', background:'#0d1520', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Sans', sans-serif" },
  box:     { width:'100%', maxWidth:560, padding:40 },
  title:   { fontFamily:"'DM Mono', monospace", fontSize:28, fontWeight:700, color:'#e8edf5', marginBottom:8 },
  sub:     { color:'#5a6475', fontSize:13, fontFamily:"'DM Mono', monospace", marginBottom:32, lineHeight:1.6 },
  drop:    { border:'2px dashed #1e2d42', borderRadius:12, padding:'40px 24px', textAlign:'center', cursor:'pointer', background:'#111d2e', transition:'border-color 0.2s' },
  dropHov: { borderColor:'#00d4aa' },
  btn:     { width:'100%', padding:'14px 0', borderRadius:8, border:'none', cursor:'pointer', fontFamily:"'DM Mono', monospace", fontSize:13, fontWeight:700, letterSpacing:'0.08em', marginTop:12 },
  label:   { color:'#5a6475', fontSize:11, fontFamily:"'DM Mono', monospace", letterSpacing:'0.1em', textTransform:'uppercase', marginBottom:6, display:'block' },
  select:  { width:'100%', background:'#0d1520', border:'1px solid #1e2d42', borderRadius:6, color:'#c8d0dc', padding:'8px 12px', fontFamily:"'DM Mono', monospace", fontSize:13, marginBottom:16 },
};

// ── Simulated pipeline steps ──────────────────────────────────────────────────
const STEPS = [
  'Loading and cleaning data...',
  'Running DistilBERT sentiment analysis...',
  'Performing aspect-based extraction...',
  'Detecting trends over time...',
  'Generating business insights...',
  'Calculating correlations...',
  'Building dashboard...',
];

export default function UploadPage() {
  const nav = useNavigate();
  const [stage, setStage]         = useState('upload');   // upload | mapping | processing | done
  const [dragOver, setDragOver]   = useState(false);
  const [fileName, setFileName]   = useState('');
  const [columns, setColumns]     = useState([]);
  const [mapping, setMapping]     = useState({ text:'', rating:'', date:'' });
  const [step, setStep]           = useState(0);
  const [error, setError]         = useState('');

  // ── Read CSV headers ────────────────────────────────────────────────────────
  const readHeaders = (file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const firstLine = e.target.result.split('\n')[0];
      const cols = firstLine.split(',').map(c => c.replace(/"/g,'').trim());
      setColumns(cols);

      // Auto-guess mappings
      const guess = (candidates) => cols.find(c => candidates.includes(c)) || '';
      setMapping({
        text:   guess(['reviewText','review_text','review_body','text','comment','Review']),
        rating: guess(['overall','rating','star_rating','stars','score']),
        date:   guess(['reviewTime','review_date','date','created_at','timestamp']),
      });
      setFileName(file.name);
      setStage('mapping');
    };
    reader.readAsText(file.slice(0, 4096)); // Only read first 4KB for headers
  };

  const onDrop = useCallback((e) => {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer?.files[0] || e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) readHeaders(file);
    else setError('Please upload a .csv file');
  }, []);

  // ── Run pipeline ─────────────────────────────────────────────────────────────
  const runAnalysis = async () => {
    setStage('processing'); setStep(0);

    // Simulate progress steps
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 900));
      setStep(i + 1);
    }

    // TODO: Uncomment below when backend is running
    // try {
    //   const formData = new FormData();
    //   formData.append('file', uploadedFile);
    //   formData.append('text_col', mapping.text);
    //   formData.append('rating_col', mapping.rating);
    //   formData.append('date_col', mapping.date);
    //   const res = await fetch('/analyze', { method:'POST', body: formData });
    //   const data = await res.json();
    //   // store data in sessionStorage for dashboard to read
    //   sessionStorage.setItem('analysisResults', JSON.stringify(data));
    // } catch(e) { setError('Backend error: ' + e.message); return; }

    nav('/dashboard');
  };

  // ── Load demo ────────────────────────────────────────────────────────────────
  const loadDemo = async () => {
    setStage('processing'); setStep(0);
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(r => setTimeout(r, 700));
      setStep(i + 1);
    }
    nav('/dashboard');
  };

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════════
  return (
    <div style={S.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <div style={S.box}>

        {/* ── STAGE 1: Upload ── */}
        {stage === 'upload' && <>
          <div style={{ fontFamily:"'DM Mono', monospace", fontSize:40, fontWeight:700, color:'#00d4aa', letterSpacing:'0.15em', marginBottom:8 }}>◈ SentiQ</div>
          <div style={S.title}>Market Sentiment<br/>Analysis Platform</div>
          <div style={S.sub}>Upload your customer reviews CSV and get instant sentiment analysis, aspect insights, trend detection and business recommendations.</div>

          {error && <div style={{ color:'#ff4757', fontSize:12, marginBottom:12, fontFamily:"'DM Mono', monospace" }}>{error}</div>}

          <div
            style={{ ...S.drop, ...(dragOver ? S.dropHov : {}) }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => document.getElementById('fileInput').click()}
          >
            <div style={{ fontSize:32, marginBottom:12 }}>📂</div>
            <div style={{ color:'#c8d0dc', fontSize:14, marginBottom:6 }}>Drag & drop your CSV here</div>
            <div style={{ color:'#3a4a60', fontSize:12, fontFamily:"'DM Mono', monospace" }}>or click to browse</div>
            <input id="fileInput" type="file" accept=".csv" style={{ display:'none' }} onChange={onDrop}/>
          </div>

          <button style={{ ...S.btn, background:'#00d4aa', color:'#0d1520' }} onClick={loadDemo}>
            ▶ Load Demo Data (Amazon Electronics)
          </button>
          <div style={{ textAlign:'center', color:'#3a4a60', fontSize:11, fontFamily:"'DM Mono', monospace", marginTop:8 }}>
            Demo uses 1,000 pre-analyzed reviews · No upload needed
          </div>
        </>}

        {/* ── STAGE 2: Column Mapping ── */}
        {stage === 'mapping' && <>
          <div style={{ fontFamily:"'DM Mono', monospace", fontSize:11, color:'#00d4aa', letterSpacing:'0.15em', marginBottom:8 }}>◈ COLUMN MAPPING</div>
          <div style={S.title}>Map Your Columns</div>
          <div style={S.sub}>File: <span style={{ color:'#00d4aa' }}>{fileName}</span> · {columns.length} columns detected. Tell us which columns contain your data.</div>

          <div style={{ background:'#111d2e', border:'1px solid #1e2d42', borderRadius:12, padding:24, marginBottom:20 }}>
            <label style={S.label}>Review Text Column *</label>
            <select style={S.select} value={mapping.text} onChange={e => setMapping(m => ({...m, text:e.target.value}))}>
              <option value="">-- Select column --</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={S.label}>Rating / Score Column (optional)</label>
            <select style={S.select} value={mapping.rating} onChange={e => setMapping(m => ({...m, rating:e.target.value}))}>
              <option value="">-- Not available --</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={S.label}>Date Column (optional)</label>
            <select style={S.select} value={mapping.date} onChange={e => setMapping(m => ({...m, date:e.target.value}))}>
              <option value="">-- Not available --</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {!mapping.text && <div style={{ color:'#ff4757', fontSize:12, marginBottom:12, fontFamily:"'DM Mono', monospace" }}>⚠ Please select a text column to continue</div>}

          <button
            style={{ ...S.btn, background: mapping.text ? '#00d4aa' : '#1e2d42', color: mapping.text ? '#0d1520' : '#3a4a60' }}
            onClick={runAnalysis}
            disabled={!mapping.text}
          >
            ▶ Run Analysis
          </button>
          <button style={{ ...S.btn, background:'transparent', color:'#5a6475', border:'1px solid #1e2d42' }} onClick={() => setStage('upload')}>
            ← Back
          </button>
        </>}

        {/* ── STAGE 3: Processing ── */}
        {stage === 'processing' && <>
          <div style={{ fontFamily:"'DM Mono', monospace", fontSize:11, color:'#00d4aa', letterSpacing:'0.15em', marginBottom:8 }}>◈ PROCESSING</div>
          <div style={S.title}>Analyzing Your Data</div>
          <div style={{ marginTop:32 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'10px 0', borderBottom:'1px solid #1e2d4230' }}>
                <span style={{ width:20, textAlign:'center', fontSize:14 }}>
                  {i < step ? '✅' : i === step ? '⏳' : '○'}
                </span>
                <span style={{ fontFamily:"'DM Mono', monospace", fontSize:12, color: i < step ? '#00d4aa' : i === step ? '#e8edf5' : '#3a4a60' }}>
                  {s}
                </span>
              </div>
            ))}
          </div>
          <div style={{ marginTop:24, height:4, background:'#1e2d42', borderRadius:2 }}>
            <div style={{ height:'100%', background:'#00d4aa', borderRadius:2, width:`${(step/STEPS.length)*100}%`, transition:'width 0.5s ease' }}/>
          </div>
        </>}

      </div>
    </div>
  );
}
