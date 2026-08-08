import React, { useState } from 'react';
import { 
  Building2, User, Ticket, QrCode, BarChart3, ShieldCheck, 
  MapPin, Calendar, ArrowRight, CheckCircle2, ChevronRight, 
  X, Mail, Lock, Phone, Sparkles, Music, Zap, LogIn, LogOut, Check
} from 'lucide-react';

// Data Konser & Event Terbaru
const EVENT_LIST = [
  {
    id: 'evt-1',
    title: 'Kisah Klasik Tour 2026',
    artist: 'Sheila On 7',
    venue: 'Stadion Siliwangi',
    city: 'Bandung',
    date: '24 OKT 2026',
    price: 'Rp 350.000',
    category: 'Konser Musik',
    badge: 'Selling Fast',
    badgeColor: '#ec4899',
    image: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'evt-2',
    title: 'Tur Manusia 2026',
    artist: 'Tulus',
    venue: 'GBK Senayan',
    city: 'Jakarta',
    date: '12 NOV 2026',
    price: 'Rp 450.000',
    category: 'Konser Musik',
    badge: 'Presale 2',
    badgeColor: '#a855f7',
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'evt-3',
    title: 'Mencari Jiwa Tour',
    artist: 'Hindia',
    venue: 'GWK Cultural Park',
    city: 'Bali',
    date: '05 DES 2026',
    price: 'Rp 280.000',
    category: 'Festival Musik',
    badge: 'Tersedia',
    badgeColor: '#10b981',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'evt-4',
    title: 'Fabula Intimate Live',
    artist: 'Mahalini',
    venue: 'Grand Pacific Hall',
    city: 'Yogyakarta',
    date: '18 DES 2026',
    price: 'Rp 300.000',
    category: 'Konser Musik',
    badge: 'Selling Fast',
    badgeColor: '#ec4899',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=800'
  }
];

