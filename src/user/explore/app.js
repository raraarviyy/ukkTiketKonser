import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Search, SlidersHorizontal, MapPin, Heart, Loader2, SearchX } from 'lucide-react';
import { useFavorites } from '../context/FavoriteContext';
import { api } from '../../api';
import FilterModal from '../../components/FilterModal';

const DEFAULT_FILTERS = { genres: [], city: '', maxPrice: 300 };

export default function Explore() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('explore');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);

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

  const isFilterActive = filters.genres.length > 0 || filters.city !== '' || filters.maxPrice < DEFAULT_FILTERS.maxPrice;

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        event.title.toLowerCase().includes(search.toLowerCase()) ||
        event.artist.toLowerCase().includes(search.toLowerCase()) ||
        event.venue.toLowerCase().includes(search.toLowerCase());

      const matchesGenre = filters.genres.length === 0 || filters.genres.includes(event.category);
      const matchesCity = filters.city === '' || event.city === filters.city;
      const matchesPrice = event.price <= filters.maxPrice;

      return matchesSearch && matchesGenre && matchesCity && matchesPrice;
    });
  }, [events, search, filters]);

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0c10', color: '#fff', maxWidth: '100vw', overflowX: 'hidden' }}>
      <style>{`
        .mobile-menu-btn { display: none; }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
        .explore-content { padding: 28px; }
        @media (max-width: 640px) {
          .explore-content { padding: 16px; }
        }
        .explore-toolbar { display: flex; gap: 12px; margin-bottom: 28px; }
        @media (max-width: 480px) {
          .explore-toolbar { flex-direction: column; }
        }
        .events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 20px;
        }
        @media (max-width: 560px) {
          .events-grid { grid-template-columns: 1fr; gap: 14px; }
        }
      `}</style>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main style={{ flex: 1, overflowY: 'auto', minWidth: 0 }}>
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <div className="explore-content">
          <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>Explore Events</h1>

          {/* Search Bar */}
          <div className="explore-toolbar">
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', backgroundColor: '#161826', borderRadius: '12px', padding: '0 16px', border: '1px solid #1e2235' }}>
              <Search size={18} color="#9ca3af" />
              <input
                type="text"
                placeholder="Search concerts, artists, venues..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ width: '100%', background: 'none', border: 'none', padding: '12px', color: '#fff', outline: 'none' }}
              />
            </div>
            <button
              onClick={() => setIsFilterOpen(true)}
              style={{
                padding: '0 16px', borderRadius: '12px',
                backgroundColor: isFilterActive ? 'rgba(56, 189, 248, 0.1)' : '#161826',
                border: isFilterActive ? '1px solid #38bdf8' : '1px solid #1e2235',
                color: isFilterActive ? '#38bdf8' : '#fff',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                whiteSpace: 'nowrap', padding: '12px 16px'
              }}
            >
              <SlidersHorizontal size={18} /> Filters{isFilterActive ? ' •' : ''}
            </button>
          </div>

          {/* Event Grid */}
          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '12px' }}>
              <Loader2 size={36} color="#38bdf8" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>Searching the best events...</span>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#161826', borderRadius: '20px', border: '1px dashed #282c42' }}>
              <SearchX size={44} color="#6b7280" style={{ marginBottom: '12px' }} />
              <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 6px 0' }}>Tidak ada event ditemukan</h3>
              <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Coba ubah kata kunci pencarian atau reset filter kamu.</p>
            </div>
          ) : (
            <div className="events-grid">
              {filteredEvents.map((event) => {
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
                      position: 'relative'
                    }}
                  >
                    <div style={{ position: 'relative' }}>
                      <img src={event.image} alt={event.title} style={{ width: '100%', height: '160px', objectFit: 'cover' }} />

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
                      <span style={{ color: '#ec4899', fontSize: '11px', fontWeight: '700' }}>{event.category}</span>
                      <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '4px 0' }}>{event.title}</h3>
                      <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <MapPin size={14} /> {event.venue}
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '16px', fontWeight: '800' }}>${event.price}</span>
                        <span style={{ color: '#38bdf8', fontSize: '12px', fontWeight: '600' }}>{event.date}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <FilterModal
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={filters}
      />
    </div>
  );
}