import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import AdminLayout from "./layout/AdminLayout";
import { THEME } from "../theme";

// Import Halaman Admin (sesuaikan path-nya dengan folder kamu)
import AdminDashboard from "./dashboard/index";
import AdminOrganizers from "./organizers/index";
import AdminConcerts from "./concerts/index";
import AdminCategories from "./categories/index";
import AdminUsers from "./users/index";
import AdminOrders from "./orders/index";
import AdminTickets from "./tickets/index";
import AdminSettlements from "./settlements/index";
import AdminReports from "./reports/index";
import AdminNotifications from "./notifications/index";
import AdminReviews from "./reviews/index";
import AdminAuditLog from "./audit-log/index";
import AdminProfile from "./profile/index";

export default function AdminApp() {
  // Cek apakah user adalah admin (opsional, bisa disesuaikan dengan AuthContext-mu)
  // const { user } = useAuth();
  
  return (
    <AdminProvider>
      <AdminLayout>
        <Routes>
          <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="organizers" element={<AdminOrganizers />} />
          <Route path="concerts" element={<AdminConcerts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="tickets" element={<AdminTickets />} />
          <Route path="settlements" element={<AdminSettlements />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="notifications" element={<AdminNotifications />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="audit-log" element={<AdminAuditLog />} />
          <Route path="profile" element={<AdminProfile />} />
          
          {/* Fallback jika rute tidak ditemukan */}
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Routes>
      </AdminLayout>
    </AdminProvider>
  );
}