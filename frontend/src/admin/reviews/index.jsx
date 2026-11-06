import React, { useMemo, useState } from "react";
import { Check, Eye, MessageSquare, MoreHorizontal, Search, Star, Trash2, Users, X } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { THEME } from "../../theme";

function Rating({ value }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={13} color={s <= value ? THEME.warning : THEME.border} fill={s <= value ? THEME.warning : "none"} />
      ))}
      <span style={{ marginLeft: 6, fontSize: "0.75rem", fontWeight: 600, color: THEME.text }}>{value}.0</span>
    </div>
  );
}

export default function AdminReviews() {
  const { reviews, deleteReview } = useAdmin();
  const [search, setSearch] = useState("");
  const [menuId, setMenuId] = useState(null);
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    return reviews.filter(r => {
      const kw = search.toLowerCase();
      const uName = (r.user_name ?? r.user?.name ?? "").toLowerCase();
      const eTitle = (r.event_title ?? r.event?.title ?? "").toLowerCase();
      const comment = (r.comment ?? "").toLowerCase();
      return uName.includes(kw) || eTitle.includes(kw) || comment.includes(kw);
    });
  }, [reviews, search]);

  const handleDelete = (id) => {
    if (window.confirm("Hapus review ini?")) deleteReview(id);
    setMenuId(null);
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text }}>Reviews</h1>
        <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: THEME.muted }}>Pantau dan moderasi review pengguna terhadap event di platform.</p>
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: "0 14px", maxWidth: 400 }}>
          <Search size={18} color={THEME.dim} />
          <input type="text" placeholder="Cari user, event, atau review..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", background: "none", border: "none", padding: "12px", color: THEME.text, outline: "none", fontSize: "0.9rem" }} />
        </div>
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${THEME.border}`, textAlign: "left", color: THEME.muted, background: "rgba(255,255,255,0.02)" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>User</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Concert</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Rating</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Review</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="5" style={{ padding: 40, textAlign: "center", color: THEME.dim }}>Belum ada review.</td></tr>
              ) : filtered.map(r => {
                const userName = r.user_name ?? r.user?.name ?? "Anonim";
                const eventTitle = r.event_title ?? r.event?.title ?? "-";
                return (
                  <tr key={r.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: THEME.pink }}><Users size={14} /></div>
                        <span style={{ fontWeight: 600, color: THEME.text }}>{userName}</span>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", color: THEME.muted }}>{eventTitle}</td>
                    <td style={{ padding: "16px 20px" }}><Rating value={Number(r.rating)} /></td>
                    <td style={{ padding: "16px 20px", color: THEME.muted, maxWidth: 250, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{r.comment}</td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button onClick={() => setMenuId(menuId === r.id ? null : r.id)} style={{ background: "none", border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "6px 8px", color: THEME.muted, cursor: "pointer" }}>
                          <MoreHorizontal size={16} />
                        </button>
                        {menuId === r.id && (
                          <>
                            <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setMenuId(null)} />
                            <div style={{ position: "absolute", right: 0, top: 36, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 140, boxShadow: "0 10px 25px rgba(0,0,0,0.5)", textAlign: "left" }}>
                              <button onClick={() => { setSelected(r); setMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.text, fontSize: "0.85rem", cursor: "pointer" }}><Eye size={14} /> Detail</button>
                              <button onClick={() => handleDelete(r.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.danger, fontSize: "0.85rem", cursor: "pointer" }}><Trash2 size={14} /> Hapus</button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: THEME.surface, borderRadius: 20, border: `1px solid ${THEME.border}`, maxWidth: 500, width: "100%", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Detail Review</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: THEME.muted, cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, marginBottom: 16 }}>
              <p style={{ margin: "0 0 8px", fontWeight: 700 }}>{selected.user_name ?? selected.user?.name}</p>
              <Rating value={Number(selected.rating)} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <p style={{ margin: "0 0 4px", fontSize: "0.75rem", color: THEME.muted }}>Event: {selected.event_title ?? selected.event?.title}</p>
              <p style={{ margin: 0, fontSize: "0.9rem", lineHeight: 1.5 }}>"{selected.comment}"</p>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => handleDelete(selected.id)} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "rgba(239,68,68,0.1)", color: THEME.danger, fontWeight: 700, cursor: "pointer" }}>Hapus</button>
              <button onClick={() => setSelected(null)} style={{ padding: "12px 20px", borderRadius: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.muted, fontWeight: 600, cursor: "pointer" }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}