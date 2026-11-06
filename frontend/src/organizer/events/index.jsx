import React, { useState } from "react";
import {
  Plus,
  MapPin,
  Calendar,
  Users,
  Ticket,
  Pencil,
  Trash2,
  Loader2,
} from "lucide-react";
import { useOrganizer } from "../context/OrganizerContext";
import EventForm from "./EventForm";
import TicketCategoryManager from "./TicketCategoryManager";
import { THEME } from "../../theme";

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
    if (window.confirm("Hapus event ini beserta seluruh kategori tiketnya?")) {
      await deleteEvent(eventId);
    }
  };

  const activeCategoryEvent = categoryManagerEvent
    ? events.find((evt) => evt.id === categoryManagerEvent) || null
    : null;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Loader2
          size={32}
          color={THEME.pink}
          style={{ animation: "spin 1s linear infinite" }}
        />
        <span style={{ color: THEME.muted, fontSize: 14 }}>
          Memuat daftar event...
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <style>{`
        .org-event-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 20px;
        }
        @media (max-width: 600px) {
          .org-event-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
              fontWeight: 800,
              color: THEME.text,
              margin: 0,
            }}
          >
            Manajemen Event
          </h1>
          <p style={{ color: THEME.muted, fontSize: "0.9rem", marginTop: 6, maxWidth: 600 }}>
            Kelola jadwal, lokasi, deskripsi, dan lineup artis event kamu.
            Event dengan status Published akan langsung tampil di Landing Page.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "11px 20px",
            borderRadius: 12,
            border: "none",
            fontWeight: 700,
            fontSize: "0.88rem",
            cursor: "pointer",
            background: THEME.gradient,
            color: "#fff",
            boxShadow: "0 4px 15px rgba(236,72,153,0.3)",
          }}
        >
          <Plus size={16} /> Buat Event
        </button>
      </div>

      {events.length === 0 ? (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            backgroundColor: THEME.surface,
            border: `1px dashed ${THEME.borderStrong}`,
            borderRadius: 18,
          }}
        >
          <p style={{ color: THEME.dim, fontSize: "0.9rem", margin: 0 }}>
            Belum ada event. Klik "Buat Event" untuk memulai.
          </p>
        </div>
      ) : (
        <div className="org-event-grid">
          {events.map((event) => {
            const totalSold = (event.categories || []).reduce(
              (sum, cat) => sum + cat.sold,
              0
            );
            const totalQuota = (event.categories || []).reduce(
              (sum, cat) => sum + cat.quota,
              0
            );

            return (
              <div
                key={event.id}
                style={{
                  backgroundColor: THEME.surface,
                  borderRadius: 18,
                  border: `1px solid ${THEME.border}`,
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: 150,
                    backgroundColor: THEME.surfaceAlt,
                  }}
                >
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: THEME.dim,
                      }}
                    >
                      <Ticket size={32} />
                    </div>
                  )}
                  <span
                    style={{
                      position: "absolute",
                      top: 10,
                      right: 10,
                      padding: "4px 10px",
                      borderRadius: 14,
                      fontSize: "0.72rem",
                      fontWeight: 700,
                      backgroundColor:
                        event.status === "published"
                          ? "rgba(16, 185, 129, 0.15)"
                          : "rgba(156, 163, 175, 0.15)",
                      color:
                        event.status === "published"
                          ? THEME.success
                          : THEME.muted,
                      border: `1px solid ${
                        event.status === "published"
                          ? THEME.success
                          : THEME.muted
                      }`,
                    }}
                  >
                    {event.status === "published" ? "Published" : "Draft"}
                  </span>
                </div>

                <div
                  style={{
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    flexGrow: 1,
                  }}
                >
                  <h3
                    style={{
                      fontSize: "1.05rem",
                      fontWeight: 800,
                      color: THEME.text,
                      margin: 0,
                    }}
                  >
                    {event.title}
                  </h3>

                  <div
                    style={{
                      fontSize: "0.82rem",
                      color: THEME.muted,
                      display: "flex",
                      flexDirection: "column",
                      gap: 6,
                    }}
                  >
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <Calendar size={14} color={THEME.pink} /> {event.date}
                    </span>
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <MapPin size={14} color={THEME.purple} /> {event.venue},{" "}
                      {event.city}
                    </span>
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <Users size={14} color={THEME.success} /> {totalSold} /{" "}
                      {totalQuota} tiket terjual
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      marginTop: "auto",
                      paddingTop: 12,
                      flexWrap: "wrap",
                    }}
                  >
                    <button
                      onClick={() => setCategoryManagerEvent(event.id)}
                      style={{
                        flex: "1 1 auto",
                        padding: "9px 12px",
                        borderRadius: 10,
                        border: `1px solid ${THEME.borderStrong}`,
                        background: "transparent",
                        color: THEME.text,
                        cursor: "pointer",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      Kelola Tiket
                    </button>
                    <button
                      onClick={() => openEditForm(event)}
                      style={{
                        padding: "9px 12px",
                        borderRadius: 10,
                        border: "none",
                        background: "rgba(168, 85, 247, 0.15)",
                        color: THEME.purple,
                        cursor: "pointer",
                      }}
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      style={{
                        padding: "9px 12px",
                        borderRadius: 10,
                        border: "none",
                        background: "rgba(239, 68, 68, 0.15)",
                        color: THEME.danger,
                        cursor: "pointer",
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