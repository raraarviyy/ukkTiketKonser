import React from "react";
import { Trash2, Pencil } from "lucide-react";
import { THEME } from "../../theme";

export default function TicketCategoryRow({ category, onEdit, onDelete }) {
  const percentSold =
    category.quota > 0
      ? Math.min(100, Math.round((category.sold / category.quota) * 100))
      : 0;

  return (
    <div
      style={{
        backgroundColor: THEME.surfaceAlt,
        border: `1px solid ${THEME.borderStrong}`,
        borderRadius: 14,
        padding: 16,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontWeight: 800, fontSize: "0.95rem", color: THEME.text }}>
            {category.name}
          </span>
          <span style={{ fontSize: "0.8rem", color: THEME.success, fontWeight: 700 }}>
            Rp{Number(category.price).toLocaleString("id-ID")}
          </span>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => onEdit(category)}
            style={{
              background: "rgba(236,72,153,0.1)",
              border: "none",
              borderRadius: 8,
              padding: "6px 8px",
              cursor: "pointer",
              color: THEME.pink,
            }}
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            style={{
              background: "rgba(244,63,94,0.1)",
              border: "none",
              borderRadius: 8,
              padding: "6px 8px",
              cursor: "pointer",
              color: THEME.danger,
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: "0.78rem",
          color: THEME.muted,
        }}
      >
        <span>Terjual {category.sold} dari {category.quota}</span>
        <span>{percentSold}%</span>
      </div>

      <div
        style={{
          width: "100%",
          height: 8,
          backgroundColor: THEME.bg,
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percentSold}%`,
            height: "100%",
            background: THEME.gradient,
            borderRadius: 6,
          }}
        />
      </div>
    </div>
  );
}