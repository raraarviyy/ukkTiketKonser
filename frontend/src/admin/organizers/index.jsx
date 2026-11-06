import React, { useMemo, useState } from "react";
import {
  Building2,
  Check,
  Eye,
  Mail,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserRound,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { THEME } from "../../theme";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

const formatNumber = (value) => new Intl.NumberFormat("id-ID").format(value || 0);

const statusConfig = {
  active: { label: "Active", color: THEME.success, bg: "rgba(16,185,129,0.1)" },
  pending: { label: "Pending", color: THEME.warning, bg: "rgba(245,158,11,0.1)" },
  suspended: { label: "Suspended", color: THEME.danger, bg: "rgba(239,68,68,0.1)" },
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

export default function AdminOrganizers() {
  const { organizers, approveOrganizer, suspendOrganizer, activateOrganizer } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const filtered = useMemo(() => {
    return organizers.filter((org) => {
      const kw = search.toLowerCase();
      const matchSearch = (org.name || "").toLowerCase().includes(kw) || (org.email || "").toLowerCase().includes(kw);
      const matchStatus = statusFilter === "all" || org.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [organizers, search, statusFilter]);

  const activeCount = organizers.filter(o => o.status === "active").length;
  const pendingCount = organizers.filter(o => o.status === "pending").length;
  const suspendedCount = organizers.filter(o => o.status === "suspended").length;
  const totalRevenue = organizers.reduce((sum, o) => sum + (o.revenue || 0), 0);

  const handleAction = async (action, id) => {
    if (action === "approve") await approveOrganizer(id);
    if (action === "suspend") await suspendOrganizer(id);
    if (action === "activate") await activateOrganizer(id);
    setMenuId(null);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text }}>Organizer Management</h1>
        <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: THEME.muted }}>Kelola organizer terdaftar, status akun, dan performa penjualan mereka.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard title="Total Organizer" value={formatNumber(organizers.length)} icon={Building2} color={THEME.pink} />
        <StatCard title="Active" value={formatNumber(activeCount)} icon={ShieldCheck} color={THEME.success} />
        <StatCard title="Pending" value={formatNumber(pendingCount)} icon={UserRound} color={THEME.warning} />
        <StatCard title="Total Revenue" value={formatCurrency(totalRevenue)} icon={XCircle} color={THEME.purple} />
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: "0 14px", flex: "1 1 300px" }}>
          <Search size={18} color={THEME.dim} />
          <input type="text" placeholder="Cari organizer atau email..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", background: "none", border: "none", padding: "12px", color: THEME.text, outline: "none", fontSize: "0.9rem" }} />
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
          {["all", "active", "pending", "suspended"].map(s => (
            <button key={s} onClick={() => setStatusFilter(s)} style={{ padding: "10px 16px", borderRadius: 10, border: "none", background: statusFilter === s ? THEME.gradient : THEME.bg, color: statusFilter === s ? "#fff" : THEME.muted, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              {s === "all" ? "Semua" : statusConfig[s]?.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${THEME.border}`, textAlign: "left", color: THEME.muted, background: "rgba(255,255,255,0.02)" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Organizer</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "center" }}>Events</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Revenue</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(org => (
                <tr key={org.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: THEME.pink }}>
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: THEME.text }}>{org.name}</p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>{org.email}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}><StatusBadge status={org.status} /></td>
                  <td style={{ padding: "16px 20px", textAlign: "center", color: THEME.text, fontWeight: 600 }}>{org.concerts || 0}</td>
                  <td style={{ padding: "16px 20px", textAlign: "right", color: THEME.text, fontWeight: 600 }}>{formatCurrency(org.revenue)}</td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <button onClick={() => setMenuId(menuId === org.id ? null : org.id)} style={{ background: "none", border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "6px 8px", color: THEME.muted, cursor: "pointer" }}>
                        <MoreHorizontal size={16} />
                      </button>
                      {menuId === org.id && (
                        <>
                          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setMenuId(null)} />
                          <div style={{ position: "absolute", right: 0, top: 36, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)", textAlign: "left" }}>
                            <button onClick={() => { setSelected(org); setMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.text, fontSize: "0.85rem", cursor: "pointer" }}><Eye size={14} /> Detail</button>
                            {org.status === "pending" && (
                              <button onClick={() => handleAction("approve", org.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.success, fontSize: "0.85rem", cursor: "pointer" }}><Check size={14} /> Approve</button>
                            )}
                            {org.status === "active" && (
                              <button onClick={() => handleAction("suspend", org.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.danger, fontSize: "0.85rem", cursor: "pointer" }}><X size={14} /> Suspend</button>
                            )}
                            {org.status === "suspended" && (
                              <button onClick={() => handleAction("activate", org.id)} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.success, fontSize: "0.85rem", cursor: "pointer" }}><ShieldCheck size={14} /> Aktifkan</button>
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
      
      {/* Modal Detail Organizer */}
      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: THEME.surface, borderRadius: 20, border: `1px solid ${THEME.border}`, maxWidth: 500, width: "100%", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Detail Organizer</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: THEME.muted, cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: THEME.bg, borderRadius: 12, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: THEME.pink }}>
                {selected.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>{selected.name}</h4>
                <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: THEME.muted }}>{selected.email}</p>
                <div style={{ marginTop: 8 }}><StatusBadge status={selected.status} /></div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, border: `1px solid ${THEME.border}` }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>Total Event</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 800 }}>{selected.concerts || 0}</p>
              </div>
              <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, border: `1px solid ${THEME.border}` }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>Total Pendapatan</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.2rem", fontWeight: 800, color: THEME.success }}>{formatCurrency(selected.revenue)}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {selected.status === "pending" && <button onClick={() => { approveOrganizer(selected.id); setSelected(null); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: THEME.success, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Approve</button>}
              {selected.status === "active" && <button onClick={() => { suspendOrganizer(selected.id); setSelected(null); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "rgba(239,68,68,0.1)", color: THEME.danger, fontWeight: 700, cursor: "pointer" }}>Suspend</button>}
              {selected.status === "suspended" && <button onClick={() => { activateOrganizer(selected.id); setSelected(null); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: THEME.success, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Aktifkan</button>}
              <button onClick={() => setSelected(null)} style={{ padding: "12px 20px", borderRadius: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.muted, fontWeight: 600, cursor: "pointer" }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}