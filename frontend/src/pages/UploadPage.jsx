import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = 'http://localhost:8000';

const STEPS = [
  'Loading and cleaning data...',
  'Running DistilBERT sentiment analysis...',
  'Performing aspect-based extraction...',
  'Detecting trends over time...',
  'Generating business insights...',
  'Calculating correlations...',
  'Building dashboard...',
];

const S = {
  page:    { minHeight: '100vh', background: '#0d1520', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'DM Sans', sans-serif" },
  box:     { width: '100%', maxWidth: 560, padding: 40 },
  title:   { fontFamily: "'DM Mono', monospace", fontSize: 28, fontWeight: 700, color: '#e8edf5', marginBottom: 8 },
  sub:     { color: '#5a6475', fontSize: 13, fontFamily: "'DM Mono', monospace", marginBottom: 32, lineHeight: 1.6 },
  drop:    { border: '2px dashed #1e2d42', borderRadius: 12, padding: '40px 24px', textAlign: 'center', cursor: 'pointer', background: '#111d2e', transition: 'border-color 0.2s' },
  dropHov: { borderColor: '#00d4aa' },
  btn:     { width: '100%', padding: '14px 0', borderRadius: 8, border: 'none', cursor: 'pointer', fontFamily: "'DM Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', marginTop: 12 },
  label:   { color: '#5a6475', fontSize: 11, fontFamily: "'DM Mono', monospace", letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 6, display: 'block' },
  select:  { width: '100%', background: '#0d1520', border: '1px solid #1e2d42', borderRadius: 6, color: '#c8d0dc', padding: '8px 12px', fontFamily: "'DM Mono', monospace", fontSize: 13, marginBottom: 16 },
  err:     { color: '#ff4757', fontSize: 12, marginBottom: 12, fontFamily: "'DM Mono', monospace", background: '#ff475710', padding: '8px 12px', borderRadius: 6, border: '1px solid #ff475730' },
};

export default function UploadPage() {
  const nav = useNavigate();
  const fileRef = useRef(null);

  const [stage, setStage]       = useState('upload');   // upload | mapping | processing | done
  const [dragOver, setDragOver] = useState(false);
  const [fileName, setFileName] = useState('');
  const [columns, setColumns]   = useState([]);
  const [mapping, setMapping]   = useState({ text: '', rating: '', date: '' });
  const [step, setStep]         = useState(0);
  const [error, setError]       = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  // ── Read CSV headers ──────────────────────────────────────────────────────
 const readHeaders = (file) => {
  setError('');
  
  // Check file type
  if (!file.name.toLowerCase().endsWith('.csv')) {
    setError('❌ Invalid file type. Please upload a .CSV file only.');
    return;
  }
  
  // Check file size (10MB limit)
  if (file.size > 10 * 1024 * 1024) {
    setError('❌ File too large. Maximum size is 10MB.');
    return;
  }

  const reader = new FileReader();
  
  reader.onload = (e) => {
    try {
      const content = e.target.result;
      const lines = content.split('\n');
      
      if (lines.length < 2) {
        setError('❌ File appears to be empty or has no data rows.');
        return;
      }
      
      const firstLine = lines[0];
      const cols = firstLine.split(',').map(c => c.replace(/"/g, '').trim()).filter(Boolean);
      
      if (cols.length === 0) {
        setError('❌ Could not detect any columns. Please check your CSV format.');
        return;
      }
      
      setColumns(cols);

      const guess = (patterns) => cols.find(c => 
        patterns.some(p => c.toLowerCase().includes(p.toLowerCase()))
      ) || '';

      const detected = {
        text: guess(['review', 'text', 'comment', 'body', 'content', 'feedback', 'opinion', 'description', 'review_text', 'reviewtext']),
        rating: guess(['rating', 'star', 'score', 'overall', 'rank', 'vote', 'stars']),
        date: guess(['date', 'time', 'created', 'timestamp', 'published', 'posted', 'review_date', 'reviewtime'])
      };
      
      // Validate we found at least text column
      if (!detected.text) {
        setError(`⚠️ Could not detect review text column. Found columns: ${cols.join(', ')}. Please select manually.`);
      } else {
        setError(''); // Clear error if we found text column
      }
      
      setMapping(detected);
      setFileName(file.name);
      setUploadedFile(file);
      setStage('mapping');
      
    } catch (err) {
      setError('❌ Error reading file: ' + err.message);
    }
  };
  
  reader.onerror = () => setError('❌ Failed to read file. Please try again.');
  reader.readAsText(file.slice(0, 8192));
};
const onDrop = useCallback((e) => {
  e.preventDefault();
  setDragOver(false);
  
  const file = e.dataTransfer?.files[0] || e.target.files?.[0];
  
  if (!file) {
    setError('❌ No file selected.');
    return;
  }
  
  if (!file.name.toLowerCase().endsWith('.csv')) {
    setError('❌ Please upload a .CSV file only. Other formats are not supported.');
    return;
  }
  
  readHeaders(file);
}, []);

  // ── Animate processing steps ─────────────────────────────────────────────
  const animateSteps = async (durationMs = 5000) => {
    const interval = durationMs / STEPS.length;
    for (let i = 0; i < STEPS.length; i++) {
      await new Promise(r => setTimeout(r, interval));
      setStep(i + 1);
    }
  };

  // ── Run real analysis ─────────────────────────────────────────────────────
  const runAnalysis = async () => {
    if (!uploadedFile) return;
    setStage('processing');
    setStep(0);
    setError('');

    // Start animation (non-blocking)
    const animPromise = animateSteps(8000);

    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);
      if (mapping.text)   formData.append('text_col',   mapping.text);
      if (mapping.rating) formData.append('rating_col', mapping.rating);
      if (mapping.date)   formData.append('date_col',   mapping.date);

      const res = await fetch(`${API_BASE}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ detail: 'Server error' }));
        throw new Error(err.detail || `HTTP ${res.status}`);
      }

      const data = await res.json();

      // Wait for animation to finish
      await animPromise;

      // Store results for all pages to read
      sessionStorage.setItem('sentiqResults', JSON.stringify(data));
      sessionStorage.setItem('sentiqMode', 'live');

      nav('/dashboard');

    } catch (err) {
      console.error('Analysis failed:', err);
      setError(`Analysis failed: ${err.message}. Check that the backend is running on port 8000.`);
      setStage('mapping');
    }
  };

  // ── Load demo data ────────────────────────────────────────────────────────
  const loadDemo = async () => {
    setStage('processing');
    setStep(0);
    await animateSteps(5000);
    sessionStorage.setItem('sentiqMode', 'demo');
    sessionStorage.removeItem('sentiqResults');
    nav('/dashboard');
  };

  // ── UI ────────────────────────────────────────────────────────────────────
  return (
    <div style={S.page}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <div style={S.box}>

        {/* ── UPLOAD STAGE ── */}
        {stage === 'upload' && <>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 40, fontWeight: 700, color: '#00d4aa', letterSpacing: '0.15em', marginBottom: 8 }}>◈ SentiQ</div>
          <div style={S.title}>Market Sentiment<br />Analysis Platform</div>
          <div style={S.sub}>Upload your customer reviews CSV and get instant sentiment analysis, aspect insights, trend detection and business recommendations.</div>

          {error && <div style={S.err}>{error}</div>}

          <div
            style={{ ...S.drop, ...(dragOver ? S.dropHov : {}) }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            onClick={() => fileRef.current?.click()}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>📂</div>
            <div style={{ color: '#c8d0dc', fontSize: 14, marginBottom: 6 }}>Drag & drop your CSV here</div>
            <div style={{ color: '#3a4a60', fontSize: 12, fontFamily: "'DM Mono', monospace" }}>or click to browse · max 10 MB</div>
            <input ref={fileRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={onDrop} />
          </div>
          {/* Sample file download */}
<div style={{ 
  marginTop:20, 
  padding:'16px 20px', 
  background:'#111d2e', 
  border:'1px solid #1e2d42', 
  borderRadius:8,
  textAlign:'center'
}}>
  <div style={{ marginBottom:10 }}>
    <a 
      href="/sample_reviews.csv" 
      download 
      style={{ 
        color:'#00d4aa', 
        fontSize:13, 
        fontFamily:"'DM Mono',monospace", 
        textDecoration:'none',
        display:'inline-flex',
        alignItems:'center',
        gap:8
      }}
    >
      <span style={{ fontSize:16 }}>⬇</span>
      Download sample CSV file
    </a>
  </div>
  <div style={{ 
    display:'flex', 
    gap:16, 
    justifyContent:'center',
    flexWrap:'wrap'
  }}>
    <span style={{ color:'#5a6475', fontSize:11, fontFamily:"'DM Mono',monospace" }}>
      <strong style={{color:'#00d4aa'}}>Required:</strong> review_text
    </span>
    <span style={{ color:'#5a6475', fontSize:11, fontFamily:"'DM Mono',monospace" }}>
      <strong style={{color:'#00d4aa'}}>Optional:</strong> rating (1-5)
    </span>
    <span style={{ color:'#5a6475', fontSize:11, fontFamily:"'DM Mono',monospace" }}>
      <strong style={{color:'#00d4aa'}}>Optional:</strong> review_date
    </span>
  </div>
</div>

          <button style={{ ...S.btn, background: '#00d4aa', color: '#0d1520' }} onClick={loadDemo}>
            ▶ Load Demo Data (Amazon Electronics)
          </button>
          <div style={{ textAlign: 'center', color: '#3a4a60', fontSize: 11, fontFamily: "'DM Mono', monospace", marginTop: 8 }}>
            Demo uses 1,000 pre-analyzed reviews · No backend needed
          </div>

          
        </>}

        {/* ── MAPPING STAGE ── */}
        {stage === 'mapping' && <>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#00d4aa', letterSpacing: '0.15em', marginBottom: 8 }}>◈ COLUMN MAPPING</div>
          <div style={S.title}>Map Your Columns</div>
          <div style={S.sub}>
            File: <span style={{ color: '#00d4aa' }}>{fileName}</span> · {columns.length} columns detected.
            <br />Tell us which columns contain your data.
          </div>

          {error && <div style={S.err}>{error}</div>}

          <div style={{ background: '#111d2e', border: '1px solid #1e2d42', borderRadius: 12, padding: 24, marginBottom: 20 }}>
            <label style={S.label}>Review Text Column *</label>
            <select style={S.select} value={mapping.text} onChange={e => setMapping(m => ({ ...m, text: e.target.value }))}>
              <option value="">-- Select column --</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={S.label}>Rating / Score Column (optional — enables correlation)</label>
            <select style={S.select} value={mapping.rating} onChange={e => setMapping(m => ({ ...m, rating: e.target.value }))}>
              <option value="">-- Not available --</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <label style={S.label}>Date Column (optional — enables trend analysis)</label>
            <select style={S.select} value={mapping.date} onChange={e => setMapping(m => ({ ...m, date: e.target.value }))}>
              <option value="">-- Not available --</option>
              {columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {!mapping.text && (
            <div style={S.err}>⚠ Please select a text column to continue</div>
          )}

          <button
            style={{ ...S.btn, background: mapping.text ? '#00d4aa' : '#1e2d42', color: mapping.text ? '#0d1520' : '#3a4a60', cursor: mapping.text ? 'pointer' : 'not-allowed' }}
            onClick={runAnalysis}
            disabled={!mapping.text}
          >
            ▶ Run Analysis
          </button>
          <button
            style={{ ...S.btn, background: 'transparent', color: '#5a6475', border: '1px solid #1e2d42' }}
            onClick={() => { setStage('upload'); setError(''); }}
          >
            ← Back
          </button>
        </>}

        {/* ── PROCESSING STAGE ── */}
        {stage === 'processing' && <>
          <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#00d4aa', letterSpacing: '0.15em', marginBottom: 8 }}>◈ PROCESSING</div>
          <div style={S.title}>Analyzing Your Data</div>
          <div style={{ color: '#5a6475', fontSize: 13, fontFamily: "'DM Mono', monospace", marginBottom: 24 }}>
            {sessionStorage.getItem('sentiqMode') === 'demo' ? 'Loading demo results...' : 'Running ML pipeline...'}
          </div>

          <div style={{ marginTop: 16 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #1e2d4230' }}>
                <span style={{ width: 20, textAlign: 'center', fontSize: 14 }}>
                  {i < step ? '✅' : i === step ? '⏳' : '○'}
                </span>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: i < step ? '#00d4aa' : i === step ? '#e8edf5' : '#3a4a60' }}>
                  {s}
                </span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 24, height: 4, background: '#1e2d42', borderRadius: 2 }}>
            <div style={{ height: '100%', background: '#00d4aa', borderRadius: 2, width: `${(step / STEPS.length) * 100}%`, transition: 'width 0.5s ease' }} />
          </div>

          {error && <div style={{ ...S.err, marginTop: 16 }}>{error}</div>}
        </>}

      </div>
    </div>
  );
}
