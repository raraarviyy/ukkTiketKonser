// src/utils/generateCode.js

/** Kode order unik, mis. ORD-83920174 */
function generateOrderCode() {
  const random = Math.floor(10000000 + Math.random() * 90000000);
  return `ORD-${random}`;
}

/** Nomor invoice unik, mis. INV/20261024/TK/482013 */
function generateInvoiceId() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const random = Math.floor(100000 + Math.random() * 900000);
  return `INV/${yyyy}${mm}${dd}/TK/${random}`;
}

/** Kode tiket unik per lembar tiket, mis. TKT-58201934 */
function generateTicketCode() {
  const random = Math.floor(10000000 + Math.random() * 90000000);
  return `TKT-${random}`;
}

/** URL QR code (pakai layanan publik qrserver, sama seperti di frontend) */
function buildQrCodeUrl(data) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    data
  )}`;
}

module.exports = { generateOrderCode, generateInvoiceId, generateTicketCode, buildQrCodeUrl };
