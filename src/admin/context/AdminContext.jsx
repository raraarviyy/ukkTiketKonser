import React, { createContext, useContext, useMemo, useState } from "react";

const AdminContext = createContext(null);

const initialUsers = [
  {
    id: 1,
    name: "Rizky Pratama",
    email: "rizky@example.com",
    role: "User",
    status: "active",
    joinedAt: "2026-08-21",
  },
  {
    id: 2,
    name: "Nadia Putri",
    email: "nadia@example.com",
    role: "User",
    status: "active",
    joinedAt: "2026-08-20",
  },
  {
    id: 3,
    name: "Andi Saputra",
    email: "andi@example.com",
    role: "Organizer",
    status: "active",
    joinedAt: "2026-08-19",
  },
  {
    id: 4,
    name: "Salsa Event",
    email: "salsa@example.com",
    role: "Organizer",
    status: "suspended",
    joinedAt: "2026-08-18",
  },
  {
    id: 5,
    name: "Dimas Ramadhan",
    email: "dimas@example.com",
    role: "User",
    status: "active",
    joinedAt: "2026-08-17",
  },
];

const initialOrganizers = [
  {
    id: 1,
    name: "Soundwave Organizer",
    email: "soundwave@example.com",
    status: "active",
    concerts: 18,
    ticketsSold: 4280,
    revenue: 428000000,
  },
  {
    id: 2,
    name: "Nusantara Event",
    email: "nusantara@example.com",
    status: "active",
    concerts: 12,
    ticketsSold: 3180,
    revenue: 312000000,
  },
  {
    id: 3,
    name: "Urban Stage",
    email: "urbanstage@example.com",
    status: "pending",
    concerts: 4,
    ticketsSold: 920,
    revenue: 86000000,
  },
  {
    id: 4,
    name: "Live Project",
    email: "liveproject@example.com",
    status: "suspended",
    concerts: 7,
    ticketsSold: 1200,
    revenue: 110000000,
  },
];

const initialEvents = [
  {
    id: 1,
    name: "Soundwave Festival 2026",
    organizer: "Soundwave Organizer",
    date: "2026-09-20",
    location: "Jakarta International Expo",
    status: "published",
    ticketsSold: 4200,
    capacity: 5000,
    revenue: 420000000,
  },
  {
    id: 2,
    name: "Nusantara Music Night",
    organizer: "Nusantara Event",
    date: "2026-10-05",
    location: "Istora Senayan",
    status: "pending",
    ticketsSold: 0,
    capacity: 3500,
    revenue: 0,
  },
  {
    id: 3,
    name: "Urban Beats Jakarta",
    organizer: "Urban Stage",
    date: "2026-09-28",
    location: "Beach City Stadium",
    status: "pending",
    ticketsSold: 0,
    capacity: 2500,
    revenue: 0,
  },
  {
    id: 4,
    name: "Live Project Vol. 4",
    organizer: "Live Project",
    date: "2026-08-30",
    location: "The Hall Senayan",
    status: "published",
    ticketsSold: 1800,
    capacity: 2200,
    revenue: 180000000,
  },
  {
    id: 5,
    name: "Jakarta Indie Fest",
    organizer: "Soundwave Organizer",
    date: "2026-11-12",
    location: "Basket Hall Senayan",
    status: "rejected",
    ticketsSold: 0,
    capacity: 3000,
    revenue: 0,
  },
  {
    id: 6,
    name: "Harmony Festival",
    organizer: "Nusantara Event",
    date: "2026-12-10",
    location: "ICE BSD",
    status: "published",
    ticketsSold: 2900,
    capacity: 4000,
    revenue: 290000000,
  },
];

