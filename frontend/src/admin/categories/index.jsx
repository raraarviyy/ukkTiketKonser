// src/admin/categories/index.jsx
import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Tag, X } from 'lucide-react';

const CATEGORY_KEY = 'auralis_global_categories';

function loadCategories() {
  try {
    const raw = localStorage.getItem(CATEGORY_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return [
    { id: 'gc-1', name: 'VIP', defaultPrice: 300, description: 'Akses area VIP, merchandise eksklusif, fast entry' },
    { id: 'gc-2', name: 'VVIP', defaultPrice: 500, description: 'Lounge eksklusif, open bar, backstage pass' },
    { id: 'gc-3', name: 'Reguler', defaultPrice: 100, description: 'Akses area umum, e-ticket QR' },
    { id: 'gc-4', name: 'Early Bird', defaultPrice: 75, description: 'Harga spesial untuk pemesanan awal' },
    { id: 'gc-5', name: 'Festival Pass', defaultPrice: 250, description: 'Akses seluruh hari festival' },
  ];
}

function saveCategories(list) {
  localStorage.setItem(CATEGORY_KEY, JSON.stringify(list));
}

function generateId() { return 'gc-' + Date.now(); }

export default function AdminCategories() {
  const [categories, setCategories] = useState(loadCategories);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', defaultPrice: '', description: '' });

  const openCreate = () => { setEditing(null); setForm({ name: '', defaultPrice: '', description: '' }); setModalOpen(true); };
  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, defaultPrice: cat.defaultPrice, description: cat.description }); setModalOpen(true); };

  const handleSave = () => {
    if (!form.name.trim()) return;
    let updated;
    if (editing) {
      updated = categories.map(c => c.id === editing.id ? { ...c, ...form, defaultPrice: Number(form.defaultPrice) } : c);
    } else {
      updated = [{ id: generateId(), ...form, defaultPrice: Number(form.defaultPrice) }, ...categories];
    }
    setCategories(updated);
    saveCategories(updated);
    setModalOpen(false);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Hapus kategori ini?')) return;
    const updated = categories.filter(c => c.id !== id);
    setCategories(updated);
    saveCategories(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontSize: 'clamp(1.3rem,3vw,1.8rem)', fontWeight: 900, color: '#f8fafc', margin: 0 }}>Kategori Tiket</h1>
          <p style={{ color: '#64748b', fontSize: '0.88rem', marginTop: 6 }}>Kelola template kategori tiket global yang bisa digunakan oleh Organizer.</p>
        </div>
        <button onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}>
          <Plus size={16} /> Tambah Kategori
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {categories.map(cat => (
          <div key={cat.id} style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 18, padding: '22px', position: 'relative', overflow: 'hidden', transition: 'border-color 0.2s' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, width: 60, height: 60, background: 'linear-gradient(135deg, #6366f1, #a855f7)', opacity: 0.1, borderRadius: '0 18px 0 60px' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(168,85,247,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Tag size={18} color="#a855f7" />
              </div>
              <div>
                <div style={{ fontWeight: 800, color: '#f8fafc', fontSize: '1rem' }}>{cat.name}</div>
                <div style={{ fontSize: '0.78rem', color: '#34d399', fontWeight: 700 }}>
                  Rp {Number(cat.defaultPrice).toLocaleString('id-ID')} <span style={{ color: '#475569', fontWeight: 400 }}>/ default</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.83rem', color: '#94a3b8', margin: '0 0 16px', lineHeight: 1.5 }}>{cat.description}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openEdit(cat)} style={{ flex: 1, padding: '9px', borderRadius: 10, border: '1px solid rgba(99,102,241,0.3)', background: 'rgba(99,102,241,0.08)', color: '#818cf8', cursor: 'pointer', fontWeight: 600, fontSize: '0.82rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, fontFamily: 'Inter, sans-serif' }}>
                <Pencil size={13} /> Edit
              </button>
              <button onClick={() => handleDelete(cat.id)} style={{ padding: '9px 12px', borderRadius: 10, border: '1px solid rgba(244,63,94,0.3)', background: 'rgba(244,63,94,0.08)', color: '#f43f5e', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div style={{ background: '#1e293b', borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', maxWidth: 440, width: '100%', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 22 }}>
              <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>{editing ? 'Edit' : 'Tambah'} Kategori</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }}><X size={20} /></button>
            </div>
            {[
              { key: 'name', label: 'Nama Kategori', placeholder: 'VIP, VVIP, Reguler...' },
              { key: 'defaultPrice', label: 'Harga Default (Rp)', placeholder: '150000', type: 'number' },
              { key: 'description', label: 'Deskripsi / Benefit', placeholder: 'Akses area VIP, merchandise...', textarea: true },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 6 }}>{f.label}</label>
                {f.textarea
                  ? <textarea value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} rows={3}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem', outline: 'none', fontFamily: 'Inter, sans-serif', resize: 'vertical', boxSizing: 'border-box' }} />
                  : <input type={f.type || 'text'} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder}
                    style={{ width: '100%', padding: '11px 14px', borderRadius: 12, background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.88rem', outline: 'none', fontFamily: 'Inter, sans-serif', boxSizing: 'border-box' }} />
                }
              </div>
            ))}
            <div style={{ display: 'flex', gap: 10, marginTop: 6 }}>
              <button onClick={() => setModalOpen(false)} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', cursor: 'pointer', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Batal</button>
              <button onClick={handleSave} style={{ flex: 2, padding: '12px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6366f1, #a855f7)', color: '#fff', cursor: 'pointer', fontWeight: 700, fontFamily: 'Inter, sans-serif' }}>
                {editing ? 'Simpan Perubahan' : 'Tambah Kategori'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
