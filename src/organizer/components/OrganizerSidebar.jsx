import React from 'react';
import { LayoutDashboard, CalendarRange, Wallet, Star, Menu, X } from 'lucide-react';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'events', label: 'Manajemen Event', icon: CalendarRange },
  { key: 'revenue', label: 'Laporan Pendapatan', icon: Wallet },
  { key: 'reviews', label: 'Ulasan Penonton', icon: Star }
];

export default function OrganizerSidebar({ activePage, onNavigate, mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.6)',
            zIndex: 45
          }}
          className="organizer-sidebar-overlay"
        />
      )}

      <aside
        className={`organizer-sidebar ${mobileOpen ? 'organizer-sidebar-open' : ''}`}
        style={{
          backgroundColor: '#0f172a',
          borderRight: '1px solid rgba(255,255,255,0.08)',
          padding: '24px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', padding: '0 8px' }}>
          <span style={{ fontSize: '1.1rem', fontWeight: '800', color: '#fff' }}>
            Panel <span style={{ color: '#a855f7' }}>Organizer</span>
          </span>
          <button
            onClick={onCloseMobile}
            className="organizer-sidebar-close"
            style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activePage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: '12px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.92rem',
                fontWeight: '600',
                textAlign: 'left',
                width: '100%',
                background: isActive ? 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)' : 'transparent',
                color: isActive ? '#fff' : '#94a3b8'
              }}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </aside>
    </>
  );
}

export function OrganizerMobileToggle({ onOpen }) {
  return (
    <button
      onClick={onOpen}
      className="organizer-mobile-toggle"
      style={{
        background: '#1e293b',
        border: '1px solid rgba(255,255,255,0.1)',
        color: '#fff',
        borderRadius: '10px',
        padding: '10px',
        cursor: 'pointer',
        display: 'none'
      }}
    >
      <Menu size={20} />
    </button>
  );
}