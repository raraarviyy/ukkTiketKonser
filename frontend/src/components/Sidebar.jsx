import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, Ticket, History, X } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();

  const menuItems = [
    { label: 'Home', icon: Home, path: '/home' },
    { label: 'Explore', icon: Compass, path: '/explore' },
    { label: 'Favorites', icon: Heart, path: '/favorites' },
    { label: 'My Tickets', icon: Ticket, path: '/my-tickets' },
    { label: 'History', icon: History, path: '/history' },
  ];

  return (
    <>
      {/* CSS internal khusus breakpoint mobile Sidebar */}
      <style>{`
        .mobile-close-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .sidebar-aside {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            bottom: 0 !important;
            height: 100vh !important;
            transform: translateX(-100%);
            box-shadow: 4px 0 25px rgba(0, 0, 0, 0.5);
          }
          .sidebar-aside.open {
            transform: translateX(0) !important;
          }
          .mobile-close-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>

      {/* Overlay Mobile (Backdrop Gelap) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen && setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 40,
          }}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        style={{
          width: '240px',
          backgroundColor: '#11131f',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '24px 16px',
          borderRight: '1px solid #1e2235',
          position: 'sticky',
          top: 0,
          flexShrink: 0,
          boxSizing: 'border-box',
          zIndex: 50,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        className={`sidebar-aside ${isOpen ? 'open' : ''}`}
      >
        <div>
          {/* Logo Brand & Mobile Close Button */}
          <div style={{ padding: '0 8px 32px 8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ color: '#fff', fontSize: '22px', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
                VibePass<span style={{ color: '#ec4899' }}>.</span>
              </h1>
              <p style={{ color: '#6b7280', fontSize: '11px', margin: '4px 0 0 0', fontWeight: '500' }}>
                Premium Ticketing
              </p>
            </div>

            {/* Tombol Silang (Close) untuk Mobile */}
            {setIsOpen && (
              <button 
                onClick={() => setIsOpen(false)}
                style={{ 
                  background: '#1a1d2e', border: '1px solid #282c42', 
                  color: '#9ca3af', cursor: 'pointer', padding: '6px', borderRadius: '8px' 
                }}
                className="mobile-close-btn"
                aria-label="Close Menu"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path || 
                              (item.path === '/explore' && location.pathname.startsWith('/event/'));

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  onClick={() => setIsOpen && setIsOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    width: '100%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '400',
                    backgroundColor: isActive ? 'rgba(236, 72, 153, 0.12)' : 'transparent',
                    color: isActive ? '#ec4899' : '#9ca3af',
                    borderLeft: isActive ? '3px solid #ec4899' : '3px solid transparent',
                    transition: 'all 0.2s ease',
                    boxSizing: 'border-box'
                  }}
                >
                  <Icon size={18} color={isActive ? '#ec4899' : '#9ca3af'} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom CTA Button */}
        <Link
          to="/explore"
          onClick={() => setIsOpen && setIsOpen(false)}
          style={{
            width: '100%',
            padding: '12px',
            borderRadius: '12px',
            border: 'none',
            background: 'linear-gradient(135deg, #e879f9 0%, #d946ef 50%, #c084fc 100%)',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            textAlign: 'center',
            textDecoration: 'none',
            boxShadow: '0 4px 15px rgba(217, 70, 239, 0.3)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxSizing: 'border-box',
            display: 'block'
          }}
        >
          Get Tickets
        </Link>
      </aside>
    </>
  );
};

export default Sidebar;