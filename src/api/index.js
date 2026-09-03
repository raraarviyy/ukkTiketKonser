const STORAGE_KEY = 'auralis_events_data';
const HISTORY_KEY = 'auralis_history_data';
const TICKETS_KEY = 'auralis_tickets_data';
const NOTIFICATIONS_KEY = 'auralis_notifications_data';
const FAVORITES_KEY = 'auralis_favorites_data';
const REVIEWS_KEY = 'auralis_reviews_data';
const USERS_KEY = 'auralis_users_data';
const TRANSACTIONS_KEY = 'auralis_transactions_data';
const ADMIN_NOTIF_KEY = 'auralis_admin_notif_data';
const AUDIT_KEY = 'auralis_audit_log';
const SETTLEMENT_KEY = 'auralis_settlement_data';
const PLATFORM_FEE_KEY = 'auralis_platform_fee';
const WALLET_KEY = 'auralis_wallet_data';
const WITHDRAWAL_KEY = 'auralis_withdrawal_data';

const seedEvents = [
  {
    id: 'evt-1',
    title: 'Harmoni Malam Jazz',
    artist: 'Tulus & Friends',
    venue: 'Balai Sarbini',
    city: 'Jakarta',
    date: '2026-09-20',
    time: '20:00',
    category: 'Jazz',
    secondaryTag: 'Jazz',
    tag: 'Featured',
    description: 'Malam apresiasi musik jazz kontemporer dengan lineup lokal terbaik.',
    lineup: ['Tulus', 'Kunto Aji', 'Rara Sekar'],
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    address: 'Jl. Sisingamangaraja No.73, Jakarta Selatan',
    lat: -6.2297,
    lng: 106.8175,
    doorsOpen: '19:00',
    showStarts: '20:00',
    ageLimit: '17+',
    status: 'published',
    organizerId: 'org-001',
    price: 45,
    categories: [
      { id: 'cat-1', name: 'VIP', price: 120, quota: 100, sold: 62 },
      { id: 'cat-2', name: 'Reguler', price: 45, quota: 500, sold: 310 }
    ],
    tickets: [
      { type: 'regular', name: 'Reguler', price: 45, benefits: ['Akses area umum', 'E-ticket QR'] },
      { type: 'vip', name: 'VIP', price: 120, benefits: ['Akses area depan', 'Merchandise eksklusif', 'Fast entry'] }
    ]
  },
  {
    id: 'evt-2',
    title: 'Festival Suara Kota',
    artist: 'Berbagai Artis',
    venue: 'GBK Senayan',
    city: 'Jakarta',
    date: '2026-10-05',
    time: '16:00',
    category: 'Festival',
    secondaryTag: 'Festival',
    tag: 'Popular',
    description: 'Festival musik tahunan lintas genre dengan puluhan artis nasional.',
    lineup: ['Raisa', 'Rich Brian', 'Fourtwnty'],
    image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
    address: 'Jl. Pintu Satu Senayan, Jakarta Pusat',
    lat: -6.2183,
    lng: 106.8027,
    doorsOpen: '15:00',
    showStarts: '16:00',
    ageLimit: 'Semua umur',
    status: 'published',
    organizerId: 'org-001',
    price: 60,
    categories: [
      { id: 'cat-3', name: 'VIP', price: 150, quota: 200, sold: 40 },
      { id: 'cat-4', name: 'Reguler', price: 60, quota: 1000, sold: 210 }
    ],
    tickets: [
      { type: 'regular', name: 'Reguler', price: 60, benefits: ['Akses area umum', 'E-ticket QR'] },
      { type: 'vip', name: 'VIP', price: 150, benefits: ['Akses tribun VIP', 'Merchandise', 'Parkir khusus'] }
    ]
  },
  {
    id: 'evt-3',
    title: 'Indie Night Out',
    artist: 'Payung Teduh',
    venue: 'Motion Blue',
    city: 'Bandung',
    date: '2026-11-12',
    time: '19:30',
    category: 'Indie',
    secondaryTag: 'Indie',
    tag: 'New',
    description: 'Malam penuh keintiman bersama Payung Teduh dan kolaborator spesial.',
    lineup: ['Payung Teduh', 'Hindia', 'Reality Club'],
    image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=800',
    address: 'Jl. Asia Afrika No. 145, Bandung',
    lat: -6.9175,
    lng: 107.6191,
    doorsOpen: '18:30',
    showStarts: '19:30',
    ageLimit: 'Semua umur',
    status: 'published',
    organizerId: 'org-002',
    price: 75,
    categories: [
      { id: 'cat-5', name: 'VIP', price: 200, quota: 50, sold: 30 },
      { id: 'cat-6', name: 'Reguler', price: 75, quota: 300, sold: 180 }
    ],
    tickets: [
      { type: 'regular', name: 'Reguler', price: 75, benefits: ['Akses area umum', 'E-ticket QR'] },
      { type: 'vip', name: 'VIP', price: 200, benefits: ['Meet & Greet', 'Merchandise eksklusif'] }
    ]
  },
  {
    id: 'evt-4',
    title: 'EDM Takeover Bali',
    artist: 'DJ Martin Garrix',
    venue: 'GWK Cultural Park',
    city: 'Bali',
    date: '2026-12-31',
    time: '21:00',
    category: 'EDM',
    secondaryTag: 'EDM',
    tag: 'Hot',
    description: 'Rayakan tahun baru dengan dentuman bass EDM internasional.',
    lineup: ['Martin Garrix', 'Alesso', 'Dipha Barus'],
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    address: 'Jl. Raya Uluwatu, Ungasan, Kuta Selatan, Bali',
    lat: -8.8101,
    lng: 115.1686,
    doorsOpen: '20:00',
    showStarts: '21:00',
    ageLimit: '21+',
    status: 'published',
    organizerId: 'org-001',
    price: 200,
    categories: [
      { id: 'cat-7', name: 'VVIP', price: 500, quota: 50, sold: 12 },
      { id: 'cat-8', name: 'VIP', price: 300, quota: 150, sold: 78 },
      { id: 'cat-9', name: 'Reguler', price: 200, quota: 800, sold: 450 }
    ],
    tickets: [
      { type: 'regular', name: 'Reguler', price: 200, benefits: ['Akses area umum', 'E-ticket QR'] },
      { type: 'vip', name: 'VIP', price: 300, benefits: ['Area VIP khusus', 'Bar premium'] },
      { type: 'vip', name: 'VVIP', price: 500, benefits: ['Lounge eksklusif', 'Open bar', 'Backstage pass'] }
    ]
  },
  {
    id: 'evt-5',
    title: 'Rock N Loud',
    artist: 'Burgerkill',
    venue: 'Istora Senayan',
    city: 'Jakarta',
    date: '2026-10-18',
    time: '18:00',
    category: 'Rock',
    secondaryTag: 'Rock',
    tag: 'Featured',
    description: 'Festival rock terbesar dengan dentuman keras band metal lokal terbaik.',
    lineup: ['Burgerkill', 'Seringai', 'Beside'],
    image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
    address: 'Jl. Pintu Satu Senayan, Jakarta Pusat',
    lat: -6.2185,
    lng: 106.8022,
    doorsOpen: '17:00',
    showStarts: '18:00',
    ageLimit: '17+',
    status: 'pending',
    organizerId: 'org-002',
    price: 150,
    categories: [
      { id: 'cat-10', name: 'VIP', price: 350, quota: 100, sold: 0 },
      { id: 'cat-11', name: 'Reguler', price: 150, quota: 500, sold: 0 }
    ],
    tickets: [
      { type: 'regular', name: 'Reguler', price: 150, benefits: ['Akses area umum', 'E-ticket QR'] },
      { type: 'vip', name: 'VIP', price: 350, benefits: ['Area VIP', 'Merchandise'] }
    ]
  }
];