const initialTransactions = [
  {
    id: "INV-2026-001",
    buyer: "Rizky Pratama",
    event: "Soundwave Festival 2026",
    amount: 150000,
    status: "paid",
    paymentMethod: "QRIS",
    createdAt: "2026-09-03 18:30",
  },
  {
    id: "INV-2026-002",
    buyer: "Nadia Putri",
    event: "Soundwave Festival 2026",
    amount: 150000,
    status: "paid",
    paymentMethod: "Bank Transfer",
    createdAt: "2026-09-03 17:45",
  },
  {
    id: "INV-2026-003",
    buyer: "Dimas Ramadhan",
    event: "Live Project Vol. 4",
    amount: 100000,
    status: "pending",
    paymentMethod: "E-Wallet",
    createdAt: "2026-09-03 17:10",
  },
  {
    id: "INV-2026-004",
    buyer: "Sinta Maharani",
    event: "Harmony Festival",
    amount: 200000,
    status: "paid",
    paymentMethod: "QRIS",
    createdAt: "2026-09-03 16:55",
  },
  {
    id: "INV-2026-005",
    buyer: "Bagas Wijaya",
    event: "Soundwave Festival 2026",
    amount: 150000,
    status: "refunded",
    paymentMethod: "QRIS",
    createdAt: "2026-09-03 16:20",
  },
];

const initialTickets = [
  {
    id: "TKT-001",
    event: "Soundwave Festival 2026",
    category: "VIP",
    price: 150000,
    quota: 1000,
    sold: 920,
    checkedIn: 740,
    status: "active",
  },
  {
    id: "TKT-002",
    event: "Soundwave Festival 2026",
    category: "Regular",
    price: 80000,
    quota: 4000,
    sold: 3280,
    checkedIn: 2650,
    status: "active",
  },
  {
    id: "TKT-003",
    event: "Live Project Vol. 4",
    category: "Festival",
    price: 100000,
    quota: 2200,
    sold: 1800,
    checkedIn: 1420,
    status: "active",
  },
  {
    id: "TKT-004",
    event: "Harmony Festival",
    category: "Regular",
    price: 100000,
    quota: 4000,
    sold: 2900,
    checkedIn: 0,
    status: "active",
  },
];

const initialNotifications = [
  {
    id: 1,
    title: "Maintenance Platform",
    message: "Platform akan melakukan maintenance pada pukul 02:00 WIB.",
    status: "published",
    createdAt: "2026-09-03",
  },
  {
    id: 2,
    title: "Kebijakan Refund Baru",
    message: "Kebijakan refund terbaru telah diterapkan.",
    status: "draft",
    createdAt: "2026-09-02",
  },
];

const initialReviews = [
  {
    id: 1,
    user: "Rizky Pratama",
    event: "Soundwave Festival 2026",
    rating: 5,
    comment: "Event sangat bagus dan proses pembelian tiket cepat.",
    status: "published",
    createdAt: "2026-09-03",
  },
  {
    id: 2,
    user: "Nadia Putri",
    event: "Live Project Vol. 4",
    rating: 2,
    comment: "Antrean masuk cukup lama.",
    status: "published",
    createdAt: "2026-09-02",
  },
];

const initialAuditLogs = [
  {
    id: 1,
    actor: "Super Admin",
    action: "Approve Concert",
    target: "Soundwave Festival 2026",
    createdAt: "2026-09-03 18:10",
  },
  {
    id: 2,
    actor: "Super Admin",
    action: "Suspend Organizer",
    target: "Live Project",
    createdAt: "2026-09-03 15:42",
  },
  {
    id: 3,
    actor: "Super Admin",
    action: "Refund Transaction",
    target: "INV-2026-005",
    createdAt: "2026-09-03 14:25",
  },
];

const monthlySales = [
  {
    month: "Apr",
    revenue: 185000000,
    sales: 2140,
  },
  {
    month: "Mei",
    revenue: 248000000,
    sales: 2980,
  },
  {
    month: "Jun",
    revenue: 312000000,
    sales: 3650,
  },
  {
    month: "Jul",
    revenue: 428000000,
    sales: 4890,
  },
  {
    month: "Agu",
    revenue: 510000000,
    sales: 5820,
  },
  {
    month: "Sep",
    revenue: 640000000,
    sales: 7240,
  },
];

