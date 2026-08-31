// src/controllers/orderController.js
const prisma = require("../database");
const { calculateOrderTotal } = require("../utils/calculateOrder");
const {
  generateOrderCode,
  generateInvoiceId,
  generateTicketCode,
  buildQrCodeUrl,
} = require("../utils/generateCode");
const { useNotifications } = require("../utils/useNotification");

const orderInclude = {
  event: {
    include: {
      category: true,
      organizer: {
        select: { id: true, name: true, organization_name: true, email: true },
      },
    },
  },
  ticket_type: true,
  tickets: true,
  user: {
    select: { id: true, name: true, email: true, phone_number: true },
  },
};

/**
 * Checkout Pemesanan Tiket:
 * - Memvalidasi ketersediaan event & status event ('approved')
 * - Memvalidasi kuota tiket
 * - Menyimpan order dan tiket digital ber-QR Code
 * - Mengirimkan notifikasi pembayaran & booking konfirmasi
 */
async function checkout(req, res) {
  const { event_id, ticket_type_id, quantity, payment_method } = req.body;

  const event = await prisma.event.findUnique({ where: { id: event_id } });
  if (!event) {
    return res.status(404).json({ message: "Event tidak ditemukan", ok: false });
  }

  if (event.status !== "approved") {
    return res.status(400).json({
      message: "Event ini belum dibuka untuk pemesanan tiket umum",
      ok: false,
    });
  }

  const ticketType = await prisma.ticketType.findUnique({ where: { id: ticket_type_id } });
  if (!ticketType || ticketType.event_id !== event_id) {
    return res
      .status(404)
      .json({ message: "Jenis tiket tidak ditemukan untuk event ini", ok: false });
  }

  if (ticketType.quota > 0 && ticketType.sold + quantity > ticketType.quota) {
    return res.status(400).json({ message: "Kuota tiket tidak mencukupi", ok: false });
  }

  const { subtotal, tax, total } = calculateOrderTotal(Number(ticketType.price), quantity);

  const order = await prisma.$transaction(async (tx) => {
    const newOrder = await tx.order.create({
      data: {
        order_code: generateOrderCode(),
        invoice_id: generateInvoiceId(),
        user_id: req.user.id,
        event_id,
        ticket_type_id,
        quantity,
        subtotal,
        tax,
        total,
        payment_method,
        status: "paid", // Simulasi pembayaran instan terintegrasi
        paid_at: new Date(),
      },
    });

    const ticketsData = Array.from({ length: quantity }).map(() => {
      const ticketCode = generateTicketCode();
      return {
        ticket_code: ticketCode,
        order_id: newOrder.id,
        user_id: req.user.id,
        event_id,
        ticket_type_id,
        seat: "General Admission",
        status: "upcoming",
        qr_code_url: buildQrCodeUrl(ticketCode),
      };
    });

    await tx.ticket.createMany({ data: ticketsData });

    await tx.ticketType.update({
      where: { id: ticket_type_id },
      data: { sold: { increment: quantity } },
    });

    return newOrder;
  });

  // Notifikasi otomatis kepada pembeli
  await useNotifications(req.user.id, [
    {
      title: "Pembayaran Berhasil",
      message: `Pembayaran sebesar Rp ${Number(total).toLocaleString("id-ID")} melalui ${payment_method.toUpperCase()} untuk "${event.title}" telah diterima.`,
      type: "payment",
    },
    {
      title: "E-Tiket Siap Digunakan",
      message: `${quantity} E-Tiket untuk konser "${event.title}" telah diterbitkan dengan QR Code unik.`,
      type: "booking",
    },
  ]);

  // Notifikasi ke penyelenggara bahwa ada tiket terjual
  if (event.organizer_id) {
    await prisma.notification.create({
      data: {
        user_id: event.organizer_id,
        title: "Penjualan Tiket Baru!",
        message: `${quantity} tiket ${ticketType.name} terjual untuk konser "${event.title}". Total: Rp ${Number(total).toLocaleString("id-ID")}`,
        type: "booking",
      },
    });
  }

  const data = await prisma.order.findUnique({
    where: { id: order.id },
    include: orderInclude,
  });

  return res.status(201).json({ message: "Checkout berhasil", data, ok: true });
}

