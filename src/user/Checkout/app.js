import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { 
  CreditCard, QrCode, Building2, CheckCircle2, ArrowLeft, 
  ShieldCheck, Download, Calendar, MapPin, Ticket, Sparkles, Copy, Loader2
} from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';
import { api } from '../../api';

export default function Checkout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loadData } = useTransaction();

  // Ambil data yang dikirim dari Halaman Detail (dengan fallback default jika diakses langsung)
  const defaultOrder = {
    ticketId: `TKT-${Math.floor(10000000 + Math.random() * 90000000)}-NEON`,
    eventTitle: "NEON PULSE TOUR 2026",
    artist: "Cyber Pulse & Friends",
    date: "OCT 24, 2026 • 20:30 PM",
    venue: "Cyber Arena, Tokyo",
    regularQty: 1,
    vipQty: 0,
    regularPrice: 89,
    vipPrice: 250,
    subtotal: 89,
    tax: 8.9,
    total: 97.90,
    ticketTypeStr: "Regular Pass"
  };

  const passedData = location.state;
  const eventData = passedData?.event || {};
  const ticketData = passedData?.ticketType || {};

  const orderData = passedData ? {
    ticketId: `TKT-${Math.floor(10000000 + Math.random() * 90000000)}`,
    eventTitle: eventData.title,
    artist: eventData.artist,
    date: `${eventData.date} • ${eventData.time}`,
    venue: eventData.venue,
    regularQty: ticketData.type === 'regular' ? passedData.quantity : 0,
    vipQty: ticketData.type === 'vip' ? passedData.quantity : 0,
    regularPrice: ticketData.type === 'regular' ? ticketData.price : 0,
    vipPrice: ticketData.type === 'vip' ? ticketData.price : 0,
    subtotal: passedData.totalPrice,
    tax: passedData.totalPrice * 0.1,
    total: passedData.totalPrice + (passedData.totalPrice * 0.1),
    ticketTypeStr: ticketData.name
  } : defaultOrder;

  // State Manajemen
  const [activeTab, setActiveTab] = useState('explore');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulasi Proses Pembayaran
  const handlePayment = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const historyRecord = {
        invoiceId: `INV/${new Date().getFullYear()}${String(new Date().getMonth()+1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}/VP/${Math.floor(Math.random() * 900000)}`,
        eventName: orderData.eventTitle,
        purchaseDate: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        paymentMethod: paymentMethod.toUpperCase(),
        itemDetails: `${orderData.regularQty + orderData.vipQty}x ${orderData.ticketTypeStr}`,
        subtotal: orderData.subtotal,
        serviceFee: orderData.tax,
        tax: 0,
        totalAmount: orderData.total.toFixed(2),
        status: 'PAID'
      };

      const ticketRecord = {
        id: orderData.ticketId,
        eventName: orderData.eventTitle,
        artist: orderData.artist,
        date: orderData.date.split(' • ')[0],
        time: orderData.date.split(' • ')[1] || '',
        venue: orderData.venue,
        ticketType: orderData.ticketTypeStr,
        seat: 'General Admission',
        quantity: orderData.regularQty + orderData.vipQty,
        totalPaid: orderData.total.toFixed(2),
        status: 'upcoming',
        qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${orderData.ticketId}`
      };

      const notificationRecords = [
        {
          title: 'Payment Successful',
          message: `Your payment of $${orderData.total.toFixed(2)} for ${orderData.eventTitle} was successful.`,
          type: 'payment'
        },
        {
          title: 'Booking Confirmed',
          message: `Your tickets for ${orderData.eventTitle} have been issued.`,
          type: 'booking'
        },
        {
          title: 'Upcoming Concert',
          message: `${orderData.eventTitle} is coming up soon on ${orderData.date.split(' • ')[0]}!`,
          type: 'reminder'
        }
      ];

      await api.purchaseTicket(ticketRecord, historyRecord, notificationRecords);
      await loadData(); // refresh global context
      setIsPaid(true);
    } catch (error) {
      console.error("Payment failed", error);
      alert("Payment failed!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(orderData.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0c10', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main style={{ padding: '28px', flex: 1, overflowY: 'auto' }}>
          
          {!isPaid && (
            <button 
              onClick={() => navigate(-1)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px', background: 'none',
                border: 'none', color: '#9ca3af', fontSize: '14px', fontWeight: '600',
                cursor: 'pointer', marginBottom: '20px'
              }}
            >
              <ArrowLeft size={18} /> Kembali ke Event Detail
            </button>
          )}

          {!isPaid ? (
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <h1 style={{ fontSize: '28px', fontWeight: '900', marginBottom: '24px' }}>Checkout & Pembayaran</h1>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '24px' }}>
                
                {/* Kolom Kiri: Pilihan Metode Pembayaran */}
                <div style={{ backgroundColor: '#161826', borderRadius: '20px', padding: '28px', border: '1px solid #1e2235' }}>
                  <h2 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '18px', color: '#38bdf8' }}>
                    Pilih Metode Pembayaran
                  </h2>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '24px' }}>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('qris')}
                      style={{
                        padding: '16px 12px', borderRadius: '14px',
                        border: paymentMethod === 'qris' ? '2px solid #38bdf8' : '1px solid #282c42',
                        backgroundColor: paymentMethod === 'qris' ? 'rgba(56, 189, 248, 0.1)' : '#11131f',
                        color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                      }}
                    >
                      <QrCode size={24} color={paymentMethod === 'qris' ? '#38bdf8' : '#9ca3af'} />
                      <span style={{ fontSize: '12px', fontWeight: '700' }}>QRIS / E-Wallet</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('card')}
                      style={{
                        padding: '16px 12px', borderRadius: '14px',
                        border: paymentMethod === 'card' ? '2px solid #38bdf8' : '1px solid #282c42',
                        backgroundColor: paymentMethod === 'card' ? 'rgba(56, 189, 248, 0.1)' : '#11131f',
                        color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                      }}
                    >
                      <CreditCard size={24} color={paymentMethod === 'card' ? '#38bdf8' : '#9ca3af'} />
                      <span style={{ fontSize: '12px', fontWeight: '700' }}>Kartu Kredit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('va')}
                      style={{
                        padding: '16px 12px', borderRadius: '14px',
                        border: paymentMethod === 'va' ? '2px solid #38bdf8' : '1px solid #282c42',
                        backgroundColor: paymentMethod === 'va' ? 'rgba(56, 189, 248, 0.1)' : '#11131f',
                        color: '#fff', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px'
                      }}
                    >
                      <Building2 size={24} color={paymentMethod === 'va' ? '#38bdf8' : '#9ca3af'} />
                      <span style={{ fontSize: '12px', fontWeight: '700' }}>Virtual Account</span>
                    </button>
                  </div>

                  <form onSubmit={handlePayment}>
                    {paymentMethod === 'qris' && (
                      <div style={{ textAlign: 'center', padding: '20px', backgroundColor: '#0b0c10', borderRadius: '16px', border: '1px solid #282c42' }}>
                        <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>
                          Scan QRIS ini menggunakan GoPay, OVO, DANA, ShopeePay, atau Mobile Banking Anda:
                        </p>
                        <div style={{ width: '180px', height: '180px', margin: '0 auto 16px', backgroundColor: '#fff', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=NEONPULSE-${orderData.ticketId}`} 
                            alt="QRIS Code" 
                            style={{ width: '100%', height: '100%' }}
                          />
                        </div>
                        <p style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '600' }}>
                          Otomatis terverifikasi setelah pembayaran selesai
                        </p>
                      </div>
                    )}

                    {paymentMethod === 'card' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div>
                          <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>Nomor Kartu</label>
                          <input type="text" placeholder="4532 •••• •••• 8921" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #282c42', backgroundColor: '#0b0c10', color: '#fff', fontSize: '14px', outline: 'none' }} required />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>Kadaluarsa (MM/YY)</label>
                            <input type="text" placeholder="12/28" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #282c42', backgroundColor: '#0b0c10', color: '#fff', fontSize: '14px', outline: 'none' }} required />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '12px', color: '#9ca3af', marginBottom: '6px' }}>CVV</label>
                            <input type="password" placeholder="•••" maxLength={3} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #282c42', backgroundColor: '#0b0c10', color: '#fff', fontSize: '14px', outline: 'none' }} required />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'va' && (
                      <div style={{ backgroundColor: '#0b0c10', padding: '16px', borderRadius: '14px', border: '1px solid #282c42' }}>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: '0 0 10px 0' }}>Nomor Virtual Account Bank BCA / Mandiri:</p>
                        <div style={{ fontSize: '20px', fontWeight: '900', color: '#38bdf8', letterSpacing: '2px', marginBottom: '8px' }}>
                          8801 9283 0192 88
                        </div>
                        <p style={{ fontSize: '11px', color: '#6b7280', margin: 0 }}>
                          Silakan transfer sesuai nominal total harga ke nomor VA di atas.
                        </p>
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={isProcessing}
                      style={{
                        width: '100%', marginTop: '24px', padding: '16px', borderRadius: '14px', border: 'none',
                        background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: '#fff',
                        fontSize: '15px', fontWeight: '800', cursor: isProcessing ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 15px rgba(2, 132, 199, 0.4)', transition: 'all 0.2s'
                      }}
                    >
                      {isProcessing ? (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Loader2 size={18} className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} /> Memproses...
                        </div>
                      ) : `Bayar Sekarang ($${orderData.total.toFixed(2)})`}
                    </button>
                  </form>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '16px', color: '#6b7280', fontSize: '12px' }}>
                    <ShieldCheck size={16} color="#22c55e" /> Encrypted 256-bit Secure Online Payment
                  </div>
                </div>

                {/* Kolom Kanan: Rincian Harga Dinamis */}
                <div style={{ backgroundColor: '#161826', borderRadius: '20px', padding: '24px', border: '1px solid #1e2235', height: 'fit-content' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', marginBottom: '16px' }}>Rincian Pesanan</h3>
                  
                  <div style={{ marginBottom: '16px', paddingBottom: '16px', borderBottom: '1px solid #282c42' }}>
                    <h4 style={{ fontSize: '15px', fontWeight: '800', margin: '0 0 4px 0', color: '#fff' }}>{orderData.eventTitle}</h4>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>{orderData.date}</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', color: '#9ca3af', marginBottom: '16px' }}>
                    {orderData.regularQty > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>Regular Ticket ({orderData.regularQty}x)</span>
                        <span style={{ color: '#fff', fontWeight: '600' }}>${orderData.regularPrice * orderData.regularQty}</span>
                      </div>
                    )}
                    {orderData.vipQty > 0 && (
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span>VIP Pulse Pass ({orderData.vipQty}x)</span>
                        <span style={{ color: '#fff', fontWeight: '600' }}>${orderData.vipPrice * orderData.vipQty}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Pajak & Layanan (10%)</span>
                      <span style={{ color: '#fff', fontWeight: '600' }}>${orderData.tax.toFixed(2)}</span>
                    </div>
                  </div>

                  <div style={{ paddingTop: '16px', borderTop: '1px dashed #282c42', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', fontWeight: '700' }}>Total Bayar</span>
                    <span style={{ fontSize: '22px', fontWeight: '900', color: '#38bdf8' }}>${orderData.total.toFixed(2)}</span>
                  </div>
                </div>

              </div>
            </div>

          ) : (

            /* E-TICKET VIEW */
            <div style={{ maxWidth: '680px', margin: '0 auto', animation: 'fadeIn 0.5s ease-in-out' }}>
              
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', backgroundColor: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', marginBottom: '12px' }}>
                  <CheckCircle2 size={42} />
                </div>
                <h1 style={{ fontSize: '26px', fontWeight: '900', margin: '0 0 6px 0' }}>Pembayaran Berhasil!</h1>
                <p style={{ color: '#9ca3af', fontSize: '14px', margin: 0 }}>
                  Tiket resmi Anda telah dibuat. Tunjukkan QR Code ini di pintu masuk venue.
                </p>
              </div>

              <div style={{
                backgroundColor: '#161826', borderRadius: '24px', border: '1px solid #282c42',
                overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.5)', position: 'relative'
              }}>
                <div style={{
                  padding: '24px', background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div>
                    <span style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff', fontSize: '10px', fontWeight: '900', padding: '4px 10px', borderRadius: '12px', textTransform: 'uppercase' }}>
                      PASS RESMI
                    </span>
                    <h2 style={{ fontSize: '22px', fontWeight: '900', margin: '8px 0 0 0', letterSpacing: '-0.5px' }}>{orderData.eventTitle}</h2>
                  </div>
                  <Sparkles size={32} color="#fff" />
                </div>

                <div style={{ padding: '24px' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #222638' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <Calendar size={18} color="#38bdf8" style={{ marginTop: '2px' }} />
                      <div>
                        <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700' }}>WAKTU & TANGGAL</span>
                        <p style={{ fontSize: '13px', fontWeight: '700', margin: '2px 0 0 0' }}>{orderData.date}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <MapPin size={18} color="#38bdf8" style={{ marginTop: '2px' }} />
                      <div>
                        <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700' }}>LOKASI VENUE</span>
                        <p style={{ fontSize: '13px', fontWeight: '700', margin: '2px 0 0 0' }}>{orderData.venue}</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '28px' }}>
                    <div>
                      <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700' }}>KATEGORI TIKET</span>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                        {orderData.regularQty > 0 && <span style={{ backgroundColor: '#1e2235', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', color: '#38bdf8' }}>{orderData.regularQty}x Regular</span>}
                        {orderData.vipQty > 0 && <span style={{ backgroundColor: '#2e1065', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', color: '#f0abfc' }}>{orderData.vipQty}x VIP Pass</span>}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700' }}>KODE TIKET</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px', cursor: 'pointer' }} onClick={handleCopyCode}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: '#fff' }}>{orderData.ticketId}</span>
                        <Copy size={12} color="#38bdf8" />
                      </div>
                      {copied && <span style={{ fontSize: '10px', color: '#22c55e' }}>Tersalin!</span>}
                    </div>
                  </div>

                  <div style={{
                    backgroundColor: '#0b0c10', borderRadius: '20px', padding: '24px', border: '1px dashed #38bdf8',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '16px', boxShadow: '0 0 20px rgba(56, 189, 248, 0.2)', marginBottom: '12px' }}>
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${orderData.ticketId}`} 
                        alt="E-Ticket QR Code" 
                        style={{ width: '160px', height: '160px', display: 'block' }}
                      />
                    </div>
                    <span style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '600' }}>Scan QR Code ini saat Check-in</span>
                  </div>

                </div>

                <div style={{ padding: '20px 24px', backgroundColor: '#11131f', borderTop: '1px solid #222638', display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => alert('Mengunduh PDF Tiket...')}
                    style={{
                      flex: 1, padding: '12px', borderRadius: '12px', border: 'none',
                      backgroundColor: '#38bdf8', color: '#000', fontWeight: '800', fontSize: '13px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
                    }}
                  >
                    <Download size={16} /> Unduh PDF
                  </button>
                  
                  <button 
                    onClick={() => navigate('/my-tickets')}
                    style={{
                      padding: '12px 20px', borderRadius: '12px', border: '1px solid #282c42',
                      backgroundColor: '#161826', color: '#fff', fontWeight: '700', fontSize: '13px',
                      cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
                    }}
                  >
                    <Ticket size={16} /> Ke My Tickets
                  </button>
                </div>

              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
}