const seedUsers = [
  { id: 'org-001', name: 'Harmony Events', email: 'organizer@auralis.id', role: 'organizer', status: 'active', avatar: null, createdAt: '2026-01-15T08:00:00Z' },
  { id: 'org-002', name: 'Bali Music Fest', email: 'balimusicfest@auralis.id', role: 'organizer', status: 'active', avatar: null, createdAt: '2026-02-10T08:00:00Z' },
  { id: 'usr-001', name: 'Budi Santoso', email: 'budi@gmail.com', role: 'user', status: 'active', avatar: null, createdAt: '2026-03-01T10:00:00Z' },
  { id: 'usr-002', name: 'Siti Rahayu', email: 'siti@gmail.com', role: 'user', status: 'active', avatar: null, createdAt: '2026-03-15T11:00:00Z' },
  { id: 'usr-003', name: 'Ahmad Fauzi', email: 'ahmad@gmail.com', role: 'user', status: 'active', avatar: null, createdAt: '2026-04-20T09:00:00Z' }
];

const seedTransactions = [
  {
    id: 'trx-001', userId: 'usr-001', userName: 'Budi Santoso', userEmail: 'budi@gmail.com',
    eventId: 'evt-1', eventTitle: 'Harmoni Malam Jazz', ticketType: 'VIP', quantity: 2,
    totalAmount: 240000, status: 'paid', paymentMethod: 'Transfer Bank', createdAt: '2026-08-10T14:30:00Z',
    ticketIds: ['tkt-001', 'tkt-002']
  },
  {
    id: 'trx-002', userId: 'usr-002', userName: 'Siti Rahayu', userEmail: 'siti@gmail.com',
    eventId: 'evt-2', eventTitle: 'Festival Suara Kota', ticketType: 'Reguler', quantity: 3,
    totalAmount: 180000, status: 'paid', paymentMethod: 'E-Wallet (GoPay)', createdAt: '2026-08-12T10:00:00Z',
    ticketIds: ['tkt-003', 'tkt-004', 'tkt-005']
  },
  {
    id: 'trx-003', userId: 'usr-003', userName: 'Ahmad Fauzi', userEmail: 'ahmad@gmail.com',
    eventId: 'evt-1', eventTitle: 'Harmoni Malam Jazz', ticketType: 'Reguler', quantity: 1,
    totalAmount: 45000, status: 'pending', paymentMethod: 'Transfer Bank', createdAt: '2026-08-14T16:00:00Z',
    ticketIds: ['tkt-006']
  },
  {
    id: 'trx-004', userId: 'usr-001', userName: 'Budi Santoso', userEmail: 'budi@gmail.com',
    eventId: 'evt-3', eventTitle: 'Indie Night Out', ticketType: 'VIP', quantity: 2,
    totalAmount: 400000, status: 'paid', paymentMethod: 'Kartu Kredit', createdAt: '2026-08-20T09:00:00Z',
    ticketIds: ['tkt-007', 'tkt-008']
  },
  {
    id: 'trx-005', userId: 'usr-002', userName: 'Siti Rahayu', userEmail: 'siti@gmail.com',
    eventId: 'evt-4', eventTitle: 'EDM Takeover Bali', ticketType: 'VIP', quantity: 1,
    totalAmount: 300000, status: 'refunded', paymentMethod: 'E-Wallet (OVO)', createdAt: '2026-08-22T11:00:00Z',
    ticketIds: ['tkt-009']
  }
];

