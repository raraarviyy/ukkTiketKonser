import React from 'react';
import { Star } from 'lucide-react';

export default function ReviewCard({ review, eventTitle }) {
  return (
    <div
      style={{
        backgroundColor: '#1e293b',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '8px' }}>
        <div>
          <span style={{ fontWeight: '700', fontSize: '0.9rem', color: '#f8fafc', display: 'block' }}>{review.reviewer}</span>
          <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{eventTitle}</span>
        </div>
        <div style={{ display: 'flex', gap: '2px' }}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              size={15}
              color={idx < review.rating ? '#eab308' : '#334155'}
              fill={idx < review.rating ? '#eab308' : 'none'}
            />
          ))}
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>{review.comment}</p>
      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{review.date}</span>
    </div>
  );
}