import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, Ticket, CreditCard, Star, ArrowLeft, Loader2, AlertCircle } from "lucide-react";
import { api } from "../../api/index";
import { THEME } from "../../theme";
import ReviewModal from "../../components/ReviewModal";

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  
  const loadOrder = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getOrderById(id);
      setOrder(res?.data ?? res);
    } catch (err) {
      setError(err.message || "Gagal memuat detail order.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadOrder(); }, [loadOrder]);

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: THEME.bg, color: THEME.text, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 12 }}>
        <Loader2 size={36} color={THEME.pink} style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ color: THEME.muted }}>Memuat detail pesanan...</span>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: THEME.bg, color: THEME.text, padding: 32, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <div style={{ backgroundColor: "rgba(239,68,68,0.1)", color: THEME.danger, padding: "16px 24px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <AlertCircle size={20} /> <span>{error || "Order tidak ditemukan"}</span>
        </div>
        <button onClick={() => navigate("/history")} style={{ background: THEME.gradient, color: "#fff", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontWeight: "bold" }}>
          Kembali ke Riwayat
        </button>
      </div>
    );
  }

  return (
    <>
      <div style={{ minHeight: "100vh", backgroundColor: THEME.bg, color: THEME.text, padding: "clamp(16px, 4vw, 32px)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <button onClick={() => navigate("/history")} style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "none", border: "none", color: THEME.pink, cursor: "pointer", fontWeight: 600, marginBottom: 20 }}>
            <ArrowLeft size={18} /> Kembali ke Riwayat
          </button>

          <div style={{ backgroundColor: THEME.surface, borderRadius: 24, overflow: "hidden", border: `1px solid ${THEME.border}` }}>
            {order.event?.image && (
              <img src={order.event.image} alt={order.event.title} style={{ width: "100%", height: "clamp(160px, 30vw, 280px)", objectFit: "cover" }} />
            )}

            <div style={{ padding: "clamp(20px, 4vw, 32px)" }}>
              <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 1.8rem)", margin: "0 0 8px" }}>{order.event?.title}</h1>
              <p style={{ color: THEME.muted, margin: "0 0 24px" }}>{order.event?.artist}</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: THEME.muted }}>Tanggal</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontWeight: 600 }}>
                    <Calendar size={16} color={THEME.purple} />
                    {order.event?.event_date ? new Date(order.event.event_date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: THEME.muted }}>Tipe Tiket</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontWeight: 600 }}>
                    <Ticket size={16} color={THEME.pink} /> {order.ticket_type?.name} ({order.quantity}x)
                  </div>
                </div>
                <div>
                  <span style={{ fontSize: "0.75rem", color: THEME.muted }}>Total Bayar</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4, fontWeight: 800, color: THEME.success }}>
                    <CreditCard size={16} /> Rp{Number(order.total).toLocaleString("id-ID")}
                  </div>
                </div>
              </div>

              <div style={{ height: 1, background: THEME.border, margin: "24px 0" }} />

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                  <span style={{ fontSize: "0.75rem", color: THEME.muted }}>Status Pesanan</span>
                  <div style={{ marginTop: 4 }}>
                    <span style={{ padding: "6px 12px", borderRadius: 20, fontSize: "0.8rem", fontWeight: 800, backgroundColor: order.status === "paid" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", color: order.status === "paid" ? THEME.success : THEME.warning }}>
                      {order.status?.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* TOMBOL REVIEW MUNCUL KETIKA STATUSNYA PAID */}
                {order.status === "paid" && (
                  <button onClick={() => setReviewOpen(true)} style={{ display: "flex", alignItems: "center", gap: 8, background: THEME.gradient, color: "#fff", border: "none", padding: "12px 20px", borderRadius: 12, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 15px rgba(236,72,153,0.3)" }}>
                    <Star size={18} fill="#fff" /> Beri Ulasan
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ReviewModal 
        isOpen={reviewOpen} 
        eventId={order.event?.id} 
        onClose={() => setReviewOpen(false)} 
        onSuccess={loadOrder}
      />
    </>
  );
}