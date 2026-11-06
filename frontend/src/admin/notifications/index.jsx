import React, { useState } from "react";
import { Bell, Check, Megaphone, Plus, Trash2, X } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { THEME } from "../../theme";

export default function AdminNotifications() {
  const { notifications, addNotification, deleteNotification } = useAdmin();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", message: "", status: "draft" });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.message.trim()) return;
    addNotification({ title: form.title.trim(), message: form.message.trim(), status: form.status });
    setForm({ title: "", message: "", status: "draft" });
    setShowCreate(false);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1000 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text }}>Notifications</h1>
          <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: THEME.muted }}>Kelola pengumuman platform untuk seluruh pengguna.</p>
        </div>
        <button onClick={() => setShowCreate(true)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: THEME.gradient, border: "none", borderRadius: 12, color: "#fff", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>
          <Plus size={16} /> Buat Announcement
        </button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {notifications.length === 0 ? (
          <div style={{ background: THEME.surface, border: `1px dashed ${THEME.border}`, borderRadius: 18, padding: 40, textAlign: "center" }}>
            <Bell size={40} color={THEME.dim} style={{ margin: "0 auto 12px" }} />
            <p style={{ margin: 0, color: THEME.muted }}>Belum ada pengumuman.</p>
          </div>
        ) : notifications.map(n => (
          <div key={n.id} style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 20, display: "flex", gap: 16 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Megaphone size={20} color={THEME.pink} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: THEME.text }}>{n.title}</h3>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: "0.7rem", fontWeight: 700, padding: "4px 10px", borderRadius: 20, background: n.status === "published" ? "rgba(16,185,129,0.1)" : "rgba(245,158,11,0.1)", color: n.status === "published" ? THEME.success : THEME.warning }}>
                    {n.status === "published" ? "Published" : "Draft"}
                  </span>
                  <button onClick={() => deleteNotification(n.id)} style={{ background: "none", border: "none", color: THEME.danger, cursor: "pointer", padding: 4 }}><Trash2 size={16} /></button>
                </div>
              </div>
              <p style={{ margin: "8px 0", fontSize: "0.85rem", color: THEME.muted, lineHeight: 1.5 }}>{n.message}</p>
              <span style={{ fontSize: "0.7rem", color: THEME.dim }}>{n.createdAt}</span>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: THEME.surface, borderRadius: 20, border: `1px solid ${THEME.border}`, maxWidth: 500, width: "100%", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Buat Announcement</h3>
              <button onClick={() => setShowCreate(false)} style={{ background: "none", border: "none", color: THEME.muted, cursor: "pointer" }}><X size={20} /></button>
            </div>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: THEME.muted, marginBottom: 6 }}>Judul</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: 12, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: THEME.muted, marginBottom: 6 }}>Pesan</label>
                <textarea rows={4} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: 12, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, outline: "none", resize: "vertical" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: THEME.muted, marginBottom: 6 }}>Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: 12, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, outline: "none" }}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button type="button" onClick={() => setShowCreate(false)} style={{ flex: 1, padding: 12, borderRadius: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.muted, fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" disabled={!form.title.trim() || !form.message.trim()} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: THEME.gradient, color: "#fff", fontWeight: 700, cursor: "pointer", opacity: !form.title.trim() || !form.message.trim() ? 0.5 : 1 }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}