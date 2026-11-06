// src/components/ProtectedRoute.js
// Komponen guard untuk route yang membutuhkan autentikasi dan/atau role tertentu.
//
// Behaviour:
// - loading         → tampilkan spinner, tunggu AuthContext selesai cek localStorage
// - belum login     → redirect ke /login
// - login, role OK  → render children
// - login, role SALAH → redirect ke dashboard sesuai role user sendiri

import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Peta role backend → path dashboard masing-masing.
 * Nilai role sesuai dengan yang disimpan di database: "Admin", "Penyelenggara", "User".
 */
const ROLE_REDIRECT = {
  Admin: "/admin",
  Penyelenggara: "/organizer",
  User: "/home",
};

/**
 * Mengambil role dari localStorage secara langsung (backup jika currentUser belum ter-set).
 */
function getStoredRole() {
  return localStorage.getItem("auralis_user_role") || null;
}

/**
 * ProtectedRoute
 *
 * @param {string|string[]} allowedRoles  - Role yang diizinkan mengakses route ini.
 *                                          Gunakan nilai backend: "Admin" | "Penyelenggara" | "User".
 *                                          Kosongkan untuk hanya mengecek autentikasi (tanpa cek role).
 * @param {React.ReactNode} children      - Konten yang dirender jika akses diizinkan.
 */
export default function ProtectedRoute({ allowedRoles = [], children }) {
  const { currentUser, token, loading } = useAuth();

  // Tunggu AuthContext selesai membaca dari localStorage
  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0b0c10",
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: "50%",
            border: "3px solid rgba(236,72,153,0.3)",
            borderTopColor: "#ec4899",
            animation: "spin 0.8s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // Belum login → paksa ke halaman login
  if (!currentUser || !token) {
    return <Navigate to="/login" replace />;
  }

  // Tentukan role user yang sedang login
  const userRole =
    currentUser?.role_relation?.name ||   // dari object user backend (include role_relation)
    currentUser?.role ||                   // fallback kalau disimpan flat
    getStoredRole();                       // fallback dari localStorage

  // Jika ada pembatasan role, cek apakah role user termasuk yang diizinkan
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // User sudah login tapi role-nya tidak sesuai → redirect ke dashboard yang benar
    const correctPath = ROLE_REDIRECT[userRole] || "/login";
    return <Navigate to={correctPath} replace />;
  }

  return children;
}
