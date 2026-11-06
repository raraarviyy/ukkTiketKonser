import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./user/context/FavoriteContext";
import { TransactionProvider } from "./user/context/TransactionContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./landing/app";
import Register from "./register/app";
import Login from "./login/app";

import Home from "./user/home/app";
import Explore from "./user/explore/app";
import EventDetail from "./user/detail/app";
import MyTickets from "./user/my-tickets/app";
import TicketDetail from "./user/my-tickets/TicketDetail";
import History from "./user/history/app";
import OrderDetail from "./user/order-detail/app";
import Checkout from "./user/Checkout/app";
import Cart from "./user/cart/app";
import Favorites from "./user/favorites/app";
import Notifications from "./user/notifications/app";
import Profile from "./user/profile/app";

import OrganizerApp from "./organizer/app";
import AdminApp from "./admin/app";

export default function App() {
  return (
    <AuthProvider>
      <TransactionProvider>
        <FavoriteProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />

              <Route
                path="/home"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/explore"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <Explore />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/detail/:id"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <EventDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-tickets"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <MyTickets />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tickets/:id"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <TicketDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <History />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order/:id"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-detail/:id"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <OrderDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/favorites"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <Favorites />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <Notifications />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute allowedRoles={["User"]}>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/organizer/*"
                element={
                  <ProtectedRoute allowedRoles={["Penyelenggara", "Admin"]}>
                    <OrganizerApp />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute allowedRoles={["Admin"]}>
                    <AdminApp />
                  </ProtectedRoute>
                }
              />

              <Route
                path="*"
                element={
                  <div style={{ padding: "60px", textAlign: "center", color: "#fff", backgroundColor: "#0b0c10", minHeight: "100vh" }}>
                    <h1 style={{ fontSize: "32px", color: "#ec4899" }}>404 - Page Not Found</h1>
                    <p style={{ color: "#9ca3af" }}>Halaman yang kamu cari tidak ditemukan.</p>
                  </div>
                }
              />
            </Routes>
          </BrowserRouter>
        </FavoriteProvider>
      </TransactionProvider>
    </AuthProvider>
  );
}