const seedTickets = [
  { id: 'tkt-001', transactionId: 'trx-001', userId: 'usr-001', userName: 'Budi Santoso', userEmail: 'budi@gmail.com', eventId: 'evt-1', eventTitle: 'Harmoni Malam Jazz', eventDate: '2026-09-20', venue: 'Balai Sarbini', ticketType: 'VIP', status: 'active', checkedIn: false, qrCode: null, createdAt: '2026-08-10T14:30:00Z' },
  { id: 'tkt-002', transactionId: 'trx-001', userId: 'usr-001', userName: 'Budi Santoso', userEmail: 'budi@gmail.com', eventId: 'evt-1', eventTitle: 'Harmoni Malam Jazz', eventDate: '2026-09-20', venue: 'Balai Sarbini', ticketType: 'VIP', status: 'active', checkedIn: false, qrCode: null, createdAt: '2026-08-10T14:30:00Z' },
  { id: 'tkt-003', transactionId: 'trx-002', userId: 'usr-002', userName: 'Siti Rahayu', userEmail: 'siti@gmail.com', eventId: 'evt-2', eventTitle: 'Festival Suara Kota', eventDate: '2026-10-05', venue: 'GBK Senayan', ticketType: 'Reguler', status: 'active', checkedIn: true, qrCode: null, createdAt: '2026-08-12T10:00:00Z' },
  { id: 'tkt-004', transactionId: 'trx-002', userId: 'usr-002', userName: 'Siti Rahayu', userEmail: 'siti@gmail.com', eventId: 'evt-2', eventTitle: 'Festival Suara Kota', eventDate: '2026-10-05', venue: 'GBK Senayan', ticketType: 'Reguler', status: 'active', checkedIn: false, qrCode: null, createdAt: '2026-08-12T10:00:00Z' },
  { id: 'tkt-005', transactionId: 'trx-002', userId: 'usr-002', userName: 'Siti Rahayu', userEmail: 'siti@gmail.com', eventId: 'evt-2', eventTitle: 'Festival Suara Kota', eventDate: '2026-10-05', venue: 'GBK Senayan', ticketType: 'Reguler', status: 'active', checkedIn: false, qrCode: null, createdAt: '2026-08-12T10:00:00Z' },
  { id: 'tkt-006', transactionId: 'trx-003', userId: 'usr-003', userName: 'Ahmad Fauzi', userEmail: 'ahmad@gmail.com', eventId: 'evt-1', eventTitle: 'Harmoni Malam Jazz', eventDate: '2026-09-20', venue: 'Balai Sarbini', ticketType: 'Reguler', status: 'pending', checkedIn: false, qrCode: null, createdAt: '2026-08-14T16:00:00Z' },
  { id: 'tkt-007', transactionId: 'trx-004', userId: 'usr-001', userName: 'Budi Santoso', userEmail: 'budi@gmail.com', eventId: 'evt-3', eventTitle: 'Indie Night Out', eventDate: '2026-11-12', venue: 'Motion Blue', ticketType: 'VIP', status: 'active', checkedIn: false, qrCode: null, createdAt: '2026-08-20T09:00:00Z' },
  { id: 'tkt-008', transactionId: 'trx-004', userId: 'usr-001', userName: 'Budi Santoso', userEmail: 'budi@gmail.com', eventId: 'evt-3', eventTitle: 'Indie Night Out', eventDate: '2026-11-12', venue: 'Motion Blue', ticketType: 'VIP', status: 'active', checkedIn: false, qrCode: null, createdAt: '2026-08-20T09:00:00Z' },
  { id: 'tkt-009', transactionId: 'trx-005', userId: 'usr-002', userName: 'Siti Rahayu', userEmail: 'siti@gmail.com', eventId: 'evt-4', eventTitle: 'EDM Takeover Bali', eventDate: '2026-12-31', venue: 'GWK Cultural Park', ticketType: 'VIP', status: 'cancelled', checkedIn: false, qrCode: null, createdAt: '2026-08-22T11:00:00Z' }
];

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.error(e); }
  return seedEvents;
}

