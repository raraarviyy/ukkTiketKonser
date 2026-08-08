const INITIAL_EVENTS = [
  {
    id: '1',
    title: 'Neon Pulse Tour 2026',
    artist: 'Cyber Pulse & Friends',
    venue: 'Cyber Arena, Tokyo',
    city: 'Tokyo',
    address: '1-1-1 Ariake, Koto City, Tokyo 135-0063, Japan',
    lat: 35.6298,
    lng: 139.7942,
    date: 'OCT 24, 2026',
    time: '19:00 PM',
    doorsOpen: '19:00 PM',
    showStarts: '20:30 PM',
    ageLimit: '18+',
    category: 'Concert',
    price: 89,
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80',
    description: 'Saksikan pertunjukan musik futuristik paling dinanti tahun ini! Nikmati pengalaman visual neon spektakuler dan tata suara berteknologi tinggi bersama Cyber Pulse & Friends di Cyber Arena, Tokyo.',
    tag: 'LIVE EXPERIENCE',
    secondaryTag: 'SELLING FAST',
    tickets: [
      { type: 'regular', name: 'Regular Pass', price: 89, badge: 'General Admission', benefits: ['Akses Area Regular', 'Standard Sound Zone', 'E-Ticket QR Code'] },
      { type: 'vip', name: 'VIP Pulse Pass', price: 180, badge: 'VIP Front Zone', benefits: ['Akses Panggung Utama (Front Stage)', 'Jalur Antrean Khusus (Fast Track)', 'Paket Exclusive Merchandise', 'Free Drink Voucher'] }
    ]
  },
  {
    id: '2',
    title: 'Summer Solstice Fest',
    artist: 'Various Artists',
    venue: 'SoFi Stadium, LA',
    city: 'Los Angeles',
    address: '1001 Stadium Dr, Inglewood, CA 90301, USA',
    lat: 33.9535,
    lng: -118.3392,
    date: 'JUL 22, 2026',
    time: '16:00 PM',
    doorsOpen: '16:00 PM',
    showStarts: '17:30 PM',
    ageLimit: 'All Ages',
    category: 'Festival',
    price: 125,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    description: 'Festival musik musim panas terbesar di Los Angeles. Menampilkan puluhan artis papan atas internasional di 3 panggung megah secara bersamaan.',
    tag: 'EXCLUSIVE',
    secondaryTag: 'HOT SALE',
    tickets: [
      { type: 'regular', name: 'Regular Fest Pass', price: 125, badge: 'General Admission', benefits: ['Akses Semua Panggung Festival', 'Akses Food & Beverage Area', 'E-Ticket Pass'] },
      { type: 'vip', name: 'VIP Super Pass', price: 250, badge: 'VIP Deck', benefits: ['Akses VIP Lounge & Private Bar', 'Viewing Deck Dekat Panggung', 'Akses Pintu Masuk Prioritas', 'Exclusive Fest Lanyard'] }
    ]
  },
  {
    id: '3',
    title: 'Acoustic Unplugged',
    artist: 'The Unplugged Sessions',
    venue: 'Royal Albert Hall, London',
    city: 'London',
    address: 'Kensington Gore, London SW7 2AP, UK',
    lat: 51.5009,
    lng: -0.1774,
    date: 'AUG 15, 2026',
    time: '20:00 PM',
    doorsOpen: '19:30 PM',
    showStarts: '20:00 PM',
    ageLimit: '16+',
    category: 'Acoustic',
    price: 65,
    image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80',
    description: 'Nikmati suasana malam intim dan syahdu dengan lantunan instrumen akustik dari musisi-musisi ternama di gedung bersejarah Royal Albert Hall.',
    tag: 'POPULAR',
    secondaryTag: 'ALMOST SOLD OUT',
    tickets: [
      { type: 'regular', name: 'Balcony Seat', price: 65, badge: 'Numbered Seat', benefits: ['Duduk Sesuai Nomor Kursi Balkon', 'Kualitas Akustik Ruangan Terbaik', 'E-Ticket QR Code'] },
      { type: 'vip', name: 'VIP Box Seat', price: 140, badge: 'VIP Private Box', benefits: ['Private VIP Box Seat', 'Welcome Champagne / Drink', 'Layanan Private Service Staff', 'Meet & Greet Voucher'] }
    ]
  },
  {
    id: '4',
    title: 'Electric Nights',
    artist: 'DJ Nova',
    venue: 'Velvet Club, Berlin',
    city: 'Berlin',
    address: 'Ritterstraße 26, 10969 Berlin, Germany',
    lat: 52.5111,
    lng: 13.4102,
    date: 'SEP 05, 2026',
    time: '22:00 PM',
    doorsOpen: '22:00 PM',
    showStarts: '23:00 PM',
    ageLimit: '21+',
    category: 'EDM',
    price: 95,
    image: 'https://images.unsplash.com/photo-1571266028243-d220c9e4d1b8?auto=format&fit=crop&w=1200&q=80',
    description: 'Malam klub bawah tanah dengan set eksklusif dari DJ Nova. Sistem tata suara berkelas dunia dan visual laser yang memukau sepanjang malam.',
    tag: 'UNDERGROUND',
    secondaryTag: 'LATE NIGHT',
    tickets: [
      { type: 'regular', name: 'Dance Floor Pass', price: 95, badge: 'General Admission', benefits: ['Akses Dance Floor Utama', 'Free Loker Penitipan', 'E-Ticket QR Code'] },
      { type: 'vip', name: 'VIP Booth', price: 190, badge: 'Private Booth', benefits: ['Private Booth & Meja', 'Bottle Service', 'Fast Entry Line', 'Merchandise Eksklusif'] }
    ]
  },
  {
    id: '5',
    title: 'Indie Waves Festival',
    artist: 'The Wandering Echoes',
    venue: 'Brooklyn Steel, NYC',
    city: 'New York City',
    address: '319 Frost St, Brooklyn, NY 11222, USA',
    lat: 40.7145,
    lng: -73.9425,
    date: 'JUN 10, 2026',
    time: '18:00 PM',
    doorsOpen: '18:00 PM',
    showStarts: '19:00 PM',
    ageLimit: '18+',
    category: 'Indie',
    price: 70,
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
    description: 'Deretan band indie underground terbaik tampil dalam satu panggung intim di Brooklyn Steel, membawa nuansa lirik puitis dan melodi yang jujur.',
    tag: 'INDIE PICK',
    secondaryTag: 'NEW ARRIVAL',
    tickets: [
      { type: 'regular', name: 'Standing Pass', price: 70, badge: 'General Admission', benefits: ['Akses Standing Area', 'Merchandise Booth Access', 'E-Ticket QR Code'] },
      { type: 'vip', name: 'VIP Balcony', price: 140, badge: 'Reserved Balcony', benefits: ['Kursi Balkon Reserved', 'Akses Meet & Greet', 'Welcome Drink', 'Priority Entry'] }
    ]
  },
  {
    id: '6',
    title: 'Jazz & Wine Evening',
    artist: 'Miles Harmony Quartet',
    venue: 'Blue Note, NYC',
    city: 'New York City',
    address: '131 W 3rd St, New York, NY 10012, USA',
    lat: 40.7308,
    lng: -73.9973,
    date: 'NOV 02, 2026',
    time: '20:00 PM',
    doorsOpen: '19:00 PM',
    showStarts: '20:00 PM',
    ageLimit: '21+',
    category: 'Jazz',
    price: 55,
    image: 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?auto=format&fit=crop&w=1200&q=80',
    description: 'Malam jazz intim ditemani segelas wine pilihan bersama Miles Harmony Quartet di klub jazz legendaris New York.',
    tag: 'INTIMATE',
    secondaryTag: 'LIMITED SEATS',
    tickets: [
      { type: 'regular', name: 'Table Seat', price: 55, badge: 'Shared Table', benefits: ['Kursi Meja Bersama', '1 Welcome Drink', 'E-Ticket QR Code'] },
      { type: 'vip', name: 'VIP Front Table', price: 120, badge: 'Front Row Table', benefits: ['Meja Baris Depan', 'Wine Pairing Set', 'Layanan Personal Waiter', 'Merchandise Signed'] }
    ]
  },
  {
    id: '7',
    title: 'Pop Sensation Live',
    artist: 'Luna Star',
    venue: 'Crypto.com Arena, LA',
    city: 'Los Angeles',
    address: '1111 S Figueroa St, Los Angeles, CA 90015, USA',
    lat: 34.0430,
    lng: -118.2673,
    date: 'DEC 12, 2026',
    time: '19:30 PM',
    doorsOpen: '18:30 PM',
    showStarts: '19:30 PM',
    ageLimit: 'All Ages',
    category: 'Pop',
    price: 110,
    image: 'https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1200&q=80',
    description: 'Konser tunggal Luna Star dengan produksi panggung megah, koreografi spektakuler, dan setlist lagu-lagu hits terbarunya.',
    tag: 'MEGA SHOW',
    secondaryTag: 'FAN FAVORITE',
    tickets: [
      { type: 'regular', name: 'Regular Seat', price: 110, badge: 'Numbered Seat', benefits: ['Kursi Sesuai Nomor', 'Akses Merchandise Booth', 'E-Ticket QR Code'] },
      { type: 'vip', name: 'VIP Gold Circle', price: 220, badge: 'Gold Circle', benefits: ['Area Gold Circle Terdekat Panggung', 'Early Entry', 'Exclusive Tour Merchandise', 'Soundcheck Party Access'] }
    ]
  },
  {
    id: '8',
    title: 'Rock Revolution',
    artist: 'Thunder Reign',
    venue: 'The O2 Arena, London',
    city: 'London',
    address: 'Peninsula Square, London SE10 0DX, UK',
    lat: 51.5030,
    lng: 0.0032,
    date: 'OCT 30, 2026',
    time: '19:00 PM',
    doorsOpen: '18:00 PM',
    showStarts: '19:00 PM',
    ageLimit: '16+',
    category: 'Rock',
    price: 99,
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
    description: 'Thunder Reign kembali menggelegar dengan tur dunia terbarunya, menghadirkan riff gitar menggelegar dan produksi panggung penuh api.',
    tag: 'ARENA TOUR',
    secondaryTag: 'BEST SELLER',
    tickets: [
      { type: 'regular', name: 'Standing GA', price: 99, badge: 'General Admission', benefits: ['Akses Standing Floor', 'Poster Eksklusif Tur', 'E-Ticket QR Code'] },
      { type: 'vip', name: 'VIP Pit Pass', price: 200, badge: 'Front Pit', benefits: ['Akses Pit Terdepan', 'Early Entry & Soundcheck', 'Exclusive Merch Bundle', 'Laminate VIP Pass'] }
    ]
  }
];

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Welcome to VibePass!',
    message: 'Find your favorite concerts and events here.',
    type: 'system',
    date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
    read: false
  }
];

