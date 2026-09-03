import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  Calendar, MapPin, Heart, ArrowLeft, Ticket, Mic2,
  ShieldCheck, Plus, Minus, ExternalLink, Check, Crown, Loader2
} from 'lucide-react';
import { useFavorites } from '../context/FavoriteContext';
import { api } from '../../api';

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [selectedTicketType, setSelectedTicketType] = useState('regular');
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const { toggleFavorite, isFavorite } = useFavorites();

  React.useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await api.getEventById(id);
        setEvent(data);
      } catch (error) {
        console.error("Failed to fetch event", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const responsiveStyles = `
    .mobile-menu-btn { display: none; }
    @media (max-width: 768px) {
      .mobile-menu-btn { display: flex !important; }
    }
    .detail-main { padding: 28px; }
    @media (max-width: 640px) {
      .detail-main { padding: 16px; }
    }
    .detail-hero { height: 340px; }
    @media (max-width: 640px) {
      .detail-hero { height: 240px; }
    }
    .detail-hero-title { font-size: 36px; }
    @media (max-width: 640px) {
      .detail-hero-title { font-size: 24px; }
    }
    .detail-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 28px;
      align-items: start;
    }
    .ticket-panel { position: sticky; top: 28px; }
    @media (max-width: 900px) {
      .ticket-panel { position: static; }
    }
  `;

  if (loading || !event) {
    return (
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0c10', color: '#fff', fontFamily: "'Inter', sans-serif", maxWidth: '100vw', overflowX: 'hidden' }}>
        <style>{responsiveStyles}</style>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Header setIsSidebarOpen={setIsSidebarOpen} />
          <main className="detail-main" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '12px' }}>
            <Loader2 size={40} color="#ec4899" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ color: '#9ca3af', fontSize: '15px' }}>Loading event details...</span>
          </main>
        </div>
      </div>
    );
  }

  const favorited = isFavorite(event.id);

  const currentTicket = event.tickets.find(t => t.type === selectedTicketType) || event.tickets[0];
  const totalPrice = currentTicket.price * ticketQuantity;

  const handleCheckout = () => {
    navigate('/checkout', {
      state: {
        event,
        ticketType: currentTicket,
        quantity: ticketQuantity,
        totalPrice
      }
    });
  };

  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${event.lat},${event.lng}`;
  const bboxOffset = 0.01;
  const mapBbox = `${event.lng - bboxOffset}%2C${event.lat - bboxOffset}%2C${event.lng + bboxOffset}%2C${event.lat + bboxOffset}`;
  const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${mapBbox}&layer=mapnik&marker=${event.lat}%2C${event.lng}`;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0c10', color: '#fff', fontFamily: "'Inter', sans-serif", maxWidth: '100vw', overflowX: 'hidden' }}>
      <style>{responsiveStyles}</style>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main className="detail-main" style={{ flex: 1, overflowY: 'auto' }}>

          <button
            onClick={() => navigate(-1)}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
              color: '#9ca3af', fontSize: '14px', cursor: 'pointer', marginBottom: '20px', padding: 0
            }}
          >
            <ArrowLeft size={18} /> Kembali
          </button>

          <div className="detail-hero" style={{
            borderRadius: '24px', overflow: 'hidden', position: 'relative',
            marginBottom: '28px', border: '1px solid #1e2235'
          }}>
            <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, rgba(11,12,16,0) 20%, rgba(11,12,16,0.95) 100%)'
            }} />

            <button
              onClick={() => toggleFavorite(event)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                backgroundColor: 'rgba(11, 12, 16, 0.7)', backdropFilter: 'blur(4px)',
                border: 'none', borderRadius: '50%', width: '40px', height: '40px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
              }}
            >
              <Heart size={20} color={favorited ? '#ec4899' : '#fff'} fill={favorited ? '#ec4899' : 'none'} />
            </button>

            <div style={{ position: 'absolute', bottom: '20px', left: '24px', right: '24px' }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' }}>
                <span style={{
                  backgroundColor: '#ec4899', color: '#fff',
                  fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '12px'
                }}>
                  {event.tag}
                </span>
                <span style={{
                  backgroundColor: '#282c42', color: '#fff',
                  fontSize: '11px', fontWeight: '800', padding: '4px 12px', borderRadius: '12px'
                }}>
                  {event.secondaryTag}
                </span>
              </div>
              <h1 className="detail-hero-title" style={{ fontWeight: '900', margin: '0 0 6px 0', letterSpacing: '-0.5px' }}>
                {event.title.toUpperCase()}
              </h1>
              <p style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#f0abfc', fontSize: '14px', fontWeight: '700', margin: '0 0 12px 0' }}>
                <Mic2 size={15} /> {event.artist}
              </p>
              <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e5e7eb', fontSize: '14px' }}>
                  <Calendar size={16} color="#38bdf8" />
                  <span>{event.date}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#e5e7eb', fontSize: '14px' }}>
                  <MapPin size={16} color="#38bdf8" />
                  <span>{event.venue.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="detail-grid">

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              <div style={{
                backgroundColor: '#161826', borderRadius: '20px', padding: '24px', border: '1px solid #1e2235'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 12px 0', color: '#ec4899' }}>
                  Tentang Acara
                </h3>
                <p style={{ color: '#9ca3af', fontSize: '14px', lineHeight: '1.7', margin: '0 0 20px 0' }}>
                  {event.description}
                </p>

                <div style={{ display: 'flex', gap: '28px', flexWrap: 'wrap', paddingTop: '12px', borderTop: '1px dashed #282c42' }}>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Pintu Dibuka
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '800' }}>{event.doorsOpen}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Acara Mulai
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '800' }}>{event.showStarts}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
                      Batas Usia
                    </div>
                    <div style={{ fontSize: '15px', fontWeight: '800' }}>{event.ageLimit}</div>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#161826', borderRadius: '20px', padding: '24px', border: '1px solid #1e2235'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', margin: 0, color: '#38bdf8', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={20} /> Lokasi Acara
                  </h3>
                  <a
                    href={directionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '6px',
                      color: '#38bdf8', fontSize: '12px', fontWeight: '700', textDecoration: 'none',
                      backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '6px 12px', borderRadius: '8px'
                    }}
                  >
                    Lihat Rute <ExternalLink size={14} />
                  </a>
                </div>

                <div style={{
                  borderRadius: '14px', overflow: 'hidden', height: '220px', marginBottom: '16px',
                  border: '1px solid #282c42'
                }}>
                  <iframe
                    title={`Peta lokasi ${event.venue}`}
                    src={mapEmbedUrl}
                    style={{ width: '100%', height: '100%', border: 0, filter: 'invert(90%) hue-rotate(180deg) contrast(90%)' }}
                    loading="lazy"
                  />
                </div>

                <div style={{ fontSize: '16px', fontWeight: '800', marginBottom: '4px' }}>
                  {event.venue}
                </div>
                <div style={{ fontSize: '13px', color: '#9ca3af', lineHeight: '1.5' }}>
                  {event.address}
                </div>
              </div>

            </div>

            <div className="ticket-panel" style={{
              backgroundColor: '#161826', borderRadius: '24px', padding: '28px', border: '1px solid #282c42'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', margin: '0 0 16px 0' }}>Beli Tiket</h3>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', display: 'block', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Pilih Kategori Tiket
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {event.tickets.map((t) => {
                    const isSelected = selectedTicketType === t.type;
                    const isVIP = t.type === 'vip';

                    return (
                      <div
                        key={t.type}
                        onClick={() => setSelectedTicketType(t.type)}
                        style={{
                          padding: '16px', borderRadius: '16px', cursor: 'pointer',
                          border: isSelected
                            ? (isVIP ? '2px solid #eab308' : '2px solid #38bdf8')
                            : '1px solid #282c42',
                          backgroundColor: isSelected
                            ? (isVIP ? 'rgba(234, 179, 8, 0.08)' : 'rgba(56, 189, 248, 0.08)')
                            : '#11131f',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {isVIP ? <Crown size={18} color="#eab308" /> : <Ticket size={18} color="#38bdf8" />}
                            <span style={{ fontWeight: '800', fontSize: '15px' }}>{t.name}</span>
                          </div>
                          <span style={{ fontSize: '18px', fontWeight: '900', color: isVIP ? '#eab308' : '#38bdf8' }}>
                            ${t.price}
                          </span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                          {t.benefits.map((benefit, idx) => (
                            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#9ca3af' }}>
                              <Check size={14} color={isSelected ? (isVIP ? '#eab308' : '#38bdf8') : '#6b7280'} />
                              <span>{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <hr style={{ borderColor: '#1e2235', margin: '0 0 20px 0' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '14px', fontWeight: '700', display: 'block' }}>Jumlah Tiket</span>
                  <span style={{ fontSize: '11px', color: '#6b7280' }}>Maks. 5 tiket per akun</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', backgroundColor: '#11131f', padding: '6px 14px', borderRadius: '12px', border: '1px solid #282c42' }}>
                  <button
                    onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Minus size={16} />
                  </button>
                  <span style={{ fontWeight: '800', minWidth: '20px', textAlign: 'center', fontSize: '15px' }}>{ticketQuantity}</span>
                  <button
                    onClick={() => setTicketQuantity(Math.min(5, ticketQuantity + 1))}
                    style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <span style={{ fontSize: '14px', color: '#9ca3af' }}>Total Pembayaran</span>
                <span style={{ fontSize: '28px', fontWeight: '900', color: '#fff' }}>${totalPrice}</span>
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  width: '100%', padding: '14px', borderRadius: '14px', border: 'none',
                  background: selectedTicketType === 'vip'
                    ? 'linear-gradient(135deg, #eab308 0%, #ca8a04 100%)'
                    : 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                  color: selectedTicketType === 'vip' ? '#000' : '#fff',
                  fontWeight: '800', fontSize: '15px', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  boxShadow: selectedTicketType === 'vip'
                    ? '0 4px 15px rgba(234, 179, 8, 0.3)'
                    : '0 4px 15px rgba(2, 132, 199, 0.4)',
                  marginBottom: '16px', transition: 'all 0.2s ease'
                }}
              >
                <Ticket size={18} /> Lanjutkan Ke Checkout
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', color: '#6b7280', fontSize: '12px' }}>
                <ShieldCheck size={16} color="#10b981" /> Tiket dijamin 100% Asli & Resmi
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}