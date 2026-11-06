import React, { useMemo, useState } from "react";
import { Activity, CalendarDays, Check, ChevronDown, Clock3, Eye, Filter, Search, ShieldCheck, User, X, FileText } from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { THEME } from "../../theme";

const actionColors = {
  "Approve Concert": THEME.success, "Reject Concert": THEME.danger, "Cancel Concert": THEME.warning,
  "Soft Delete Concert": THEME.danger, "Approve Organizer": THEME.success, "Suspend Organizer": THEME.warning,
  "Activate Organizer": THEME.pink, "Suspend User": THEME.warning, "Activate User": THEME.pink,
  "Change User Role": THEME.purple, "Delete User": THEME.danger, "Refund Transaction": THEME.warning,
  "Cancel Transaction": THEME.danger, "Update Order Status": THEME.pink, "Cancel Ticket": THEME.danger,
  "Update Platform Fee": THEME.pink, "Create Announcement": THEME.pink, "Delete Announcement": THEME.danger,
  "Update Review": THEME.purple, "Delete Review": THEME.danger,
};

function getActionColor(action) { return actionColors[action] || THEME.muted; }

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

export default function AdminAuditLog() {
  const { auditLogs } = useAdmin();
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [selected, setSelected] = useState(null);

  const actionOptions = useMemo(() => [...new Set(auditLogs.map(l => l.action))].sort(), [auditLogs]);

  const filtered = useMemo(() => {
    const kw = search.toLowerCase();
    return auditLogs.filter(l => {
      const matchSearch = (l.actor || "").toLowerCase().includes(kw) || (l.action || "").toLowerCase().includes(kw) || (l.target || "").toLowerCase().includes(kw);
      const matchAction = actionFilter === "all" || l.action === actionFilter;
      return matchSearch && matchAction;
    });
  }, [auditLogs, search, actionFilter]);

  const formatDate = (log) => {
    const raw = log?.createdAt || log?.created_at;
    if (!raw) return "-";
    if (typeof raw === "string" && raw.includes("-") && raw.includes(":")) return raw;
    const d = new Date(raw);
    return isNaN(d.getTime()) ? "-" : d.toLocaleString("id-ID", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text }}>Audit Log</h1>
        <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: THEME.muted }}>Riwayat aktivitas penting yang dilakukan oleh Super Admin.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard title="Total Activity" value={auditLogs.length} icon={Activity} color={THEME.pink} />
        <StatCard title="Action Type" value={actionOptions.length} icon={FileText} color={THEME.purple} />
        <StatCard title="Active Actor" value={new Set(auditLogs.map(l => l.actor)).size} icon={User} color={THEME.warning} />
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: "0 14px", flex: "1 1 300px" }}>
          <Search size={18} color={THEME.dim} />
          <input type="text" placeholder="Cari actor, action, atau target..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", background: "none", border: "none", padding: "12px", color: THEME.text, outline: "none", fontSize: "0.9rem" }} />
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowFilter(!showFilter)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, color: THEME.text, cursor: "pointer", fontSize: "0.85rem" }}>
            <Filter size={14} /> {actionFilter === "all" ? "Semua Aktivitas" : actionFilter} <ChevronDown size={14} />
          </button>
          {showFilter && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setShowFilter(false)} />
              <div style={{ position: "absolute", right: 0, top: 44, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 200, maxHeight: 250, overflowY: "auto", boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                <button onClick={() => { setActionFilter("all"); setShowFilter(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", color: actionFilter === "all" ? THEME.pink : THEME.muted, fontSize: "0.85rem", cursor: "pointer", borderRadius: 8 }}>Semua Aktivitas</button>
                {actionOptions.map(a => (
                  <button key={a} onClick={() => { setActionFilter(a); setShowFilter(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", color: actionFilter === a ? THEME.pink : THEME.muted, fontSize: "0.85rem", cursor: "pointer", borderRadius: 8 }}>{a}</button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 700, borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${THEME.border}`, textAlign: "left", color: THEME.muted, background: "rgba(255,255,255,0.02)" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Actor</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Action</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Target</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Date</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Detail</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(log => (
                <tr key={log.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: THEME.pink }}><ShieldCheck size={14} /></div>
                      <span style={{ fontWeight: 600, color: THEME.text }}>{log.actor}</span>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700, backgroundColor: `${getActionColor(log.action)}15`, color: getActionColor(log.action), display: "inline-block" }}>{log.action}</span>
                  </td>
                  <td style={{ padding: "16px 20px", color: THEME.muted }}>{log.target}</td>
                  <td style={{ padding: "16px 20px", color: THEME.muted, whiteSpace: "nowrap" }}>{formatDate(log)}</td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <button onClick={() => setSelected(log)} style={{ background: "none", border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "6px 8px", color: THEME.muted, cursor: "pointer" }}><Eye size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: THEME.surface, borderRadius: 20, border: `1px solid ${THEME.border}`, maxWidth: 450, width: "100%", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Detail Aktivitas</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: THEME.muted, cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div><span style={{ fontSize: "0.75rem", color: THEME.muted }}>Actor</span><p style={{ margin: "4px 0 0", fontWeight: 600 }}>{selected.actor}</p></div>
              <div><span style={{ fontSize: "0.75rem", color: THEME.muted }}>Action</span><p style={{ margin: "4px 0 0", fontWeight: 600, color: getActionColor(selected.action) }}>{selected.action}</p></div>
              <div><span style={{ fontSize: "0.75rem", color: THEME.muted }}>Target</span><p style={{ margin: "4px 0 0", fontWeight: 600 }}>{selected.target}</p></div>
              <div><span style={{ fontSize: "0.75rem", color: THEME.muted }}>Waktu</span><p style={{ margin: "4px 0 0", fontWeight: 600 }}>{formatDate(selected)}</p></div>
            </div>
            <button onClick={() => setSelected(null)} style={{ width: "100%", marginTop: 24, padding: 12, borderRadius: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.text, fontWeight: 600, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}