import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Ticket, MapPin, Heart, Loader2 } from 'lucide-react';
import { useFavorites } from '../context/FavoriteContext';
import { api } from '../../api';

export default function Home() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const { toggleFavorite, isFavorite } = useFavorites();

  const featured = events[0];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0c10', color: '#fff', maxWidth: '100vw', overflowX: 'hidden' }}>
      <style>{`
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
        .home-main { padding: 28px; }
        @media (max-width: 640px) {
          .home-main { padding: 16px; }
        }
        .home-hero { padding: 32px; }
        @media (max-width: 640px) {
          .home-hero { padding: 20px; }
        }
        .home-hero-title { font-size: 32px; }
        @media (max-width: 640px) {
          .home-hero-title { font-size: 22px; }
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
        }
        @media (max-width: 560px) {
          .events-grid { grid-template-columns: 1fr; gap: 14px; }
        }
      `}</style>

      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main className="home-main" style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '12px' }}>
            <Loader2 size={32} color="#ec4899" style={{ animation: 'spin 1s linear infinite' }} />
            <span style={{ color: '#9ca3af', fontSize: '14px' }}>Loading upcoming events...</span>
          </div>
        ) : (
          <>
            {/* Featured Hero Banner */}
            {featured && (
              <div
                className="home-hero"
                onClick={() => navigate(`/detail/${featured.id}`)}
                style={{
                  borderRadius: '20px',
                  backgroundImage: `linear-gradient(to right, rgba(11,12,16,0.9), rgba(11,12,16,0.2)), url('${featured.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  marginBottom: '32px',
                  cursor: 'pointer',
                  border: '1px solid #1e2235'
                }}
              >
                <span style={{ backgroundColor: '#ec4899', color: '#fff', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700' }}>FEATURED</span>
                <h2 className="home-hero-title" style={{ fontWeight: '900', margin: '12px 0 8px 0' }}>{featured.title}</h2>
                <p style={{ color: '#38bdf8', fontSize: '14px', margin: '0 0 20px 0', display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                  <MapPin size={16} /> {featured.venue} • {featured.date}
                </p>
                <button style={{ padding: '10px 20px', borderRadius: '12px', border: 'none', backgroundColor: '#38bdf8', color: '#000', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Ticket size={16} /> Get Tickets Now (${featured.price})
                </button>
              </div>
            )}

            {/* Recommended Section */}
            <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Recommended For You</h2>

            <div className="events-grid">
              {events.slice(0, 6).map((event) => {
                const favorited = isFavorite(event.id);
                return (
                  <div
                    key={event.id}
                    onClick={() => navigate(`/detail/${event.id}`)}
                    style={{
                      backgroundColor: '#161826',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid #1e2235',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'transform 0.2s'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img src={event.image} alt={event.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />

                      {/* Tombol Heart */}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(event);
                        }}
                        style={{
                          position: 'absolute', top: '10px', right: '10px',
                          backgroundColor: 'rgba(11, 12, 16, 0.6)', backdropFilter: 'blur(4px)',
                          border: 'none', borderRadius: '50%', width: '32px', height: '32px',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 10
                        }}
                      >
                        <Heart size={16} color={favorited ? '#ec4899' : '#fff'} fill={favorited ? '#ec4899' : 'none'} />
                      </button>
                    </div>

                    <div style={{ padding: '16px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>{event.title}</h3>
                      <p style={{ color: '#38bdf8', fontSize: '12px', margin: 0 }}>{event.venue} • {event.date}</p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                        <span style={{ fontSize: '16px', fontWeight: '800' }}>${event.price}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
    </div>
  );
}