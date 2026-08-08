import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { User, Mail, Phone, MapPin, Shield, CreditCard, LogOut, Settings, ChevronRight } from 'lucide-react';

export default function Profile() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0c10', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header setIsSidebarOpen={setIsSidebarOpen} />
        
        <main style={{ padding: '28px', flex: 1, overflowY: 'auto' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '900', margin: '0 0 24px 0', letterSpacing: '-0.5px' }}>Profile Settings</h1>
            
            {/* Header Profile */}
            <div style={{
              backgroundColor: '#161826', borderRadius: '24px', padding: '28px', 
              border: '1px solid #1e2235', display: 'flex', alignItems: 'center', gap: '24px',
              marginBottom: '28px'
            }}>
              <div style={{ 
                width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', 
                border: '4px solid #38bdf8', backgroundColor: '#1e2235'
              }}>
                <img 
                  src="https://ui-avatars.com/api/?name=User+Profile&background=38bdf8&color=fff&bold=true&size=200" 
                  alt="Profile" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '0 0 6px 0' }}>User Profile</h2>
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: '0 0 12px 0' }}>Member since 2026 • Premium VIP</p>
                <button style={{
                  padding: '8px 16px', borderRadius: '12px', border: '1px solid #38bdf8',
                  backgroundColor: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', fontSize: '13px',
                  fontWeight: '700', cursor: 'pointer'
                }}>
                  Edit Profile
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
              
              {/* Personal Information */}
              <div style={{ backgroundColor: '#161826', borderRadius: '24px', padding: '24px', border: '1px solid #1e2235' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 20px 0', color: '#ec4899', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <User size={20} /> Personal Information
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #282c42' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9ca3af' }}>
                      <Mail size={18} />
                      <span style={{ fontSize: '14px' }}>Email Address</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>user@vibepass.com</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid #282c42' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9ca3af' }}>
                      <Phone size={18} />
                      <span style={{ fontSize: '14px' }}>Phone Number</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>+1 (555) 123-4567</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#9ca3af' }}>
                      <MapPin size={18} />
                      <span style={{ fontSize: '14px' }}>Location</span>
                    </div>
                    <span style={{ fontSize: '14px', fontWeight: '600' }}>Tokyo, Japan</span>
                  </div>
                </div>
              </div>

              {/* Account Settings */}
              <div style={{ backgroundColor: '#161826', borderRadius: '24px', padding: '24px', border: '1px solid #1e2235' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 20px 0', color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Settings size={20} /> Account Settings
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[
                    { icon: Shield, label: 'Security & Password' },
                    { icon: CreditCard, label: 'Payment Methods' },
                  ].map((item, i) => (
                    <div key={i} style={{ 
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                      padding: '16px', borderRadius: '16px', backgroundColor: '#11131f', 
                      border: '1px solid #282c42', cursor: 'pointer', transition: 'all 0.2s'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <item.icon size={18} color="#9ca3af" />
                        <span style={{ fontSize: '14px', fontWeight: '600' }}>{item.label}</span>
                      </div>
                      <ChevronRight size={18} color="#6b7280" />
                    </div>
                  ))}
                </div>
              </div>

              <button 
                onClick={handleLogout}
                style={{
                  width: '100%', padding: '16px', borderRadius: '16px', border: '1px solid #ef4444',
                  backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', fontSize: '15px', 
                  fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', 
                  justifyContent: 'center', gap: '8px', transition: 'all 0.2s'
                }}
              >
                <LogOut size={18} /> Logout Account
              </button>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
