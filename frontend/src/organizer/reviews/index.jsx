import React, { useMemo, useState } from "react";
import { Star } from "lucide-react";
import { useOrganizer } from "../context/OrganizerContext";
import ReviewCard from "../components/ReviewCard";
import StatCard from "../components/StatCard";
import { THEME } from "../../theme";

export default function OrganizerReviews() {
  const { events, reviews } = useOrganizer();
  const [eventFilter, setEventFilter] = useState("all");

  const eventTitleMap = useMemo(() => {
    const map = {};
    events.forEach((evt) => {
      map[evt.id] = evt.title;
    });
    return map;
  }, [events]);

  // Filter menggunakan pengecekan ID yang aman
  const filteredReviews =
    eventFilter === "all"
      ? reviews
      : reviews.filter((rv) => String(rv.eventId || rv.event?.id) === String(eventFilter));

  const averageRating =
    filteredReviews.length > 0
      ? (
          filteredReviews.reduce((sum, rv) => sum + (rv.rating || 0), 0) /
          filteredReviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <style>{`
        .org-reviews-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 18px;
        }
        @media (max-width: 600px) {
          .org-reviews-grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
              fontWeight: 800,
              color: THEME.text,
              margin: 0,
            }}
          >
            Ulasan Penonton
          </h1>
          <p style={{ color: THEME.muted, fontSize: "0.9rem", marginTop: 6 }}>
            Evaluasi rating dan komentar penonton untuk event kamu.
          </p>
        </div>

        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          style={{
            padding: "10px 14px",
            borderRadius: 10,
            backgroundColor: THEME.surface,
            border: `1px solid ${THEME.borderStrong}`,
            color: THEME.text,
            fontSize: "0.85rem",
            outline: "none",
            cursor: "pointer",
          }}
        >
          <option value="all">Semua Event</option>
          {events.map((evt) => (
            <option key={evt.id} value={evt.id}>
              {evt.title}
            </option>
          ))}
        </select>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard
          icon={Star}
          label="Rata-rata Rating"
          value={averageRating + " / 5"}
          accentColor={THEME.warning}
        />
        <StatCard
          icon={Star}
          label="Total Ulasan"
          value={filteredReviews.length}
          accentColor={THEME.purple}
        />
      </div>

      <div className="org-reviews-grid">
        {filteredReviews.length === 0 ? (
          <div
            style={{
              gridColumn: "1 / -1",
              padding: 40,
              textAlign: "center",
              backgroundColor: THEME.surface,
              border: `1px dashed ${THEME.borderStrong}`,
              borderRadius: 18,
            }}
          >
            <p style={{ color: THEME.dim, fontSize: "0.9rem", margin: 0 }}>
              Belum ada ulasan untuk filter ini.
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              eventTitle={eventTitleMap[review.eventId || review.event?.id] || "-"}
            />
          ))
        )}
      </div>
    </div>
  );
}