import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { Heart, Ticket, MapPin } from 'lucide-react';
import { useFavorites } from '../context/FavoriteContext';

export default function Favorites() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('favorites');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { favorites, toggleFavorite } = useFavorites();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0c10', color: '#fff' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <main style={{ flex: 1, padding: '28px', overflowY: 'auto' }}>
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <h1 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '20px' }}>Your Favorites</h1>

        {favorites.length === 0 ? (
          <p style={{ color: '#9ca3af' }}>Belum ada event favorit yang disimpan.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '20px' }}>
            {favorites.map((item) => (
              <div 
                key={item.id}
                style={{
                  backgroundColor: '#161826',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #1e2235',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'relative' }}>
                  <img src={item.image} alt={item.title} style={{ width: '100%', height: '140px', objectFit: 'cover' }} />
                  
                  {/* Tombol Menghapus dari Favorit */}
                  <button
                    type="button"
                    onClick={() => toggleFavorite(item)}
                    style={{
                      position: 'absolute', top: '10px', right: '10px',
                      backgroundColor: 'rgba(11, 12, 16, 0.6)', backdropFilter: 'blur(4px)',
                      border: 'none', borderRadius: '50%', width: '32px', height: '32px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}
                  >
                    <Heart size={16} color="#ec4899" fill="#ec4899" />
                  </button>
                </div>

                <div style={{ padding: '16px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '700', margin: '0 0 4px 0' }}>{item.title}</h3>
                  <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={14} /> {item.venue}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '16px', fontWeight: '800' }}>{item.price}</span>
                    
                    {/* FIX: Tombol Beli Tiket Harus Navigasi Ke Detail */}
                    <button
                      onClick={() => navigate(`/detail/${item.id}`)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        backgroundColor: '#38bdf8',
                        color: '#000',
                        fontWeight: '700',
                        fontSize: '12px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Ticket size={14} /> Beli Tiket
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}