export function AdminProvider({ children }) {
  const [users, setUsers] = useState(initialUsers);
  const [organizers, setOrganizers] = useState(initialOrganizers);
  const [events, setEvents] = useState(initialEvents);
  const [transactions, setTransactions] = useState(initialTransactions);
  const [tickets, setTickets] = useState(initialTickets);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [reviews, setReviews] = useState(initialReviews);
  const [auditLogs, setAuditLogs] = useState(initialAuditLogs);
  const [platformFee, setPlatformFee] = useState(5);
  const [loading] = useState(false);

  const stats = useMemo(() => {
    const totalRevenue = events.reduce(
      (total, event) => total + event.revenue,
      0
    );

    const totalTicketsSold = events.reduce(
      (total, event) => total + event.ticketsSold,
      0
    );

    const totalCapacity = events.reduce(
      (total, event) => total + event.capacity,
      0
    );

    const gmv = totalRevenue;

    const platformRevenue = Math.round((gmv * platformFee) / 100);

    const refundTransactions = transactions.filter(
      (transaction) => transaction.status === "refunded"
    );

    const refundAmount = refundTransactions.reduce(
      (total, transaction) => total + transaction.amount,
      0
    );

    const paidTransactions = transactions.filter(
      (transaction) => transaction.status === "paid"
    );

    const pendingEvents = events.filter(
      (event) => event.status === "pending"
    );

    const eventSales = events
      .filter((event) => event.ticketsSold > 0)
      .sort((a, b) => b.ticketsSold - a.ticketsSold)
      .slice(0, 6)
      .map((event) => ({
        name:
          event.name.length > 22
            ? `${event.name.substring(0, 22)}...`
            : event.name,
        sold: event.ticketsSold,
      }));

    const totalCheckedIn = tickets.reduce(
      (total, ticket) => total + ticket.checkedIn,
      0
    );

    return {
      totalUsers: users.length,
      totalOrganizers: organizers.length,
      totalEvents: events.length,
      totalTicketsSold,
      totalCapacity,
      totalRevenue,
      gmv,
      platformRevenue,
      refundAmount,
      settlement: Math.max(gmv - platformRevenue - refundAmount, 0),
      pendingEvents: pendingEvents.length,
      paidTransactions: paidTransactions.length,
      pendingTransactions: transactions.filter(
        (transaction) => transaction.status === "pending"
      ).length,
      cancelledTransactions: transactions.filter(
        (transaction) => transaction.status === "cancelled"
      ).length,
      totalCheckedIn,
      monthlySales,
      eventSales,
    };
  }, [users, organizers, events, transactions, tickets, platformFee]);

  const approveOrganizer = (id) => {
    setOrganizers((current) =>
      current.map((organizer) =>
        organizer.id === id
          ? { ...organizer, status: "active" }
          : organizer
      )
    );

    addAuditLog("Approve Organizer", `Organizer #${id}`);
  };

  const suspendOrganizer = (id) => {
    setOrganizers((current) =>
      current.map((organizer) =>
        organizer.id === id
          ? { ...organizer, status: "suspended" }
          : organizer
      )
    );

    addAuditLog("Suspend Organizer", `Organizer #${id}`);
  };

  const activateOrganizer = (id) => {
    setOrganizers((current) =>
      current.map((organizer) =>
        organizer.id === id
          ? { ...organizer, status: "active" }
          : organizer
      )
    );

    addAuditLog("Activate Organizer", `Organizer #${id}`);
  };

  const approveEvent = (id) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? { ...event, status: "published" }
          : event
      )
    );

    addAuditLog("Approve Concert", `Concert #${id}`);
  };

  const rejectEvent = (id) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? { ...event, status: "rejected" }
          : event
      )
    );

    addAuditLog("Reject Concert", `Concert #${id}`);
  };

  const cancelEvent = (id) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? { ...event, status: "cancelled" }
          : event
      )
    );

    addAuditLog("Cancel Concert", `Concert #${id}`);
  };

  const softDeleteEvent = (id) => {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? { ...event, status: "deleted" }
          : event
      )
    );

    addAuditLog("Soft Delete Concert", `Concert #${id}`);
  };

  const suspendUser = (id) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, status: "suspended" } : user
      )
    );

    addAuditLog("Suspend User", `User #${id}`);
  };

  const activateUser = (id) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, status: "active" } : user
      )
    );

    addAuditLog("Activate User", `User #${id}`);
  };

  const changeUserRole = (id, role) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === id ? { ...user, role } : user
      )
    );

    addAuditLog("Change User Role", `User #${id} → ${role}`);
  };

  const refundTransaction = (id) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === id
          ? { ...transaction, status: "refunded" }
          : transaction
      )
    );

    addAuditLog("Refund Transaction", id);
  };

  const cancelTransaction = (id) => {
    setTransactions((current) =>
      current.map((transaction) =>
        transaction.id === id
          ? { ...transaction, status: "cancelled" }
          : transaction
      )
    );

    addAuditLog("Cancel Transaction", id);
  };

  const cancelTicket = (id) => {
    setTickets((current) =>
      current.map((ticket) =>
        ticket.id === id
          ? { ...ticket, status: "cancelled" }
          : ticket
      )
    );

    addAuditLog("Cancel Ticket", id);
  };

  const updatePlatformFee = (fee) => {
    const numericFee = Number(fee);

    if (Number.isNaN(numericFee)) {
      return;
    }

    if (numericFee < 0 || numericFee > 100) {
      return;
    }

    setPlatformFee(numericFee);

    addAuditLog("Update Platform Fee", `${numericFee}%`);
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      createdAt: new Date().toISOString().split("T")[0],
    };

    setNotifications((current) => [newNotification, ...current]);

    addAuditLog("Create Announcement", notification.title);
  };

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter((notification) => notification.id !== id)
    );

    addAuditLog("Delete Announcement", `Notification #${id}`);
  };

  const updateReviewStatus = (id, status) => {
    setReviews((current) =>
      current.map((review) =>
        review.id === id ? { ...review, status } : review
      )
    );

    addAuditLog("Update Review", `Review #${id}`);
  };

  function addAuditLog(action, target) {
    const newLog = {
      id: Date.now(),
      actor: "Super Admin",
      action,
      target,
      createdAt: new Date().toLocaleString("id-ID"),
    };

    setAuditLogs((current) => [newLog, ...current]);
  }

  const getEventById = (id) => {
    return events.find((event) => String(event.id) === String(id));
  };

  const getOrganizerById = (id) => {
    return organizers.find(
      (organizer) => String(organizer.id) === String(id)
    );
  };

  const getTransactionById = (id) => {
    return transactions.find(
      (transaction) => String(transaction.id) === String(id)
    );
  };

  const getTicketById = (id) => {
    return tickets.find(
      (ticket) => String(ticket.id) === String(id)
    );
  };

  const value = {
    loading,

    stats,

    users,
    setUsers,

    organizers,
    setOrganizers,

    events,
    setEvents,

    transactions,
    setTransactions,

    tickets,
    setTickets,

    notifications,
    setNotifications,

    reviews,
    setReviews,

    auditLogs,
    setAuditLogs,

    platformFee,

    approveOrganizer,
    suspendOrganizer,
    activateOrganizer,

    approveEvent,
    rejectEvent,
    cancelEvent,
    softDeleteEvent,

    suspendUser,
    activateUser,
    changeUserRole,

    refundTransaction,
    cancelTransaction,

    cancelTicket,

    updatePlatformFee,

    addNotification,
    deleteNotification,

    updateReviewStatus,

    addAuditLog,

    getEventById,
    getOrganizerById,
    getTransactionById,
    getTicketById,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAdmin harus digunakan di dalam AdminProvider");
  }

  return context;
}

export default AdminContext;
