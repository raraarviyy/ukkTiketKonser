import React, { useState } from 'react';
import OrganizerSidebar, { OrganizerMobileToggle } from './components/OrganizerSidebar';
import { OrganizerProvider } from './context/OrganizerContext';
import OrganizerDashboard from './dashboard';
import OrganizerEvents from './events';
import OrganizerRevenue from './revenue';
import OrganizerReviews from './reviews';

function OrganizerLayout() {
  const [activePage, setActivePage] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (page) => {
    setActivePage(page);
    setMobileOpen(false);
  };

  const renderPage = () => {
    if (activePage === 'dashboard') return <OrganizerDashboard />;
    if (activePage === 'events') return <OrganizerEvents />;
    if (activePage === 'revenue') return <OrganizerRevenue />;
    if (activePage === 'reviews') return <OrganizerReviews />;
    return <OrganizerDashboard />;
  };

  return (
    <div
      style={{
        backgroundColor: '#0f172a',
        color: '#f8fafc',
        minHeight: '100vh',
        fontFamily: 'Inter, sans-serif',
        display: 'grid',
        gridTemplateColumns: '260px 1fr'
      }}
      className="organizer-layout"
    >
      <style>{`
        .organizer-sidebar {
          width: 260px;
        }
        .organizer-sidebar-close,
        .organizer-sidebar-overlay {
          display: none;
        }
        .organizer-mobile-toggle {
          display: none;
        }

        @media (max-width: 900px) {
          .organizer-layout {
            grid-template-columns: 1fr !important;
          }
          .organizer-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 260px;
            transform: translateX(-100%);
            transition: transform 0.25s ease;
            z-index: 50;
          }
          .organizer-sidebar-open {
            transform: translateX(0);
          }
          .organizer-sidebar-close {
            display: inline-flex !important;
          }
          .organizer-sidebar-overlay {
            display: block !important;
          }
          .organizer-mobile-toggle {
            display: inline-flex !important;
          }
        }

        @media (max-width: 520px) {
          .organizer-content {
            padding: 16px !important;
          }
        }
      `}</style>

      <OrganizerSidebar
        activePage={activePage}
        onNavigate={handleNavigate}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      <main
        className="organizer-content"
        style={{
          padding: 'clamp(16px, 3vw, 32px)',
          minWidth: 0,
          overflowX: 'hidden'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <OrganizerMobileToggle onOpen={() => setMobileOpen(true)} />
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>
            Panel Organizer
          </span>
        </div>

        {renderPage()}
      </main>
    </div>
  );
}

export default function OrganizerApp() {
  return (
    <OrganizerProvider>
      <OrganizerLayout />
    </OrganizerProvider>
  );
}