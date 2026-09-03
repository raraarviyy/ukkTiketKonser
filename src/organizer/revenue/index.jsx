import React from 'react';
import { Wallet, TrendingUp, PieChart } from 'lucide-react';
import { useOrganizer } from '../context/OrganizerContext';
import StatCard from '../components/StatCard';

export default function OrganizerRevenue() {
  const { getRevenueSummary } = useOrganizer();
  const summary = getRevenueSummary();

  const bestEvent = summary.perEvent.reduce(
    (best, current) => (current.revenue > (best?.revenue || 0) ? current : best),
    null
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
          Laporan Pendapatan
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
          Ringkasan dan rincian pendapatan dari hasil penjualan tiket.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '18px'
        }}
      >
        <StatCard
          icon={Wallet}
          label="Total Pendapatan Kotor"
          value={'Rp' + summary.totalRevenue.toLocaleString('id-ID')}
          accentColor="#34d399"
        />
        <StatCard
          icon={TrendingUp}
          label="Event Berkinerja Terbaik"
          value={bestEvent ? bestEvent.title : '-'}
          accentColor="#a855f7"
          subtext={bestEvent ? 'Rp' + bestEvent.revenue.toLocaleString('id-ID') : ''}
        />
        <StatCard
          icon={PieChart}
          label="Rata-rata Pendapatan per Event"
          value={
            summary.perEvent.length > 0
              ? 'Rp' + Math.round(summary.totalRevenue / summary.perEvent.length).toLocaleString('id-ID')
              : 'Rp0'
          }
          accentColor="#38bdf8"
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
          Rincian Pendapatan per Event
        </h3>

        <table style={{ width: '100%', minWidth: '480px', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#94a3b8', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <th style={{ padding: '10px 8px', fontWeight: '600' }}>Event</th>
              <th style={{ padding: '10px 8px', fontWeight: '600' }}>Tiket Terjual</th>
              <th style={{ padding: '10px 8px', fontWeight: '600' }}>Pendapatan</th>
            </tr>
          </thead>
          <tbody>
            {summary.perEvent.map((item) => (
              <tr key={item.eventId} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: '12px 8px', color: '#f8fafc', fontWeight: '600' }}>{item.title}</td>
                <td style={{ padding: '12px 8px', color: '#cbd5e1' }}>{item.sold} / {item.quota}</td>
                <td style={{ padding: '12px 8px', color: '#34d399', fontWeight: '700' }}>
                  Rp{item.revenue.toLocaleString('id-ID')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}