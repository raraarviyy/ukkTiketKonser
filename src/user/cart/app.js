import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { 
  ShoppingBag, Ticket, Trash2, ArrowRight, Calendar, 
  MapPin, QrCode, Sparkles, AlertCircle 
} from 'lucide-react';

const INITIAL_CART_ITEMS = [
  {
    id: "cart-1",
    eventId: "1",
    eventTitle: "NEON PULSE TOUR 2026",
    date: "OCT 24, 2026 • 20:30 PM",
    venue: "Cyber Arena, Tokyo",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80",
    regularQty: 2,
    vipQty: 1,
    regularPrice: 89,
    vipPrice: 250,
  }
];

const MY_ACTIVE_TICKETS = [
  {
    ticketId: "TKT-892102-CYBER",
    eventTitle: "CYBERPUNK NIGHTS 2026",
    date: "NOV 15, 2026 • 19:30 PM",
    venue: "Future Hall, Seoul",
    type: "VIP Pulse Pass (1x)",
    qrCode: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=TKT-892102-CYBER"
  }
];

export default function Cart() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('cart');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [cartItems, setCartItems] = useState(INITIAL_CART_ITEMS);
  const [viewMode, setViewMode] = useState('cart'); // 'cart' atau 'my_tickets'

  const removeItem = (id) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const handleCheckoutItem = (item) => {
    const totalWithoutTax = (item.regularQty * item.regularPrice) + (item.vipQty * item.vipPrice);
    const orderPayload = {
      eventTitle: item.eventTitle,
      date: item.date,
      venue: item.venue,
      regularQty: item.regularQty,
      vipQty: item.vipQty,
      regularPrice: item.regularPrice,
      vipPrice: item.vipPrice,
      subtotal: totalWithoutTax,
      tax: totalWithoutTax * 0.1,
      total: totalWithoutTax * 1.1
    };

    navigate('/checkout', { state: { orderData: orderPayload } });
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0c10', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main style={{ padding: '28px', flex: 1, overflowY: 'auto' }}>
          
          {/* Header & Toggle View Mode */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 style={{ fontSize: '26px', fontWeight: '900', margin: 0 }}>
                {viewMode === 'cart' ? 'Keranjang Belanja' : 'Tiket Saya'}
              </h1>
              <p style={{ color: '#9ca3af', fontSize: '13px', margin: '4px 0 0 0' }}>
                {viewMode === 'cart' ? 'Selesaikan pesanan tiket kamu sebelum kehabisan.' : 'Daftar tiket resmi yang siap digunakan.'}
              </p>
            </div>

            <div style={{ backgroundColor: '#161826', padding: '4px', borderRadius: '12px', border: '1px solid #282c42', display: 'flex', gap: '4px' }}>
              <button
                onClick={() => setViewMode('cart')}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  backgroundColor: viewMode === 'cart' ? '#38bdf8' : 'transparent',
                  color: viewMode === 'cart' ? '#000' : '#9ca3af',
                  fontSize: '12px', fontWeight: '800', cursor: 'pointer'
                }}
              >
                Keranjang ({cartItems.length})
              </button>
              <button
                onClick={() => setViewMode('my_tickets')}
                style={{
                  padding: '8px 16px', borderRadius: '8px', border: 'none',
                  backgroundColor: viewMode === 'my_tickets' ? '#38bdf8' : 'transparent',
                  color: viewMode === 'my_tickets' ? '#000' : '#9ca3af',
                  fontSize: '12px', fontWeight: '800', cursor: 'pointer'
                }}
              >
                Tiket Saya ({MY_ACTIVE_TICKETS.length})
              </button>
            </div>
          </div>

          {/* VIEW 1: KERANJANG BELANJA */}
          {viewMode === 'cart' && (
            <>
              {cartItems.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '800px' }}>
                  {cartItems.map((item) => {
                    const itemTotal = (item.regularQty * item.regularPrice) + (item.vipQty * item.vipPrice);
                    return (
                      <div
                        key={item.id}
                        style={{
                          backgroundColor: '#161826', borderRadius: '20px', border: '1px solid #1e2235',
                          padding: '20px', display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap'
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.eventTitle}
                          style={{ width: '110px', height: '110px', borderRadius: '14px', objectFit: 'cover' }}
                        />

                        <div style={{ flex: 1, minWidth: '220px' }}>
                          <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px 0' }}>{item.eventTitle}</h3>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', color: '#9ca3af', fontSize: '12px', marginBottom: '12px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={14} color="#38bdf8" /> {item.date}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={14} color="#38bdf8" /> {item.venue}</span>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                            {item.regularQty > 0 && <span style={{ backgroundColor: '#1e2235', padding: '4px 10px', borderRadius: '6px', color: '#38bdf8', fontWeight: '700' }}>{item.regularQty}x Regular</span>}
                            {item.vipQty > 0 && <span style={{ backgroundColor: '#2e1065', padding: '4px 10px', borderRadius: '6px', color: '#f0abfc', fontWeight: '700' }}>{item.vipQty}x VIP</span>}
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '12px', justifyContent: 'space-between', height: '100%' }}>
                          <div>
                            <span style={{ fontSize: '11px', color: '#6b7280', display: 'block' }}>Subtotal</span>
                            <span style={{ fontSize: '20px', fontWeight: '900', color: '#38bdf8' }}>${itemTotal}</span>
                          </div>

                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button
                              onClick={() => removeItem(item.id)}
                              style={{
                                padding: '10px', borderRadius: '10px', border: '1px solid #282c42',
                                backgroundColor: '#11131f', color: '#ef4444', cursor: 'pointer'
                              }}
                            >
                              <Trash2 size={16} />
                            </button>
                            <button
                              onClick={() => handleCheckoutItem(item)}
                              style={{
                                padding: '10px 18px', borderRadius: '10px', border: 'none',
                                background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                                color: '#fff', fontSize: '13px', fontWeight: '800', cursor: 'pointer',
                                display: 'flex', alignItems: 'center', gap: '6px'
                              }}
                            >
                              Checkout <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div style={{ backgroundColor: '#161826', borderRadius: '20px', border: '1px dashed #282c42', padding: '48px', textAlign: 'center' }}>
                  <ShoppingBag size={42} color="#6b7280" style={{ marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '0 0 4px 0' }}>Keranjang Kamu Kosong</h3>
                  <p style={{ color: '#9ca3af', fontSize: '13px', margin: '0 0 20px 0' }}>Cari konser favoritmu dan tambahkan tiket ke keranjang.</p>
                  <button
                    onClick={() => navigate('/home')}
                    style={{
                      padding: '10px 20px', borderRadius: '10px', border: 'none',
                      backgroundColor: '#38bdf8', color: '#000', fontWeight: '800', cursor: 'pointer'
                    }}
                  >
                    Jelajahi Event
                  </button>
                </div>
              )}
            </>
          )}

          {/* VIEW 2: TIKET SAYA (E-TICKETS) */}
          {viewMode === 'my_tickets' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
              {MY_ACTIVE_TICKETS.map((tkt) => (
                <div
                  key={tkt.ticketId}
                  style={{
                    backgroundColor: '#161826', borderRadius: '20px', border: '1px solid #282c42',
                    padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ backgroundColor: '#22c55e', color: '#000', fontSize: '10px', fontWeight: '900', padding: '3px 8px', borderRadius: '8px' }}>
                        AKTIF / CONFIRMED
                      </span>
                      <Ticket size={18} color="#38bdf8" />
                    </div>

                    <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0' }}>{tkt.eventTitle}</h3>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 4px 0' }}>{tkt.date}</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 16px 0' }}>{tkt.venue}</p>
                    
                    <div style={{ backgroundColor: '#0b0c10', padding: '12px', borderRadius: '12px', border: '1px solid #1e2235', marginBottom: '16px' }}>
                      <span style={{ fontSize: '10px', color: '#6b7280', display: 'block', fontWeight: '700' }}>KATEGORI TIKET</span>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: '#f0abfc' }}>{tkt.type}</span>
                    </div>
                  </div>

                  <div style={{ textAlign: 'center', paddingTop: '16px', borderTop: '1px dashed #282c42' }}>
                    <img src={tkt.qrCode} alt="QR" style={{ width: '120px', height: '120px', borderRadius: '10px', backgroundColor: '#fff', padding: '8px', marginBottom: '8px' }} />
                    <span style={{ fontSize: '11px', color: '#6b7280', display: 'block', fontFamily: 'monospace' }}>{tkt.ticketId}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>
    </div>
  );
}