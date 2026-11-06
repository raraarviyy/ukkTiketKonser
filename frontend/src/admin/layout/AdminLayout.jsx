import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { THEME } from "../../theme";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: THEME.bg,
        color: THEME.text,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        display: "flex",
        overflowX: "hidden",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; padding: 0; background-color: ${THEME.bg}; }
        
        .admin-main {
          flex: 1;
          min-width: 0;
          min-height: 100vh;
          transition: padding-left 0.3s ease;
          padding: 24px;
        }

        /* Desktop */
        @media (min-width: 1024px) {
          .admin-main { padding-left: 280px; }
          .admin-main.collapsed { padding-left: 100px; }
        }

        /* Mobile / Tablet */
        @media (max-width: 1023px) {
          .admin-main { padding-top: 80px; }
        }
      `}</style>

      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main className={`admin-main ${collapsed ? "collapsed" : ""}`}>
        {children}
      </main>
    </div>
  );
}