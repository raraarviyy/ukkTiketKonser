// src/config/midtrans.js
const midtransClient = require("midtrans-client");

const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";
const serverKey = process.env.MIDTRANS_SERVER_KEY || "SB-Mid-server-demo-key";
const clientKey = process.env.MIDTRANS_CLIENT_KEY || "SB-Mid-client-demo-key";

// Inisialisasi Snap Client untuk Midtrans Sandbox / Production
const snap = new midtransClient.Snap({
  isProduction,
  serverKey,
  clientKey,
});

// Inisialisasi Core API Client (untuk cek status transaksi, cancel, refund, dll)
const coreApi = new midtransClient.CoreApi({
  isProduction,
  serverKey,
  clientKey,
});

module.exports = {
  snap,
  coreApi,
  isProduction,
  serverKey,
  clientKey,
};