function saveToStorage(events) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    window.dispatchEvent(new Event('auralis:data-changed'));
  } catch (e) { console.error(e); }
}

function loadList(key, seed = []) {
  try {
    const raw = localStorage.getItem(key);
    if (raw) return JSON.parse(raw);
  } catch (e) { console.error(e); }
  return seed;
}

function saveList(key, list) {
  try {
    localStorage.setItem(key, JSON.stringify(list));
  } catch (e) { console.error(e); }
}

function delay(ms) { return new Promise(r => setTimeout(r, ms)); }

function generateId(prefix = 'evt') {
  return prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
}

function createTicketsFromCategories(categories) {
  return categories.map(category => ({
    type: category.name.toLowerCase().includes('vip') ? 'vip' : 'regular',
    name: category.name,
    price: category.price,
    benefits: category.name.toLowerCase().includes('vip')
      ? ['Akses area VIP', 'Merchandise eksklusif']
      : ['Akses area umum', 'E-ticket QR']
  }));
}

(function initSeedData() {
  if (!localStorage.getItem(USERS_KEY)) saveList(USERS_KEY, seedUsers);
  if (!localStorage.getItem(TRANSACTIONS_KEY)) saveList(TRANSACTIONS_KEY, seedTransactions);
  if (!localStorage.getItem(TICKETS_KEY)) saveList(TICKETS_KEY, seedTickets);
})();

let eventsData = loadFromStorage();

function addAuditLog(action, target, details, actor = 'admin') {
  const logs = loadList(AUDIT_KEY);
  logs.unshift({
    id: generateId('aud'),
    action,
    target,
    details,
    actor,
    timestamp: new Date().toISOString()
  });
  saveList(AUDIT_KEY, logs);
}

