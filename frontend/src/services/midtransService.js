// src/services/midtransService.js
const crypto = require("crypto");
const { snap, coreApi, serverKey, clientKey, isProduction } = require("../config/midtrans");

/**
 * Membuat Transaksi Snap Token di Midtrans
 * @param {Object} params
 * @param {Object} params.order Data Order
 * @param {Object} params.user Data User Pembeli
 * @param {Object} params.event Data Event
 * @param {Object} params.ticketType Data TicketType
 * @param {number} params.quantity Jumlah tiket
 * @param {number} params.subtotal Subtotal
 * @param {number} params.tax Pajak / Biaya Layanan
 * @param {number} params.total Total pembayaran
 * @param {Object} [params.callbacks] URL callback opsional
 */
async function createSnapTransaction({
  order,
  user,
  event,
  ticketType,
  quantity,
  subtotal,
  tax,
  total,
  callbacks = {},
}) {
  const roundedTotal = Math.round(Number(total));
  const roundedPrice = Math.round(Number(ticketType.price));
  const roundedTax = Math.round(Number(tax));

  // Build item_details
  const itemDetails = [
    {
      id: `TKT-${ticketType.id}`,
      price: roundedPrice,
      quantity: Number(quantity),
      name: `${event.title} - ${ticketType.name}`.slice(0, 50),
      category: event.category?.name || "Concert Ticket",
    },
  ];

  if (roundedTax > 0) {
    itemDetails.push({
      id: "TAX-SERVICE-FEE",
      price: roundedTax,
      quantity: 1,
      name: "Pajak & Biaya Layanan",
    });
  }

  // Hitung total item agar persis sama dengan gross_amount
  const calculatedItemsTotal = itemDetails.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const parameter = {
    transaction_details: {
      order_id: order.order_code,
      gross_amount: calculatedItemsTotal || roundedTotal,
    },
    item_details: itemDetails,
    customer_details: {
      first_name: user.name,
      email: user.email,
      phone: user.phone_number || undefined,
    },
    callbacks: {
      finish: callbacks.finish || process.env.MIDTRANS_FINISH_URL,
      error: callbacks.error || process.env.MIDTRANS_ERROR_URL,
      pending: callbacks.pending || process.env.MIDTRANS_PENDING_URL,
    },
  };

  const transaction = await snap.createTransaction(parameter);
  return {
    token: transaction.token,
    redirect_url: transaction.redirect_url,
    client_key: clientKey,
  };
}

/**
 * Verifikasi signature Midtrans SHA512
 * Format: SHA512(order_id + status_code + gross_amount + ServerKey)
 */
function verifySignature({ order_id, status_code, gross_amount, signature_key }) {
  if (!order_id || !status_code || !gross_amount || !signature_key) {
    return false;
  }
  const input = `${order_id}${status_code}${gross_amount}${serverKey}`;
  const calculatedSignature = crypto.createHash("sha512").update(input).digest("hex");
  return calculatedSignature.toLowerCase() === String(signature_key).toLowerCase();
}

/**
 * Cek status transaksi langsung ke API Midtrans
 * @param {string} orderCode
 */
async function getMidtransStatus(orderCode) {
  return await snap.transaction.status(orderCode);
}

/**
 * Batalkan transaksi di Midtrans
 * @param {string} orderCode
 */
async function cancelMidtransTransaction(orderCode) {
  return await snap.transaction.cancel(orderCode);
}

/**
 * Mengubah tipe pembayaran Midtrans menjadi format yang mudah dibaca
 * @param {string} paymentType
 * @param {Object} [notificationBody]
 */
function formatPaymentMethod(paymentType, notificationBody = {}) {
  if (!paymentType) return "midtrans";

  switch (paymentType) {
    case "bank_transfer": {
      if (notificationBody.va_numbers && notificationBody.va_numbers.length > 0) {
        return `${notificationBody.va_numbers[0].bank.toUpperCase()} Virtual Account`;
      }
      if (notificationBody.permata_va_number) {
        return "Permata Virtual Account";
      }
      return "Bank Transfer";
    }
    case "echannel":
      return "Mandiri Bill Payment";
    case "credit_card":
      return "Credit Card";
    case "gopay":
      return "GoPay";
    case "qris":
      return "QRIS";
    case "shopeepay":
      return "ShopeePay";
    case "cstore":
      return notificationBody.store ? notificationBody.store.toUpperCase() : "Convenience Store";
    case "akulaku":
      return "Akulaku";
    case "kredivo":
      return "Kredivo";
    default:
      return paymentType;
  }
}

/**
 * Menerjemahkan status transaksi Midtrans ke status internal Order
 * @param {string} transactionStatus
 * @param {string} [fraudStatus]
 */
function parseTransactionStatus(transactionStatus, fraudStatus) {
  if (transactionStatus === "capture") {
    if (fraudStatus === "challenge") {
      return "pending"; // Perlu verifikasi manual fraud
    } else if (fraudStatus === "accept") {
      return "paid";
    }
    return "paid";
  } else if (transactionStatus === "settlement") {
    return "paid";
  } else if (transactionStatus === "pending") {
    return "pending";
  } else if (transactionStatus === "deny") {
    return "failed";
  } else if (transactionStatus === "expire") {
    return "expired";
  } else if (transactionStatus === "cancel") {
    return "cancelled";
  } else if (transactionStatus === "refund" || transactionStatus === "partial_refund") {
    return "refunded";
  }
  return "pending";
}

module.exports = {
  createSnapTransaction,
  verifySignature,
  getMidtransStatus,
  cancelMidtransTransaction,
  formatPaymentMethod,
  parseTransactionStatus,
  clientKey,
  serverKey,
  isProduction,
};
