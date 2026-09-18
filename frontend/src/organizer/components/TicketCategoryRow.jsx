import React from 'react';
import { Trash2, Pencil } from 'lucide-react';

export default function TicketCategoryRow({ category, onEdit, onDelete }) {
  const percentSold = category.quota > 0 ? Math.min(100, Math.round((category.sold / category.quota) * 100)) : 0;

  return (
    <div
      style={{
        backgroundColor: '#11131f',
        border: '1px solid #282c42',
        borderRadius: '14px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span style={{ fontWeight: '800', fontSize: '0.95rem', color: '#f8fafc' }}>{category.name}</span>
          <span style={{ fontSize: '0.8rem', color: '#34d399', fontWeight: '700' }}>
            ${Number(category.price).toLocaleString('id-ID')}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => onEdit(category)}
            style={{ background: 'rgba(236,72,153,0.1)', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#ec4899' }}
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            style={{ background: 'rgba(244,63,94,0.1)', border: 'none', borderRadius: '8px', padding: '6px 8px', cursor: 'pointer', color: '#f43f5e' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', color: '#94a3b8' }}>
        <span>Terjual {category.sold} dari {category.quota}</span>
        <span>{percentSold}%</span>
      </div>

      <div style={{ width: '100%', height: '8px', backgroundColor: '#1a1d2e', borderRadius: '6px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${percentSold}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ec4899, #a855f7)',
            borderRadius: '6px'
          }}
        />
      </div>
    </div>
  );
}