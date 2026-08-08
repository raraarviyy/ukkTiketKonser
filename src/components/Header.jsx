import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Bell, Heart, Menu } from 'lucide-react';
import { useTransaction } from '../user/context/TransactionContext';

export default function Header({ setIsSidebarOpen }) {
  const navigate = useNavigate();
  const { unreadCount } = useTransaction();

  return (
    <>
      {/* CSS internal khusus breakpoint mobile Header */}
      <style>{`
        .mobile-menu-btn {
          display: none !important;
        }
        @media (max-width: 768px) {
          .mobile-menu-btn {
            display: flex !important;
            align-items: center;
            justify-content: center;
          }
          .header-search-container {
            max-width: 180px !important;
          }
        }
        @media (max-width: 480px) {
          .header-search-container {
            display: none !important;
          }
        }
      `}</style>

      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 20px', borderBottom: '1px solid #1e2235', backgroundColor: '#11131f',
        position: 'sticky', top: 0, zIndex: 30, gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
          {/* Mobile Menu Button (Hamburger) */}
          <button 
            onClick={() => setIsSidebarOpen(true)} 
            className="mobile-menu-btn" 
            style={{ 
              background: '#1a1d2e', border: '1px solid #282c42', 
              color: '#fff', cursor: 'pointer', padding: '8px', borderRadius: '10px' 
            }}
            aria-label="Open Menu"
          >
            <Menu size={20} />
          </button>

          {/* Search Bar */}
          <div className="header-search-container" style={{ position: 'relative', flex: 1, maxWidth: '420px' }}>
            <Search size={16} color="#6b7280" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search artists, venues..."
              style={{
                width: '100%', padding: '8px 16px 8px 38px', borderRadius: '24px',
                backgroundColor: '#1a1d2e', border: '1px solid #282c42', color: '#fff', fontSize: '13px', outline: 'none'
              }}
            />
          </div>
        </div>

        {/* Right Controls & Profile */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          
          {/* Tombol Notifikasi */}
          <button 
            onClick={() => navigate('/notifications')}
            style={{ 
              position: 'relative', background: '#1a1d2e', border: '1px solid #282c42', 
              color: '#9ca3af', cursor: 'pointer', padding: '8px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Notifikasi"
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{ 
                position: 'absolute', top: '-4px', right: '-4px', 
                minWidth: '16px', height: '16px', backgroundColor: '#ec4899', 
                borderRadius: '50%', color: '#fff', fontSize: '10px', fontWeight: '800',
                display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 4px'
              }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {/* Tombol Favorit */}
          <button 
            onClick={() => navigate('/favorites')}
            style={{ 
              background: '#1a1d2e', border: '1px solid #282c42', 
              color: '#9ca3af', cursor: 'pointer', padding: '8px', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            title="Favorit Saya"
          >
            <Heart size={18} />
          </button>

          {/* Foto Profile */}
          <div 
            onClick={() => navigate('/profile')}
            style={{ 
              width: '36px', 
              height: '36px', 
              borderRadius: '50%', 
              overflow: 'hidden', 
              border: '2px solid #38bdf8', 
              cursor: 'pointer',
              backgroundColor: '#1e2235',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
            title="Profile Saya"
          >
            <img 
              src="https://ui-avatars.com/api/?name=User+Profile&background=38bdf8&color=fff&bold=true" 
              alt="Profile" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
            />
          </div>
        </div>
      </header>
    </>
  );
}