export const api = {
  async getEvents() {
    await delay(150);
    return eventsData.filter(e => e.status === 'published');
  },

  async getFeaturedEvents(limit = 10) {
    await delay(150);
    return eventsData.filter(e => e.status === 'published').slice(0, limit);
  },

  async getEventById(id) {
    await delay(150);
    const event = eventsData.find(e => e.id === id);
    if (!event) throw new Error('Event tidak ditemukan');
    return event;
  },

  async getAllEventsForOrganizer(organizerId = null) {
    await delay(100);
    if (organizerId) return eventsData.filter(e => e.organizerId === organizerId);
    return [...eventsData];
  },

  async getAllEventsForAdmin() {
    await delay(100);
    return [...eventsData];
  },

  async createEvent(eventPayload) {
    await delay(200);
    const categories = (eventPayload.categories || []).map(c => ({
      id: c.id || generateId('cat'),
      name: c.name, price: Number(c.price) || 0,
      quota: Number(c.quota) || 0, sold: Number(c.sold) || 0
    }));
    const price = categories.length > 0 ? Math.min(...categories.map(c => c.price)) : 0;
    const newEvent = {
      id: generateId('evt'),
      title: eventPayload.title || '',
      artist: eventPayload.artist || eventPayload.lineup?.[0] || 'Berbagai Artis',
      venue: eventPayload.venue || '',
      city: eventPayload.city || '',
      date: eventPayload.date || '',
      time: eventPayload.time || '19:00',
      category: eventPayload.category || 'Concert',
      secondaryTag: eventPayload.category || 'Concert',
      description: eventPayload.description || '',
      image: eventPayload.image || '',
      status: 'pending',
      tag: 'New',
      address: eventPayload.address || eventPayload.venue || '',
      lat: Number(eventPayload.lat) || -6.2,
      lng: Number(eventPayload.lng) || 106.8,
      doorsOpen: eventPayload.doorsOpen || '18:00',
      showStarts: eventPayload.showStarts || '19:00',
      ageLimit: eventPayload.ageLimit || 'Semua umur',
      lineup: eventPayload.lineup || [],
      organizerId: eventPayload.organizerId || null,
      categories, price,
      tickets: createTicketsFromCategories(categories)
    };
    eventsData = [newEvent, ...eventsData];
    saveToStorage(eventsData);
    addAuditLog('CREATE_EVENT', newEvent.id, `Event "${newEvent.title}" dibuat`, eventPayload.organizerId || 'organizer');
    return newEvent;
  },

  async updateEvent(eventId, updates) {
    await delay(200);
    eventsData = eventsData.map(e => e.id === eventId ? { ...e, ...updates } : e);
    saveToStorage(eventsData);
    addAuditLog('UPDATE_EVENT', eventId, `Event diperbarui`);
    return eventsData.find(e => e.id === eventId);
  },

  async deleteEvent(eventId) {
    await delay(200);
    const evt = eventsData.find(e => e.id === eventId);
    eventsData = eventsData.filter(e => e.id !== eventId);
    saveToStorage(eventsData);
    addAuditLog('DELETE_EVENT', eventId, `Event "${evt?.title}" dihapus`);
    return true;
  },

  async softDeleteEvent(eventId) {
    await delay(200);
    eventsData = eventsData.map(e => e.id === eventId ? { ...e, status: 'deleted', deletedAt: new Date().toISOString() } : e);
    saveToStorage(eventsData);
    addAuditLog('SOFT_DELETE_EVENT', eventId, `Event di-soft-delete`);
    return true;
  },

  async approveEvent(eventId) {
    await delay(200);
    eventsData = eventsData.map(e => e.id === eventId ? { ...e, status: 'published' } : e);
    saveToStorage(eventsData);
    addAuditLog('APPROVE_EVENT', eventId, `Event disetujui dan dipublish`);
    return true;
  },

  async rejectEvent(eventId) {
    await delay(200);
    eventsData = eventsData.map(e => e.id === eventId ? { ...e, status: 'cancelled' } : e);
    saveToStorage(eventsData);
    addAuditLog('REJECT_EVENT', eventId, `Event ditolak`);
    return true;
  },

  async addTicketCategory(eventId, category) {
    await delay(150);
    const newCategory = { id: generateId('cat'), sold: 0, ...category };
    eventsData = eventsData.map(e => {
      if (e.id !== eventId) return e;
      const categories = [...(e.categories || []), newCategory];
      return { ...e, categories, price: Math.min(...categories.map(c => Number(c.price) || 0)), tickets: createTicketsFromCategories(categories) };
    });
    saveToStorage(eventsData);
    return newCategory;
  },

  async updateTicketCategory(eventId, categoryId, updates) {
    await delay(150);
    eventsData = eventsData.map(e => {
      if (e.id !== eventId) return e;
      const categories = (e.categories || []).map(c => c.id === categoryId ? { ...c, ...updates } : c);
      const price = categories.length > 0 ? Math.min(...categories.map(c => Number(c.price) || 0)) : 0;
      return { ...e, categories, price, tickets: createTicketsFromCategories(categories) };
    });
    saveToStorage(eventsData);
  },

  async deleteTicketCategory(eventId, categoryId) {
    await delay(150);
    eventsData = eventsData.map(e => {
      if (e.id !== eventId) return e;
      const categories = (e.categories || []).filter(c => c.id !== categoryId);
      const price = categories.length > 0 ? Math.min(...categories.map(c => Number(c.price) || 0)) : 0;
      return { ...e, categories, price, tickets: createTicketsFromCategories(categories) };
    });
    saveToStorage(eventsData);
  },

  async getUsers() {
    await delay(100);
    return loadList(USERS_KEY, seedUsers);
  },

  async getUserById(id) {
    await delay(100);
    const users = loadList(USERS_KEY, seedUsers);
    return users.find(u => u.id === id) || null;
  },

  async updateUser(userId, updates) {
    await delay(150);
    const users = loadList(USERS_KEY, seedUsers);
    const updated = users.map(u => u.id === userId ? { ...u, ...updates } : u);
    saveList(USERS_KEY, updated);
    addAuditLog('UPDATE_USER', userId, `User diperbarui: ${JSON.stringify(updates)}`);
    return updated.find(u => u.id === userId);
  },

  async deleteUser(userId) {
    await delay(150);
    const users = loadList(USERS_KEY, seedUsers);
    saveList(USERS_KEY, users.filter(u => u.id !== userId));
    addAuditLog('DELETE_USER', userId, `User dihapus`);
    return true;
  },

  async approveOrganizer(userId) {
    await delay(150);
    const users = loadList(USERS_KEY, seedUsers);
    const updated = users.map(u => u.id === userId ? { ...u, status: 'active', role: 'organizer' } : u);
    saveList(USERS_KEY, updated);
    addAuditLog('APPROVE_ORGANIZER', userId, `Organizer disetujui`);
    return true;
  },

  async suspendOrganizer(userId) {
    await delay(150);
    const users = loadList(USERS_KEY, seedUsers);
    const updated = users.map(u => u.id === userId ? { ...u, status: 'suspended' } : u);
    saveList(USERS_KEY, updated);
    addAuditLog('SUSPEND_ORGANIZER', userId, `Organizer disuspend`);
    return true;
  },

  async activateOrganizer(userId) {
    await delay(150);
    const users = loadList(USERS_KEY, seedUsers);
    const updated = users.map(u => u.id === userId ? { ...u, status: 'active' } : u);
    saveList(USERS_KEY, updated);
    addAuditLog('ACTIVATE_ORGANIZER', userId, `Organizer diaktifkan`);
    return true;
  },

  async getAllTransactions() {
    await delay(100);
    return loadList(TRANSACTIONS_KEY, seedTransactions);
  },

  async getTransactionsByOrganizer(organizerId) {
    await delay(100);
    const all = loadList(TRANSACTIONS_KEY, seedTransactions);
    const orgEventIds = eventsData.filter(e => e.organizerId === organizerId).map(e => e.id);
    return all.filter(t => orgEventIds.includes(t.eventId));
  },

  async updateTransaction(txId, updates) {
    await delay(150);
    const txs = loadList(TRANSACTIONS_KEY, seedTransactions);
    const updated = txs.map(t => t.id === txId ? { ...t, ...updates } : t);
    saveList(TRANSACTIONS_KEY, updated);
    return updated.find(t => t.id === txId);
  },

  async cancelTransaction(txId) {
    await delay(200);
    const txs = loadList(TRANSACTIONS_KEY, seedTransactions);
    const updated = txs.map(t => t.id === txId ? { ...t, status: 'cancelled' } : t);
    saveList(TRANSACTIONS_KEY, updated);
    const tickets = loadList(TICKETS_KEY, seedTickets);
    const tx = txs.find(t => t.id === txId);
    if (tx) {
      saveList(TICKETS_KEY, tickets.map(tk => tx.ticketIds?.includes(tk.id) ? { ...tk, status: 'cancelled' } : tk));
    }
    addAuditLog('CANCEL_TRANSACTION', txId, `Transaksi dibatalkan`);
    return true;
  },

  async refundTransaction(txId) {
    await delay(200);
    const txs = loadList(TRANSACTIONS_KEY, seedTransactions);
    const updated = txs.map(t => t.id === txId ? { ...t, status: 'refunded' } : t);
    saveList(TRANSACTIONS_KEY, updated);
    addAuditLog('REFUND_TRANSACTION', txId, `Transaksi di-refund`);
    return true;
  },

  async confirmPayment(txId) {
    await delay(200);
    const txs = loadList(TRANSACTIONS_KEY, seedTransactions);
    const updated = txs.map(t => t.id === txId ? { ...t, status: 'paid' } : t);
    saveList(TRANSACTIONS_KEY, updated);
    const tickets = loadList(TICKETS_KEY, seedTickets);
    const tx = txs.find(t => t.id === txId);
    if (tx) {
      saveList(TICKETS_KEY, tickets.map(tk => tx.ticketIds?.includes(tk.id) ? { ...tk, status: 'active' } : tk));
    }
    addAuditLog('CONFIRM_PAYMENT', txId, `Pembayaran dikonfirmasi`);
    return true;
  },

  async getAllTickets() {
    await delay(100);
    return loadList(TICKETS_KEY, seedTickets);
  },

  async getTicketsByOrganizer(organizerId) {
    await delay(100);
    const all = loadList(TICKETS_KEY, seedTickets);
    const orgEventIds = eventsData.filter(e => e.organizerId === organizerId).map(e => e.id);
    return all.filter(t => orgEventIds.includes(t.eventId));
  },

  async cancelTicket(ticketId) {
    await delay(150);
    const tickets = loadList(TICKETS_KEY, seedTickets);
    saveList(TICKETS_KEY, tickets.map(t => t.id === ticketId ? { ...t, status: 'cancelled' } : t));
    addAuditLog('CANCEL_TICKET', ticketId, `Tiket dibatalkan`);
    return true;
  },

  async checkInTicket(ticketId) {
    await delay(150);
    const tickets = loadList(TICKETS_KEY, seedTickets);
    saveList(TICKETS_KEY, tickets.map(t => t.id === ticketId ? { ...t, checkedIn: true, checkedInAt: new Date().toISOString() } : t));
    return true;
  },

  async purchaseTicket(ticketRecord, historyRecord, notificationRecords) {
    await delay(300);
    const tickets = loadList(TICKETS_KEY, []);
    tickets.unshift(ticketRecord);
    saveList(TICKETS_KEY, tickets);

    const history = loadList(HISTORY_KEY);
    history.unshift(historyRecord);
    saveList(HISTORY_KEY, history);

    const txs = loadList(TRANSACTIONS_KEY, []);
    txs.unshift({
      id: generateId('trx'),
      userId: historyRecord.userId || 'guest',
      userName: historyRecord.userName || 'Penonton',
      userEmail: historyRecord.userEmail || '',
      eventId: historyRecord.eventId,
      eventTitle: historyRecord.eventTitle,
      ticketType: ticketRecord.ticketType,
      quantity: ticketRecord.quantity,
      totalAmount: historyRecord.amount,
      status: 'paid',
      paymentMethod: historyRecord.paymentMethod || 'E-Wallet',
      createdAt: new Date().toISOString(),
      ticketIds: [ticketRecord.id]
    });
    saveList(TRANSACTIONS_KEY, txs);

    const notifications = loadList(NOTIFICATIONS_KEY);
    const newNotifications = notificationRecords.map(n => ({
      id: generateId('notif'), read: false, createdAt: new Date().toISOString(), ...n
    }));
    saveList(NOTIFICATIONS_KEY, [...newNotifications, ...notifications]);

    eventsData = eventsData.map(event => {
      const hasCategory = (event.categories || []).some(c => c.name === ticketRecord.ticketType);
      if (!hasCategory) return event;
      const categories = event.categories.map(c =>
        c.name === ticketRecord.ticketType
          ? { ...c, sold: Number(c.sold || 0) + Number(ticketRecord.quantity || 0) }
          : c
      );
      return { ...event, categories, tickets: createTicketsFromCategories(categories) };
    });
    saveToStorage(eventsData);
    return true;
  },

  async sendAdminNotification(notif) {
    await delay(100);
    const notifs = loadList(ADMIN_NOTIF_KEY);
    notifs.unshift({ id: generateId('anotif'), createdAt: new Date().toISOString(), ...notif });
    saveList(ADMIN_NOTIF_KEY, notifs);
    addAuditLog('SEND_NOTIFICATION', 'platform', `Notifikasi dikirim: "${notif.title}"`);
    return true;
  },

  async getAdminNotifications() {
    await delay(100);
    return loadList(ADMIN_NOTIF_KEY);
  },

  async getHistory() { await delay(100); return loadList(HISTORY_KEY); },
  async getMyTickets() { await delay(100); return loadList(TICKETS_KEY, seedTickets); },
  async getNotifications() { await delay(100); return loadList(NOTIFICATIONS_KEY); },
  async getFavorites() { await delay(100); return loadList(FAVORITES_KEY); },
  async toggleFavorite(event) {
    await delay(100);
    const favorites = loadList(FAVORITES_KEY);
    const exists = favorites.some(f => f.id === event.id);
    const updated = exists ? favorites.filter(f => f.id !== event.id) : [event, ...favorites];
    saveList(FAVORITES_KEY, updated);
    return updated;
  },
  async getReviews() { await delay(100); return loadList(REVIEWS_KEY); },
  async addReview(review) {
    await delay(150);
    const reviews = loadList(REVIEWS_KEY);
    reviews.unshift({ id: generateId('rev'), createdAt: new Date().toISOString(), ...review });
    saveList(REVIEWS_KEY, reviews);
    return true;
  },

  async deleteReview(reviewId) {
    await delay(150);
    const reviews = loadList(REVIEWS_KEY);
    saveList(REVIEWS_KEY, reviews.filter(r => r.id !== reviewId));
    addAuditLog('DELETE_REVIEW', reviewId, `Review dihapus`);
    return true;
  },

  async getAuditLogs() {
    await delay(100);
    return loadList(AUDIT_KEY);
  },

  async getPlatformFee() {
    await delay(50);
    const fee = localStorage.getItem(PLATFORM_FEE_KEY);
    return fee ? Number(fee) : 10;
  },

  async setPlatformFee(feePercent) {
    await delay(100);
    localStorage.setItem(PLATFORM_FEE_KEY, String(feePercent));
    addAuditLog('SET_PLATFORM_FEE', 'platform', `Platform fee diubah menjadi ${feePercent}%`);
    return true;
  },

  async getSettlements() {
    await delay(100);
    return loadList(SETTLEMENT_KEY);
  },

  async createSettlement(settlement) {
    await delay(200);
    const list = loadList(SETTLEMENT_KEY);
    const newSettlement = { id: generateId('stl'), createdAt: new Date().toISOString(), status: 'completed', ...settlement };
    list.unshift(newSettlement);
    saveList(SETTLEMENT_KEY, list);
    addAuditLog('CREATE_SETTLEMENT', newSettlement.id, `Settlement untuk ${settlement.organizerName}: Rp${settlement.amount?.toLocaleString('id-ID')}`);
    return newSettlement;
  },

  async getWithdrawals() {
    await delay(100);
    return loadList(WITHDRAWAL_KEY);
  },

  async requestWithdrawal(data) {
    await delay(200);
    const list = loadList(WITHDRAWAL_KEY);
    const newWithdrawal = { id: generateId('wd'), createdAt: new Date().toISOString(), status: 'pending', ...data };
    list.unshift(newWithdrawal);
    saveList(WITHDRAWAL_KEY, list);
    return newWithdrawal;
  },

  async processWithdrawal(withdrawalId, status) {
    await delay(200);
    const list = loadList(WITHDRAWAL_KEY);
    const updated = list.map(w => w.id === withdrawalId ? { ...w, status, processedAt: new Date().toISOString() } : w);
    saveList(WITHDRAWAL_KEY, updated);
    addAuditLog('PROCESS_WITHDRAWAL', withdrawalId, `Withdrawal ${status}`);
    return true;
  },

  async sendOrganizerNotification(notif) {
    await delay(100);
    const notifications = loadList(NOTIFICATIONS_KEY);
    const newNotif = { id: generateId('notif'), read: false, createdAt: new Date().toISOString(), type: 'organizer', ...notif };
    notifications.unshift(newNotif);
    saveList(NOTIFICATIONS_KEY, notifications);
    return true;
  },

  async getPlatformStats() {
    await delay(100);
    const users = loadList(USERS_KEY, seedUsers);
    const txs = loadList(TRANSACTIONS_KEY, seedTransactions);
    const tickets = loadList(TICKETS_KEY, seedTickets);
    const events = [...eventsData];
    const platformFee = localStorage.getItem(PLATFORM_FEE_KEY) ? Number(localStorage.getItem(PLATFORM_FEE_KEY)) : 10;
    const totalRevenue = txs.filter(t => t.status === 'paid').reduce((s, t) => s + (t.totalAmount || 0), 0);
    const totalSold = txs.filter(t => t.status === 'paid').reduce((s, t) => s + (t.quantity || 0), 0);
    const totalRefund = txs.filter(t => t.status === 'refunded').reduce((s, t) => s + (t.totalAmount || 0), 0);
    const platformRevenue = Math.round(totalRevenue * platformFee / 100);
    const totalOrganizers = users.filter(u => u.role === 'organizer').length;
    const totalCheckedIn = tickets.filter(t => t.checkedIn).length;

    const monthlySales = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const month = d.toLocaleString('id-ID', { month: 'short' });
      const year = d.getFullYear();
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const sales = txs.filter(t => t.status === 'paid' && t.createdAt?.startsWith(key)).reduce((s, t) => s + (t.quantity || 0), 0);
      const revenue = txs.filter(t => t.status === 'paid' && t.createdAt?.startsWith(key)).reduce((s, t) => s + (t.totalAmount || 0), 0);
      monthlySales.push({ month: `${month} ${year}`, sales, revenue });
    }

    return {
      totalUsers: users.length,
      totalOrganizers,
      totalEvents: events.length,
      publishedEvents: events.filter(e => e.status === 'published').length,
      pendingEvents: events.filter(e => e.status === 'pending').length,
      totalTicketsSold: totalSold,
      totalRevenue,
      totalRefund,
      platformFee,
      platformRevenue,
      gmv: totalRevenue,
      totalTransactions: txs.length,
      totalCheckedIn,
      monthlySales,
      eventSales: events.map(e => {
        const eventTxs = txs.filter(t => t.eventId === e.id && t.status === 'paid');
        return { name: e.title, sold: eventTxs.reduce((s, t) => s + (t.quantity || 0), 0), revenue: eventTxs.reduce((s, t) => s + (t.totalAmount || 0), 0) };
      }).filter(e => e.sold > 0)
    };
  }
};
