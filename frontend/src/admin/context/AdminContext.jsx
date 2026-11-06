import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { api } from "../../api/index";

const AdminContext = createContext(null);

const unwrapArray = (res) => {
  const raw = res?.data?.data ?? res?.data ?? res;
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.data)) return raw.data;
  if (Array.isArray(raw?.users)) return raw.users;
  return [];
};

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const getRoleName = (user) => {
  const raw =
    user.role_name ?? user.roleName ?? user.role_relation?.name ??
    user.roles?.name ?? user.role;
  if (raw && typeof raw === "object") return raw.name;
  return raw;
};

const isOrganizerRole = (name) =>
  ["penyelenggara", "organizer"].includes(String(name || "").toLowerCase());

const eventStatusMap = {
  approved: "published",
  pending: "pending",
  rejected: "rejected",
  cancelled: "cancelled",
  deleted: "deleted",
};

export function AdminProvider({ children }) {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [issuedTickets, setIssuedTickets] = useState([]);
  const [settlements, setSettlements] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [platformFee, setPlatformFee] = useState(5);
  const [notifications, setNotifications] = useState([]); 
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    try {
      const res = await api.getAdminDashboard();
      setStats(res?.data ?? null);
    } catch (err) {
      console.error("Gagal memuat dashboard admin", err);
    }
  }, []);

  const loadUsers = useCallback(async () => {
    try {
      const res = await api.getUsers();
      setUsers(unwrapArray(res));
    } catch (err) {
      console.error("Gagal memuat users", err);
    }
  }, []);

  const loadEvents = useCallback(async () => {
    try {
      const res = await api.getEvents({ status: "all" });
      setEvents(Array.isArray(res) ? res : unwrapArray(res));
    } catch (err) {
      console.error("Gagal memuat events", err);
    }
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const res = await api.getAllOrders();
      setOrders(unwrapArray(res));
    } catch (err) {
      console.error("Gagal memuat orders", err);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      const res = await api.getOrganizerReviews();
      setReviews(unwrapArray(res));
    } catch (err) {
      console.error("Gagal memuat reviews", err);
    }
  }, []);

  const loadTickets = useCallback(async () => {
    try {
      const res = await api.getAllTickets();
      setIssuedTickets(unwrapArray(res));
    } catch (err) {
      console.error("Gagal memuat tickets", err);
    }
  }, []);

  const loadSettlements = useCallback(async () => {
    try {
      const res = await api.getSettlements();
      setSettlements(unwrapArray(res));
    } catch (err) {
      console.error("Gagal memuat settlements", err);
    }
  }, []);

  const loadPlatformFee = useCallback(async () => {
    try {
      const res = await api.getPlatformFee();
      setPlatformFee(Number(res?.data?.fee_percent ?? 5));
    } catch (err) {
      console.error("Gagal memuat fee", err);
    }
  }, []);

  const loadAuditLogs = useCallback(async () => {
    try {
      const res = await api.getAuditLogs();
      setAuditLogs(unwrapArray(res));
    } catch (err) {
      console.error("Gagal memuat audit log", err);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([
        loadDashboard(), loadUsers(), loadEvents(), loadOrders(),
        loadReviews(), loadTickets(), loadSettlements(), loadPlatformFee(), loadAuditLogs()
      ]);
      setLoading(false);
    };
    init();
  }, [loadDashboard, loadUsers, loadEvents, loadOrders, loadReviews, loadTickets, loadSettlements, loadPlatformFee, loadAuditLogs]);

  const logAudit = useCallback(async (action, target) => {
    try {
      await api.createAuditLog({ action, target: String(target || "-") });
      await loadAuditLogs();
    } catch (err) {
      console.error("Gagal menulis audit log", err);
    }
  }, [loadAuditLogs]);

  const revenueByEvent = useMemo(() => {
    const map = {};
    orders.forEach((o) => {
      if (o.status === "paid") {
        const key = o.event_id ?? o.event?.id;
        map[key] = (map[key] || 0) + Number(o.total || 0);
      }
    });
    return map;
  }, [orders]);

  const concerts = useMemo(
    () => events.map((e) => {
      const types = e.ticket_types || [];
      return {
        id: e.id, name: e.title,
        organizer: e.organizer?.organization_name || e.organizer?.name || "-",
        location: [e.venue, e.city].filter(Boolean).join(", "),
        date: formatDate(e.event_date),
        ticketsSold: types.reduce((s, t) => s + (t.sold || 0), 0),
        capacity: types.reduce((s, t) => s + (t.quota || 0), 0),
        revenue: revenueByEvent[e.id] || 0,
        status: eventStatusMap[e.status] || e.status,
      };
    }), [events, revenueByEvent]
  );

  const organizers = useMemo(
    () => users.filter((u) => isOrganizerRole(getRoleName(u))).map((user) => {
      const owned = events.filter((e) => (e.organizer_id ?? e.organizer?.id) === user.id);
      const ticketsSold = owned.reduce((sum, e) => sum + (e.ticket_types || []).reduce((i, t) => i + (t.sold || 0), 0), 0);
      const revenue = owned.reduce((s, e) => s + (revenueByEvent[e.id] || 0), 0);
      return {
        id: user.id, name: user.organization_name || user.name,
        email: user.email, status: user.status || "active",
        concerts: owned.length, ticketsSold, revenue,
      };
    }), [users, events, revenueByEvent]
  );

  const eventLabel = (id) => events.find((e) => String(e.id) === String(id))?.title || `Event #${id}`;
  const userLabel = (id) => {
    const u = users.find((x) => String(x.id) === String(id));
    return u ? u.organization_name || u.name : `User #${id}`;
  };
  const orderLabel = (id) => {
    const o = orders.find((x) => String(x.id) === String(id));
    return o ? o.order_code || o.invoice_id : `Order #${id}`;
  };

  const approveEvent = async (id) => {
    await api.moderateEventStatus(id, { status: "approved" });
    await logAudit("Approve Concert", eventLabel(id));
    await loadEvents(); await loadDashboard();
  };

  const rejectEvent = async (id, reason = "") => {
    await api.moderateEventStatus(id, { status: "rejected", reject_reason: reason });
    await logAudit("Reject Concert", eventLabel(id));
    await loadEvents(); await loadDashboard();
  };

  const cancelEvent = async (id) => {
    await api.moderateEventStatus(id, { status: "rejected", reject_reason: "Dibatalkan Admin" });
    await logAudit("Cancel Concert", eventLabel(id));
    await loadEvents(); await loadDashboard();
  };

  const deleteEvent = async (id) => {
    await api.deleteEvent(id);
    await logAudit("Soft Delete Concert", eventLabel(id));
    await loadEvents(); await loadDashboard();
  };

  const softDeleteEvent = deleteEvent;

  const suspendUser = async (id) => {
    await api.updateUserStatus(id, "suspended");
    await logAudit("Suspend User", userLabel(id));
    await loadUsers();
  };

  const activateUser = async (id) => {
    await api.updateUserStatus(id, "active");
    await logAudit("Activate User", userLabel(id));
    await loadUsers();
  };

  const changeUserRole = async (id, role) => {
    await api.updateUserRole(id, role);
    await logAudit("Change User Role", `${userLabel(id)} - ${role}`);
    await loadUsers();
  };

  const updateOrderStatus = async (id, status) => {
    await api.updateOrderStatus(id, { status });
    let action = "Update Order Status";
    if (status === "refunded") action = "Refund Transaction";
    if (status === "cancelled") action = "Cancel Transaction";
    await logAudit(action, orderLabel(id));
    await loadOrders();
  };

  const deleteReview = async (id) => {
    await api.deleteReview(id);
    await logAudit("Delete Review", `Review #${id}`);
    await loadReviews();
  };

  const updateReviewStatus = async (id, status) => {
    if (status === "hidden") deleteReview(id);
  };

  // --- FUNGSI SETTLEMENTS YANG SEBELUMNYA HILANG ---
  const handleUpdateSettlementStatus = async (id, status) => {
    try {
      await api.updateSettlementStatus(id, status);
      await loadSettlements();
      logAudit("Update Settlement Status", `Settlement #${id} → ${status}`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleUpdatePlatformFee = async (feePercent) => {
    try {
      await api.updatePlatformFee(feePercent);
      await loadPlatformFee();
      await loadSettlements();
      logAudit("Update Platform Fee", `${feePercent}%`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const handleGenerateSettlements = async (year, month) => {
    try {
      await api.generateSettlements({ year, month });
      await loadSettlements();
      logAudit("Generate Settlements", `Periode ${month}/${year}`);
    } catch (err) {
      console.error(err);
      throw err;
    }
  };
  // ------------------------------------------------

  const addNotification = ({ title, message, status }) => {
    const entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title, message, status: status === "published" ? "published" : "draft",
      createdAt: new Date().toLocaleString("id-ID"),
    };
    setNotifications((cur) => [entry, ...cur]);
  };

  const deleteNotification = (id) => {
    setNotifications((cur) => cur.filter((n) => n.id !== id));
  };

  const value = {
    loading, stats, users, events, orders, reviews, issuedTickets, settlements,
    notifications, auditLogs, platformFee, concerts, organizers,
    
    approveEvent, rejectEvent, cancelEvent, deleteEvent, softDeleteEvent,
    suspendUser, activateUser, changeUserRole,
    updateOrderStatus, deleteReview, updateReviewStatus,
    
    // Didaftarkan di sini agar bisa dipakai di komponen
    handleUpdateSettlementStatus, 
    handleUpdatePlatformFee, 
    handleGenerateSettlements,
    
    addNotification, deleteNotification, logAudit, addAuditLog: logAudit,
    
    tickets: events.flatMap((e) => (e.ticket_types || []).map((t) => ({
      id: `TT-${t.id}`, typeId: t.id, eventId: e.id, event: e.title,
      category: t.name, price: Number(t.price), quota: t.quota, sold: t.sold,
      checkedIn: 0, status: "active"
    }))),

    getEventById: (id) => events.find((e) => String(e.id) === String(id)),
    getOrderById: (id) => orders.find((o) => String(o.id) === String(id)),
    reload: { dashboard: loadDashboard, users: loadUsers, events: loadEvents, orders: loadOrders, reviews: loadReviews, tickets: loadTickets, settlements: loadSettlements, platformFee: loadPlatformFee, auditLogs: loadAuditLogs },
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin harus digunakan di dalam AdminProvider");
  return ctx;
}
export default AdminContext;