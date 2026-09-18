// src/controllers/dashboardController.js
const prisma = require("../database");

/**
 * Admin: Pemantauan Performa Platform
 * Memantau statistik penggunaan aplikasi secara keseluruhan guna menjaga kestabilan & kualitas layanan.
 */
async function getAdminDashboardStats(req, res) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const [
    totalEvents,
    approvedEvents,
    pendingEvents,
    rejectedEvents,
    totalUsers,
    usersByRole,
    totalOrders,
    paidOrdersToday,
    pendingOrders,
    cancelledOrders,
    totalTicketsSold,
    revenueAgg,
    todayRevenueAgg,
    recentOrders,
    topEvents,
  ] = await Promise.all([
    prisma.event.count(),
    prisma.event.count({ where: { status: "approved" } }),
    prisma.event.count({ where: { status: "pending" } }),
    prisma.event.count({ where: { status: "rejected" } }),
    prisma.user.count(),
    prisma.role.findMany({
      select: {
        name: true,
        _count: { select: { users: true } },
      },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "paid", paid_at: { gte: startOfToday } } }),
    prisma.order.count({ where: { status: "pending" } }),
    prisma.order.count({ where: { status: "cancelled" } }),
    prisma.ticket.count({ where: { status: { not: "cancelled" } } }),
    prisma.order.aggregate({
      where: { status: "paid" },
      _sum: { total: true },
    }),
    prisma.order.aggregate({
      where: { status: "paid", paid_at: { gte: startOfToday } },
      _sum: { total: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { created_at: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true } },
        event: { select: { id: true, title: true } },
        ticket_type: { select: { id: true, name: true } },
      },
    }),
    prisma.event.findMany({
      where: { status: "approved" },
      take: 5,
      orderBy: { orders: { _count: "desc" } },
      select: {
        id: true,
        title: true,
        artist: true,
        city: true,
        _count: { select: { orders: true, tickets: true, reviews: true } },
      },
    }),
  ]);

  const userStats = {};
  usersByRole.forEach((r) => {
    userStats[r.name] = r._count.users;
  });

  return res.json({
    message: "success",
    data: {
      overview: {
        totalUsers,
        totalEvents,
        totalOrders,
        totalTicketsSold,
        totalRevenue: revenueAgg._sum.total ?? 0,
        todayRevenue: todayRevenueAgg._sum.total ?? 0,
        paidOrdersToday,
        pendingOrders,
        cancelledOrders,
      },
      events_breakdown: {
        total: totalEvents,
        approved: approvedEvents,
        pending_moderation: pendingEvents,
        rejected: rejectedEvents,
      },
      users_breakdown: userStats,
      recent_transactions: recentOrders,
      top_performing_events: topEvents,
    },
    ok: true,
  });
}

/**
 * Penyelenggara: Dashboard Penjualan
 * Memantau progres penjualan tiket secara real-time melalui tampilan terpusat.
 */
