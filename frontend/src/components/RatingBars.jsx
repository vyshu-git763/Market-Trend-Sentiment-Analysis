export default function RatingBars({ ratings }) {
  const maxCount = Math.max(...ratings.map(r => r.count));

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 120, padding: '0 4px' }}>
      {ratings.map(r => {
        const h     = (r.count / maxCount) * 100;
        const color = r.sentiment > 0.1
  ? '#00d4aa'                    // positive → teal
  : r.sentiment > -0.1
  ? '#ffa502'                    // neutral → orange
  : '#ff4757';                   // negative → red
        return (
          <div key={r.stars} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ color: '#8892a4', fontSize: 10, fontFamily: "'DM Mono', monospace" }}>
              {r.count}
            </span>
            <div style={{
              width:        '100%',
              height:       `${h}%`,
              background:   color,
              borderRadius: '3px 3px 0 0',
              opacity:      0.85,
              transition:   'height 1s ease',
            }} />
            <span style={{ color: '#5a6475', fontSize: 11 }}>
              {'★'.repeat(r.stars)}
            </span>
          </div>
        );
      })}
    </div>
  );
}