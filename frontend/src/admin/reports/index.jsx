import React, { useMemo, useState } from "react";
import {
  Calendar,
  Check,
  ChevronDown,
  CircleDollarSign,
  CreditCard,
  Download,
  Receipt,
  Ticket,
  TrendingUp,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { THEME } from "../../theme";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

const formatNumber = (value) => new Intl.NumberFormat("id-ID").format(value || 0);

const formatCompact = (value) =>
  `Rp ${new Intl.NumberFormat("id-ID", { notation: "compact", maximumFractionDigits: 1 }).format(value)}`;

const periodOptions = [
  { value: "all", label: "Semua Waktu" },
  { value: "7", label: "7 Hari Terakhir" },
  { value: "30", label: "30 Hari Terakhir" },
  { value: "year", label: "Tahun Ini" },
];

const getOrderDate = (order) => new Date(order.paid_at || order.created_at);

const getOrganizerName = (order) =>
  order.event?.organizer?.organization_name || order.event?.organizer?.name || "-";

const getOrganizerId = (order) =>
  order.event?.organizer?.id ?? order.event?.organizer_id ?? 0;

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: THEME.muted, fontWeight: 500 }}>{title}</p>
          <h3 style={{ margin: "6px 0 0", fontSize: "clamp(1.2rem, 4vw, 1.5rem)", fontWeight: 800, color: THEME.text }}>{value}</h3>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </div>
  );
}

