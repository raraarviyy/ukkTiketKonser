import React, { useState } from 'react';
import { Plus, MapPin, Calendar, Users, Ticket, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useOrganizer } from '../context/OrganizerContext';
import EventForm from './EventForm';
import TicketCategoryManager from './TicketCategoryManager';

export default function OrganizerEvents() {
  const { events, addEvent, updateEvent, deleteEvent, loading } = useOrganizer();
  const [formOpen, setFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [categoryManagerEvent, setCategoryManagerEvent] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const openCreateForm = () => {
    setEditingEvent(null);
    setFormOpen(true);
  };

  const openEditForm = (event) => {
    setEditingEvent(event);
    setFormOpen(true);
  };

  const handleSubmit = async (data) => {
    setSubmitting(true);
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, data);
      } else {
        await addEvent(data);
      }
      setFormOpen(false);
      setEditingEvent(null);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (eventId) => {
    if (window.confirm('Hapus event ini beserta seluruh kategori tiketnya?')) {
      await deleteEvent(eventId);
    }
  };

  const activeCategoryEvent = categoryManagerEvent
    ? events.find((evt) => evt.id === categoryManagerEvent) || null
    : null;

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', flexDirection: 'column', gap: '12px' }}>
        <Loader2 size={32} color="#a855f7" style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Memuat daftar event...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', fontWeight: '800', color: '#f8fafc', margin: 0 }}>
            Manajemen Event
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginTop: '6px' }}>
            Kelola jadwal, lokasi, deskripsi, dan lineup artis event kamu. Event dengan status Published akan langsung tampil di Landing Page, Home, dan Explore.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '11px 20px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: '700',
            fontSize: '0.88rem',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
            color: '#fff'
          }}
        >
          <Plus size={16} /> Buat Event
        </button>
      </div>

      {events.length === 0 ? (
        <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Belum ada event. Klik "Buat Event" untuk memulai.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: '22px'
          }}
        >
          {events.map((event) => {
            const totalSold = (event.categories || []).reduce((sum, cat) => sum + cat.sold, 0);
            const totalQuota = (event.categories || []).reduce((sum, cat) => sum + cat.quota, 0);

            return (
              <div
                key={event.id}
                style={{
                  backgroundColor: '#1e293b',
                  borderRadius: '18px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                <div style={{ position: 'relative', height: '150px', backgroundColor: '#0f172a' }}>
                  {event.image ? (
                    <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#334155' }}>
                      <Ticket size={32} />
                    </div>
                  )}
                  <span
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      padding: '4px 10px',
                      borderRadius: '14px',
                      fontSize: '0.72rem',
                      fontWeight: '700',
                      backgroundColor: event.status === 'published' ? 'rgba(52,211,153,0.18)' : 'rgba(148,163,184,0.18)',
                      color: event.status === 'published' ? '#34d399' : '#94a3b8',
                      border: `1px solid ${event.status === 'published' ? '#34d399' : '#94a3b8'}`
                    }}
                  >
                    {event.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </div>

                <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: '800', color: '#f8fafc', margin: 0 }}>{event.title}</h3>

                  <div style={{ fontSize: '0.82rem', color: '#94a3b8', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calendar size={14} color="#ec4899" /> {event.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} color="#94a3b8" /> {event.venue}, {event.city}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Users size={14} color="#38bdf8" /> {totalSold} / {totalQuota} tiket terjual
                    </span>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: 'auto', paddingTop: '12px', flexWrap: 'wrap' }}>
                    <button
                      onClick={() => setCategoryManagerEvent(event.id)}
                      style={{
                        flex: '1 1 auto',
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.15)',
                        background: 'transparent',
                        color: '#cbd5e1',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}
                    >
                      Kelola Tiket
                    </button>
                    <button
                      onClick={() => openEditForm(event)}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'rgba(99,102,241,0.15)',
                        color: '#818cf8',
                        cursor: 'pointer'
                      }}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      style={{
                        padding: '9px 12px',
                        borderRadius: '10px',
                        border: 'none',
                        background: 'rgba(244,63,94,0.15)',
                        color: '#f43f5e',
                        cursor: 'pointer'
                      }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {formOpen && (
        <EventForm
          initialData={editingEvent}
          submitting={submitting}
          onSubmit={handleSubmit}
          onClose={() => {
            setFormOpen(false);
            setEditingEvent(null);
          }}
        />
      )}

      {activeCategoryEvent && (
        <TicketCategoryManager
          event={activeCategoryEvent}
          onClose={() => setCategoryManagerEvent(null)}
        />
      )}
    </div>
  );
}