// Seed initial data if not present
if (!localStorage.getItem('vibepass_events')) {
  localStorage.setItem('vibepass_events', JSON.stringify(INITIAL_EVENTS));
}
if (!localStorage.getItem('vibepass_tickets')) {
  localStorage.setItem('vibepass_tickets', JSON.stringify([]));
}
if (!localStorage.getItem('vibepass_history')) {
  localStorage.setItem('vibepass_history', JSON.stringify([]));
}
if (!localStorage.getItem('vibepass_notifications')) {
  localStorage.setItem('vibepass_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
}

// Simulated Network Latency
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const api = {
  // === EVENTS ===
  getEvents: async () => {
    await delay(800); // Simulate network delay
    const data = localStorage.getItem('vibepass_events');
    return JSON.parse(data);
  },

  getEventById: async (id) => {
    await delay(800);
    const data = localStorage.getItem('vibepass_events');
    const events = JSON.parse(data);
    const event = events.find(e => e.id === id);
    if (!event) throw new Error("Event not found");
    return event;
  },

  // === TICKETS ===
  getTickets: async () => {
    await delay(600);
    const data = localStorage.getItem('vibepass_tickets');
    return JSON.parse(data);
  },

  // === HISTORY ===
  getHistory: async () => {
    await delay(600);
    const data = localStorage.getItem('vibepass_history');
    return JSON.parse(data);
  },

  // === NOTIFICATIONS ===
  getNotifications: async () => {
    await delay(400);
    const data = localStorage.getItem('vibepass_notifications');
    return JSON.parse(data);
  },

  markNotificationsRead: async () => {
    await delay(300);
    const data = localStorage.getItem('vibepass_notifications');
    let notifications = JSON.parse(data);
    notifications = notifications.map(n => ({ ...n, read: true }));
    localStorage.setItem('vibepass_notifications', JSON.stringify(notifications));
    return notifications;
  },

  // === TRANSACTIONS ===
  purchaseTicket: async (ticket, history, notifications) => {
    await delay(1500); // Payment processing delay

    // Save ticket
    const ticketsData = JSON.parse(localStorage.getItem('vibepass_tickets'));
    ticketsData.unshift(ticket);
    localStorage.setItem('vibepass_tickets', JSON.stringify(ticketsData));

    // Save history
    const historyData = JSON.parse(localStorage.getItem('vibepass_history'));
    historyData.unshift(history);
    localStorage.setItem('vibepass_history', JSON.stringify(historyData));

    // Save notifications
    const notifData = JSON.parse(localStorage.getItem('vibepass_notifications'));
    const formattedNotifs = notifications.map(n => ({
      ...n,
      id: `notif-${Date.now()}-${Math.random()}`,
      date: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      read: false
    }));
    const updatedNotifs = [...formattedNotifs, ...notifData];
    localStorage.setItem('vibepass_notifications', JSON.stringify(updatedNotifs));

    return { success: true };
  }
};