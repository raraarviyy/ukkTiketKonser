import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { FavoriteProvider } from "./user/context/FavoriteContext";
import { TransactionProvider } from "./user/context/TransactionContext";

import Landing from "./landing/app";
import Register from "./register/app";
import Login from "./login/app";

import Home from "./user/home/app";
import Explore from "./user/explore/app";
import EventDetail from "./user/detail/app";
import MyTickets from "./user/my-tickets/app";
import History from "./user/history/app";
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

              <Route path="/home" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/detail/:id" element={<EventDetail />} />

              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/history" element={<History />} />

              <Route path="/checkout" element={<Checkout />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/profile" element={<Profile />} />

              <Route path="/organizer/*" element={<OrganizerApp />} />
              <Route path="/admin/*" element={<AdminApp />} />

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