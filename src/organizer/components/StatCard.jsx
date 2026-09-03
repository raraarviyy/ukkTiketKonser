import React from 'react';

export default function StatCard({ icon: Icon, label, value, accentColor, subtext }) {
  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '18px',
        padding: '22px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        minWidth: 0
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: `${accentColor}22`
        }}
      >
        <Icon size={20} color={accentColor} />
      </div>
      <div>
        <span style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>{label}</span>
        <span style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: '800', color: '#f8fafc', wordBreak: 'break-word' }}>
          {value}
        </span>
        {subtext && <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginTop: '4px' }}>{subtext}</span>}
      </div>
    </div>
  );
}