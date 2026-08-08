import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { useTransaction } from '../context/TransactionContext';
import { Bell, Check, Clock, CreditCard, Ticket, BellRing, Loader2 } from 'lucide-react';

export default function Notifications() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { notifications, markAllAsRead, loading } = useTransaction();

  // Optionally mark all as read when opening page
  useEffect(() => {
    markAllAsRead();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getIcon = (type) => {
    switch(type) {
      case 'booking': return <Ticket size={20} color="#ec4899" />;
      case 'payment': return <CreditCard size={20} color="#22c55e" />;
      case 'reminder': return <Clock size={20} color="#eab308" />;
      case 'system': return <BellRing size={20} color="#38bdf8" />;
      default: return <Bell size={20} color="#9ca3af" />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0c10', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        
        <main style={{ padding: '28px', flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h1 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 8px 0' }}>Notifications</h1>
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>Stay updated with your latest bookings and events.</p>
              </div>
              <button 
                onClick={markAllAsRead}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px',
                  borderRadius: '12px', border: '1px solid #282c42', background: '#161826',
                  color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer'
                }}
              >
                <Check size={16} color="#38bdf8" /> Mark all read
              </button>
            </div>

            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '12px' }}>
                <Loader2 size={36} color="#38bdf8" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
                <span style={{ color: '#9ca3af', fontSize: '14px' }}>Loading notifications...</span>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {notifications.map((notif) => (
                  <div key={notif.id} style={{
                    backgroundColor: '#161826', padding: '20px', borderRadius: '16px',
                    border: notif.read ? '1px solid #1e2235' : '1px solid #ec4899',
                    display: 'flex', gap: '20px', alignItems: 'flex-start',
                    boxShadow: notif.read ? 'none' : '0 4px 15px rgba(236, 72, 153, 0.1)'
                  }}>
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%', flexShrink: 0,
                      backgroundColor: '#11131f', border: '1px solid #282c42',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      {getIcon(notif.type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '800', color: notif.read ? '#e5e7eb' : '#fff' }}>
                          {notif.title}
                        </h4>
                        <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '600' }}>{notif.date}</span>
                      </div>
                      <p style={{ margin: 0, fontSize: '13px', color: '#9ca3af', lineHeight: '1.5' }}>
                        {notif.message}
                      </p>
                    </div>
                  </div>
                ))}
                
                {notifications.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#161826', borderRadius: '20px', border: '1px dashed #282c42' }}>
                    <Bell size={48} color="#6b7280" style={{ marginBottom: '12px' }} />
                    <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>No Notifications Yet</h3>
                    <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>You're all caught up!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
