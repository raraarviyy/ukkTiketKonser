<<<<<<< HEAD
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
=======
# Tiket Konser API (Multi-Role: User, Admin, Penyelenggara)

API **Tiket Konser** dengan **Express.js + Prisma + PostgreSQL**, ditulis dalam **JavaScript murni** (CommonJS), dengan dukungan 3 Role lengkap: **User (Penonton)**, **Admin (Administrator Platform)**, dan **Penyelenggara (Event Organizer)**, serta terintegrasi dengan **Midtrans Payment Gateway (Sandbox Mode)**.

---

## 🚀 Setup & Instalasi

```bash
npm install
cp .env.example .env      # Sesuaikan DATABASE_URL, JWT_SECRET, & MIDTRANS Sandbox Keys

npm run db:generate       # Generate Prisma Client
npm run db:push           # Jalankan sinkronisasi database (atau npm run db:migrate)
npm run db:seed           # Seed 3 Role, Kategori, Akun Default, Event, & Sample Reviews

npm run dev               # Berjalan di http://localhost:5000
```

### 🔑 Akun Default (Hasil Seeding)

| Email | Password | Role | Keterangan |
| :--- | :--- | :--- | :--- |
| `admin@tiketkonser.local` | `Admin123!` | **Admin** | Administrator Platform |
| `organizer@tiketkonser.local` | `Organizer123!` | **Penyelenggara** | SoundPulse Organizer |
| `user@tiketkonser.local` | `User123!` | **User** | Akun Penonton / Pembeli |

---

## 💳 Konfigurasi Midtrans Payment Gateway (Sandbox)

Tambahkan konfigurasi Midtrans Anda di file `.env`:

```env
# Midtrans Payment Gateway Configuration (Sandbox Mode)
MIDTRANS_SERVER_KEY="SB-Mid-server-xxxxxxxxxxxxxx"
MIDTRANS_CLIENT_KEY="SB-Mid-client-xxxxxxxxxxxxxx"
MIDTRANS_IS_PRODUCTION=false
MIDTRANS_MERCHANT_ID=""

# Frontend URL Callback Redirects (Opsional)
MIDTRANS_FINISH_URL="http://localhost:3000/orders/finish"
MIDTRANS_ERROR_URL="http://localhost:3000/orders/error"
MIDTRANS_PENDING_URL="http://localhost:3000/orders/pending"
```

