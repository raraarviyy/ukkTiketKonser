import React, { useMemo, useState } from "react";
import {
  Ban,
  Check,
  ChevronDown,
  CircleDollarSign,
  Eye,
  Filter,
  MoreHorizontal,
  Search,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { THEME } from "../../theme";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

const formatNumber = (value) => new Intl.NumberFormat("id-ID").format(value || 0);

const statusConfig = {
  active: { label: "Active", color: THEME.success, bg: "rgba(16,185,129,0.1)" },
  cancelled: { label: "Cancelled", color: THEME.danger, bg: "rgba(239,68,68,0.1)" },
};

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

export default function AdminTickets() {
  const { tickets, cancelTicket } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    return tickets.filter((t) => {
      const kw = search.toLowerCase();
      const matchSearch = (t.id || "").toLowerCase().includes(kw) || (t.event || "").toLowerCase().includes(kw) || (t.category || "").toLowerCase().includes(kw);
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [tickets, search, statusFilter]);

  const totalQuota = tickets.reduce((s, t) => s + t.quota, 0);
  const totalSold = tickets.reduce((s, t) => s + t.sold, 0);
  const activeTickets = tickets.filter(t => t.status === "active").length;
  const totalValue = tickets.reduce((s, t) => s + (t.price * t.sold), 0);

  const handleCancel = (id) => {
    if (window.confirm("Batalkan tiket ini? Sisa kuota akan di-set 0.")) {
      cancelTicket(id);
    }
    setMenuId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text }}>Ticket Monitoring</h1>
        <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: THEME.muted }}>Monitor harga, kuota, penjualan, dan status tiket konser.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard title="Ticket Types" value={formatNumber(tickets.length)} icon={Ticket} color={THEME.pink} />
        <StatCard title="Total Quota" value={formatNumber(totalQuota)} icon={Users} color={THEME.purple} />
        <StatCard title="Tickets Sold" value={formatNumber(totalSold)} icon={Check} color={THEME.success} />
        <StatCard title="Ticket GMV" value={formatCurrency(totalValue)} icon={CircleDollarSign} color={THEME.warning} />
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: "0 14px", flex: "1 1 300px" }}>
          <Search size={18} color={THEME.dim} />
          <input type="text" placeholder="Cari ticket ID, event, atau kategori..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", background: "none", border: "none", padding: "12px", color: THEME.text, outline: "none", fontSize: "0.9rem" }} />
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowFilter(!showFilter)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, color: THEME.text, cursor: "pointer", fontSize: "0.85rem" }}>
            <Filter size={14} /> {statusFilter === "all" ? "Semua Status" : statusConfig[statusFilter]?.label} <ChevronDown size={14} />
          </button>
          {showFilter && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setShowFilter(false)} />
              <div style={{ position: "absolute", right: 0, top: 44, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                {["all", "active", "cancelled"].map(s => (
                  <button key={s} onClick={() => { setStatusFilter(s); setShowFilter(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", color: statusFilter === s ? THEME.pink : THEME.muted, fontSize: "0.85rem", cursor: "pointer", borderRadius: 8 }}>
                    {s === "all" ? "Semua Status" : statusConfig[s]?.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${THEME.border}`, textAlign: "left", color: THEME.muted, background: "rgba(255,255,255,0.02)" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Ticket</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Concert</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Price</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "center" }}>Sold / Quota</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "center" }}>Status</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: THEME.muted }}>Belum ada tiket yang terdaftar.</td>
                </tr>
              ) : filtered.map(t => {
                const percent = t.quota > 0 ? Math.round((t.sold / t.quota) * 100) : 0;
                return (
                  <tr key={t.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(168,85,247,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: THEME.purple }}>
                          <Ticket size={16} />
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: THEME.text }}>{t.id}</p>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>{t.category}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", color: THEME.text, maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.event}</td>
                    <td style={{ padding: "16px 20px", textAlign: "right", fontWeight: 600, color: THEME.text }}>{formatCurrency(t.price)}</td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <p style={{ margin: "0 0 4px", fontSize: "0.85rem", fontWeight: 600 }}>{t.sold} / {t.quota}</p>
                      <div style={{ width: 80, height: 4, background: THEME.bg, borderRadius: 2, margin: "0 auto", overflow: "hidden" }}>
                        <div style={{ width: `${percent}%`, height: "100%", background: THEME.gradient }} />
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "center" }}>
                      <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700, backgroundColor: statusConfig[t.status]?.bg, color: statusConfig[t.status]?.color, display: "inline-block" }}>
                        {statusConfig[t.status]?.label}
                      </span>
                    </td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button onClick={() => setMenuId(menuId === t.id ? null : t.id)} style={{ background: "none", border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "6px 8px", color: THEME.muted, cursor: "pointer" }}>
                          <MoreHorizontal size={16} />
                        </button>
                        {menuId === t.id && (
                          <>
                            <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setMenuId(null)} />
                            <div style={{ position: "absolute", right: 0, top: 36, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)", textAlign: "left" }}>
                              <button onClick={() => { setSelected(t); setMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.text, fontSize: "0.85rem", cursor: "pointer" }}><Eye size={14} /> Detail</button>
                              {t.status === "active" && (
                                <button onClick={() => handleCancel(t.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.danger, fontSize: "0.85rem", cursor: "pointer" }}><Ban size={14} /> Cancel Tiket</button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: THEME.surface, borderRadius: 20, border: `1px solid ${THEME.border}`, maxWidth: 500, width: "100%", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Detail Tiket</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: THEME.muted, cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, marginBottom: 16 }}>
               <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>{selected.event}</h4>
               <p style={{ margin: "4px 0 10px", fontSize: "0.85rem", color: THEME.muted }}>{selected.category}</p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, border: `1px solid ${THEME.border}` }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>Harga</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: 800, color: THEME.purple }}>{formatCurrency(selected.price)}</p>
              </div>
              <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, border: `1px solid ${THEME.border}` }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>Terjual</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: 800 }}>{selected.sold} / {selected.quota}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {selected.status === "active" && (
                <button onClick={() => { handleCancel(selected.id); setSelected(null); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "rgba(239,68,68,0.1)", color: THEME.danger, fontWeight: 700, cursor: "pointer" }}>Tutup Penjualan (Cancel)</button>
              )}
              <button onClick={() => setSelected(null)} style={{ padding: "12px 20px", borderRadius: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.muted, fontWeight: 600, cursor: "pointer" }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}