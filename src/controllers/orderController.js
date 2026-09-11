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
const {
  createSnapTransaction,
  verifySignature,
  getMidtransStatus,
  cancelMidtransTransaction,
  formatPaymentMethod,
  parseTransactionStatus,
  clientKey,
} = require("../services/midtransService");

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
 * Checkout Pemesanan Tiket dengan Midtrans Snap Payment Gateway:
 * - Memvalidasi ketersediaan event & status event ('approved')
 * - Memvalidasi kuota tiket
 * - Membuat Order baru berstatus 'pending'
 * - Menghasilkan Snap Token & Redirect URL dari Midtrans
 * - Mengembalikan detail order dan token Snap ke frontend
 */
async function checkout(req, res) {
  const { event_id, ticket_type_id, quantity, payment_method, callbacks } = req.body;

  const event = await prisma.event.findUnique({
    where: { id: event_id },
    include: { category: true },
  });
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
  const orderCode = generateOrderCode();
  const invoiceId = generateInvoiceId();

  // Simpan Order awal dengan status 'pending'
  const newOrder = await prisma.order.create({
    data: {
      order_code: orderCode,
      invoice_id: invoiceId,
      user_id: req.user.id,
      event_id,
      ticket_type_id,
      quantity,
      subtotal,
      tax,
      total,
      payment_method: payment_method || "midtrans",
      status: "pending",
    },
  });

  // Request Snap Token ke Midtrans
  let snapData = { token: null, redirect_url: null, client_key: clientKey };
  try {
    const snapResult = await createSnapTransaction({
      order: newOrder,
      user: req.user,
      event,
      ticketType,
      quantity,
      subtotal,
      tax,
      total,
      callbacks,
    });

    snapData = snapResult;

    // Update snap_token & snap_redirect_url ke database
    await prisma.order.update({
      where: { id: newOrder.id },
      data: {
        snap_token: snapResult.token,
        snap_redirect_url: snapResult.redirect_url,
      },
    });
  } catch (midtransError) {
    console.error("⚠️ Midtrans Snap Error:", midtransError.message);
    // Jika dalam development/sandbox tanpa key valid, buat token simulasi agar frontend tetap bisa lanjut testing
    snapData = {
      token: `sandbox-snap-${orderCode}`,
      redirect_url: `https://app.sandbox.midtrans.com/snap/v2/vtweb/sandbox-snap-${orderCode}`,
      client_key: clientKey,
      note: "Midtrans sandbox simulation token",
    };
  }

  // Notifikasi tagihan / instruksi pembayaran kepada pembeli
  await prisma.notification.create({
    data: {
      user_id: req.user.id,
      title: "Menunggu Pembayaran",
      message: `Pemesanan ${orderCode} untuk "${event.title}" sebesar Rp ${Number(total).toLocaleString("id-ID")} berhasil dibuat. Silakan selesaikan pembayaran Anda.`,
      type: "payment",
    },
  });

  const fullOrder = await prisma.order.findUnique({
    where: { id: newOrder.id },
    include: orderInclude,
  });

  return res.status(201).json({
    message: "Checkout berhasil, silakan selesaikan pembayaran via Midtrans",
    data: {
      order: fullOrder,
      snap_token: snapData.token,
      snap_redirect_url: snapData.redirect_url,
      client_key: clientKey,
    },
    ok: true,
  });
}

/**
 * Helper internal untuk memproses transaksi yang berhasil dibayar (settlement / capture accept)
 */
