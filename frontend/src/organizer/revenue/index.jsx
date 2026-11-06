import React from "react";
import { Wallet, TrendingUp, PieChart } from "lucide-react";
import { useOrganizer } from "../context/OrganizerContext";
import StatCard from "../components/StatCard";
import { THEME } from "../../theme";

export default function OrganizerRevenue() {
  const { getRevenueSummary } = useOrganizer();
  const summary = getRevenueSummary();

  const bestEvent = summary.perEvent.reduce(
    (best, current) => (current.revenue > (best?.revenue || 0) ? current : best),
    null
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <style>{`
        .org-revenue-table-wrap {
          overflow-x: auto;
          width: 100%;
        }
        .org-revenue-table {
          width: 100%;
          min-width: 500px;
          border-collapse: collapse;
          font-size: 0.85rem;
        }
      `}</style>

      <div>
        <h1
          style={{
            fontSize: "clamp(1.4rem, 3vw, 1.9rem)",
            fontWeight: 800,
            color: THEME.text,
            margin: 0,
          }}
        >
          Laporan Pendapatan
        </h1>
        <p style={{ color: THEME.muted, fontSize: "0.9rem", marginTop: 6 }}>
          Ringkasan dan rincian pendapatan dari hasil penjualan tiket.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        <StatCard
          icon={Wallet}
          label="Total Pendapatan"
          value={"Rp" + summary.totalRevenue.toLocaleString("id-ID")}
          accentColor={THEME.success}
        />
        <StatCard
          icon={TrendingUp}
          label="Event Terbaik"
          value={bestEvent ? bestEvent.title : "-"}
          accentColor={THEME.pink}
          subtext={bestEvent ? "Rp" + bestEvent.revenue.toLocaleString("id-ID") : ""}
        />
        <StatCard
          icon={PieChart}
          label="Rata-rata/Event"
          value={
            summary.perEvent.length > 0
              ? "Rp" + Math.round(summary.totalRevenue / summary.perEvent.length).toLocaleString("id-ID")
              : "Rp0"
          }
          accentColor={THEME.purple}
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
          Rincian Pendapatan per Event
        </h3>

        {summary.perEvent.length === 0 ? (
          <p style={{ color: THEME.dim, fontSize: "0.85rem" }}>
            Belum ada data pendapatan.
          </p>
        ) : (
          <div className="org-revenue-table-wrap">
            <table className="org-revenue-table">
              <thead>
                <tr
                  style={{
                    textAlign: "left",
                    color: THEME.muted,
                    borderBottom: `1px solid ${THEME.border}`,
                  }}
                >
                  <th style={{ padding: "10px 8px", fontWeight: 600 }}>Event</th>
                  <th style={{ padding: "10px 8px", fontWeight: 600 }}>Tiket Terjual</th>
                  <th style={{ padding: "10px 8px", fontWeight: 600, textAlign: "right" }}>Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {summary.perEvent.map((item) => (
                  <tr
                    key={item.eventId}
                    style={{ borderBottom: `1px solid ${THEME.border}` }}
                  >
                    <td style={{ padding: "12px 8px", color: THEME.text, fontWeight: 600 }}>
                      {item.title}
                    </td>
                    <td style={{ padding: "12px 8px", color: THEME.muted }}>
                      {item.sold} / {item.quota}
                    </td>
                    <td
                      style={{
                        padding: "12px 8px",
                        color: THEME.success,
                        fontWeight: 700,
                        textAlign: "right",
                      }}
                    >
                      Rp{item.revenue.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}