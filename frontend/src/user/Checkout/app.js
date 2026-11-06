import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, ShieldCheck, Ticket, Loader2 } from "lucide-react";
import { api } from "../../api/index";
import { THEME } from "../../theme";

export default function Checkout() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const item = state?.item;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!item) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backgroundColor: THEME.bg, color: THEME.text, padding: 20 }}>
        <Ticket size={48} color={THEME.dim} style={{ marginBottom: 16 }} />
        <h1 style={{ margin: "0 0 8px", fontSize: "1.5rem" }}>Data Checkout Kosong</h1>
        <p style={{ color: THEME.muted, marginBottom: 24 }}>Sepertinya kamu belum memilih tiket.</p>
        <button onClick={() => navigate("/explore")} style={{ padding: "12px 24px", borderRadius: 12, background: THEME.gradient, color: "#fff", border: "none", fontWeight: 700, cursor: "pointer" }}>
          Kembali ke Explore
        </button>
      </div>
    );
  }

  // Kalkulasi biaya (Simulasi pajak 10% seperti di BE)
  const subtotal = Number(item.price) * Number(item.quantity);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  const handlePay = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.checkout({
        event_id: Number(item.event_id),
        ticket_type_id: Number(item.ticket_type_id),
        quantity: Number(item.quantity),
      });

      const redirectUrl = res?.data?.snap_redirect_url;

      if (redirectUrl) {
        window.location.href = redirectUrl;
        return;
      }

      if (res?.data?.order?.id) {
        navigate(`/order/${res.data.order.id}`);
        return;
      }

      throw new Error("Snap URL tidak ditemukan dari server.");
    } catch (err) {
      setError(err.message || "Gagal melakukan checkout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: THEME.bg, color: THEME.text, padding: "clamp(20px, 5vw, 60px) 20px", fontFamily: "'Inter', sans-serif" }}>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        
        {/* Tombol Kembali */}
        <button 
          onClick={() => navigate(-1)} 
          style={{ background: "none", border: "none", color: THEME.muted, display: "flex", alignItems: "center", gap: 8, cursor: "pointer", marginBottom: 24, padding: 0, fontSize: "0.9rem", fontWeight: 600 }}
        >
          <ArrowLeft size={18} /> Kembali
        </button>

        {/* Judul */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ margin: 0, fontSize: "clamp(1.6rem, 4vw, 2rem)", fontWeight: 800, color: THEME.text }}>
            Selesaikan Pesanan
          </h1>
          <p style={{ margin: "8px 0 0", color: THEME.muted, fontSize: "0.95rem" }}>
            Periksa kembali detail tiket pesananmu sebelum melanjutkan pembayaran.
          </p>
        </div>

        {/* Kartu Tiket */}
        <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 20, overflow: "hidden", marginBottom: 24 }}>
          
          {/* Header Tiket */}
          <div style={{ padding: 24, borderBottom: `1px dashed ${THEME.borderStrong}`, position: "relative" }}>
            {/* Ornamen berlian (notch) di pinggir kiri kanan */}
            <div style={{ position: "absolute", left: -10, top: "100%", width: 20, height: 20, borderRadius: "50%", backgroundColor: THEME.bg, transform: "translateY(-50%)" }} />
            <div style={{ position: "absolute", right: -10, top: "100%", width: 20, height: 20, borderRadius: "50%", backgroundColor: THEME.bg, transform: "translateY(-50%)" }} />
            
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Ticket size={20} color={THEME.pink} />
              </div>
              <div>
                <span style={{ fontSize: "0.8rem", color: THEME.pink, fontWeight: 700, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                  {item.ticket_type_name}
                </span>
                <h2 style={{ margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 800 }}>{item.event_title}</h2>
              </div>
            </div>
          </div>

          {/* Detail Tiket */}
          <div style={{ padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: "0.9rem" }}>
              <span style={{ color: THEME.muted }}>Harga Tiket</span>
              <span style={{ fontWeight: 600 }}>Rp {Number(item.price).toLocaleString("id-ID")}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12, fontSize: "0.9rem" }}>
              <span style={{ color: THEME.muted }}>Jumlah</span>
              <span style={{ fontWeight: 600 }}>{item.quantity} Tiket</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, fontSize: "0.9rem" }}>
              <span style={{ color: THEME.muted }}>Subtotal</span>
              <span style={{ fontWeight: 600 }}>Rp {subtotal.toLocaleString("id-ID")}</span>
            </div>
            
            <div style={{ height: 1, background: THEME.border, margin: "16px 0" }} />
            
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: "0.9rem" }}>
              <span style={{ color: THEME.muted }}>Pajak & Biaya Layanan (10%)</span>
              <span style={{ fontWeight: 600 }}>Rp {tax.toLocaleString("id-ID")}</span>
            </div>
          </div>
        </div>

        {/* Total Pembayaran */}
        <div style={{ backgroundColor: "rgba(236,72,153,0.05)", border: `1px solid rgba(236,72,153,0.3)`, borderRadius: 16, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: THEME.muted }}>Total Pembayaran</p>
            <p style={{ margin: "4px 0 0", fontSize: "1.6rem", fontWeight: 900, color: THEME.pink }}>
              Rp {total.toLocaleString("id-ID")}
            </p>
          </div>
          <CreditCard size={32} color={THEME.pink} style={{ opacity: 0.5 }} />
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{ backgroundColor: "rgba(239,68,68,0.1)", border: `1px solid ${THEME.danger}`, color: THEME.danger, padding: 16, borderRadius: 12, marginBottom: 24, fontSize: "0.9rem", display: "flex", gap: 8 }}>
            <ShieldCheck size={18} /> {error}
          </div>
        )}

        {/* Tombol Bayar */}
        <button
          onClick={handlePay}
          disabled={loading}
          style={{
            width: "100%",
            padding: "16px",
            background: THEME.gradient,
            color: "#fff",
            border: "none",
            borderRadius: 14,
            fontSize: "1rem",
            fontWeight: 800,
            cursor: loading ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
            boxShadow: "0 10px 30px rgba(236,72,153,0.3)",
            opacity: loading ? 0.7 : 1,
            transition: "all 0.2s"
          }}
        >
          {loading ? (
            <><Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} /> Memproses...</>
          ) : (
            "Bayar Sekarang"
          )}
        </button>

        <div style={{ textAlign: "center", marginTop: 20, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: THEME.dim, fontSize: "0.8rem" }}>
          <ShieldCheck size={14} /> Pembayaran aman & terenkripsi
        </div>

      </div>
    </div>
  );
}