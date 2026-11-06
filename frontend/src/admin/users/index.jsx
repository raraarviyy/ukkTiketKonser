import React, { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Eye,
  MoreHorizontal,
  Search,
  ShieldCheck,
  Users,
  UserCog,
  X,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { THEME } from "../../theme";

const formatNumber = (value) => new Intl.NumberFormat("id-ID").format(value || 0);

const roleColor = {
  User: { bg: "rgba(156,163,175,0.1)", color: "#9ca3af", label: "User" },
  Organizer: { bg: "rgba(168,85,247,0.1)", color: "#a855f7", label: "Organizer" },
  Penyelenggara: { bg: "rgba(168,85,247,0.1)", color: "#a855f7", label: "Organizer" },
  "Super Admin": { bg: "rgba(236,72,153,0.1)", color: "#ec4899", label: "Super Admin" },
  Admin: { bg: "rgba(236,72,153,0.1)", color: "#ec4899", label: "Super Admin" },
};

const statusColor = {
  active: { bg: "rgba(16,185,129,0.1)", color: "#10b981", label: "Active" },
  suspended: { bg: "rgba(239,68,68,0.1)", color: "#ef4444", label: "Suspended" },
};

// FUNGSI SAKTI UNTUK MEMBACA ROLE DARI BACKEND
const getRoleName = (user) => {
  const rawRole = user.role_relation?.name || user.role_name || user.role;
  if (rawRole && typeof rawRole === 'object') return rawRole.name;
  // Fallback jika Backend mengirim ID angka
  if (rawRole === 1) return "User";
  if (rawRole === 2) return "Super Admin";
  if (rawRole === 3) return "Penyelenggara";
  return rawRole || "User";
};

function Badge({ type, value }) {
  // Jika value berupa ID angka dari BE, konversi dulu
  let displayValue = value;
  if (type === "role") {
    if (value === 1) displayValue = "User";
    if (value === 2) displayValue = "Super Admin";
    if (value === 3) displayValue = "Penyelenggara";
  }

  const config = type === "role" 
    ? (roleColor[displayValue] || roleColor.User) 
    : (statusColor[displayValue] || statusColor.active);
    
  return (
    <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700, backgroundColor: config.bg, color: config.color, display: "inline-block", whiteSpace: "nowrap" }}>
      {config.label || displayValue}
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

export default function AdminUsers() {
  const { users, suspendUser, activateUser, changeUserRole } = useAdmin();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [menuId, setMenuId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleFilter, setShowRoleFilter] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const kw = search.toLowerCase();
      const matchesSearch = (u.name || "").toLowerCase().includes(kw) || (u.email || "").toLowerCase().includes(kw);
      
      const roleName = getRoleName(u);
      const matchesRole = roleFilter === "all" || roleName === roleFilter || (roleFilter === "Organizer" && roleName === "Penyelenggara");
      
      const matchesStatus = statusFilter === "all" || u.status === statusFilter;
      
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, roleFilter, statusFilter]);

  const activeUsers = users.filter(u => u.status === "active").length;
  const suspendedUsers = users.filter(u => u.status === "suspended").length;
  const organizerUsers = users.filter(u => {
    const r = getRoleName(u);
    return r === "Organizer" || r === "Penyelenggara";
  }).length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text }}>User Management</h1>
        <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: THEME.muted }}>Kelola seluruh pengguna platform, status akun, dan hak akses.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard title="Total Users" value={formatNumber(users.length)} icon={Users} color={THEME.pink} />
        <StatCard title="Active" value={formatNumber(activeUsers)} icon={Check} color={THEME.success} />
        <StatCard title="Suspended" value={formatNumber(suspendedUsers)} icon={ShieldCheck} color={THEME.danger} />
        <StatCard title="Organizers" value={formatNumber(organizerUsers)} icon={UserCog} color={THEME.purple} />
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: "0 14px", flex: "1 1 300px" }}>
          <Search size={18} color={THEME.dim} />
          <input 
            type="text" placeholder="Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", background: "none", border: "none", padding: "12px", color: THEME.text, outline: "none", fontSize: "0.9rem" }} 
          />
        </div>
        
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {/* Filter Role */}
          <div style={{ position: "relative" }}>
            <button onClick={() => { setShowRoleFilter(!showRoleFilter); setShowStatusFilter(false); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, color: THEME.text, cursor: "pointer", fontSize: "0.85rem" }}>
              {roleFilter === "all" ? "Semua Role" : roleColor[roleFilter]?.label || roleFilter} <ChevronDown size={14} />
            </button>
            {showRoleFilter && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setShowRoleFilter(false)} />
                <div style={{ position: "absolute", right: 0, top: 44, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                  {["all", "User", "Organizer", "Admin"].map(r => (
                    <button key={r} onClick={() => { setRoleFilter(r); setShowRoleFilter(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", color: roleFilter === r ? THEME.pink : THEME.muted, fontSize: "0.85rem", cursor: "pointer", borderRadius: 8 }}>
                      {r === "all" ? "Semua Role" : roleColor[r]?.label || r}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          
          {/* Filter Status */}
          <div style={{ position: "relative" }}>
            <button onClick={() => { setShowStatusFilter(!showStatusFilter); setShowRoleFilter(false); }} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, color: THEME.text, cursor: "pointer", fontSize: "0.85rem" }}>
              {statusFilter === "all" ? "Semua Status" : statusColor[statusFilter]?.label} <ChevronDown size={14} />
            </button>
            {showStatusFilter && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setShowStatusFilter(false)} />
                <div style={{ position: "absolute", right: 0, top: 44, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                  {["all", "active", "suspended"].map(s => (
                    <button key={s} onClick={() => { setStatusFilter(s); setShowStatusFilter(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", color: statusFilter === s ? THEME.pink : THEME.muted, fontSize: "0.85rem", cursor: "pointer", borderRadius: 8 }}>
                      {s === "all" ? "Semua Status" : statusColor[s]?.label}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 800, borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${THEME.border}`, textAlign: "left", color: THEME.muted, background: "rgba(255,255,255,0.02)" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>User</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Role</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(u => {
                const roleName = getRoleName(u);
                return (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                    <td style={{ padding: "16px 20px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: THEME.pink, flexShrink: 0 }}>
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ margin: 0, fontWeight: 600, color: THEME.text }}>{u.name}</p>
                          <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: "16px 20px" }}><Badge type="role" value={roleName} /></td>
                    <td style={{ padding: "16px 20px" }}><Badge type="status" value={u.status} /></td>
                    <td style={{ padding: "16px 20px", textAlign: "right" }}>
                      <div style={{ position: "relative", display: "inline-block" }}>
                        <button onClick={() => setMenuId(menuId === u.id ? null : u.id)} style={{ background: "none", border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "6px 8px", color: THEME.muted, cursor: "pointer" }}>
                          <MoreHorizontal size={16} />
                        </button>
                        {menuId === u.id && (
                          <>
                            <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setMenuId(null)} />
                            <div style={{ position: "absolute", right: 0, top: 36, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)", textAlign: "left" }}>
                              <button onClick={() => { setSelectedUser(u); setMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.text, fontSize: "0.85rem", cursor: "pointer" }}><Eye size={14} /> Lihat Detail</button>
                              {u.status === "active" ? (
                                <button onClick={() => { suspendUser(u.id); setMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.danger, fontSize: "0.85rem", cursor: "pointer" }}><ShieldCheck size={14} /> Suspend</button>
                              ) : (
                                <button onClick={() => { activateUser(u.id); setMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.success, fontSize: "0.85rem", cursor: "pointer" }}><Check size={14} /> Aktifkan</button>
                              )}
                              <div style={{ height: 1, background: THEME.border, margin: "6px 0" }} />
                              <button onClick={() => { changeUserRole(u.id, "Penyelenggara"); setMenuId(null); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", color: THEME.muted, fontSize: "0.85rem", cursor: "pointer" }}>Jadikan Organizer</button>
                              <button onClick={() => { changeUserRole(u.id, "User"); setMenuId(null); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", color: THEME.muted, fontSize: "0.85rem", cursor: "pointer" }}>Jadikan User</button>
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
      
      {selectedUser && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: THEME.surface, borderRadius: 20, border: `1px solid ${THEME.border}`, maxWidth: 500, width: "100%", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Detail User</h3>
              <button onClick={() => setSelectedUser(null)} style={{ background: "none", border: "none", color: THEME.muted, cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, background: THEME.bg, borderRadius: 12, marginBottom: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800, color: THEME.pink }}>
                {selectedUser.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>{selectedUser.name}</h4>
                <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: THEME.muted }}>{selectedUser.email}</p>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <Badge type="role" value={getRoleName(selectedUser)} />
                  <Badge type="status" value={selectedUser.status} />
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
              <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, border: `1px solid ${THEME.border}` }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>User ID</p>
                <p style={{ margin: "4px 0 0", fontSize: "1.1rem", fontWeight: 800 }}>#{selectedUser.id}</p>
              </div>
              <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, border: `1px solid ${THEME.border}` }}>
                <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>No. HP</p>
                <p style={{ margin: "4px 0 0", fontSize: "1rem", fontWeight: 600 }}>{selectedUser.phone_number || "-"}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {selectedUser.status === "active" ? (
                <button onClick={() => { suspendUser(selectedUser.id); setSelectedUser(null); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "rgba(239,68,68,0.1)", color: THEME.danger, fontWeight: 700, cursor: "pointer" }}>Suspend</button>
              ) : (
                <button onClick={() => { activateUser(selectedUser.id); setSelectedUser(null); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: THEME.success, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Aktifkan</button>
              )}
              <button onClick={() => setSelectedUser(null)} style={{ padding: "12px 20px", borderRadius: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.muted, fontWeight: 600, cursor: "pointer" }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}