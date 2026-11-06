import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const http = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

http.interceptors.request.use((config) => {
  const token = localStorage.getItem("auralis_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auralis_token");
      localStorage.removeItem("auralis_current_user");
      localStorage.removeItem("auralis_logged_in");
      localStorage.removeItem("auralis_user_role");
      window.location.href = "/login";
    }
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Terjadi kesalahan jaringan.";
    return Promise.reject(new Error(message));
  }
);

/* ================= AUTH ================= */
async function login({ email, password }) {
  const res = await http.post("/auth/login", { email, password });
  return res.data;
}
async function register({ name, email, password, role, phone_number, organization_name }) {
  const res = await http.post("/auth/register", {
    name, email, password, role,
    ...(phone_number && { phone_number }),
    ...(organization_name && { organization_name }),
  });
  return res.data;
}

/* ================= EVENTS ================= */
async function getEvents(params = {}) {
  const res = await http.get("/events", { params });
  const raw = res.data?.data ?? res.data;
  return Array.isArray(raw) ? raw : [];
}
async function getFeaturedEvents(limit = 10) {
  const res = await http.get("/events", { params: { status: "approved" } });
  const raw = res.data?.data ?? res.data;
  return (Array.isArray(raw) ? raw : []).slice(0, limit);
}
async function getEventById(id) {
  const res = await http.get(`/events/${id}`);
  return res.data?.data ?? res.data;
}
async function getMyOrganizedEvents(params = {}) {
  const res = await http.get("/events/my-events", { params });
  const raw = res.data?.data ?? res.data;
  return Array.isArray(raw) ? raw : [];
}
async function createEvent(data) { return (await http.post("/events", data)).data; }
async function updateEvent(id, data) { return (await http.put(`/events/${id}`, data)).data; }
async function deleteEvent(id) { return (await http.delete(`/events/${id}`)).data; }
async function moderateEventStatus(id, data) {
  return (await http.patch(`/events/${id}/status`, data)).data;
}

/* ================= TICKET TYPES ================= */
async function getTicketTypesByEvent(eventId) {
  const res = await http.get(`/events/${eventId}/ticket-types`);
  const raw = res.data?.data ?? res.data;
  return Array.isArray(raw) ? raw : [];
}
async function createTicketType(eventId, data) {
  return (await http.post(`/events/${eventId}/ticket-types`, data)).data;
}
async function updateTicketType(id, data) {
  return (await http.put(`/ticket-types/${id}`, data)).data;
}
async function deleteTicketType(id) {
  return (await http.delete(`/ticket-types/${id}`)).data;
}

/* ================= TICKETS ================= */
async function getMyTickets(params = {}) {
  return (await http.get("/tickets/me", { params })).data;
}
async function getTicketById(id) {
  return (await http.get(`/tickets/${id}`)).data;
}
async function getAllTickets(params = {}) {
  return (await http.get("/tickets", { params })).data;
}
async function checkInTicket(id) {
  return (await http.put(`/tickets/${id}/check-in`)).data;
}
async function checkInByCode(ticket_code) {
  return (await http.post("/tickets/check-in", { ticket_code })).data;
}

/* ================= ORDERS ================= */
async function checkout(payload) {
  return (await http.post("/orders/checkout", payload)).data;
}
async function getMyOrders() {
  return (await http.get("/orders/me")).data;
}
async function getOrderById(id) {
  return (await http.get(`/orders/${id}`)).data;
}
async function checkPaymentStatus(id) {
  return (await http.get(`/orders/${id}/check-payment`)).data;
}
async function cancelMyOrder(id) {
  return (await http.post(`/orders/${id}/cancel`)).data;
}
async function getOrganizerOrders(params = {}) {
  return (await http.get("/orders/organizer", { params })).data;
}
async function getAllOrders(params = {}) {
  return (await http.get("/orders", { params })).data;
}
async function updateOrderStatus(id, data) {
  return (await http.patch(`/orders/${id}/status`, data)).data;
}

/* ================= FAVORITES ================= */
async function getMyFavorites() { return (await http.get("/favorites")).data; }
async function toggleFavorite(event_id) {
  return (await http.post("/favorites/toggle", { event_id })).data;
}
async function removeFavorite(eventId) {
  return (await http.delete(`/favorites/${eventId}`)).data;
}

/* ================= NOTIFICATIONS ================= */
async function getMyNotifications() { return (await http.get("/notifications")).data; }
async function markNotificationRead(id) {
  return (await http.put(`/notifications/${id}/read`)).data;
}
async function markAllNotificationsRead() {
  return (await http.put("/notifications/read-all")).data;
}

