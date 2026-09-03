import React, { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import { useOrganizer } from '../context/OrganizerContext';
import ReviewCard from '../components/ReviewCard';
import StatCard from '../components/StatCard';

export default function OrganizerReviews() {
  const { events, reviews } = useOrganizer();
  const [eventFilter, setEventFilter] = useState('all');

  const eventTitleMap = useMemo(() => {
    const map = {};
    events.forEach((evt) => {
      map[evt.id] = evt.title;
    });
    return map;
  }, [events]);

  const filteredReviews = eventFilter === 'all' ? reviews : reviews.filter((rv) => rv.eventId === eventFilter);

  const averageRating =
    filteredReviews.length > 0
      ? (filteredReviews.reduce((sum, rv) => sum + rv.rating, 0) / filteredReviews.length).toFixed(1)
      : '0.0';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
            Ulasan Penonton
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
            Evaluasi rating dan komentar penonton untuk event kamu.
          </p>
        </div>

        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          style={{
            padding: '10px 14px',
            borderRadius: '10px',
            backgroundColor: '#1e293b',
            border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff',
            fontSize: '0.85rem'
          }}
        >
          <option value="all">Semua Event</option>
          {events.map((evt) => (
            <option key={evt.id} value={evt.id}>
              {evt.title}
            </option>
          ))}
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '18px' }}>
        <StatCard icon={Star} label="Rata-rata Rating" value={averageRating + ' / 5'} accentColor="#eab308" />
        <StatCard icon={Star} label="Total Ulasan" value={filteredReviews.length} accentColor="#38bdf8" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '18px'
        }}
      >
        {filteredReviews.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Belum ada ulasan untuk filter ini.</p>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard key={review.id} review={review} eventTitle={eventTitleMap[review.eventId] || '-'} />
          ))
        )}
      </div>
    </div>
  );
}