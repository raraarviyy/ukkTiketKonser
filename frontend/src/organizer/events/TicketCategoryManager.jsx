import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import { useOrganizer } from "../context/OrganizerContext";
import TicketCategoryRow from "../components/TicketCategoryRow";
import { THEME } from "../../theme";

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: 12,
  backgroundColor: THEME.surfaceAlt,
  border: `1px solid ${THEME.borderStrong}`,
  color: THEME.text,
  fontSize: "0.88rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

export default function TicketCategoryManager({ event, onClose }) {
  const { addCategory, updateCategory, deleteCategory } = useOrganizer();
  const [editingCategory, setEditingCategory] = useState(null);
  const [form, setForm] = useState({ name: "", price: "", quota: "" });

  const startEdit = (category) => {
    setEditingCategory(category.id);
    setForm({ name: category.name, price: category.price, quota: category.quota });
  };

  const resetForm = () => {
    setEditingCategory(null);
    setForm({ name: "", price: "", quota: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      price: Number(form.price),
      quota: Number(form.quota),
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
        position: "fixed",
        inset: 0,
        zIndex: 100,
        backgroundColor: "rgba(5, 5, 8, 0.88)",
        backdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          backgroundColor: THEME.surface,
          borderRadius: 24,
          border: `1px solid ${THEME.border}`,
          maxWidth: 560,
          width: "100%",
          padding: 28,
          position: "relative",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 18,
            right: 18,
            background: "none",
            border: "none",
            color: THEME.muted,
            cursor: "pointer",
            padding: 8,
            display: "flex",
          }}
        >
          <X size={20} />
        </button>

        <h3
          style={{
            fontSize: "1.25rem",
            fontWeight: 900,
            color: THEME.text,
            marginTop: 0,
            marginBottom: 6,
          }}
        >
          Kategori & Kuota Tiket
        </h3>
        <p style={{ color: THEME.muted, fontSize: "0.85rem", marginBottom: 20 }}>
          {event.title}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
          {(!event.categories || event.categories.length === 0) && (
            <p style={{ color: THEME.dim, fontSize: "0.85rem" }}>Belum ada kategori.</p>
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
            display: "flex",
            flexDirection: "column",
            gap: 12,
            backgroundColor: THEME.bg,
            padding: 20,
            borderRadius: 16,
            border: `1px solid ${THEME.border}`,
          }}
        >
          <span
            style={{
              fontSize: "0.85rem",
              fontWeight: 800,
              color: THEME.pink,
              textTransform: "uppercase",
            }}
          >
            {editingCategory ? "Edit Kategori" : "Tambah Kategori Baru"}
          </span>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))",
              gap: 10,
            }}
          >
            <input
              type="text"
              required
              placeholder="Nama (VIP)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
            />
            <input
              type="number"
              required
              min="0"
              placeholder="Harga"
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

          <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 12,
                border: "none",
                fontWeight: 800,
                fontSize: "0.85rem",
                cursor: "pointer",
                background: THEME.gradient,
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
            >
              <Plus size={14} /> {editingCategory ? "Simpan" : "Tambah"}
            </button>
            {editingCategory && (
              <button
                type="button"
                onClick={resetForm}
                style={{
                  padding: "12px 16px",
                  borderRadius: 12,
                  border: `1px solid ${THEME.borderStrong}`,
                  background: "transparent",
                  color: THEME.muted,
                  cursor: "pointer",
                  fontSize: "0.85rem",
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