/* ================= REVIEWS ================= */
async function getMyReviews() { return (await http.get("/reviews/me")).data; }
async function createReview(data) {
  return (await http.post("/reviews", data)).data;
}
async function getReviewsByEvent(eventId) {
  return (await http.get(`/reviews/events/${eventId}`)).data;
}
async function getOrganizerReviews(params = {}) {
  return (await http.get("/reviews/organizer", { params })).data;
}
async function updateReview(id, data) {
  return (await http.put(`/reviews/${id}`, data)).data;
}
async function deleteReview(id) {
  return (await http.delete(`/reviews/${id}`)).data;
}

/* ================= PROFILE ================= */
async function getMyProfile() { return (await http.get("/me")).data; }
async function updateMyProfile(data) {
  return (await http.put("/me", data)).data;
}
async function changeMyPassword(data) {
  return (await http.put("/me/password", data)).data;
}

/* ================= CATEGORIES ================= */
async function getCategories() {
  const res = await http.get("/categories");
  const raw = res.data?.data ?? res.data;
  return Array.isArray(raw) ? raw : [];
}
async function createCategory(data) {
  return (await http.post("/categories", data)).data;
}
async function updateCategory(id, data) {
  return (await http.put(`/categories/${id}`, data)).data;
}
async function deleteCategory(id) {
  return (await http.delete(`/categories/${id}`)).data;
}

/* ================= USERS ================= */
async function getUsers(params = {}) {
  return (await http.get("/users", { params })).data;
}
async function getUserById(id) { return (await http.get(`/users/${id}`)).data; }
async function updateUserRole(id, role) {
  return (await http.put(`/users/${id}/role`, { role })).data;
}
async function updateUserStatus(id, status) {
  return (await http.patch(`/users/${id}/status`, { status })).data;
}
async function deleteUser(id) {
  return (await http.delete(`/users/${id}`)).data;
}

/* ================= DASHBOARD ================= */
async function getAdminDashboard() {
  return (await http.get("/dashboard/admin")).data;
}
async function getOrganizerDashboard() {
  return (await http.get("/dashboard/organizer")).data;
}
async function getOrganizerRevenueReport(params = {}) {
  return (await http.get("/dashboard/organizer/revenue", { params })).data;
}

/* ================= SETTLEMENTS (BARU) ================= */
async function getSettlements(params = {}) {
  return (await http.get("/settlements", { params })).data;
}
async function getSettlementById(id) {
  return (await http.get(`/settlements/${id}`)).data;
}
async function updateSettlementStatus(id, status) {
  return (await http.patch(`/settlements/${id}/status`, { status })).data;
}
async function generateSettlements(data) {
  return (await http.post("/settlements/generate", data)).data;
}
async function getPlatformFee() {
  return (await http.get("/settlements/fee")).data;
}
async function updatePlatformFee(fee_percent) {
  return (await http.put("/settlements/fee", { fee_percent })).data;
}
async function getMySettlements() {
  return (await http.get("/settlements/me")).data;
}

/* ================= AUDIT LOGS (BARU) ================= */
async function getAuditLogs(params = {}) {
  return (await http.get("/audit-logs", { params })).data;
}
async function createAuditLog(data) {
  return (await http.post("/audit-logs", data)).data;
}

export const api = {
  login, register,
  getEvents, getFeaturedEvents, getEventById, getMyOrganizedEvents,
  createEvent, updateEvent, deleteEvent, moderateEventStatus,
  getTicketTypesByEvent, createTicketType, updateTicketType, deleteTicketType,
  getMyTickets, getTicketById, getAllTickets, checkInTicket, checkInByCode,
  checkout, getMyOrders, getOrderById, checkPaymentStatus, cancelMyOrder,
  getOrganizerOrders, getAllOrders, updateOrderStatus,
  getMyFavorites, toggleFavorite, removeFavorite,
  getMyNotifications, markNotificationRead, markAllNotificationsRead,
  getMyReviews, createReview, getReviewsByEvent, getOrganizerReviews,
  updateReview, deleteReview,
  getMyProfile, updateMyProfile, changeMyPassword,
  getCategories, createCategory, updateCategory, deleteCategory,
  getUsers, getUserById, updateUserRole, updateUserStatus, deleteUser,
  getAdminDashboard, getOrganizerDashboard, getOrganizerRevenueReport,
  // Baru:
  getSettlements, getSettlementById, updateSettlementStatus,
  generateSettlements, getPlatformFee, updatePlatformFee, getMySettlements,
  getAuditLogs, createAuditLog,
};

export { http };
export default api;