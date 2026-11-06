import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  Tag,
  ShoppingCart,
  Ticket,
  Wallet,
  BarChart3,
  Bell,
  Star,
  ClipboardList,
  UserCircle,
  Menu,
  X,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { THEME } from "../../theme";

const menuGroups = [
  {
    title: "Overview",
    items: [{ label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard }],
  },
  {
    title: "Management",
    items: [
      { label: "Organizer", path: "/admin/organizers", icon: Building2 },
      { label: "Concert", path: "/admin/concerts", icon: CalendarDays },
      { label: "Category", path: "/admin/categories", icon: Tag },
      { label: "User", path: "/admin/users", icon: Users },
      { label: "Order", path: "/admin/orders", icon: ShoppingCart },
      { label: "Ticket", path: "/admin/tickets", icon: Ticket },
    ],
  },
  {
    title: "Finance",
    items: [
      { label: "Settlement", path: "/admin/settlements", icon: Wallet },
      { label: "Reports", path: "/admin/reports", icon: BarChart3 },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Notifications", path: "/admin/notifications", icon: Bell },
      { label: "Reviews", path: "/admin/reviews", icon: Star },
      { label: "Audit Log", path: "/admin/audit-log", icon: ClipboardList },
      { label: "Profile", path: "/admin/profile", icon: UserCircle },
    ],
  },
];

export default function AdminSidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const sidebarWidth = collapsed ? 84 : 280;

  return (
    <>
      <style>{`
        .admin-sidebar {
          position: fixed;
          top: 0;
          left: 0;
          bottom: 0;
          z-index: 50;
          background-color: ${THEME.surface};
          border-right: 1px solid ${THEME.border};
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease, transform 0.3s ease;
          width: ${sidebarWidth}px;
        }
        .admin-sidebar-overlay { display: none; }
        .admin-mobile-toggle { display: none; }
        .admin-collapse-btn { display: flex; }

        @media (max-width: 1023px) {
          .admin-sidebar {
            width: 280px !important;
            transform: translateX(${mobileOpen ? "0" : "-100%"});
          }
          .admin-sidebar-overlay {
            display: ${mobileOpen ? "block" : "none"};
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            z-index: 40;
          }
          .admin-mobile-toggle { display: flex; }
          .admin-collapse-btn { display: none !important; }
        }
      `}</style>

      <div className="admin-sidebar-overlay" onClick={() => setMobileOpen(false)} />

      <aside className="admin-sidebar">
        {/* Header / Logo */}
        <div
          style={{
            height: 76,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
            borderBottom: `1px solid ${THEME.border}`,
            flexShrink: 0,
          }}
        >
          <div
            onClick={() => navigate("/admin")}
            style={{ display: "flex", alignItems: "center", gap: 12, cursor: "pointer", overflow: "hidden" }}
          >
            <div
              style={{
                width: 40, height: 40, borderRadius: 12,
                background: THEME.gradient, display: "flex",
                alignItems: "center", justifyContent: "center", flexShrink: 0,
              }}
            >
              <Ticket size={22} color="#fff" />
            </div>
            {!collapsed && (
              <div style={{ minWidth: 0 }}>
                <h1 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: THEME.text }}>
                  Aur<span style={{ color: THEME.pink }}>alis</span>
                </h1>
                <p style={{ margin: 0, fontSize: 10, fontWeight: 600, letterSpacing: 1, color: THEME.muted, textTransform: "uppercase" }}>
                  Super Admin
                </p>
              </div>
            )}
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="admin-mobile-toggle"
            style={{ background: "none", border: "none", color: THEME.muted, cursor: "pointer" }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Menu List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 14px" }}>
          {menuGroups.map((group) => (
            <div key={group.title} style={{ marginBottom: 24 }}>
              {!collapsed && (
                <p style={{ margin: "0 0 8px 12px", fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, color: THEME.dim }}>
                  {group.title}
                </p>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setMobileOpen(false)}
                      title={collapsed ? item.label : undefined}
                      style={({ isActive }) => ({
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "10px 12px",
                        borderRadius: 12,
                        textDecoration: "none",
                        fontSize: 14,
                        fontWeight: 600,
                        justifyContent: collapsed ? "center" : "flex-start",
                        background: isActive ? THEME.gradient : "transparent",
                        color: isActive ? "#fff" : THEME.muted,
                        transition: "all 0.2s",
                      })}
                    >
                      <Icon size={18} style={{ flexShrink: 0 }} />
                      {!collapsed && <span>{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Logout */}
        <div style={{ padding: 14, borderTop: `1px solid ${THEME.border}`, flexShrink: 0 }}>
          <button
            onClick={handleLogout}
            style={{
              display: "flex", alignItems: "center", gap: 12, padding: "10px 12px",
              borderRadius: 12, background: "transparent", border: "none",
              color: THEME.danger, fontSize: 14, fontWeight: 600, cursor: "pointer",
              width: "100%", justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <LogOut size={18} />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* Collapse Button (Desktop) */}
        <button
          className="admin-collapse-btn"
          onClick={() => setCollapsed(!collapsed)}
          style={{
            position: "absolute", right: -12, top: 88, width: 24, height: 24,
            borderRadius: "50%", background: THEME.surface, border: `1px solid ${THEME.border}`,
            color: THEME.muted, alignItems: "center", justifyContent: "center",
            cursor: "pointer", zIndex: 10,
          }}
        >
          {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>

      {/* Mobile Toggle */}
      <button
        className="admin-mobile-toggle"
        onClick={() => setMobileOpen(true)}
        style={{
          position: "fixed", left: 16, top: 16, zIndex: 30, width: 40, height: 40,
          borderRadius: 10, background: THEME.surface, border: `1px solid ${THEME.border}`,
          color: THEME.text, alignItems: "center", justifyContent: "center",
          cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
        }}
      >
        <Menu size={20} />
      </button>
    </>
  );
}