/** Riwayat transaksi milik user login */
async function getMyOrders(req, res) {
  const data = await prisma.order.findMany({
    where: { user_id: req.user.id },
    orderBy: { created_at: "desc" },
    include: orderInclude,
  });

  return res.json({ message: "success", data, ok: true });
}

/** Detail pesanan / invoice */
async function getOrderById(req, res) {
  const id = Number(req.params.id);

  const data = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });

  if (!data) {
    return res.status(404).json({ message: "Order tidak ditemukan", ok: false });
  }

  const isOwner = data.user_id === req.user.id;
  const isOrganizer = req.user.role === "Penyelenggara" && data.event.organizer_id === req.user.id;
  const isAdmin = req.user.role === "Admin";

  if (!isOwner && !isOrganizer && !isAdmin) {
    return res.status(403).json({ message: "Akses ditolak", ok: false });
  }

  return res.json({ message: "success", data, ok: true });
}

/** Penyelenggara: melihat daftar transaksi khusus untuk event yang diselenggarakannya */
async function getOrganizerOrders(req, res) {
  const { event_id, status } = req.query;

  const where = {
    event: {
      organizer_id: req.user.id,
      id: event_id ? Number(event_id) : undefined,
    },
    status: status || undefined,
  };

  const data = await prisma.order.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: orderInclude,
  });

  return res.json({ message: "success", data, ok: true });
}

/**
 * Admin: Monitoring Keamanan Transaksi Platform
 * Mengawasi transaksi pembayaran dan tiket untuk mendeteksi indikasi kecurangan / aktivitas mencurigakan.
 */
async function getAllOrders(req, res) {
  const { status, payment_method, search, event_id, date_from, date_to } = req.query;

  const where = {};

  if (status) where.status = status;
  if (payment_method) where.payment_method = payment_method;
  if (event_id) where.event_id = Number(event_id);

  if (date_from || date_to) {
    where.created_at = {};
    if (date_from) where.created_at.gte = new Date(date_from);
    if (date_to) where.created_at.lte = new Date(date_to);
  }

  if (search) {
    where.OR = [
      { order_code: { contains: search, mode: "insensitive" } },
      { invoice_id: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
      { event: { title: { contains: search, mode: "insensitive" } } },
    ];
  }

  const data = await prisma.order.findMany({
    where,
    orderBy: { created_at: "desc" },
    include: orderInclude,
  });

  return res.json({ message: "success", data, ok: true });
}

/** Admin: Update status order / transaksi (misal: cancel / refund jika ada kecurangan) */
async function updateOrderStatus(req, res) {
  const id = Number(req.params.id);
  const { status, reason } = req.body;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { tickets: true, event: true },
  });

  if (!order) {
    return res.status(404).json({ message: "Order tidak ditemukan", ok: false });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updatedOrder = await tx.order.update({
      where: { id },
      data: { status },
      include: orderInclude,
    });

    // Jika transaksi dibatalkan / gagal, batalkan tiket terkait & kurangi quota sold
    if (status === "cancelled" || status === "failed") {
      await tx.ticket.updateMany({
        where: { order_id: id },
        data: { status: "cancelled" },
      });

      if (order.status === "paid") {
        await tx.ticketType.update({
          where: { id: order.ticket_type_id },
          data: { sold: { decrement: order.quantity } },
        });
      }
    }

    return updatedOrder;
  });

  // Notifikasi perubahan status transaksi kepada user
  await prisma.notification.create({
    data: {
      user_id: order.user_id,
      title: `Status Transaksi Diperbarui: ${status.toUpperCase()}`,
      message: `Status pemesanan ${order.order_code} untuk "${order.event.title}" diubah menjadi ${status}. ${reason ? `Alasan: ${reason}` : ""}`,
      type: "payment",
    },
  });

  return res.json({ message: `Status order berhasil diubah menjadi ${status}`, data: updated, ok: true });
}

module.exports = {
  checkout,
  getMyOrders,
  getOrderById,
  getOrganizerOrders,
  getAllOrders,
  updateOrderStatus,
};