export default function AdminReports() {
  const { orders, tickets } = useAdmin();
  const [period, setPeriod] = useState("all");
  const [showPeriod, setShowPeriod] = useState(false);

  const allOrders = useMemo(() => (Array.isArray(orders) ? orders : []), [orders]);

  const filteredOrders = useMemo(() => {
    const now = new Date();
    return allOrders.filter((order) => {
      const date = getOrderDate(order);
      if (Number.isNaN(date.getTime())) return false;
      if (period === "all") return true;
      if (period === "year") return date.getFullYear() === now.getFullYear();
      return now.getTime() - date.getTime() <= Number(period) * 86400000;
    });
  }, [allOrders, period]);

  const paidOrders = useMemo(() => filteredOrders.filter((order) => order.status === "paid"), [filteredOrders]);

  const totalRevenue = paidOrders.reduce((total, order) => total + Number(order.total || 0), 0);
  const ticketsSold = paidOrders.reduce((total, order) => total + Number(order.quantity || 0), 0);
  const averageOrder = paidOrders.length ? Math.round(totalRevenue / paidOrders.length) : 0;

  const trend = useMemo(() => {
    const now = new Date();
    const months = [];
    for (let index = 5; index >= 0; index -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - index, 1);
      months.push({
        key: date.getFullYear() * 100 + date.getMonth() + 1,
        label: date.toLocaleDateString("id-ID", { month: "short" }),
        value: 0,
      });
    }
    allOrders.forEach((order) => {
      if (order.status !== "paid") return;
      const date = getOrderDate(order);
      if (Number.isNaN(date.getTime())) return;
      const key = date.getFullYear() * 100 + date.getMonth() + 1;
      const target = months.find((month) => month.key === key);
      if (target) target.value += Number(order.total || 0);
    });
    const max = Math.max(...months.map((month) => month.value), 0);
    return months.map((month) => ({
      ...month,
      height: max > 0 ? Math.round((month.value / max) * 140) : 0,
    }));
  }, [allOrders]);

  const concertRows = useMemo(() => {
    const map = {};
    paidOrders.forEach((order) => {
      const key = order.event_id ?? order.event?.id ?? 0;
      if (!map[key]) {
        map[key] = { id: key, name: order.event?.title || "-", organizer: getOrganizerName(order), revenue: 0, tickets: 0 };
      }
      map[key].tickets += Number(order.quantity || 0);
      map[key].revenue += Number(order.total || 0);
    });
    return Object.values(map).sort((a, b) => b.revenue - a.revenue);
  }, [paidOrders]);

  const handleExport = () => {
    const headers = ["Concert", "Organizer", "Tickets Sold", "Revenue"];
    const rows = concertRows.map((row) => [row.name, row.organizer, row.tickets, row.revenue]);
    const csv = [headers, ...rows].map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url; link.download = "laporan-penjualan.csv"; link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text }}>Reports & Analytics</h1>
          <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: THEME.muted }}>Ringkasan penjualan tiket, performa konser, dan metode pembayaran.</p>
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <div style={{ position: "relative" }}>
            <button onClick={() => setShowPeriod(!showPeriod)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, color: THEME.text, cursor: "pointer", fontSize: "0.85rem" }}>
              <Calendar size={14} /> {periodOptions.find((o) => o.value === period)?.label} <ChevronDown size={14} />
            </button>
            {showPeriod && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setShowPeriod(false)} />
                <div style={{ position: "absolute", right: 0, top: 44, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                  {periodOptions.map((item) => (
                    <button key={item.value} onClick={() => { setPeriod(item.value); setShowPeriod(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", color: period === item.value ? THEME.pink : THEME.muted, fontSize: "0.85rem", cursor: "pointer", borderRadius: 8 }}>
                      {item.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: THEME.gradient, border: "none", borderRadius: 12, color: "#fff", cursor: "pointer", fontSize: "0.85rem", fontWeight: 700 }}>
            <Download size={15} /> Export CSV
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={CircleDollarSign} color={THEME.pink} />
        <StatCard title="Paid Orders" value={formatNumber(paidOrders.length)} icon={Receipt} color={THEME.success} />
        <StatCard title="Tickets Sold" value={formatNumber(ticketsSold)} icon={Ticket} color={THEME.purple} />
        <StatCard title="Avg Order Value" value={formatCurrency(averageOrder)} icon={TrendingUp} color={THEME.warning} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 24 }}>
        <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TrendingUp size={18} color={THEME.pink} />
            </div>
            <div>
              <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Revenue 6 Bulan Terakhir</h2>
              <p style={{ margin: 0, fontSize: "0.8rem", color: THEME.muted }}>Total pendapatan order lunas per bulan</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", height: 180, gap: 8 }}>
            {trend.map((item) => (
              <div key={item.key} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                <span style={{ fontSize: "0.65rem", color: THEME.muted, fontWeight: 600 }}>{item.value > 0 ? formatCompact(item.value) : "-"}</span>
                <div style={{ width: "100%", height: item.height, background: THEME.gradient, borderRadius: "4px 4px 0 0", minHeight: item.value > 0 ? 4 : 0 }} />
                <span style={{ fontSize: "0.7rem", color: THEME.dim, textTransform: "uppercase" }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, overflow: "hidden" }}>
          <div style={{ padding: 24, borderBottom: `1px solid ${THEME.border}` }}>
            <h2 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Top Konser</h2>
            <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: THEME.muted }}>Berdasarkan pendapatan tertinggi</p>
          </div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", minWidth: 400, borderCollapse: "collapse", fontSize: "0.85rem" }}>
              <thead>
                <tr style={{ borderBottom: `1px solid ${THEME.border}`, textAlign: "left", color: THEME.muted }}>
                  <th style={{ padding: "12px 24px", fontWeight: 600 }}>Konser</th>
                  <th style={{ padding: "12px 24px", fontWeight: 600, textAlign: "right" }}>Tiket</th>
                  <th style={{ padding: "12px 24px", fontWeight: 600, textAlign: "right" }}>Pendapatan</th>
                </tr>
              </thead>
              <tbody>
                {concertRows.length === 0 ? (
                  <tr><td colSpan="3" style={{ padding: 24, textAlign: "center", color: THEME.dim }}>Belum ada data.</td></tr>
                ) : concertRows.slice(0, 5).map(row => (
                  <tr key={row.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                    <td style={{ padding: "12px 24px" }}>
                      <p style={{ margin: 0, fontWeight: 600, color: THEME.text }}>{row.name}</p>
                      <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>{row.organizer}</p>
                    </td>
                    <td style={{ padding: "12px 24px", textAlign: "right", color: THEME.text }}>{formatNumber(row.tickets)}</td>
                    <td style={{ padding: "12px 24px", textAlign: "right", fontWeight: 600, color: THEME.success }}>{formatCurrency(row.revenue)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}