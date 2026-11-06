import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  MapPin,
  MoreHorizontal,
  Search,
  ShieldAlert,
  Ticket,
  X,
  XCircle,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { THEME } from "../../theme";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

const formatNumber = (value) => new Intl.NumberFormat("id-ID").format(value || 0);

const statusConfig = {
  published: { label: "Published", color: THEME.success, bg: "rgba(16,185,129,0.1)" },
  pending: { label: "Pending", color: THEME.warning, bg: "rgba(245,158,11,0.1)" },
  rejected: { label: "Rejected", color: THEME.danger, bg: "rgba(239,68,68,0.1)" },
  cancelled: { label: "Cancelled", color: THEME.warning, bg: "rgba(245,158,11,0.1)" },
  deleted: { label: "Deleted", color: THEME.muted, bg: "rgba(156,163,175,0.1)" },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700, backgroundColor: config.bg, color: config.color, display: "inline-block" }}>
      {config.label}
    </span>
  );
}

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

export default function AdminConcerts() {
  const { concerts, approveEvent, rejectEvent, cancelEvent, softDeleteEvent } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const filtered = useMemo(() => {
    return concerts.filter((ev) => {
      const kw = search.toLowerCase();
      const matchSearch = (ev.name || "").toLowerCase().includes(kw) || (ev.organizer || "").toLowerCase().includes(kw) || (ev.location || "").toLowerCase().includes(kw);
      const matchStatus = statusFilter === "all" || ev.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [concerts, search, statusFilter]);

  const publishedCount = concerts.filter(e => e.status === "published").length;
  const pendingCount = concerts.filter(e => e.status === "pending").length;
  const rejectedCount = concerts.filter(e => e.status === "rejected").length;

  const handleAction = async (action, id) => {
    if (action === "approve") await approveEvent(id);
    if (action === "reject") await rejectEvent(id);
    if (action === "cancel") await cancelEvent(id);
    if (action === "delete") await softDeleteEvent(id);
    setMenuId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text }}>Concert Management</h1>
        <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: THEME.muted }}>Pantau seluruh konser di platform dan lakukan approval atau pembatalan.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard title="Total Concert" value={formatNumber(concerts.length)} icon={CalendarDays} color={THEME.pink} />
        <StatCard title="Published" value={formatNumber(publishedCount)} icon={Check} color={THEME.success} />
        <StatCard title="Pending" value={formatNumber(pendingCount)} icon={Clock3} color={THEME.warning} />
        <StatCard title="Rejected" value={formatNumber(rejectedCount)} icon={XCircle} color={THEME.danger} />
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: "0 14px", flex: "1 1 300px" }}>
          <Search size={18} color={THEME.dim} />
          <input type="text" placeholder="Cari konser, organizer, atau lokasi..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", background: "none", border: "none", padding: "12px", color: THEME.text, outline: "none", fontSize: "0.9rem" }} />
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowFilter(!showFilter)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, color: THEME.text, cursor: "pointer", fontSize: "0.85rem" }}>
            {statusFilter === "all" ? "Semua Status" : statusConfig[statusFilter]?.label} <ChevronDown size={14} />
          </button>
          {showFilter && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setShowFilter(false)} />
              <div style={{ position: "absolute", right: 0, top: 44, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                {["all", "published", "pending", "rejected"].map(s => (
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
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Concert</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Organizer</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Date & Location</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "center" }}>Ticket</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Revenue</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "center" }}>Status</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(ev => (
                <tr key={ev.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: THEME.pink }}>
                        <CalendarDays size={18} />
                      </div>
                      <p style={{ margin: 0, fontWeight: 600, color: THEME.text, maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{ev.name}</p>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", color: THEME.muted }}>{ev.organizer}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <p style={{ margin: 0, color: THEME.text }}>{ev.date}</p>
                    <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>{ev.location}</p>
                  </td>
                  <td style={{ padding: "16px 20px", textAlign: "center", color: THEME.text, fontWeight: 600 }}>{formatNumber(ev.ticketsSold)}</td>
                  <td style={{ padding: "16px 20px", textAlign: "right", color: THEME.success, fontWeight: 600 }}>{formatCurrency(ev.revenue)}</td>
                  <td style={{ padding: "16px 20px", textAlign: "center" }}><StatusBadge status={ev.status} /></td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <button onClick={() => setMenuId(menuId === ev.id ? null : ev.id)} style={{ background: "none", border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "6px 8px", color: THEME.muted, cursor: "pointer" }}>
                        <MoreHorizontal size={16} />
                      </button>
                      {menuId === ev.id && (
                        <>
                          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setMenuId(null)} />
                          <div style={{ position: "absolute", right: 0, top: 36, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)", textAlign: "left" }}>
                            <button onClick={() => { setSelected(ev); setMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.text, fontSize: "0.85rem", cursor: "pointer" }}><Eye size={14} /> Detail</button>
                            {ev.status === "pending" && (
                              <>
                                <button onClick={() => handleAction("approve", ev.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.success, fontSize: "0.85rem", cursor: "pointer" }}><Check size={14} /> Approve</button>
                                <button onClick={() => handleAction("reject", ev.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.danger, fontSize: "0.85rem", cursor: "pointer" }}><XCircle size={14} /> Reject</button>
                              </>
                            )}
                            {ev.status === "published" && (
                              <button onClick={() => handleAction("cancel", ev.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.warning, fontSize: "0.85rem", cursor: "pointer" }}><ShieldAlert size={14} /> Cancel</button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Detail Modal Concerts */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: THEME.surface, borderRadius: 20, border: `1px solid ${THEME.border}`, maxWidth: 500, width: "100%", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Detail Konser</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: THEME.muted, cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, marginBottom: 16 }}>
               <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>{selected.name}</h4>
               <p style={{ margin: "4px 0 10px", fontSize: "0.85rem", color: THEME.muted }}>{selected.organizer}</p>
               <StatusBadge status={selected.status} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, border: `1px solid ${THEME.border}` }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>Tiket Terjual</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 800 }}>{selected.ticketsSold} / {selected.capacity}</p>
              </div>
              <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, border: `1px solid ${THEME.border}` }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>Pendapatan</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 800, color: THEME.success }}>{formatCurrency(selected.revenue)}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {selected.status === "pending" && (
                <>
                  <button onClick={() => { approveEvent(selected.id); setSelected(null); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: THEME.success, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Approve</button>
                  <button onClick={() => { rejectEvent(selected.id); setSelected(null); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "rgba(239,68,68,0.1)", color: THEME.danger, fontWeight: 700, cursor: "pointer" }}>Reject</button>
                </>
              )}
              {selected.status === "published" && (
                <button onClick={() => { cancelEvent(selected.id); setSelected(null); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "rgba(245,158,11,0.1)", color: THEME.warning, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              )}
              <button onClick={() => setSelected(null)} style={{ padding: "12px 20px", borderRadius: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.muted, fontWeight: 600, cursor: "pointer" }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}