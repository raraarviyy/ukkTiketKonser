// src/utils/calculateOrder.js

const TAX_RATE = 0.1; // 10% service fee/tax, sama seperti simulasi di frontend

/** Menghitung subtotal, pajak/service fee (10%), dan total dari harga tiket & jumlah */
function calculateOrderTotal(price, quantity) {
  const subtotal = Math.round(price * quantity * 100) / 100;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + tax) * 100) / 100;
  return { subtotal, tax, total };
}

module.exports = { calculateOrderTotal };
