import React from "react";
import { Star } from "lucide-react";
import { THEME } from "../../theme";

export default function ReviewCard({ review, eventTitle }) {
  // Ambil nama dari data yang sudah dinormalisasi, atau fallback ke user.name
  const reviewerName = review.reviewer || review.user?.name || "Anonim";
  
  // Format tanggal
  const displayDate = review.date || (review.created_at ? new Date(review.created_at).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric"
  }) : "-");

  return (
    <div
      style={{
        backgroundColor: THEME.surface,
        border: `1px solid ${THEME.border}`,
        borderRadius: 16,
        padding: 18,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <div>
          <span
            style={{
              fontWeight: 700,
              fontSize: "0.9rem",
              color: THEME.text,
              display: "block",
            }}
          >
            {reviewerName}
          </span>
          <span style={{ fontSize: "0.75rem", color: THEME.dim }}>
            {eventTitle || "-"}
          </span>
        </div>
        <div style={{ display: "flex", gap: 2 }}>
          {Array.from({ length: 5 }).map((_, idx) => (
            <Star
              key={idx}
              size={15}
              color={idx < (review.rating || 0) ? THEME.warning : THEME.borderStrong}
              fill={idx < (review.rating || 0) ? THEME.warning : "none"}
            />
          ))}
        </div>
      </div>
      <p
        style={{
          fontSize: "0.85rem",
          color: THEME.muted,
          lineHeight: 1.5,
          margin: 0,
        }}
      >
        {review.comment || "Tidak ada komentar."}
      </p>
      <span style={{ fontSize: "0.72rem", color: THEME.dim }}>
        {displayDate}
      </span>
    </div>
  );
}