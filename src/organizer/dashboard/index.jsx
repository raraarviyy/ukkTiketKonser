import React from 'react';
import { Ticket, TrendingUp, CalendarCheck, Users, Loader2 } from 'lucide-react';
import { useOrganizer } from '../context/OrganizerContext';
import StatCard from '../components/StatCard';

export default function OrganizerDashboard() {
  const { events, getRevenueSummary, loading } = useOrganizer();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '12px' }}>
        <Loader2 size={32} color="#a855f7" style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Memuat data dashboard...</span>
      </div>
    );
  }

  const summary = getRevenueSummary();
  const publishedCount = events.filter((evt) => evt.status === 'published').length;
  const occupancyRate = summary.totalQuota > 0 ? Math.round((summary.totalSold / summary.totalQuota) * 100) : 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
          Dashboard Penjualan
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
          Pantau progres penjualan tiket dari seluruh event secara real-time.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '18px'
        }}
      >
        <StatCard
          icon={TrendingUp}
          label="Total Pendapatan"
          value={'Rp' + summary.totalRevenue.toLocaleString('id-ID')}
          accentColor="#34d399"
        />
        <StatCard
          icon={Ticket}
          label="Tiket Terjual"
          value={summary.totalSold + ' / ' + summary.totalQuota}
          accentColor="#a855f7"
          subtext={occupancyRate + '% okupansi'}
        />
        <StatCard
          icon={CalendarCheck}
          label="Event Tayang"
          value={publishedCount + ' / ' + events.length}
          accentColor="#38bdf8"
        />
        <StatCard
          icon={Users}
          label="Rata-rata Terjual per Event"
          value={events.length > 0 ? Math.round(summary.totalSold / events.length) : 0}
          accentColor="#f43f5e"
        />
      </div>

      <div
        style={{
          backgroundColor: '#1e293b',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '18px',
          padding: '20px',
          overflowX: 'auto'
        }}
      >
        <h3 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#f8fafc', marginTop: 0, marginBottom: '16px' }}>
          Progres per Event
        </h3>

        {summary.perEvent.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Belum ada event yang dibuat.</p>
        ) : (
          <div style={{ minWidth: '480px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {summary.perEvent.map((item) => {
              const percent = item.quota > 0 ? Math.round((item.sold / item.quota) * 100) : 0;
              return (
                <div key={item.eventId}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '6px' }}>
                    <span style={{ fontWeight: '600' }}>{item.title}</span>
                    <span>{item.sold} / {item.quota} tiket</span>
                  </div>
                  <div style={{ width: '100%', height: '10px', backgroundColor: '#0f172a', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: percent + '%',
                        height: '100%',
                        background: 'linear-gradient(90deg, #6366f1, #a855f7)'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}