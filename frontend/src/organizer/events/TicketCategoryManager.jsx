import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useOrganizer } from '../context/OrganizerContext';
import TicketCategoryRow from '../components/TicketCategoryRow';

const inputStyle = {
  width: '100%',
  padding: '11px 14px',
  borderRadius: '12px',
  backgroundColor: '#1a1d2e',
  border: '1px solid #282c42',
  color: '#fff',
  fontSize: '0.88rem',
  outline: 'none',
  boxSizing: 'border-box'
};

export default function TicketCategoryManager({ event, onClose }) {
  const { addCategory, updateCategory, deleteCategory } = useOrganizer();
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: '', price: '', quota: '' });

  const startEdit = (category) => {
    setEditingCategory(category.id);
    setForm({ name: category.name, price: category.price, quota: category.quota });
  };

  const resetForm = () => {
    setEditingCategory(null);
    setForm({ name: '', price: '', quota: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      price: Number(form.price),
      quota: Number(form.quota)
    };

    if (editingCategory) {
      await updateCategory(event.id, editingCategory, payload);
    } else {
      await addCategory(event.id, payload);
    }
    resetForm();
  };

  const handleDelete = async (categoryId) => {
    await deleteCategory(event.id, categoryId);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(5, 5, 8, 0.88)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
    >
      <div
        style={{
          backgroundColor: '#161826',
          borderRadius: '24px',
          border: '1px solid #1e2235',
          maxWidth: '560px',
          width: '100%',
          padding: '28px',
          position: 'relative',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '18px',
            right: '18px',
            background: 'none',
            border: 'none',
            color: '#9ca3af',
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={20} />
        </button>

        <h3 style={{ fontSize: '1.25rem', fontWeight: '900', color: '#fff', marginTop: 0, letterSpacing: '-0.5px' }}>
          Kategori & Kuota Tiket
        </h3>
        <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '20px' }}>{event.title}</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {(!event.categories || event.categories.length === 0) && (
            <p style={{ color: '#64748b', fontSize: '0.85rem' }}>Belum ada kategori tiket untuk event ini.</p>
          )}
          {(event.categories || []).map((category) => (
            <TicketCategoryRow
              key={category.id}
              category={category}
              onEdit={startEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            backgroundColor: '#11131f',
            padding: '20px',
            borderRadius: '16px',
            border: '1px solid #1e2235'
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: '800', color: '#ec4899', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {editingCategory ? 'Edit Kategori' : 'Tambah Kategori Baru'}
          </span>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '10px' }}>
            <input
              type="text"
              required
              placeholder="Nama (VIP, Reguler)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <input
              type="number"
              required
              min="0"
              placeholder="Harga ($)"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              style={inputStyle}
            />
            <input
              type="number"
              required
              min="1"
              placeholder="Kuota"
              value={form.quota}
              onChange={(e) => setForm({ ...form, quota: e.target.value })}
              style={inputStyle}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                border: 'none',
                fontWeight: '800',
                fontSize: '0.85rem',
                cursor: 'pointer',
                background: 'linear-gradient(135deg, #ec4899 0%, #a855f7 100%)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <Plus size={14} /> {editingCategory ? 'Simpan' : 'Tambah'}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: '12px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent',
                  color: '#cbd5e1',
                  cursor: 'pointer',
                  fontSize: '0.85rem'
                }}
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}