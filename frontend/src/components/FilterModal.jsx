import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const GENRES = ['Concert', 'Festival', 'Acoustic', 'EDM', 'Indie', 'Jazz', 'Pop', 'Rock'];
const CITIES = ['Tokyo', 'Los Angeles', 'New York City', 'London', 'Berlin'];
const MAX_PRICE_LIMIT = 300;

const FilterModal = ({ isOpen, onClose, onApply, initialFilters }) => {
  const [selectedGenres, setSelectedGenres] = useState(initialFilters?.genres || []);
  const [selectedCity, setSelectedCity] = useState(initialFilters?.city || '');
  const [price, setPrice] = useState(initialFilters?.maxPrice ?? MAX_PRICE_LIMIT);

  // Sinkronkan ulang state internal setiap kali modal dibuka
  useEffect(() => {
    if (isOpen) {
      setSelectedGenres(initialFilters?.genres || []);
      setSelectedCity(initialFilters?.city || '');
      setPrice(initialFilters?.maxPrice ?? MAX_PRICE_LIMIT);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleGenre = (genre) => {
    if (selectedGenres.includes(genre)) {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    } else {
      setSelectedGenres([...selectedGenres, genre]);
    }
  };

  const handleClearAll = () => {
    setSelectedGenres([]);
    setSelectedCity('');
    setPrice(MAX_PRICE_LIMIT);
  };

  const handleApply = () => {
    onApply({ genres: selectedGenres, city: selectedCity, maxPrice: Number(price) });
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(8px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px',
      animation: 'fadeIn 0.25s ease-out'
    }}>
      <div style={{
        backgroundColor: '#161826',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '480px',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        border: '1px solid #282c42',
        boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
        color: '#fff',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', margin: 0 }}>Filter Events</h2>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button
              onClick={handleClearAll}
              style={{ background: 'none', border: 'none', color: '#38bdf8', fontSize: '13px', cursor: 'pointer', fontWeight: '500' }}
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              style={{ background: '#222638', border: 'none', color: '#9ca3af', width: '32px', height: '32px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Genre Section */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            Genre
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {GENRES.map((genre) => {
              const isSelected = selectedGenres.includes(genre);
              return (
                <button
                  key={genre}
                  onClick={() => toggleGenre(genre)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '13px',
                    border: '1px solid',
                    borderColor: isSelected ? '#a855f7' : '#282c42',
                    backgroundColor: isSelected ? 'rgba(168, 85, 247, 0.2)' : '#1e2235',
                    color: isSelected ? '#f0abfc' : '#9ca3af',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {genre}
                </button>
              );
            })}
          </div>
        </div>

        {/* City Section */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase', display: 'block', marginBottom: '12px' }}>
            City
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {CITIES.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <div
                  key={city}
                  onClick={() => setSelectedCity(isSelected ? '' : city)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '10px 14px',
                    borderRadius: '10px',
                    backgroundColor: '#1e2235',
                    cursor: 'pointer',
                    border: isSelected ? '1px solid #38bdf8' : '1px solid transparent',
                    fontSize: '13px',
                    color: isSelected ? '#fff' : '#9ca3af'
                  }}
                >
                  <div style={{
                    width: '16px',
                    height: '16px',
                    borderRadius: '4px',
                    border: isSelected ? 'none' : '1px solid #4b5563',
                    backgroundColor: isSelected ? '#38bdf8' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    {isSelected && <Check size={12} color="#000" strokeWidth={3} />}
                  </div>
                  {city}
                </div>
              );
            })}
          </div>
        </div>

        {/* Price Range */}
        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <label style={{ fontSize: '12px', fontWeight: '700', color: '#9ca3af', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              Price Range
            </label>
            <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: '600' }}>$0 - ${price}</span>
          </div>
          <input
            type="range"
            min="0"
            max={MAX_PRICE_LIMIT}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            style={{
              width: '100%',
              accentColor: '#38bdf8',
              cursor: 'pointer'
            }}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleApply}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '12px',
            border: 'none',
            backgroundColor: '#0ea5e9',
            color: '#fff',
            fontWeight: '600',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(14, 165, 233, 0.3)',
            transition: 'background-color 0.2s ease'
          }}
        >
          Update Results
        </button>
      </div>
    </div>
  );
};

export default FilterModal;