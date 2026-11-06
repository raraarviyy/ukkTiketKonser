import React from "react";
import {
  LayoutDashboard,
  CalendarRange,
  Wallet,
  Star,
  Menu,
  X,
  LogOut,
  Ticket,
  UserCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { THEME } from "../../theme";
import { useAuth } from "../../context/AuthContext";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { key: "events", label: "Manajemen Event", icon: CalendarRange },
  { key: "revenue", label: "Laporan Pendapatan", icon: Wallet },
  { key: "reviews", label: "Ulasan Penonton", icon: Star },
  { key: "profile", label: "Profil", icon: UserCircle},
];

export default function OrganizerSidebar({
  activePage = "dashboard",
  onNavigate,
  mobileOpen,
  onCloseMobile,
}) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout?.();
    navigate("/login");
  };

  return (
    <>
      <style>{`
        .org-sidebar {
          position: fixed;
          top: 0; left: 0; bottom: 0;
          width: 260px;
          background-color: ${THEME.surface};
          border-right: 1px solid ${THEME.border};
          padding: 20px 14px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 50;
          transform: translateX(0);
          transition: transform 0.3s ease;
        }
        .org-sidebar-close { display: none; }
        .org-mobile-btn { display: none; }
        .org-overlay { display: none; }

        @media (max-width: 900px) {
          .org-sidebar { transform: translateX(-100%); }
          .org-sidebar.open { transform: translateX(0); }
          .org-sidebar-close { display: flex !important; }
          .org-mobile-btn { display: flex !important; }
          .org-overlay.open {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.6);
            backdrop-filter: blur(4px);
            z-index: 40;
          }
        }
      `}</style>

      <div
        className={`org-overlay ${mobileOpen ? "open" : ""}`}
        onClick={onCloseMobile}
      />

      <aside className={`org-sidebar ${mobileOpen ? "open" : ""}`}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
            padding: "0 8px",
          }}
        >
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
          >
            <div
              style={{
                padding: "6px 8px",
                background: THEME.gradient,
                borderRadius: 10,
                display: "flex",
              }}
            >
              <Ticket size={18} color="#fff" />
            </div>
            <span
              style={{
                fontSize: "1.1rem",
                fontWeight: 800,
                color: THEME.text,
              }}
            >
              Aur<span style={{ color: THEME.pink }}>alis</span>
            </span>
          </div>
          <button
            className="org-sidebar-close"
            onClick={onCloseMobile}
            style={{
              background: "none",
              border: "none",
              color: THEME.muted,
              cursor: "pointer",
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.key;
            return (
              <button
                key={item.key}
                onClick={() => onNavigate && onNavigate(item.key)} /* <-- INI PENGAMANNYA */
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 14px",
                  borderRadius: 12,
                  border: "none",
                  cursor: "pointer",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                  textAlign: "left",
                  width: "100%",
                  background: isActive ? THEME.gradient : "transparent",
                  color: isActive ? "#fff" : THEME.muted,
                }}
              >
                <Icon size={18} />
                {item.label}
              </button>
            );
          })}
        </div>

        <button
          onClick={handleLogout}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "12px 14px",
            borderRadius: 12,
            border: "none",
            cursor: "pointer",
            fontSize: "0.9rem",
            fontWeight: 600,
            textAlign: "left",
            width: "100%",
            background: "transparent",
            color: THEME.danger,
          }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>
    </>
  );
}

export function OrganizerMobileToggle({ onOpen }) {
  return (
    <button
      className="org-mobile-btn"
      onClick={onOpen}
      style={{
        background: THEME.surface,
        border: `1px solid ${THEME.border}`,
        color: THEME.text,
        borderRadius: 10,
        padding: 10,
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Menu size={20} />
    </button>
  );
}