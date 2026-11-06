import React, { useState } from "react";
import { Star, X, Loader2, MessageSquare } from "lucide-react";
import { api } from "../api/index";
import { THEME } from "../theme";

export default function ReviewModal({ isOpen, eventId, onClose, onSuccess }) {
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return setError("Mohon tulis komentar Anda.");
    
    setLoading(true);
    setError("");

    try {
      await api.createReview({
        event_id: Number(eventId),
        rating: rating,
        comment: comment.trim(),
      });
      setComment("");
      setRating(5);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || "Gagal mengirim ulasan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ background: THEME.surface, borderRadius: 20, border: `1px solid ${THEME.border}`, maxWidth: 450, width: "100%", padding: 24, position: "relative" }}>
        
        <button onClick={onClose} style={{ position: "absolute", top: 16, right: 16, background: "none", border: "none", color: THEME.muted, cursor: "pointer" }}>
          <X size={20} />
        </button>

        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ width: 50, height: 50, borderRadius: 16, background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
            <MessageSquare size={24} color={THEME.pink} />
          </div>
          <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: THEME.text }}>Beri Ulasan</h2>
          <p style={{ margin: "6px 0 0", fontSize: "0.85rem", color: THEME.muted }}>Bagaimana pengalaman konsermu?</p>
        </div>

        {error && (
          <div style={{ padding: 12, background: "rgba(239,68,68,0.1)", color: THEME.danger, borderRadius: 10, fontSize: "0.8rem", marginBottom: 16, textAlign: "center" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}
              >
                <Star
                  size={32}
                  color={(hover || rating) >= star ? THEME.warning : THEME.borderStrong}
                  fill={(hover || rating) >= star ? THEME.warning : "none"}
                  style={{ transition: "all 0.2s" }}
                />
              </button>
            ))}
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: THEME.muted, marginBottom: 8 }}>Komentar Ulasan</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Ceritakan keseruan konsernya di sini..."
              style={{ width: "100%", padding: 12, borderRadius: 12, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, outline: "none", resize: "none", fontFamily: "inherit" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: 14, borderRadius: 12, border: "none", background: THEME.gradient, color: "#fff", fontWeight: 700, fontSize: "0.9rem", cursor: loading ? "not-allowed" : "pointer", display: "flex", justifyContent: "center", alignItems: "center", gap: 8, opacity: loading ? 0.7 : 1 }}
          >
            {loading ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : "Kirim Ulasan"}
          </button>
        </form>

      </div>
    </div>
  );
}