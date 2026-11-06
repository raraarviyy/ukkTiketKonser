import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';
import { api } from '../../api/index';

const OrganizerContext = createContext(null);

function normalizeEvent(event) {
  const ticketTypes = event.ticket_types || [];
  return {
    ...event,
    date: event.event_date
      ? new Date(event.event_date).toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : '-',
    doorsOpen: event.doors_open || '-',
    showStarts: event.show_starts || '-',
    ageLimit: event.age_limit || 'Semua umur',
    lat: event.latitude || -6.2,
    lng: event.longitude || 106.8,
    tag: event.tag || (event.category?.name || ''),
    secondaryTag: event.secondary_tag || '',
    category: event.category?.name || '',
    categories: ticketTypes.map((tt) => ({
      id: tt.id,
      name: tt.name,
      type: tt.type,
      price: Number(tt.price),
      quota: tt.quota,
      sold: tt.sold,
      benefits: tt.benefits || [],
      badge: tt.badge || '',
    })),
  };
}

// Fungsi ini yang bikin error sebelumnya. Sekarang sudah aman.
function normalizeReview(rv) {
  return {
    ...rv,
    eventId: rv.event_id || rv.event?.id,
    reviewer: rv.user?.name || "Anonim",
    date: rv.created_at
      ? new Date(rv.created_at).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "-",
  };
}

export function OrganizerProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      const data = await api.getMyOrganizedEvents();
      setEvents(data.map(normalizeEvent));
    } catch (error) {
      console.error('Gagal memuat event', error);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      const res = await api.getOrganizerReviews();
      
      // Ekstrak array dari bentuk response BE yang bervariasi
      const raw = res?.data?.data ?? res?.data ?? res;
      const arr = Array.isArray(raw) ? raw : [];
      
      setReviews(arr.map(normalizeReview));
    } catch (error) {
      console.error('Gagal memuat ulasan', error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([loadEvents(), loadReviews()]);
      setLoading(false);
    };
    init();

    const handleDataChanged = () => { loadEvents(); };
    window.addEventListener('auralis:data-changed', handleDataChanged);
    return () => { window.removeEventListener('auralis:data-changed', handleDataChanged); };
  }, [loadEvents, loadReviews]);

  const resolveCategory = async (categoryName) => {
    try {
      const cats = await api.getCategories();
      const found = cats.find(
        (c) => c.name.toLowerCase() === (categoryName || '').toLowerCase()
      );
      if (found) return found.id;
      const res = await api.createCategory({ name: categoryName || 'Concert' });
      return res.data?.id || res.id;
    } catch {
      return 1;
    }
  };

  const addEvent = async (formData) => {
    const categoryId = await resolveCategory(formData.category);
    const ticketCategories = formData.categories || [];

    const eventPayload = {
      title: formData.title,
      artist: formData.artist || 'Berbagai Artis',
      venue: formData.venue,
      city: formData.city,
      address: formData.address || '',
      latitude: Number(formData.lat) || -6.2,
      longitude: Number(formData.lng) || 106.8,
      event_date: formData.date,
      doors_open: formData.doorsOpen || null,
      show_starts: formData.showStarts || null,
      age_limit: formData.ageLimit || null,
      category_id: categoryId,
      image: formData.image || null,
      description: formData.description || '',
      tag: formData.category || null,
      secondary_tag: formData.secondaryTag || null,
    };

    const res = await api.createEvent(eventPayload);
    const newEventId = res.data?.id;

    if (newEventId && ticketCategories.length > 0) {
      for (const cat of ticketCategories) {
        await api.createTicketType(newEventId, {
          type: cat.name?.toLowerCase().replace(/\s+/g, '_') || 'regular',
          name: cat.name,
          price: Number(cat.price),
          quota: Number(cat.quota),
        });
      }
    }

    await loadEvents();
    return newEventId;
  };

  const updateEvent = async (eventId, formData) => {
    let categoryId;
    if (formData.category) {
      categoryId = await resolveCategory(formData.category);
    }

    const updatePayload = {
      title: formData.title,
      artist: formData.artist,
      venue: formData.venue,
      city: formData.city,
      address: formData.address || '',
      latitude: Number(formData.lat) || undefined,
      longitude: Number(formData.lng) || undefined,
      event_date: formData.date || undefined,
      doors_open: formData.doorsOpen || null,
      show_starts: formData.showStarts || null,
      age_limit: formData.ageLimit || null,
      image: formData.image || null,
      description: formData.description || '',
      tag: formData.category || null,
      secondary_tag: formData.secondaryTag || null,
    };

    if (categoryId) {
      updatePayload.category_id = categoryId;
    }

    await api.updateEvent(eventId, updatePayload);
    await loadEvents();
  };

  const deleteEvent = async (eventId) => {
    await api.deleteEvent(eventId);
    await loadEvents();
  };

  const addCategory = async (eventId, category) => {
    await api.createTicketType(eventId, {
      type: category.name?.toLowerCase().replace(/\s+/g, '_') || 'regular',
      name: category.name,
      price: Number(category.price),
      quota: Number(category.quota),
    });
    await loadEvents();
  };

  const updateCategory = async (eventId, categoryId, updates) => {
    await api.updateTicketType(categoryId, {
      name: updates.name,
      price: Number(updates.price),
      quota: Number(updates.quota),
    });
    await loadEvents();
  };

  const deleteCategory = async (eventId, categoryId) => {
    await api.deleteTicketType(categoryId);
    await loadEvents();
  };

  const getRevenueSummary = () => {
    let totalRevenue = 0;
    let totalSold = 0;
    let totalQuota = 0;

    const perEvent = events.map((event) => {
      const categories = event.categories || [];
      const eventRevenue = categories.reduce(
        (sum, c) => sum + Number(c.price || 0) * Number(c.sold || 0), 0
      );
      const eventSold = categories.reduce(
        (sum, c) => sum + Number(c.sold || 0), 0
      );
      const eventQuota = categories.reduce(
        (sum, c) => sum + Number(c.quota || 0), 0
      );
      totalRevenue += eventRevenue;
      totalSold += eventSold;
      totalQuota += eventQuota;
      return {
        eventId: event.id,
        title: event.title,
        revenue: eventRevenue,
        sold: eventSold,
        quota: eventQuota,
      };
    });

    return { totalRevenue, totalSold, totalQuota, perEvent };
  };

  const value = {
    events,
    reviews,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    addCategory,
    updateCategory,
    deleteCategory,
    getRevenueSummary,
    refreshEvents: loadEvents,
  };

  return (
    <OrganizerContext.Provider value={value}>
      {children}
    </OrganizerContext.Provider>
  );
}

export function useOrganizer() {
  const context = useContext(OrganizerContext);
  if (!context) {
    throw new Error('useOrganizer harus dipakai di dalam OrganizerProvider');
  }
  return context;
}