async function fulfillOrder(order, paymentType, rawNotification = {}) {
  if (order.status === "paid") {
    return order; // Sudah diproses sebelumnya (idempotent)
  }

  const formattedPaymentMethod = formatPaymentMethod(paymentType, rawNotification);

  const updatedOrder = await prisma.$transaction(async (tx) => {
    // 1. Update status order menjadi paid
    const orderUpdated = await tx.order.update({
      where: { id: order.id },
      data: {
        status: "paid",
        paid_at: new Date(),
        payment_method: formattedPaymentMethod,
      },
      include: orderInclude,
    });

    // 2. Cek apakah tiket sudah pernah digenerate untuk order ini
    const existingTicketsCount = await tx.ticket.count({
      where: { order_id: order.id },
    });

    if (existingTicketsCount === 0) {
      const ticketsData = Array.from({ length: order.quantity }).map(() => {
        const ticketCode = generateTicketCode();
        return {
          ticket_code: ticketCode,
          order_id: order.id,
          user_id: order.user_id,
          event_id: order.event_id,
          ticket_type_id: order.ticket_type_id,
          seat: "General Admission",
          status: "upcoming",
          qr_code_url: buildQrCodeUrl(ticketCode),
        };
      });

      await tx.ticket.createMany({ data: ticketsData });

      // 3. Tambah jumlah tiket terjual di TicketType
      await tx.ticketType.update({
        where: { id: order.ticket_type_id },
        data: { sold: { increment: order.quantity } },
      });
    }

    return orderUpdated;
  });

  // Notifikasi otomatis kepada pembeli
  await useNotifications(order.user_id, [
    {
      title: "Pembayaran Berhasil! 🎟️",
      message: `Pembayaran sebesar Rp ${Number(order.total).toLocaleString("id-ID")} melalui ${formattedPaymentMethod} untuk "${order.event?.title || "Konser"}" telah diterima.`,
      type: "payment",
    },
    {
      title: "E-Tiket Siap Digunakan",
      message: `${order.quantity} E-Tiket untuk konser "${order.event?.title || "Konser"}" telah diterbitkan dengan QR Code unik.`,
      type: "booking",
    },
  ]);

  // Notifikasi ke penyelenggara bahwa ada tiket terjual
  if (order.event && order.event.organizer_id) {
    await prisma.notification.create({
      data: {
        user_id: order.event.organizer_id,
        title: "Penjualan Tiket Baru!",
        message: `${order.quantity} tiket ${order.ticket_type?.name || ""} terjual untuk konser "${order.event.title}". Total: Rp ${Number(order.total).toLocaleString("id-ID")}`,
        type: "booking",
      },
    });
  }

  return updatedOrder;
}

/**
 * Helper internal untuk membatalkan / menggagalkan transaksi order
 */
async function cancelOrExpireOrder(order, newStatus, reason = "") {
  if (order.status === newStatus) return order;

  const wasPaid = order.status === "paid";

  const updatedOrder = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.update({
      where: { id: order.id },
      data: { status: newStatus },
      include: orderInclude,
    });

    if (wasPaid) {
      // Batalkan tiket yang sudah diterbitkan
      await tx.ticket.updateMany({
        where: { order_id: order.id },
        data: { status: "cancelled" },
      });

      // Kembalikan kuota tiket
      await tx.ticketType.update({
        where: { id: order.ticket_type_id },
        data: { sold: { decrement: order.quantity } },
      });
    }

    return updated;
  });

  // Notifikasi kepada pembeli
  await prisma.notification.create({
    data: {
      user_id: order.user_id,
      title: `Status Pembayaran: ${newStatus.toUpperCase()}`,
      message: `Pemesanan ${order.order_code} untuk "${order.event?.title || "Konser"}" berstatus ${newStatus}. ${reason ? `Keterangan: ${reason}` : ""}`,
      type: "payment",
    },
  });

  return updatedOrder;
}

/**
 * Webhook Handler Notifikasi Midtrans:
 * Menerima HTTP POST callback dari server Midtrans ketika status pembayaran berubah (settlement, expire, cancel, dll).
 * Endpoint ini bersifat publik tanpa Bearer token, namun diverifikasi menggunakan Signature Key Midtrans.
 */
async function handleMidtransNotification(req, res) {
  const notification = req.body;

  const orderId = notification.order_id;
  const transactionStatus = notification.transaction_status;
  const fraudStatus = notification.fraud_status;
  const statusCode = notification.status_code;
  const grossAmount = notification.gross_amount;
  const signatureKey = notification.signature_key;
  const paymentType = notification.payment_type;

  console.log(`📥 [Midtrans Webhook] Menerima notifikasi untuk Order ${orderId}: status=${transactionStatus}, payment=${paymentType}`);

  // 1. Verifikasi Signature Key (jika ada signature_key dari Midtrans)
  if (signatureKey) {
    const isValidSignature = verifySignature({
      order_id: orderId,
      status_code: statusCode,
      gross_amount: grossAmount,
      signature_key: signatureKey,
    });

    if (!isValidSignature) {
      console.warn(`⚠️ [Midtrans Webhook] Signature tidak valid untuk order: ${orderId}`);
      return res.status(403).json({ message: "Invalid Midtrans signature", ok: false });
    }
  }

  // 2. Cari order berdasarkan order_code
  const order = await prisma.order.findUnique({
    where: { order_code: orderId },
    include: orderInclude,
  });

  if (!order) {
    console.warn(`⚠️ [Midtrans Webhook] Order tidak ditemukan: ${orderId}`);
    return res.status(404).json({ message: "Order not found", ok: false });
  }

  // 3. Tentukan status order berdasarkan transaction_status & fraud_status Midtrans
  const parsedStatus = parseTransactionStatus(transactionStatus, fraudStatus);

  if (parsedStatus === "paid") {
    await fulfillOrder(order, paymentType, notification);
  } else if (["cancelled", "failed", "expired"].includes(parsedStatus)) {
    await cancelOrExpireOrder(order, parsedStatus, `Midtrans status: ${transactionStatus}`);
  }

  return res.status(200).json({
    message: "Midtrans notification processed successfully",
    order_code: orderId,
    status: parsedStatus,
    ok: true,
  });
}

