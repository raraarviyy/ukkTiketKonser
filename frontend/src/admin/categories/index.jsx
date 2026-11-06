import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Tag, X, Loader2, AlertCircle } from "lucide-react";
import { api } from "../../api/index";
import { THEME } from "../../theme";

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  
  // Form cuma butuh Nama Kategori
  const [form, setForm] = useState({ name: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getCategories();
      setCategories(Array.isArray(res) ? res : []);
    } catch (err) {
      setError(err.message || "Gagal memuat kategori.");
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm({ name: "" });
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name || "" });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!form.name.trim() || submitting) return;
    try {
      setSubmitting(true);
      if (editing) {
        await api.updateCategory(editing.id, { name: form.name.trim() });
      } else {
        await api.createCategory({ name: form.name.trim() });
      }
      await fetchCategories();
      setModalOpen(false);
    } catch (err) {
      alert(err.message || "Gagal menyimpan kategori.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus kategori ini?")) return;
    try {
      await api.deleteCategory(id);
      await fetchCategories();
    } catch (err) {
      alert(err.message || "Gagal menghapus kategori.");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text }}>Kategori Musik</h1>
          <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: THEME.muted }}>Kelola genre musik global yang bisa dipilih oleh Organizer saat membuat event.</p>
        </div>
        <button onClick={openCreate} style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 20px", borderRadius: 12, border: "none", background: THEME.gradient, color: "#fff", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer" }}>
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      {loading ? (
        <div style={{ height: 300, display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", gap: 12 }}>
          <Loader2 size={34} color={THEME.pink} style={{ animation: "spin 1s linear infinite" }} />
          <span style={{ color: THEME.muted }}>Memuat kategori...</span>
        </div>
      ) : error ? (
        <div style={{ backgroundColor: "rgba(239,68,68,0.1)", color: THEME.danger, padding: "16px", borderRadius: 14, display: "flex", alignItems: "center", gap: 10 }}>
          <AlertCircle size={20} /> <span>{error}</span>
        </div>
      ) : categories.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 20px", backgroundColor: THEME.surface, borderRadius: 20, border: `1px solid ${THEME.border}` }}>
          <Tag size={48} color={THEME.dim} style={{ margin: "0 auto 16px" }} />
          <h3 style={{ color: THEME.text }}>Belum Ada Kategori</h3>
          <p style={{ color: THEME.muted }}>Silakan tambahkan kategori musik pertama Anda.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
          {categories.map((cat) => (
            <div key={cat.id} style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 22, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", top: 0, right: 0, width: 60, height: 60, background: THEME.gradient, opacity: 0.1, borderRadius: "0 18px 0 60px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Tag size={18} color={THEME.purple} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, color: THEME.text, fontSize: "1rem" }}>{cat.name}</div>
                  <div style={{ fontSize: "0.78rem", color: THEME.muted, fontWeight: 600 }}>
                    {cat._count?.events !== undefined ? `${cat._count.events} Event Terkait` : "Kategori Global"}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                <button onClick={() => openEdit(cat)} style={{ flex: 1, padding: "9px", borderRadius: 10, border: `1px solid ${THEME.border}`, background: "rgba(236,72,153,0.08)", color: THEME.pink, cursor: "pointer", fontWeight: 600, fontSize: "0.82rem", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                  <Pencil size={13} /> Edit
                </button>
                <button onClick={() => handleDelete(cat.id)} style={{ padding: "9px 12px", borderRadius: 10, border: `1px solid ${THEME.border}`, background: "rgba(239,68,68,0.08)", color: THEME.danger, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL FORM - SEKARANG CUMA NAMA KATEGORI */}
      {modalOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: THEME.surface, borderRadius: 24, border: `1px solid ${THEME.border}`, maxWidth: 440, width: "100%", padding: 28 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: THEME.text }}>{editing ? "Edit" : "Tambah"} Kategori</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: "none", border: "none", color: THEME.muted, cursor: "pointer" }}><X size={20} /></button>
            </div>
            
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: THEME.muted, marginBottom: 8 }}>Nama Kategori Musik</label>
              <input 
                type="text" 
                value={form.name} 
                onChange={(e) => setForm({ name: e.target.value })} 
                placeholder="Contoh: K-Pop, Dangdut, Metal..." 
                style={{ width: "100%", padding: "14px 16px", borderRadius: 12, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, fontSize: "0.95rem", outline: "none", boxSizing: "border-box" }} 
                autoFocus
              />
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: "12px", borderRadius: 12, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.muted, cursor: "pointer", fontWeight: 600 }}>Batal</button>
              <button onClick={handleSave} disabled={submitting || !form.name.trim()} style={{ flex: 2, padding: "12px", borderRadius: 12, border: "none", background: THEME.gradient, color: "#fff", cursor: submitting || !form.name.trim() ? "not-allowed" : "pointer", opacity: submitting || !form.name.trim() ? 0.6 : 1, fontWeight: 700 }}>
                {submitting ? "Menyimpan..." : (editing ? "Simpan Perubahan" : "Tambah Kategori")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}