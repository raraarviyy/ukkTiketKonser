import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import {
  Calendar, MapPin, QrCode, Download, Ticket, X, Loader2
} from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function MyTickets() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [ticketFilter, setTicketFilter] = useState('upcoming');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const { myTickets, loading } = useTransaction();

  const filteredTickets = myTickets.filter(ticket => ticket.status === ticketFilter);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0c10', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .ticket-card { transition: all 0.25s ease; border: 1px solid #1e2235; }
        .ticket-card:hover { border-color: #38bdf8; transform: translateY(-2px); }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Reusable Header */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main style={{ padding: '28px', flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>My Tickets</h1>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '4px 0 0 0' }}>
              Show your QR Code at the entry gate for instant access.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <button
              onClick={() => setTicketFilter('upcoming')}
              style={{
                padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '13px',
                border: ticketFilter === 'upcoming' ? '1px solid #ec4899' : '1px solid #282c42',
                backgroundColor: ticketFilter === 'upcoming' ? 'rgba(236, 72, 153, 0.1)' : '#161826',
                color: ticketFilter === 'upcoming' ? '#ec4899' : '#9ca3af',
                transition: 'all 0.2s'
              }}
            >
              Upcoming Events
            </button>
            <button
              onClick={() => setTicketFilter('past')}
              style={{
                padding: '10px 20px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700', fontSize: '13px',
                border: ticketFilter === 'past' ? '1px solid #ec4899' : '1px solid #282c42',
                backgroundColor: ticketFilter === 'past' ? 'rgba(236, 72, 153, 0.1)' : '#161826',
                color: ticketFilter === 'past' ? '#ec4899' : '#9ca3af',
                transition: 'all 0.2s'
              }}
            >
              Past Events
            </button>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '12px' }}>
              <Loader2 size={36} color="#ec4899" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>Loading your tickets...</span>
            </div>
          ) : (
            filteredTickets.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredTickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="ticket-card"
                    style={{
                      backgroundColor: '#161826', borderRadius: '20px', padding: '20px 24px',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: '280px' }}>
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '16px', backgroundColor: 'rgba(56, 189, 248, 0.1)',
                        color: '#38bdf8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <Ticket size={28} />
                      </div>

                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', fontWeight: '800', color: '#ec4899', backgroundColor: 'rgba(236, 72, 153, 0.1)', padding: '2px 8px', borderRadius: '6px' }}>
                            {ticket.ticketType}
                          </span>
                          <span style={{ fontSize: '11px', color: '#6b7280' }}>#{ticket.id}</span>
                        </div>
                        <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 6px 0' }}>{ticket.eventName}</h3>
                        <div style={{ display: 'flex', gap: '16px', color: '#9ca3af', fontSize: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} color="#38bdf8" /> {ticket.date}</span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} color="#38bdf8" /> {ticket.venue}</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {ticket.status === 'upcoming' ? (
                        <button
                          onClick={() => setSelectedTicket(ticket)}
                          style={{
                            padding: '10px 20px', borderRadius: '12px', border: 'none',
                            background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)',
                            color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)'
                          }}
                        >
                          <QrCode size={16} /> View Pass
                        </button>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '600', padding: '8px 16px', backgroundColor: '#1e2235', borderRadius: '10px' }}>
                          Event Completed
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#161826', borderRadius: '20px', border: '1px dashed #282c42' }}>
                <Ticket size={48} color="#6b7280" style={{ marginBottom: '12px' }} />
                <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>No Tickets Found</h3>
                <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>You don't have any {ticketFilter} tickets.</p>
              </div>
            )
          )}
        </main>
      </div>

      {/* Modal E-Ticket */}
      {selectedTicket && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#161826', borderRadius: '24px', width: '100%', maxWidth: '380px',
            padding: '28px', border: '1px solid #282c42', color: '#fff', textAlign: 'center', position: 'relative'
          }}>
            <button onClick={() => setSelectedTicket(null)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <span style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', letterSpacing: '1px' }}>OFFICIAL E-TICKET</span>
            <h2 style={{ fontSize: '20px', fontWeight: '900', margin: '6px 0 2px 0' }}>{selectedTicket.eventName}</h2>
            <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 20px 0' }}>{selectedTicket.ticketType} • {selectedTicket.seat}</p>

            <div style={{ backgroundColor: '#fff', padding: '16px', borderRadius: '16px', display: 'inline-block', marginBottom: '20px' }}>
              <img src={selectedTicket.qrCodeUrl} alt="QR Code Pass" style={{ width: '180px', height: '180px', display: 'block' }} />
            </div>

            <p style={{ fontSize: '11px', color: '#9ca3af', margin: '0 0 20px 0' }}>
              Scan this QR code at the venue gate for admission.
            </p>

            <button style={{
              width: '100%', padding: '12px', borderRadius: '12px', border: '1px solid #282c42',
              backgroundColor: '#222638', color: '#fff', fontWeight: '700', fontSize: '13px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              <Download size={16} /> Save to Wallet / PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}