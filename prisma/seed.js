// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Memulai proses seeding...");

  // 1. ROLES (User, Admin, Penyelenggara)
  const roleNames = ["User", "Admin", "Penyelenggara"];
  const roleMap = {};
  for (const name of roleNames) {
    const role = await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    roleMap[name] = role.id;
  }
  console.log("Roles berhasil di-seed: User, Admin, Penyelenggara.");

  // 2. CATEGORIES
  const categoryNames = ["Concert", "Festival", "Acoustic", "EDM", "Indie", "Jazz", "Pop", "Rock"];
  const categoryMap = {};
  for (const name of categoryNames) {
    const category = await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    categoryMap[name] = category.id;
  }
  console.log("Kategori berhasil di-seed.");

  // 3. AKUN DEFAULT
  const defaultUsers = [
    {
      name: "Super Admin",
      email: "admin@tiketkonser.local",
      password: "Admin123!",
      role: "Admin",
      organization_name: "Tiket Konser Platform",
      phone_number: "081234567890",
    },
    {
      name: "SoundPulse Organizer",
      email: "organizer@tiketkonser.local",
      password: "Organizer123!",
      role: "Penyelenggara",
      organization_name: "SoundPulse Events Management",
      phone_number: "081298765432",
    },
    {
      name: "Demo User",
      email: "user@tiketkonser.local",
      password: "User123!",
      role: "User",
      phone_number: "081345678901",
    },
  ];

  const userRecords = {};
  for (const u of defaultUsers) {
    const hashedPassword = await bcrypt.hash(u.password, 10);
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: {
        role: roleMap[u.role],
        organization_name: u.organization_name || null,
        phone_number: u.phone_number || null,
      },
      create: {
        name: u.name,
        email: u.email,
        password: hashedPassword,
        role: roleMap[u.role],
        organization_name: u.organization_name || null,
        phone_number: u.phone_number || null,
        status: "active",
      },
    });
    userRecords[u.role] = user;
  }
  console.log("Akun default 3 role berhasil di-seed.");

  const organizerUser = userRecords["Penyelenggara"];
  const regularUser = userRecords["User"];

  // 4. EVENTS + TICKET TYPES
  const events = [
    {
      title: "Neon Pulse Tour 2026",
      artist: "Cyber Pulse & Friends",
      venue: "Cyber Arena, Tokyo",
      city: "Tokyo",
      address: "1-1-1 Ariake, Koto City, Tokyo 135-0063, Japan",
      latitude: 35.6298,
      longitude: 139.7942,
      event_date: new Date("2026-10-24T19:00:00Z"),
      doors_open: "19:00 PM",
      show_starts: "20:30 PM",
      age_limit: "18+",
      category: "Concert",
      organizer_id: organizerUser.id,
      status: "approved",
      image:
        "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
      description:
        "Saksikan pertunjukan musik futuristik paling dinanti tahun ini bersama Cyber Pulse & Friends di Cyber Arena, Tokyo.",
      tag: "LIVE EXPERIENCE",
      secondary_tag: "SELLING FAST",
      ticket_types: [
        {
          type: "regular",
          name: "Regular Pass",
          price: 89,
          badge: "General Admission",
          benefits: ["Akses Area Regular", "Standard Sound Zone", "E-Ticket QR Code"],
          quota: 500,
        },
        {
          type: "vip",
          name: "VIP Pulse Pass",
          price: 180,
          badge: "VIP Front Zone",
          benefits: [
            "Akses Panggung Utama (Front Stage)",
            "Jalur Antrean Khusus (Fast Track)",
            "Paket Exclusive Merchandise",
            "Free Drink Voucher",
          ],
          quota: 100,
        },
      ],
    },
    {
      title: "Summer Solstice Fest",
      artist: "Various Artists",
      venue: "SoFi Stadium, LA",
      city: "Los Angeles",
      address: "1001 Stadium Dr, Inglewood, CA 90301, USA",
      latitude: 33.9535,
      longitude: -118.3392,
      event_date: new Date("2026-07-22T16:00:00Z"),
      doors_open: "16:00 PM",
      show_starts: "17:30 PM",
      age_limit: "All Ages",
      category: "Festival",
      organizer_id: organizerUser.id,
      status: "approved",
      image:
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
      description:
        "Festival musik musim panas terbesar di Los Angeles, menampilkan puluhan artis papan atas di 3 panggung megah.",
      tag: "EXCLUSIVE",
      secondary_tag: "HOT SALE",
      ticket_types: [
        {
          type: "regular",
          name: "Regular Fest Pass",
          price: 125,
          badge: "General Admission",
          benefits: ["Akses Semua Panggung Festival", "Akses Food & Beverage Area", "E-Ticket Pass"],
          quota: 800,
        },
        {
          type: "vip",
          name: "VIP Super Pass",
          price: 250,
          badge: "VIP Deck",
          benefits: [
            "Akses VIP Lounge & Private Bar",
            "Viewing Deck Dekat Panggung",
            "Akses Pintu Masuk Prioritas",
            "Exclusive Fest Lanyard",
          ],
          quota: 150,
        },
      ],
    },
    {
      title: "Rock Revolution",
      artist: "Thunder Reign",
      venue: "The O2 Arena, London",
      city: "London",
      address: "Peninsula Square, London SE10 0DX, UK",
      latitude: 51.503,
      longitude: 0.0032,
      event_date: new Date("2026-10-30T19:00:00Z"),
      doors_open: "18:00 PM",
      show_starts: "19:00 PM",
      age_limit: "16+",
      category: "Rock",
      organizer_id: organizerUser.id,
      status: "approved",
      image:
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80",
      description:
        "Thunder Reign kembali menggelegar dengan tur dunia terbarunya di The O2 Arena, London.",
      tag: "ARENA TOUR",
      secondary_tag: "BEST SELLER",
      ticket_types: [
        {
          type: "regular",
          name: "Standing GA",
          price: 99,
          badge: "General Admission",
          benefits: ["Akses Standing Floor", "Poster Eksklusif Tur", "E-Ticket QR Code"],
          quota: 600,
        },
        {
          type: "vip",
          name: "VIP Pit Pass",
          price: 200,
          badge: "Front Pit",
          benefits: [
            "Akses Pit Terdepan",
            "Early Entry & Soundcheck",
            "Exclusive Merch Bundle",
            "Laminate VIP Pass",
          ],
          quota: 80,
        },
      ],
    },
    {
      title: "Indie Acoustic Night",
      artist: "Luna Echoes",
      venue: "Grand Theater, Jakarta",
      city: "Jakarta",
      address: "Jl. Sudirman No. 45, Jakarta Pusat",
      latitude: -6.2088,
      longitude: 106.8456,
      event_date: new Date("2026-11-15T19:30:00Z"),
      doors_open: "18:30 PM",
      show_starts: "19:30 PM",
      age_limit: "All Ages",
      category: "Acoustic",
      organizer_id: organizerUser.id,
      status: "pending", // Contoh event pending menunggu moderasi admin
      image:
        "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
      description:
        "Malam akustik penuh kehangatan bersama Luna Echoes membawakan lagu-lagu hits terfavorit.",
      tag: "INTIMATE CONCERT",
      secondary_tag: "NEW SUBMISSION",
      ticket_types: [
        {
          type: "regular",
          name: "Early Bird Seat",
          price: 50,
          badge: "Standard Seat",
          benefits: ["Akses Duduk Regular", "Free Sticker Pack"],
          quota: 200,
        },
      ],
    },
  ];

  for (const e of events) {
    const existing = await prisma.event.findFirst({ where: { title: e.title } });
    if (existing) {
      await prisma.event.update({
        where: { id: existing.id },
        data: { organizer_id: e.organizer_id, status: e.status },
      });
      continue;
    }

    const { ticket_types, category, ...eventData } = e;
    await prisma.event.create({
      data: {
        ...eventData,
        category_id: categoryMap[category],
        ticket_types: { create: ticket_types },
      },
    });
  }
  console.log("✅ Event contoh & ticket types berhasil di-seed.");

  // 5. SAMPLE REVIEWS
  const firstEvent = await prisma.event.findFirst({ where: { status: "approved" } });
  if (firstEvent && regularUser) {
    await prisma.review.upsert({
      where: {
        user_id_event_id: {
          user_id: regularUser.id,
          event_id: firstEvent.id,
        },
      },
      update: {},
      create: {
        user_id: regularUser.id,
        event_id: firstEvent.id,
        rating: 5,
        comment: "Konser luar biasa! Sound system jernih dan tata panggung sangat memukau!",
      },
    });
    console.log("✅ Review contoh berhasil di-seed.");
  }

  // 6. SAMPLE NOTIFICATION
  if (regularUser) {
    await prisma.notification.create({
      data: {
        user_id: regularUser.id,
        title: "Selamat Datang di Tiket Konser!",
        message: "Temukan konser impianmu dan nikmati kemudahan transaksi e-tiket dengan QR Code.",
        type: "system",
      },
    });
    console.log("✅ Notifikasi selamat datang berhasil di-seed.");
  }

  console.log("\n🚀 SEED SELESAI!");
  console.log("🔑 Akun Login Default 3 Role:");
  for (const u of defaultUsers) {
    console.log(`   - [${u.role}] : ${u.email} / ${u.password}`);
  }
}

main()
  .catch((e) => {
    console.error("Terjadi error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
