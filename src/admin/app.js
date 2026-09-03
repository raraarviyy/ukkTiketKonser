import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { AdminProvider } from "./context/AdminContext";
import AdminLayout from "./layout/AdminLayout";

import AdminDashboard from "./dashboard";
import AdminOrganizers from "./organizers";
import AdminConcerts from "./concerts";
import AdminUsers from "./users";
import AdminOrders from "./orders";
import AdminTickets from "./tickets";
import AdminSettlements from "./settlements";
import AdminReports from "./reports";
import AdminNotifications from "./notifications";
import AdminReviews from "./reviews";
import AdminAuditLog from "./audit-log";
import AdminProfile from "./profile";

export default function AdminApp() {
  return (
    <AdminProvider>
      <AdminLayout>
        <Routes>
          <Route
            path="/"
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<AdminDashboard />}
          />

          <Route
            path="organizers"
            element={<AdminOrganizers />}
          />

          <Route
            path="concerts"
            element={<AdminConcerts />}
          />

          <Route
            path="users"
            element={<AdminUsers />}
          />

          <Route
            path="orders"
            element={<AdminOrders />}
          />

          <Route
            path="tickets"
            element={<AdminTickets />}
          />

          <Route
            path="settlements"
            element={<AdminSettlements />}
          />

          <Route
            path="reports"
            element={<AdminReports />}
          />

          <Route
            path="notifications"
            element={<AdminNotifications />}
          />

          <Route
            path="reviews"
            element={<AdminReviews />}
          />

          <Route
            path="audit-log"
            element={<AdminAuditLog />}
          />

          <Route
            path="profile"
            element={<AdminProfile />}
          />

          <Route
            path="*"
            element={
              <Navigate
                to="/admin/dashboard"
                replace
              />
            }
          />
        </Routes>
      </AdminLayout>
    </AdminProvider>
  );
}