export default function GoersInspiredPortal() {
  // Authentication State Simulation
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // Modal & Selection States
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState('user'); // 'user' | 'organizer'
  const [selectedConcert, setSelectedConcert] = useState(null);

  // Form States
  const [userForm, setUserForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [organizerForm, setOrganizerForm] = useState({
    orgName: '', venueName: '', venueType: 'Concert Hall / Arena', picName: '', businessEmail: '', phone: '', capacity: ''
  });

  // Intercept Booking Action
  const handleBookingClick = (eventItem) => {
    if (!isLoggedIn) {
      setSelectedConcert(eventItem);
      setActiveRoleTab('user');
      setAuthModalOpen(true);
    } else {
      alert(`Berhasil! Kamu akan masuk ke halaman pembayaran tiket untuk: ${eventItem.title}`);
    }
  };

  // Submit Handler Registration User
  const handleUserSubmit = (e) => {
    e.preventDefault();
    setIsLoggedIn(true);
    setCurrentUser({ name: userForm.fullName, email: userForm.email });
    setAuthModalOpen(false);

    if (selectedConcert) {
      alert(`Registrasi Berhasil! Selamat datang ${userForm.fullName}. Lanjutkan pemesanan tiket ${selectedConcert.title}.`);
    } else {
      alert(`Registrasi Berhasil! Selamat datang, ${userForm.fullName}.`);
    }
  };

  // Submit Handler Organizer
  const handleOrganizerSubmit = (e) => {
    e.preventDefault();
    alert(`Permohonan Kemitraan Venue "${organizerForm.venueName}" dikirim! Tim Business Development kami akan menghubungi Anda.`);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentUser(null);
    setSelectedConcert(null);
  };

  return (
    <div style={{ backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>
      
      <style>{`
        .active-tab {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #fff !important;
          box-shadow: 0 4px 15px rgba(99, 102, 241, 0.35);
        }
        .card-hover {
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .card-hover:hover {
          transform: translateY(-6px);
          border-color: rgba(168, 85, 247, 0.5) !important;
          box-shadow: 0 16px 32px rgba(0, 0, 0, 0.5);
        }
        .btn-gradient {
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          color: #fff;
          transition: all 0.25s ease;
        }
        .btn-gradient:hover {
          opacity: 0.92;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(168, 85, 247, 0.4);
        }
      `}</style>

      {/* NAVBAR */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 40, backgroundColor: 'rgba(15, 23, 42, 0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div style={{ padding: '8px 10px', background: 'linear-gradient(135deg, #6366f1, #a855f7)', borderRadius: '12px' }}>
              <Ticket size={22} color="#fff" />
            </div>
            <span style={{ fontSize: '1.4rem', fontWeight: '900', letterSpacing: '-0.5px' }}>
              Goers<span style={{ color: '#a855f7' }}>Pass</span>
            </span>
          </div>

          {/* Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '28px', fontSize: '0.92rem', fontWeight: '500' }}>
            <a href="#concert-list" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Jadwal Konser</a>
            <a href="#venue-solutions" style={{ color: '#cbd5e1', textDecoration: 'none' }}>Solusi Venue & Organizer</a>
          </div>

          {/* User Auth Action */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isLoggedIn ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '0.88rem', color: '#38bdf8', fontWeight: '600' }}>
                  👋 Halo, {currentUser?.name}
                </span>
                <button 
                  onClick={handleLogout}
                  style={{ padding: '8px 14px', backgroundColor: '#334155', border: 'none', color: '#f1f5f9', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <LogOut size={15} /> Keluar
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={() => { setSelectedConcert(null); setActiveRoleTab('user'); setAuthModalOpen(true); }}
                  style={{ padding: '9px 18px', backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '0.88rem' }}
                >
                  Masuk / Daftar User
                </button>
                <button 
                  onClick={() => { setSelectedConcert(null); setActiveRoleTab('organizer'); setAuthModalOpen(true); }}
                  className="btn-gradient"
                  style={{ padding: '10px 20px', border: 'none', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', fontSize: '0.88rem', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Building2 size={16} /> Daftar Mitra Venue
                </button>
              </>
            )}
          </div>

        </div>
      </nav>

      {/* HERO SECTION */}
      <section style={{ maxWidth: '1240px', margin: '40px auto 60px', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', backgroundColor: 'rgba(168, 85, 247, 0.15)', border: '1px solid rgba(168, 85, 247, 0.3)', color: '#c084fc', fontSize: '0.82rem', fontWeight: '700', marginBottom: '20px' }}>
            <Sparkles size={15} /> GOERS TICKETING & VENUE ECOSYSTEM
          </div>
          
          <h1 style={{ fontSize: 'clamp(2.2rem, 4.2vw, 3.5rem)', fontWeight: '900', lineHeight: 1.15, marginBottom: '20px', letterSpacing: '-1px' }}>
            Pesan Tiket Konser atau <br />
            <span style={{ background: 'linear-gradient(135deg, #818cf8, #c084fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Daftarkan Organisasi & Venue
            </span>
          </h1>

          <p style={{ color: '#94a3b8', fontSize: '1.02rem', lineHeight: 1.6, marginBottom: '32px', maxWidth: '520px' }}>
            Dapatkan e-ticket instan untuk konser musik favoritmu. Jika kamu pengelola venue atau EO, daftarkan tempatmu untuk sistem *gate scanner* & laporan otomatis.
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a 
              href="#concert-list"
              className="btn-gradient"
              style={{ padding: '14px 28px', borderRadius: '12px', textDecoration: 'none', fontSize: '0.95rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <Ticket size={18} /> Lihat Daftar Konser
            </a>
            
            <button 
              onClick={() => { setSelectedConcert(null); setActiveRoleTab('organizer'); setAuthModalOpen(true); }}
              style={{ padding: '14px 28px', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.95rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Building2 size={18} color="#c084fc" /> Registrasi Venue (B2B)
            </button>
          </div>
        </div>

        {/* Hero Quick Banner */}
        <div style={{ backgroundColor: '#1e293b', borderRadius: '24px', padding: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <Zap color="#f43f5e" size={24} />
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800' }}>Alur Pemesanan Cepat & Aman</h3>
          </div>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', color: '#cbd5e1', fontSize: '0.9rem' }}>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={16} color="#34d399" /> Pilih Konser & Kategori Tiket</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={16} color="#34d399" /> Verifikasi / Login Akun Penonton</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={16} color="#34d399" /> Pembayaran QRIS / E-Wallet Instan</li>
            <li style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><CheckCircle2 size={16} color="#34d399" /> E-Ticket QR Code masuk ke HP kamu</li>
          </ul>
        </div>
      </section>

      {/* CONCERT & EVENT LIST SECTION */}
      <section id="concert-list" style={{ maxWidth: '1240px', margin: '0 auto 80px', padding: '0 24px', scrollMarginTop: '90px' }}>
        <div style={{ marginBottom: '32px' }}>
          <span style={{ color: '#ec4899', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '1px' }}>TIKET TERSEDIA HARI INI</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '800', marginTop: '4px' }}>Jadwal Konser Musik Mendatang</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '28px' }}>
          {EVENT_LIST.map((evt) => (
            <div 
              key={evt.id}
              className="card-hover"
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Event Image */}
              <div style={{ position: 'relative', height: '190px' }}>
                <img src={evt.image} alt={evt.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                
                {/* Badge Status */}
                <span style={{
                  position: 'absolute', top: '12px', right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(8px)',
                  color: evt.badgeColor, border: `1px solid ${evt.badgeColor}`,
                  padding: '4px 10px', borderRadius: '16px', fontSize: '0.75rem', fontWeight: '700'
                }}>
                  {evt.badge}
                </span>

                {/* City Tag */}
                <span style={{
                  position: 'absolute', bottom: '12px', left: '12px',
                  backgroundColor: 'rgba(0, 0, 0, 0.75)', backdropFilter: 'blur(8px)',
                  color: '#fff', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '600',
                  display: 'flex', alignItems: 'center', gap: '4px'
                }}>
                  <MapPin size={12} color="#ec4899" /> {evt.city}
                </span>
              </div>

              {/* Event Content */}
              <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'space-between' }}>
                <div>
                  <span style={{ color: '#a855f7', fontWeight: '700', fontSize: '0.82rem' }}>{evt.artist}</span>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: '800', margin: '4px 0 10px', lineHeight: '1.3' }}>{evt.title}</h3>
                  
                  <div style={{ fontSize: '0.85rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={15} color="#ec4899" /> {evt.date}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={15} color="#94a3b8" /> {evt.venue}
                    </div>
                  </div>
                </div>

                {/* Price & Booking Button */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Mulai dari</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: '800', color: '#34d399' }}>{evt.price}</span>
                  </div>
                  
                  <button 
                    onClick={() => handleBookingClick(evt)}
                    className="btn-gradient"
                    style={{
                      padding: '9px 16px', borderRadius: '10px', border: 'none',
                      fontSize: '0.85rem', fontWeight: '700', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: '6px'
                    }}
                  >
                    Pesan Tiket <Ticket size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* VENUE MANAGEMENT SOLUTIONS */}
      <section id="venue-solutions" style={{ backgroundColor: '#1e293b', padding: '80px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: '#a855f7', fontWeight: '700', fontSize: '0.88rem', letterSpacing: '1px' }}>UNTUK PROMOTOR & ORGANISASI VENUE</span>
            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '6px' }}>Solusi Pengelolaan Event & Tempat</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ backgroundColor: '#0f172a', padding: '28px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <Building2 size={32} color="#818cf8" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px' }}>Atur Jadwal & Slot Venue</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>Atur kalender booking venue, tipe tribun, dan reservasi dalam satu dashboard terpusat.</p>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '28px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <QrCode size={32} color="#c084fc" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px' }}>Gate QR Scanner</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>Validasi tiket penonton secara otomatis di pintu masuk tanpa hambatan antrean.</p>
            </div>

            <div style={{ backgroundColor: '#0f172a', padding: '28px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <BarChart3 size={32} color="#38bdf8" style={{ marginBottom: '16px' }} />
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '8px' }}>Laporan Real-Time</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.6 }}>Pantau total penjualan tiket dan pencairan dana langsung dari portal statistik mitra.</p>
            </div>
          </div>
        </div>
      </section>

      {/* DUAL REGISTRATION & LOGIN MODAL */}
      {authModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, backgroundColor: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#1e293b', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.12)', maxWidth: '500px', width: '100%', padding: '32px', position: 'relative', maxHeight: '90vh', overflowY: 'auto' }}>
            
            {/* Close Modal */}
            <button 
              onClick={() => { setAuthModalOpen(false); setSelectedConcert(null); }}
              style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
            >
              <X size={22} />
            </button>

            {/* If user clicked 'Pesan Tiket' without login */}
            {selectedConcert && (
              <div style={{ backgroundColor: 'rgba(236, 72, 153, 0.12)', border: '1px solid rgba(236, 72, 153, 0.3)', padding: '12px 16px', borderRadius: '12px', marginBottom: '20px', color: '#f472b6', fontSize: '0.85rem' }}>
                🔑 <strong>Pemberitahuan:</strong> Silakan login/daftar akun terlebih dahulu untuk melanjutkan pesan tiket <strong>{selectedConcert.title} ({selectedConcert.artist})</strong>.
              </div>
            )}

            {/* Role Switcher Tabs */}
            <div style={{ display: 'flex', backgroundColor: '#0f172a', padding: '5px', borderRadius: '12px', marginBottom: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
              <button 
                onClick={() => setActiveRoleTab('user')}
                className={activeRoleTab === 'user' ? 'active-tab' : ''}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', color: '#94a3b8', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <User size={15} /> Akun Penonton
              </button>
              <button 
                onClick={() => setActiveRoleTab('organizer')}
                className={activeRoleTab === 'organizer' ? 'active-tab' : ''}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', fontWeight: '700', fontSize: '0.85rem', cursor: 'pointer', color: '#94a3b8', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
              >
                <Building2 size={15} /> Mitra Venue / EO
              </button>
            </div>

            {/* TAB 1: REGISTRASI USER / PENONTON */}
            {activeRoleTab === 'user' && (
              <form onSubmit={handleUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ textAlign: 'center', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Daftar Akun Penonton</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>Isi data diri singkat untuk melanjutkan transaksi tiket.</p>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Nama Lengkap</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Contoh: Budi Santoso"
                    value={userForm.fullName}
                    onChange={(e) => setUserForm({...userForm, fullName: e.target.value})}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Alamat Email</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="nama@email.com"
                    value={userForm.email}
                    onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Nomor WhatsApp</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="08123456789"
                    value={userForm.phone}
                    onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Kata Sandi</label>
                  <input 
                    type="password" 
                    required 
                    placeholder="Minimal 8 karakter"
                    value={userForm.password}
                    onChange={(e) => setUserForm({...userForm, password: e.target.value})}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.88rem' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-gradient" 
                  style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '0.92rem', cursor: 'pointer', marginTop: '6px' }}
                >
                  {selectedConcert ? 'Lanjut ke Pembayaran Tiket' : 'Daftar Akun User'}
                </button>
              </form>
            )}

            {/* TAB 2: REGISTRASI VENUE / ORGANIZER */}
            {activeRoleTab === 'organizer' && (
              <form onSubmit={handleOrganizerSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ textAlign: 'center', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: '800' }}>Registrasi Venue / Organisasi</h3>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '2px' }}>Daftarkan venue atau promotor event Anda.</p>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Nama Perusahaan / Organisasi</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="PT Harmony Event"
                    value={organizerForm.orgName}
                    onChange={(e) => setOrganizerForm({...organizerForm, orgName: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Nama Venue</label>
                    <input 
                      type="text" 
                      required 
                      placeholder="Balai Sarbini"
                      value={organizerForm.venueName}
                      onChange={(e) => setOrganizerForm({...organizerForm, venueName: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Tipe Venue</label>
                    <select 
                      value={organizerForm.venueType}
                      onChange={(e) => setOrganizerForm({...organizerForm, venueType: e.target.value})}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                    >
                      <option value="Concert Hall / Arena">Concert Hall</option>
                      <option value="Stadium">Stadium</option>
                      <option value="Amphitheater / Outdoor Park">Outdoor Park</option>
                      <option value="Club / Lounge">Club / Lounge</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Email Bisnis</label>
                  <input 
                    type="email" 
                    required 
                    placeholder="partner@organisasi.com"
                    value={organizerForm.businessEmail}
                    onChange={(e) => setOrganizerForm({...organizerForm, businessEmail: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: '600', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>No. HP / WhatsApp PIC</label>
                  <input 
                    type="tel" 
                    required 
                    placeholder="08123456789"
                    value={organizerForm.phone}
                    onChange={(e) => setOrganizerForm({...organizerForm, phone: e.target.value})}
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                <button 
                  type="submit" 
                  className="btn-gradient" 
                  style={{ width: '100%', padding: '13px', borderRadius: '12px', border: 'none', fontWeight: '700', fontSize: '0.92rem', cursor: 'pointer', marginTop: '6px' }}
                >
                  Kirim Permohonan Kemitraan
                </button>
              </form>
            )}

          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '36px 24px', textAlign: 'center', color: '#64748b', fontSize: '0.88rem' }}>
        <p>© 2026 GoersPass Indonesia — Ecosystem for Ticketing & Venue Management.</p>
      </footer>

    </div>
  );
}