import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  MapPin, Heart, ArrowLeft, Ticket, Mic2, 
  Plus, Minus, Loader2, Star, Calendar, ExternalLink
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { useFavorites } from "../context/FavoriteContext";
import { useAuth } from "../../context/AuthContext"; 
import { api } from "../../api/index";
import { THEME } from "../../theme";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { user } = useAuth(); 

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTicketType, setSelectedTicketType] = useState(null);
  const [ticketQuantity, setTicketQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

  const { toggleFavorite, isFavorite } = useFavorites();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const resEvent = await api.getEventById(id);
        const normalized = resEvent?.data ?? resEvent;
        setEvent(normalized);
        if (normalized?.ticket_types?.length > 0) {
          setSelectedTicketType(normalized.ticket_types[0].type);
        }

        const resReviews = await api.getReviewsByEvent(id);
        setReviews(resReviews?.data || resReviews || []);

      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading || !event) {
    return (
      <div style={{ display: "flex", minHeight: "100vh", backgroundColor: THEME.bg, color: THEME.text }}>
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Header setIsSidebarOpen={setIsSidebarOpen} />
          <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 12 }}>
            <Loader2 size={40} color={THEME.pink} style={{ animation: "spin 1s linear infinite" }} />
            <span style={{ color: THEME.muted }}>Memuat detail event...</span>
          </div>
        </div>
      </div>
    );
  }

  const favorited = isFavorite(event.id);
  const currentTicket = event.ticket_types?.find((t) => t.type === selectedTicketType) || event.ticket_types?.[0];
  const totalPrice = currentTicket ? Number(currentTicket.price) * ticketQuantity : 0;

  const handleCheckout = () => {
    if (!currentTicket) return;

    if (!user) {
      navigate("/login", { 
        state: { redirectAfterLogin: `/detail/${id}` } 
      });
      return;
    }

    navigate("/checkout", {
      state: {
        item: {
          event_id: event.id,
          event_title: event.title,
          ticket_type_id: currentTicket.id,
          ticket_type_name: currentTicket.name,
          price: currentTicket.price,
          quantity: ticketQuantity,
        },
      },
    });
  };

  const mapBbox = event.latitude && event.longitude 
    ? `${event.longitude - 0.01}%2C${event.latitude - 0.01}%2C${event.longitude + 0.01}%2C${event.latitude + 0.01}` 
    : null;

  return (
    <div style={{ display: "flex", minHeight: "100vh", backgroundColor: THEME.bg, color: THEME.text }}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main style={{ padding: "clamp(16px, 3vw, 32px)", flex: 1, overflowY: "auto" }}>
          
          <button onClick={() => navigate(-1)} style={{ display: "flex", alignItems: "center", gap: 8, background: "none", border: "none", color: THEME.muted, fontSize: "0.9rem", cursor: "pointer", marginBottom: 20 }}>
            <ArrowLeft size={18} /> Kembali
          </button>

          {/* Hero Image */}
          <div style={{ borderRadius: 24, overflow: "hidden", position: "relative", height: "clamp(240px, 40vw, 340px)", marginBottom: 28, border: `1px solid ${THEME.border}` }}>
            <img src={event.image} alt={event.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(11,12,16,0) 20%, rgba(11,12,16,0.95) 100%)" }} />
            <button onClick={() => toggleFavorite(event.id)} style={{ position: "absolute", top: 16, right: 16, backgroundColor: "rgba(11,12,16,0.7)", border: "none", borderRadius: "50%", width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <Heart size={20} color={favorited ? THEME.pink : "#fff"} fill={favorited ? THEME.pink : "none"} />
            </button>
            <div style={{ position: "absolute", bottom: 24, left: 24, right: 24 }}>
              <h1 style={{ fontWeight: 900, margin: "0 0 6px", fontSize: "clamp(1.5rem, 4vw, 2.2rem)" }}>{event.title.toUpperCase()}</h1>
              <p style={{ display: "flex", alignItems: "center", gap: 6, color: THEME.pink, fontSize: "0.9rem", fontWeight: 700, margin: "0 0 12px" }}>
                <Mic2 size={15} /> {event.artist}
              </p>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 28, alignItems: "start" }}>
            
            {/* Kolom Kiri: Info & Ulasan */}
            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              <div style={{ backgroundColor: THEME.surface, borderRadius: 20, padding: 24, border: `1px solid ${THEME.border}` }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 12px", color: THEME.pink }}>Tentang Acara</h3>
                <p style={{ color: THEME.muted, fontSize: "0.9rem", lineHeight: 1.7, margin: 0 }}>{event.description}</p>
              </div>

              {/* --- LOKASI & PETA --- */}
              <div style={{ backgroundColor: THEME.surface, borderRadius: 20, padding: 24, border: `1px solid ${THEME.border}` }}>
                <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 16px", color: THEME.pink, display: "flex", alignItems: "center", gap: 8 }}>
                  <MapPin size={18} /> Lokasi Acara
                </h3>
                
                <p style={{ color: THEME.text, fontWeight: 700, marginBottom: 4, fontSize: "1rem" }}>{event.venue}</p>
                <p style={{ color: THEME.muted, fontSize: "0.9rem", marginBottom: 16, lineHeight: 1.5 }}>
                  {event.address || "-"}, {event.city}
                </p>

                {mapBbox && (
                  <div style={{ borderRadius: 16, overflow: "hidden", height: 250, border: `1px solid ${THEME.border}` }}>
                    <iframe
                      title="Peta Lokasi"
                      width="100%"
                      height="100%"
                      frameBorder="0"
                      scrolling="no"
                      src={`https://www.openstreetmap.org/export/embed.html?bbox=${mapBbox}&layer=mapnik&marker=${event.latitude}%2C${event.longitude}`}
                      style={{ border: 0, filter: "invert(90%) hue-rotate(180deg) contrast(90%)" }}
                    />
                  </div>
                )}

                {event.latitude && event.longitude && (
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${event.latitude},${event.longitude}`} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ display: "inline-flex", alignItems: "center", gap: 6, marginTop: 16, color: THEME.purple, fontSize: "0.85rem", fontWeight: 700, textDecoration: "none" }}
                  >
                    Buka di Google Maps <ExternalLink size={14} />
                  </a>
                )}
              </div>
              {/* --------------------- */}

              {/* Ulasan */}
              <div style={{ backgroundColor: THEME.surface, borderRadius: 20, padding: 24, border: `1px solid ${THEME.border}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                    <Star color={THEME.warning} fill={THEME.warning} /> Ulasan ({reviews.length})
                  </h3>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {reviews.length === 0 ? (
                    <p style={{ color: THEME.dim, fontSize: "0.9rem", margin: 0, textAlign: "center", padding: "20px 0" }}>Belum ada ulasan.</p>
                  ) : (
                    reviews.map((rv) => (
                      <div key={rv.id} style={{ borderBottom: `1px solid ${THEME.border}`, paddingBottom: 16 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                          <strong style={{ color: THEME.text, fontSize: "0.9rem" }}>{rv.user?.name || "Anonim"}</strong>
                          <div style={{ display: "flex" }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} color={i < rv.rating ? THEME.warning : THEME.border} fill={i < rv.rating ? THEME.warning : "none"} />
                            ))}
                          </div>
                        </div>
                        <p style={{ margin: 0, color: THEME.muted, fontSize: "0.85rem" }}>"{rv.comment}"</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Beli Tiket */}
            <div style={{ backgroundColor: THEME.surface, borderRadius: 24, padding: 28, border: `1px solid ${THEME.border}`, position: "sticky", top: 24 }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 16px" }}>Beli Tiket</h3>
              
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: "0.8rem", fontWeight: 700, color: THEME.muted, display: "block", marginBottom: 10 }}>Pilih Kategori</label>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {event.ticket_types?.map((t) => (
                    <div key={t.id} onClick={() => setSelectedTicketType(t.type)} style={{ padding: 16, borderRadius: 12, cursor: "pointer", border: selectedTicketType === t.type ? `2px solid ${THEME.pink}` : `1px solid ${THEME.border}`, backgroundColor: selectedTicketType === t.type ? "rgba(236,72,153,0.05)" : THEME.bg }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontWeight: 800 }}>{t.name}</span>
                        <span style={{ fontSize: "1rem", fontWeight: 900, color: THEME.pink }}>Rp{Number(t.price).toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <hr style={{ borderColor: THEME.border, margin: "20px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>Jumlah</span>
                <div style={{ display: "flex", alignItems: "center", gap: 12, background: THEME.bg, padding: "6px 14px", borderRadius: 10, border: `1px solid ${THEME.border}` }}>
                  <button onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))} style={{ background: "none", border: "none", color: THEME.text, cursor: "pointer" }}><Minus size={16} /></button>
                  <span style={{ fontWeight: 800, minWidth: 20, textAlign: "center" }}>{ticketQuantity}</span>
                  <button onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))} style={{ background: "none", border: "none", color: THEME.text, cursor: "pointer" }}><Plus size={16} /></button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <span style={{ fontSize: "0.9rem", color: THEME.muted }}>Total</span>
                <span style={{ fontSize: "1.4rem", fontWeight: 900 }}>Rp{totalPrice.toLocaleString("id-ID")}</span>
              </div>

              <button onClick={handleCheckout} style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: THEME.gradient, color: "#fff", fontWeight: 800, fontSize: "0.95rem", cursor: "pointer", boxShadow: "0 4px 15px rgba(236, 72, 153, 0.3)" }}>
                {user ? "Lanjut ke Pembayaran" : "Login untuk Membeli"}
              </button>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}