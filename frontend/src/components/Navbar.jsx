import { Link, useLocation } from 'react-router-dom';

const NAV_ITEMS = [
  { path: '/dashboard',   label: 'Dashboard',   icon: '⬡' },
  { path: '/sentiment',   label: 'Sentiment',   icon: '◎' },
  { path: '/aspects',     label: 'Aspects',     icon: '◈' },
  { path: '/trends',      label: 'Trends',      icon: '△' },
  { path: '/insights',    label: 'Insights',    icon: '◇' },
  { path: '/correlation', label: 'Correlation', icon: '⊕' },
];

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <nav style={{
      position:       'sticky',
      top:            0,
      zIndex:         100,
      background:     '#0d1520ee',
      backdropFilter: 'blur(12px)',
      borderBottom:   '1px solid #1e2d42',
      padding:        '0 32px',
      display:        'flex',
      alignItems:     'center',
      gap:            32,
      height:         60,
    }}>
      {/* Logo */}
      <Link to="/dashboard" style={{ textDecoration: 'none' }}>
        <div style={{
          fontFamily:    "'DM Mono', monospace",
          fontSize:      15,
          fontWeight:    700,
          color:         '#00d4aa',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          ◈ SentiQ
        </div>
      </Link>

      {/* Nav items */}
      <div style={{ flex: 1, display: 'flex', gap: 4 }}>
        {NAV_ITEMS.map(item => {
          const active = pathname === item.path;
          return (
            <Link key={item.path} to={item.path} style={{ textDecoration: 'none' }}>
              <div style={{
                padding:       '8px 14px',
                borderRadius:  6,
                cursor:        'pointer',
                fontSize:      13,
                fontFamily:    "'DM Mono', monospace",
                letterSpacing: '0.05em',
                color:         active ? '#00d4aa' : '#5a6475',
                background:    active ? '#00d4aa15' : 'transparent',
                border:        active ? '1px solid #00d4aa30' : '1px solid transparent',
                transition:    'all 0.2s',
                userSelect:    'none',
              }}>
                <span style={{ marginRight: 6, opacity: 0.7 }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width:     8,
          height:    8,
          borderRadius: '50%',
          background: '#00d4aa',
          boxShadow:  '0 0 8px #00d4aa',
        }} />
        <span style={{ color: '#5a6475', fontSize: 11, fontFamily: "'DM Mono', monospace" }}>
          LIVE DATA
        </span>
      </div>
    </nav>
  );
}