> **Catatan Midtrans Sandbox**:
> 1. Dapatkan Server Key & Client Key dari [Midtrans Sandbox Dashboard](https://dashboard.sandbox.midtrans.com) (Menu *Settings* > *Access Keys*).
> 2. Untuk pengetesan webhook notifikasi saat pengembangan lokal, atur *Payment Notification URL* di Midtrans Dashboard ke URL ngrok atau tunnel Anda: `https://<your-ngrok-subdomain>.ngrok-free.app/api/orders/notification`.

---

## 🎭 Fitur Berdasarkan 3 Role

### 1. 👤 Role: User (Penonton)
- **Pencarian & Filter Konser**: Temukan event berdasarkan genre musik, nama kota, tanggal acara (`startDate`/`endDate`/`event_date`), nama artis/band, serta kata kunci pencarian.
- **Pemesanan Tiket & Midtrans Snap**: Memilih kategori tiket (VIP, Reguler, Early Bird, dsb.) dengan validasi kuota real-time dan mendapatkan `snap_token` serta `snap_redirect_url`.
- **Beragam Metode Pembayaran**: QRIS, GoPay, ShopeePay, Virtual Account Bank (BCA, Mandiri, BNI, BRI, Permata), Kartu Kredit/Debit, dan Minimarket via antarmuka Midtrans Snap.
- **Sinkronisasi Status Pembayaran**: Sinkronisasi status instan dari Midtrans ke sistem via endpoint `/api/orders/:id/check-payment` dan Midtrans Webhook.
- **E-Tiket QR Code**: Tiket digital unik diterbitkan otomatis setelah pembayaran berstatus `paid` lengkap dengan QR Code per lembar tiket.
- **Notifikasi & Pengingat**: Pemberitahuan otomatis saat tagihan dibuat, konfirmasi pembayaran berhasil, penerbitan tiket, dan pembaruan transaksi.
- **Riwayat Transaksi**: Rekam jejak transaksi pemesanan tiket (`/api/orders/me`) dan koleksi e-tiket (`/api/tickets/me`).
- **Rating & Ulasan**: Memberikan skor bintang (1-5) dan review untuk event yang telah dibeli tiketnya.

### 2. 🛡️ Role: Admin (Pengelola Platform)
- **Verifikasi & Moderasi Event**: Memeriksa, menyetujui (`approved`), atau menolak (`rejected`) event baru yang diajukan oleh penyelenggara sebelum tayang ke publik.
- **Manajemen Akun Pengguna**: Mengelola data user & penyelenggara, ubah role pengguna, dan moderasi status akun (`active`, `suspended`, `inactive`).
- **Monitoring Keamanan Transaksi**: Memantau seluruh transaksi dan riwayat pembayaran lintas event, deteksi anomali, serta intervensi status transaksi.
- **Pemantauan Performa Platform**: Dashboard analitik platform (total user by role, total event by status, total omzet/GMV, tiket terjual, dan event terpopuler).

### 3. 🎪 Role: Penyelenggara (Event Organizer)
- **Dashboard Penjualan**: Memantau progres penjualan tiket dan tingkat keterisian kuota secara real-time.
- **Manajemen Event**: Membuat dan mengelola event (jadwal, venue, deskripsi, tag, dan lineup artis) yang otomatis diajukan ke admin untuk verifikasi.
- **Pengaturan Kategori & Kuota Tiket**: Menentukan kategori tiket (VIP, Regular, dsb.), harga tiket, benefit fasilitas, serta kuota penjualan.
- **Laporan Pendapatan**: Rekapitulasi pendapatan kotor, pajak, total omzet per event maupun per rentang waktu.
- **Manajemen Ulasan**: Melihat skor rating dan ulasan penonton untuk evaluasi kualitas acara berikutnya.
- **Validasi & Check-in QR Tiket**: Scanner tiket pengunjung di lokasi acara via kode unik tiket (`ticket_code`).

---

## 📡 Ringkasan Endpoint API (Prefix `/api`)

### 🔐 Autentikasi (`/api/auth`)
- `POST /auth/register` — Daftar akun baru (Role: `User` atau `Penyelenggara`)
- `POST /auth/login` — Login akun, menghasilkan JWT Bearer Token

### 👤 Profil Akun (`/api/me`)
- `GET /me` — Profil user login
- `PUT /me` — Update nama, email, foto profil
- `PUT /me/password` — Ubah password akun

### 👥 Manajemen Akun Pengguna (`/api/users`) — *Admin Only*
- `GET /users` — List semua pengguna (Filter: `?role=&status=&search=`)
- `GET /users/:id` — Detail pengguna + statistik
- `PUT /users/:id/role` — Ubah role (`User`, `Admin`, `Penyelenggara`)
- `PATCH /users/:id/status` — Ubah status akun (`active`, `suspended`, `inactive`)
- `DELETE /users/:id` — Hapus akun pengguna

### 🎸 Event & Konser (`/api/events`)
- `GET /events` — Publik: List event (Filter: `?search=&artist=&city=&category=&event_date=&minPrice=&maxPrice=&status=`)
- `GET /events/my-events` — Penyelenggara: List event yang diselenggarakannya
- `GET /events/:id` — Detail lengkap event
- `POST /events` — Penyelenggara/Admin: Buat event baru (Penyelenggara status default `pending`)
- `PUT /events/:id` — Penyelenggara/Admin: Perbarui event miliknya
- `PATCH /events/:id/status` — Admin: Moderasi event (`approved` / `rejected`)
- `DELETE /events/:id` — Penyelenggara/Admin: Hapus event

### 🏷️ Kategori & Genre (`/api/categories`)
- `GET /categories` — Publik: Daftar kategori konser
- `POST/PUT/DELETE /categories` — Admin: Kelola kategori

### 🎫 Jenis & Kuota Tiket (`/api/events/:eventId/ticket-types` & `/api/ticket-types/:id`)
- `GET /events/:eventId/ticket-types` — Publik: Jenis tiket per event
- `POST /events/:eventId/ticket-types` — Penyelenggara/Admin: Tambah jenis tiket & kuota
- `PUT /ticket-types/:id` — Penyelenggara/Admin: Edit harga/kuota/benefit tiket
- `DELETE /ticket-types/:id` — Penyelenggara/Admin: Hapus jenis tiket

### 💳 Pemesanan & Pembayaran Midtrans (`/api/orders`)
- `POST /orders/checkout` — User: Checkout tiket & buat token Midtrans Snap
  ```json
  // Request Body
  {
    "event_id": 1,
    "ticket_type_id": 2,
    "quantity": 2
  }
  // Response Data
  {
    "message": "Checkout berhasil, silakan selesaikan pembayaran via Midtrans",
    "data": {
      "order": { "id": 1, "order_code": "ORD-12345678", "total": "440.00", "status": "pending", ... },
      "snap_token": "xxx-xxx-xxx",
      "snap_redirect_url": "https://app.sandbox.midtrans.com/snap/v2/vtweb/xxx-xxx-xxx",
      "client_key": "SB-Mid-client-xxx"
    },
    "ok": true
  }
  ```
- `POST /orders/notification` — **Publik / Midtrans Webhook**: Menerima notifikasi status dari Midtrans (dengan validasi SHA512 signature).
- `GET /orders/:id/check-payment` — User/Admin: Cek dan sinkronkan status transaksi langsung ke Midtrans.
- `POST /orders/:id/cancel` — User: Batalkan pesanan pending.
- `GET /orders/me` — User: Riwayat transaksi sendiri.
- `GET /orders/organizer` — Penyelenggara: Rekap transaksi tiket event miliknya.
- `GET /orders/:id` — Detail pesanan / invoice.
- `GET /orders` — Admin: Monitoring keamanan transaksi platform.
- `PATCH /orders/:id/status` — Admin: Intervensi status transaksi.

### 🎟️ Tiket & QR Code Scanner (`/api/tickets`)
- `GET /tickets/me` — User: Koleksi e-tiket ber-QR Code (`?status=upcoming|used|expired|cancelled`)
- `POST /tickets/check-in` — Penyelenggara/Admin: Scan QR code tiket di lokasi konser via `ticket_code`
- `PUT /tickets/:id/check-in` — Penyelenggara/Admin: Check-in tiket by ID
- `GET /tickets/:id` — Detail e-tiket
- `GET /tickets` — Penyelenggara/Admin: Daftar tiket

### ⭐ Rating & Ulasan (`/api/reviews`)
- `GET /reviews/events/:eventId` — Publik: Daftar rating & ulasan per event
- `GET /reviews/me` — User: Daftar ulasan yang pernah dibuat
- `GET /reviews/organizer` — Penyelenggara: Rekap ulasan & evaluasi kepuasan penonton
- `POST /reviews` — User: Berikan rating & ulasan (validasi pernah membeli tiket)
- `PUT /reviews/:id` — User: Ubah rating & ulasan
- `DELETE /reviews/:id` — User/Admin: Hapus ulasan

### 🔔 Notifikasi (`/api/notifications`)
- `GET /notifications` — List notifikasi user login
- `PUT /notifications/:id/read` — Tandai notifikasi dibaca
- `PUT /notifications/read-all` — Tandai semua dibaca

### 📊 Dashboard & Laporan (`/api/dashboard`)
- `GET /dashboard/admin` — Admin: Pemantauan performa & statistik platform komprehensif
- `GET /dashboard/organizer` — Penyelenggara: Dashboard penjualan tiket real-time
- `GET /dashboard/organizer/revenue` — Penyelenggara: Laporan pendapatan & omzet per event
<<<<<<< HEAD
>>>>>>> 70336ce (first commit)
=======

---

## 💻 Panduan Integrasi Frontend dengan Midtrans Snap

1. Muat script Snap JS di HTML atau komponen React:
```html
<script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key="YOUR_CLIENT_KEY"></script>
```

2. Panggil popup Snap setelah checkout:
```javascript
// Setelah memanggil API POST /api/orders/checkout
const { snap_token } = response.data;

window.snap.pay(snap_token, {
  onSuccess: function(result) {
    console.log("Pembayaran Berhasil:", result);
    // Refresh / redirect ke halaman tiket atau panggil /api/orders/:id/check-payment
  },
  onPending: function(result) {
    console.log("Menunggu Pembayaran:", result);
  },
  onError: function(result) {
    console.error("Pembayaran Gagal:", result);
  },
  onClose: function() {
    console.log("Pengguna menutup popup tanpa menyelesaikan pembayaran");
  }
});
```
>>>>>>> 0a976b7 (first commit)