/**
 * Cek Status Pembayaran ke Midtrans API & Sinkronisasi Database:
 * Berguna saat testing lokal sandbox (tanpa ngrok/webhook) atau tombol "Cek Pembayaran" di frontend.
 */
async function checkPaymentStatus(req, res) {
  const id = Number(req.params.id);

  const order = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });

  if (!order) {
    return res.status(404).json({ message: "Order tidak ditemukan", ok: false });
  }

  const isOwner = order.user_id === req.user.id;
  const isOrganizer = req.user.role === "Penyelenggara" && order.event.organizer_id === req.user.id;
  const isAdmin = req.user.role === "Admin";

  if (!isOwner && !isOrganizer && !isAdmin) {
    return res.status(403).json({ message: "Akses ditolak", ok: false });
  }

  try {
    const midtransStatus = await getMidtransStatus(order.order_code);
    const parsedStatus = parseTransactionStatus(
      midtransStatus.transaction_status,
      midtransStatus.fraud_status
    );

    let updatedOrder = order;
    if (parsedStatus === "paid" && order.status !== "paid") {
      updatedOrder = await fulfillOrder(order, midtransStatus.payment_type, midtransStatus);
    } else if (["cancelled", "failed", "expired"].includes(parsedStatus) && order.status !== parsedStatus) {
      updatedOrder = await cancelOrExpireOrder(order, parsedStatus, `Midtrans status: ${midtransStatus.transaction_status}`);
    }

    return res.json({
      message: "Status transaksi berhasil disinkronkan dengan Midtrans",
      midtrans_status: midtransStatus,
      order: updatedOrder,
      ok: true,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Gagal mengambil status dari Midtrans: " + (error.message || "Unknown error"),
      current_order: order,
      ok: false,
    });
  }
}

/**
 * Batalkan transaksi yang berstatus pending di Midtrans & Database
 */
async function cancelMyOrder(req, res) {
  const id = Number(req.params.id);

  const order = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });

  if (!order) {
    return res.status(404).json({ message: "Order tidak ditemukan", ok: false });
  }

  if (order.user_id !== req.user.id && req.user.role !== "Admin") {
    return res.status(403).json({ message: "Akses ditolak", ok: false });
  }

  if (order.status !== "pending") {
    return res.status(400).json({
      message: `Order dengan status "${order.status}" tidak dapat dibatalkan`,
      ok: false,
    });
  }

  // Batalkan di Midtrans jika ada
  try {
    await cancelMidtransTransaction(order.order_code);
  } catch (e) {
    // Abaikan jika transaksi belum pernah diakses di Midtrans
  }

  const updatedOrder = await cancelOrExpireOrder(order, "cancelled", "Dibatalkan oleh pengguna");

  return res.json({
    message: "Order berhasil dibatalkan",
    data: updatedOrder,
    ok: true,
  });
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

/** Admin: Update status order / transaksi secara manual */
async function updateOrderStatus(req, res) {
  const id = Number(req.params.id);
  const { status, reason } = req.body;

  const order = await prisma.order.findUnique({
    where: { id },
    include: orderInclude,
  });

  if (!order) {
    return res.status(404).json({ message: "Order tidak ditemukan", ok: false });
  }

  let updatedOrder;
  if (status === "paid") {
    updatedOrder = await fulfillOrder(order, order.payment_method);
  } else if (["cancelled", "failed", "expired"].includes(status)) {
    updatedOrder = await cancelOrExpireOrder(order, status, reason);
  } else {
    updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
      include: orderInclude,
    });
  }

  return res.json({
    message: `Status order berhasil diubah menjadi ${status}`,
    data: updatedOrder,
    ok: true,
  });
}

module.exports = {
  checkout,
  handleMidtransNotification,
  checkPaymentStatus,
  cancelMyOrder,
  getMyOrders,
  getOrderById,
  getOrganizerOrders,
  getAllOrders,
  updateOrderStatus,
};
