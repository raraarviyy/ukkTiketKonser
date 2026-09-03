import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#060912] text-white">
      <AdminSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <main
        className={`
          min-h-screen transition-all duration-300
          ${collapsed ? "lg:pl-[82px]" : "lg:pl-[260px]"}
        `}
      >
        <div className="min-h-screen p-4 pt-20 sm:p-6 sm:pt-20 lg:p-8 lg:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}