// src/organizer/events/EventForm.jsx

import React, { useState, useEffect, useRef } from 'react';
import { X, Plus, Trash2, Loader2, MapPin, Calendar, Clock, Sparkles, Ticket, Shield } from 'lucide-react';

const sectionTitleStyle = {
  fontSize: '0.95rem',
  fontWeight: '800',
  color: '#ec4899',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '14px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const cardSectionStyle = {
  backgroundColor: '#11131f',
  borderRadius: '16px',
  padding: '20px',
  border: '1px solid #1e2235',
  marginBottom: '20px'
};

const inputStyle = {
  width: '100%',
  padding: '12px 16px',
  borderRadius: '12px',
  backgroundColor: '#1a1d2e',
  border: '1px solid #282c42',
  color: '#fff',
  fontSize: '0.88rem',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
  boxSizing: 'border-box'
};

const labelStyle = {
  fontSize: '0.82rem',
  fontWeight: '600',
  color: '#9ca3af',
  display: 'block',
  marginBottom: '6px'
};

export default function EventForm({
  initialData,
  onSubmit,
  onClose,
  submitting
}) {
  const [form, setForm] = useState({
    title: initialData?.title || '',
    artist: initialData?.artist || '',
    venue: initialData?.venue || '',
    city: initialData?.city || '',
    date: initialData?.date || '',
    time: initialData?.time || '19:00',
    description: initialData?.description || '',
    image: initialData?.image || '',
    status: initialData?.status || 'published',
    category: initialData?.category || 'Concert',
    address: initialData?.address || '',
    doorsOpen: initialData?.doorsOpen || '18:00',
    showStarts: initialData?.showStarts || '19:00',
    ageLimit: initialData?.ageLimit || 'Semua umur',
    lat: initialData?.lat || -6.2,
    lng: initialData?.lng || 106.8
  });

  const [lineup, setLineup] = useState(
    initialData?.lineup?.length
      ? initialData.lineup
      : ['']
  );

  const [categories, setCategories] = useState(
    initialData?.categories?.length
      ? initialData.categories.map(category => ({
          id: category.id,
          name: category.name || '',
          price: category.price ?? '',
          quota: category.quota ?? ''
        }))
      : [
          {
            name: 'Reguler',
            price: '',
            quota: ''
          }
        ]
  );

  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const updateForm = (field, value) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    // Fix marker icons pathing
    delete window.L.Icon.Default.prototype._getIconUrl;
    window.L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });

    const initLat = Number(form.lat) || -6.2;
    const initLng = Number(form.lng) || 106.8;

    // Create Map
    const map = window.L.map(mapContainerRef.current).setView([initLat, initLng], 13);
    mapRef.current = map;

    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Create Draggable Marker
    const marker = window.L.marker([initLat, initLng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    // Sync marker drag coordinates to form
    marker.on('dragend', () => {
      const position = marker.getLatLng();
      updateForm('lat', Number(position.lat.toFixed(6)));
      updateForm('lng', Number(position.lng.toFixed(6)));
    });

    // Map click moves marker and updates form
    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      updateForm('lat', Number(e.latlng.lat.toFixed(6)));
      updateForm('lng', Number(e.latlng.lng.toFixed(6)));
    });

    // Resize map on load to prevent rendering issues in modal
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update map marker when manual inputs change
  const handleManualCoordsChange = (field, val) => {
    const num = Number(val);
    updateForm(field, val);

    if (!isNaN(num) && mapRef.current && markerRef.current) {
      const newLat = field === 'lat' ? num : Number(form.lat);
      const newLng = field === 'lng' ? num : Number(form.lng);

      markerRef.current.setLatLng([newLat, newLng]);
      mapRef.current.panTo([newLat, newLng]);
    }
  };

  const handleLineupChange = (index, value) => {
    setLineup(prev =>
      prev.map((item, idx) =>
        idx === index ? value : item
      )
    );
  };

  const addLineupField = () => {
    setLineup(prev => [...prev, '']);
  };

  const removeLineupField = index => {
    setLineup(prev =>
      prev.filter((_, idx) => idx !== index)
    );
  };

  const updateCategory = (index, field, value) => {
    setCategories(prev =>
      prev.map((category, idx) =>
        idx === index
          ? {
              ...category,
              [field]: value
            }
          : category
      )
    );
  };

  const addCategory = () => {
    setCategories(prev => [
      ...prev,
      {
        name: '',
        price: '',
        quota: ''
      }
    ]);
  };

  const removeCategory = index => {
    if (categories.length === 1) return;
    setCategories(prev =>
      prev.filter((_, idx) => idx !== index)
    );
  };

  const handleSubmit = e => {
    e.preventDefault();

    const cleanLineup = lineup.filter(
      item => item.trim() !== ''
    );

    const cleanCategories = categories
      .filter(category => category.name.trim() !== '')
      .map(category => ({
        ...(category.id ? { id: category.id } : {}),
        name: category.name.trim(),
        price: Number(category.price),
        quota: Number(category.quota),
        sold: Number(category.sold || 0)
      }));

    if (cleanCategories.length === 0) {
      alert('Minimal harus ada 1 kategori tiket.');
      return;
    }

    const invalidCategory = cleanCategories.some(
      category =>
        category.price < 0 ||
        category.quota < 1
    );

    if (invalidCategory) {
      alert('Harga tiket tidak boleh negatif dan kuota minimal 1.');
      return;
    }

    const cheapestPrice = Math.min(
      ...cleanCategories.map(category =>
        Number(category.price)
      )
    );

    onSubmit({
      ...form,
      lat: Number(form.lat) || -6.2,
      lng: Number(form.lng) || 106.8,
      artist:
        form.artist ||
        cleanLineup[0] ||
        'Berbagai Artis',
      lineup: cleanLineup,
      secondaryTag: form.category,
      categories: cleanCategories,
      price: cheapestPrice,
      tickets: cleanCategories.map(category => ({
        type: category.name
          .toLowerCase()
          .includes('vip')
          ? 'vip'
          : 'regular',
        name: category.name,
        price: category.price,
        benefits: category.name
          .toLowerCase()
          .includes('vip')
          ? [
              'Akses area VIP',
              'Merchandise eksklusif'
            ]
          : [
              'Akses area umum',
              'E-ticket QR'
            ]
      }))
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(5, 5, 8, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      {/* Modal Card */}
      <div
        style={{
          backgroundColor: '#161826',
          borderRadius: '24px',
          border: '1px solid #1e2235',
          maxWidth: '750px',
          width: '100%',
          padding: '28px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        {/* Style block for hover border effects and Leaflet container */}
        <style>{`
          .form-input-field:focus {
            border-color: #ec4899 !important;
            box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.15);
          }
          .form-close-btn:hover {
            color: #fff !important;
            background-color: rgba(255, 255, 255, 0.05);
          }
          /* Override Leaflet internal styling to match dark theme */
          .leaflet-container {
            font-family: inherit;
          }
          .leaflet-bar a {
            background-color: #161826 !important;
            color: #fff !important;
            border-bottom: 1px solid #282c42 !important;
          }
        `}</style>

        {/* Close Modal Button */}
        <button
          type="button"
          onClick={onClose}
          className="form-close-btn"
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#38bdf8', fontWeight: '800', letterSpacing: '1px', textTransform: 'uppercase', backgroundColor: 'rgba(56, 189, 248, 0.08)', padding: '4px 10px', borderRadius: '8px', marginBottom: '8px' }}>
            <Sparkles size={12} /> Auralis Portal EO
          </div>
          <h3
            style={{
              fontSize: '1.45rem',
              fontWeight: '900',
              color: '#fff',
              margin: 0,
              letterSpacing: '-0.5px'
            }}
          >
            {initialData ? 'Edit Konser Anda' : 'Buat Konser Baru'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          
          {/* SECTION 1: INFORMASI UTAMA */}
          <div style={cardSectionStyle}>
            <div style={sectionTitleStyle}>
              <Ticket size={18} /> Informasi Utama
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Judul Konser/Event</label>
                  <input
                    type="text"
                    required
                    className="form-input-field"
                    value={form.title}
                    onChange={e => updateForm('title', e.target.value)}
                    style={inputStyle}
                    placeholder="Contoh: Harmoni Malam Jazz"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Artis Utama</label>
                  <input
                    type="text"
                    className="form-input-field"
                    value={form.artist}
                    onChange={e => updateForm('artist', e.target.value)}
                    style={inputStyle}
                    placeholder="Contoh: Tulus & Friends"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Kategori Musik/Genre</label>
                  <select
                    value={form.category}
                    onChange={e => updateForm('category', e.target.value)}
                    className="form-input-field"
                    style={{ ...inputStyle, appearance: 'none' }}
                  >
                    <option value="Concert">Concert</option>
                    <option value="Festival">Festival</option>
                    <option value="Acoustic">Acoustic</option>
                    <option value="EDM">EDM</option>
                    <option value="Indie">Indie</option>
                    <option value="Jazz">Jazz</option>
                    <option value="Pop">Pop</option>
                    <option value="Rock">Rock</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status Penerbitan</label>
                  <select
                    value={form.status}
                    onChange={e => updateForm('status', e.target.value)}
                    className="form-input-field"
                    style={{ ...inputStyle, appearance: 'none' }}
                  >
                    <option value="draft">Draft (Simpan internal)</option>
                    <option value="published">Published (Langsung tayang ke user)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>URL Gambar Banner</label>
                <input
                  type="url"
                  className="form-input-field"
                  value={form.image}
                  onChange={e => updateForm('image', e.target.value)}
                  style={inputStyle}
                  placeholder="https://images.unsplash.com/..."
                />
              </div>

              <div>
                <label style={labelStyle}>Deskripsi Acara</label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={e => updateForm('description', e.target.value)}
                  className="form-input-field"
                  style={{
                    ...inputStyle,
                    resize: 'vertical',
                    fontFamily: 'inherit'
                  }}
                  placeholder="Berikan deskripsi detail konser Anda..."
                />
              </div>

              {/* Lineup Artis */}
              <div>
                <label style={labelStyle}>Lineup Pendukung</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {lineup.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={item}
                        onChange={e => handleLineupChange(idx, e.target.value)}
                        className="form-input-field"
                        style={inputStyle}
                        placeholder={`Nama Artis/Band ${idx + 1}`}
                      />
                      {lineup.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLineupField(idx)}
                          style={{
                            background: 'rgba(244,63,94,0.1)',
                            border: '1px solid rgba(244,63,94,0.2)',
                            borderRadius: '12px',
                            padding: '0 12px',
                            color: '#f43f5e',
                            cursor: 'pointer',
                            transition: 'all 0.2s'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLineupField}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                      padding: '10px',
                      borderRadius: '12px',
                      border: '1px dashed #282c42',
                      backgroundColor: 'transparent',
                      color: '#9ca3af',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Plus size={14} /> Tambah Lineup Artis
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: JADWAL & KETENTUAN */}
          <div style={cardSectionStyle}>
            <div style={sectionTitleStyle}>
              <Calendar size={18} /> Jadwal & Ketentuan
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
              <div>
                <label style={labelStyle}>Tanggal Pelaksanaan</label>
                <input
                  type="date"
                  required
                  className="form-input-field"
                  value={form.date}
                  onChange={e => updateForm('date', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Batas Usia Penonton</label>
                <select
                  value={form.ageLimit}
                  onChange={e => updateForm('ageLimit', e.target.value)}
                  className="form-input-field"
                  style={{ ...inputStyle, appearance: 'none' }}
                >
                  <option value="Semua umur">Semua umur</option>
                  <option value="13+">Remaja (13+)</option>
                  <option value="17+">Dewasa (17+)</option>
                  <option value="18+">Dewasa (18+)</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
              <div>
                <label style={labelStyle}>Gerbang Dibuka (Doors Open)</label>
                <input
                  type="time"
                  className="form-input-field"
                  value={form.doorsOpen}
                  onChange={e => updateForm('doorsOpen', e.target.value)}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Konser Dimulai (Show Starts)</label>
                <input
                  type="time"
                  className="form-input-field"
                  value={form.showStarts}
                  onChange={e => updateForm('showStarts', e.target.value)}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* SECTION 3: LOKASI & KOORDINAT PETA */}
          <div style={cardSectionStyle}>
            <div style={sectionTitleStyle}>
              <MapPin size={18} /> Detail Lokasi & Peta Koordinat
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Nama Venue / Tempat</label>
                  <input
                    type="text"
                    required
                    className="form-input-field"
                    value={form.venue}
                    onChange={e => updateForm('venue', e.target.value)}
                    style={inputStyle}
                    placeholder="Contoh: Balai Sarbini"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Kota</label>
                  <input
                    type="text"
                    required
                    className="form-input-field"
                    value={form.city}
                    onChange={e => updateForm('city', e.target.value)}
                    style={inputStyle}
                    placeholder="Contoh: Jakarta"
                  />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Alamat Lengkap Venue</label>
                <input
                  type="text"
                  className="form-input-field"
                  value={form.address}
                  onChange={e => updateForm('address', e.target.value)}
                  style={inputStyle}
                  placeholder="Jl. Sisingamangaraja No.73, Jakarta Selatan"
                />
              </div>

              {/* Coordinates Inputs */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={labelStyle}>Latitude (Garis Lintang)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="form-input-field"
                    value={form.lat}
                    onChange={e => handleManualCoordsChange('lat', e.target.value)}
                    style={inputStyle}
                    placeholder="-6.2297"
                  />
                </div>
                <div>
                  <label style={labelStyle}>Longitude (Garis Bujur)</label>
                  <input
                    type="number"
                    step="any"
                    required
                    className="form-input-field"
                    value={form.lng}
                    onChange={e => handleManualCoordsChange('lng', e.target.value)}
                    style={inputStyle}
                    placeholder="106.8175"
                  />
                </div>
              </div>

              {/* Map Container */}
              <div>
                <span style={labelStyle}>Pilih Lokasi di Peta (Klik atau Drag Pin)</span>
                <div 
                  ref={mapContainerRef} 
                  style={{ 
                    height: '240px', 
                    borderRadius: '14px', 
                    border: '1px solid #282c42',
                    overflow: 'hidden',
                    zIndex: 1,
                    marginTop: '8px'
                  }}
                />
              </div>
            </div>
          </div>

          {/* SECTION 4: KATEGORI TIKET */}
          <div style={cardSectionStyle}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '14px'
              }}
            >
              <div style={{ ...sectionTitleStyle, marginBottom: 0 }}>
                <Ticket size={18} /> Kategori Tiket Awal
              </div>

              <button
                type="button"
                onClick={addCategory}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'rgba(236,72,153,0.1)',
                  color: '#ec4899',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: '700',
                  transition: 'all 0.2s'
                }}
              >
                <Plus size={14} /> Tambah Kategori
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {categories.map((category, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#161826',
                    borderRadius: '12px',
                    padding: '12px',
                    border: '1px solid #282c42'
                  }}
                >
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '2fr 1fr 1fr auto',
                      gap: '8px',
                      alignItems: 'center'
                    }}
                  >
                    <input
                      type="text"
                      required
                      className="form-input-field"
                      value={category.name}
                      onChange={e => updateCategory(idx, 'name', e.target.value)}
                      style={inputStyle}
                      placeholder="Contoh: VIP / Reguler"
                    />

                    <input
                      type="number"
                      required
                      min="0"
                      className="form-input-field"
                      value={category.price}
                      onChange={e => updateCategory(idx, 'price', e.target.value)}
                      style={inputStyle}
                      placeholder="Harga ($)"
                    />

                    <input
                      type="number"
                      required
                      min="1"
                      className="form-input-field"
                      value={category.quota}
                      onChange={e => updateCategory(idx, 'quota', e.target.value)}
                      style={inputStyle}
                      placeholder="Kuota"
                    />

                    <button
                      type="button"
                      onClick={() => removeCategory(idx)}
                      disabled={categories.length === 1}
                      style={{
                        width: '38px',
                        height: '38px',
                        border: 'none',
                        borderRadius: '10px',
                        background: categories.length === 1 ? 'rgba(255,255,255,0.02)' : 'rgba(244,63,94,0.1)',
                        color: categories.length === 1 ? '#4b5563' : '#f43f5e',
                        cursor: categories.length === 1 ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              border: 'none',
              fontWeight: '800',
              fontSize: '0.95rem',
              cursor: submitting ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 8px 20px rgba(236, 72, 153, 0.25)',
              opacity: submitting ? 0.75 : 1,
              transition: 'all 0.2s'
            }}
          >
            {submitting ? (
              <Loader2
                size={18}
                style={{
                  animation: 'spin 1s linear infinite'
                }}
              />
            ) : null}
            {initialData ? 'Simpan Perubahan Konser' : 'Terbitkan Konser & Tiket'}
          </button>
        </form>
      </div>
    </div>
  );
}