async function getOrganizerDashboardStats(req, res) {
  const organizerId = req.user.id;

  const events = await prisma.event.findMany({
    where: { organizer_id: organizerId },
    include: {
      ticket_types: true,
      _count: {
        select: {
          orders: true,
          tickets: true,
          reviews: true,
        },
      },
    },
    orderBy: { created_at: "desc" },
  });

  const eventIds = events.map((e) => e.id);

  const [ordersAgg, paidOrdersCount, pendingOrdersCount, ticketsCount] = await Promise.all([
    prisma.order.aggregate({
      where: {
        event_id: { in: eventIds },
        status: "paid",
      },
      _sum: { total: true },
    }),
    prisma.order.count({
      where: { event_id: { in: eventIds }, status: "paid" },
    }),
    prisma.order.count({
      where: { event_id: { in: eventIds }, status: "pending" },
    }),
    prisma.ticket.count({
      where: { event_id: { in: eventIds }, status: { not: "cancelled" } },
    }),
  ]);

  let totalQuota = 0;
  let totalSold = 0;

  const eventProgress = events.map((event) => {
    let eQuota = 0;
    let eSold = 0;
    event.ticket_types.forEach((tt) => {
      eQuota += tt.quota;
      eSold += tt.sold;
    });

    totalQuota += eQuota;
    totalSold += eSold;

    const fillRate = eQuota > 0 ? Number(((eSold / eQuota) * 100).toFixed(1)) : 0;

    return {
      id: event.id,
      title: event.title,
      artist: event.artist,
      status: event.status,
      event_date: event.event_date,
      total_quota: eQuota,
      total_sold: eSold,
      available_quota: Math.max(0, eQuota - eSold),
      fill_percentage: fillRate,
      ticket_types: event.ticket_types.map((tt) => ({
        id: tt.id,
        name: tt.name,
        type: tt.type,
        price: tt.price,
        quota: tt.quota,
        sold: tt.sold,
        remaining: Math.max(0, tt.quota - tt.sold),
      })),
    };
  });

  return res.json({
    message: "success",
    data: {
      summary: {
        total_events: events.length,
        total_revenue: ordersAgg._sum.total ?? 0,
        total_tickets_sold: totalSold,
        total_quota: totalQuota,
        remaining_quota: Math.max(0, totalQuota - totalSold),
        overall_sales_rate: totalQuota > 0 ? Number(((totalSold / totalQuota) * 100).toFixed(1)) : 0,
        paid_orders_count: paidOrdersCount,
        pending_orders_count: pendingOrdersCount,
      },
      events: eventProgress,
    },
    ok: true,
  });
}

/**
 * Penyelenggara: Laporan Pendapatan (Revenue Report)
 * Mengakses ringkasan dan rincian pendapatan dari penjualan tiket untuk mendukung keputusan bisnis.
 */
async function getOrganizerRevenueReport(req, res) {
  const organizerId = req.user.id;
  const { event_id, start_date, end_date } = req.query;

  const whereEvent = { organizer_id: organizerId };
  if (event_id) whereEvent.id = Number(event_id);

  const myEvents = await prisma.event.findMany({
    where: whereEvent,
    select: { id: true, title: true, artist: true, event_date: true },
  });

  const myEventIds = myEvents.map((e) => e.id);

  const orderWhere = {
    event_id: { in: myEventIds },
    status: "paid",
  };

  if (start_date || end_date) {
    orderWhere.paid_at = {};
    if (start_date) orderWhere.paid_at.gte = new Date(start_date);
    if (end_date) orderWhere.paid_at.lte = new Date(end_date);
  }

  const [orders, revenueAgg] = await Promise.all([
    prisma.order.findMany({
      where: orderWhere,
      orderBy: { paid_at: "desc" },
      include: {
        event: { select: { id: true, title: true } },
        ticket_type: { select: { id: true, name: true, type: true, price: true } },
        user: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.order.aggregate({
      where: orderWhere,
      _sum: {
        subtotal: true,
        tax: true,
        total: true,
      },
      _count: { id: true },
    }),
  ]);

  // Breakdown per event
  const revenueByEvent = {};
  myEvents.forEach((ev) => {
    revenueByEvent[ev.id] = {
      event_id: ev.id,
      title: ev.title,
      artist: ev.artist,
      total_transactions: 0,
      tickets_sold: 0,
      revenue: 0,
    };
  });

  orders.forEach((o) => {
    if (revenueByEvent[o.event_id]) {
      revenueByEvent[o.event_id].total_transactions += 1;
      revenueByEvent[o.event_id].tickets_sold += o.quantity;
      revenueByEvent[o.event_id].revenue += Number(o.total);
    }
  });

  return res.json({
    message: "success",
    data: {
      summary: {
        total_revenue: revenueAgg._sum.total ?? 0,
        total_subtotal: revenueAgg._sum.subtotal ?? 0,
        total_tax: revenueAgg._sum.tax ?? 0,
        total_paid_orders: revenueAgg._count.id ?? 0,
      },
      breakdown_by_event: Object.values(revenueByEvent),
      transactions: orders,
    },
    ok: true,
  });
}

module.exports = {
  getAdminDashboardStats,
  getOrganizerDashboardStats,
  getOrganizerRevenueReport,
};
