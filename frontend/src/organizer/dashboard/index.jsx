import React from "react";
import {
  Ticket,
  TrendingUp,
  CalendarCheck,
  Users,
  Loader2,
} from "lucide-react";
import { useOrganizer } from "../context/OrganizerContext";
import StatCard from "../components/StatCard";
import { THEME } from "../../theme";

export default function OrganizerDashboard() {
  const { events, getRevenueSummary, loading } = useOrganizer();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 300,
          flexDirection: "column",
          gap: 12,
        }}
      >
        <Loader2
          size={32}
          color={THEME.pink}
          style={{ animation: "spin 1s linear infinite" }}
        />
        <span style={{ color: THEME.muted, fontSize: 14 }}>
          Memuat data dashboard...
        </span>
      </div>
    );
  }

  const summary = getRevenueSummary();
  const publishedCount = events.filter((e) => e.status === "published").length;
  const occupancyRate =
    summary.totalQuota > 0
      ? Math.round((summary.totalSold / summary.totalQuota) * 100)
      : 0;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div>
        <h1
          style={{
            fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
            fontWeight: 800,
            color: THEME.text,
            margin: 0,
          }}
        >
          Dashboard Penjualan
        </h1>
        <p style={{ color: THEME.muted, fontSize: "0.9rem", marginTop: 6 }}>
          Pantau progres penjualan tiket dari seluruh event secara real-time.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard
          icon={TrendingUp}
          label="Total Pendapatan"
          value={"Rp" + summary.totalRevenue.toLocaleString("id-ID")}
          accentColor={THEME.pink}
        />
        <StatCard
          icon={Ticket}
          label="Tiket Terjual"
          value={summary.totalSold + " / " + summary.totalQuota}
          accentColor={THEME.purple}
          subtext={occupancyRate + "% okupansi"}
        />
        <StatCard
          icon={CalendarCheck}
          label="Event Tayang"
          value={publishedCount + " / " + events.length}
          accentColor={THEME.success}
        />
        <StatCard
          icon={Users}
          label="Rata-rata Terjual/Event"
          value={
            events.length > 0
              ? Math.round(summary.totalSold / events.length)
              : 0
          }
          accentColor={THEME.warning}
        />
      </div>

      <div
        style={{
          backgroundColor: THEME.surface,
          border: `1px solid ${THEME.border}`,
          borderRadius: 18,
          padding: 20,
        }}
      >
        <h3
          style={{
            fontSize: "1.05rem",
            fontWeight: 700,
            color: THEME.text,
            marginTop: 0,
            marginBottom: 16,
          }}
        >
          Progres per Event
        </h3>

        {summary.perEvent.length === 0 ? (
          <p style={{ color: THEME.dim, fontSize: "0.85rem" }}>
            Belum ada event yang dibuat.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {summary.perEvent.map((item) => {
              const percent =
                item.quota > 0
                  ? Math.round((item.sold / item.quota) * 100)
                  : 0;
              return (
                <div key={item.eventId}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontSize: "0.85rem",
                      color: THEME.muted,
                      marginBottom: 6,
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        fontWeight: 600,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.title}
                    </span>
                    <span style={{ whiteSpace: "nowrap" }}>
                      {item.sold} / {item.quota}
                    </span>
                  </div>
                  <div
                    style={{
                      width: "100%",
                      height: 10,
                      backgroundColor: THEME.surfaceAlt,
                      borderRadius: 6,
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: percent + "%",
                        height: "100%",
                        background: THEME.gradient,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}