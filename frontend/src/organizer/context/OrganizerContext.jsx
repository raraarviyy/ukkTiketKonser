import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback
} from 'react';

import { api } from '../../api';

const OrganizerContext = createContext(null);

export function OrganizerProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = useCallback(async () => {
    try {
      const data = await api.getAllEventsForOrganizer();
      setEvents(data);
    } catch (error) {
      console.error('Gagal memuat event', error);
    }
  }, []);

  const loadReviews = useCallback(async () => {
    try {
      const data = await api.getReviews();
      setReviews(data);
    } catch (error) {
      console.error('Gagal memuat ulasan', error);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      await Promise.all([
        loadEvents(),
        loadReviews()
      ]);

      setLoading(false);
    };

    init();

    const handleDataChanged = () => {
      loadEvents();
    };

    window.addEventListener(
      'auralis:data-changed',
      handleDataChanged
    );

    return () => {
      window.removeEventListener(
        'auralis:data-changed',
        handleDataChanged
      );
    };
  }, [loadEvents, loadReviews]);

  const addEvent = async (eventData) => {
    const newEvent = await api.createEvent(eventData);
    await loadEvents();

    return newEvent.id;
  };

  const updateEvent = async (eventId, updates) => {
    await api.updateEvent(eventId, updates);
    await loadEvents();
  };

  const deleteEvent = async (eventId) => {
    await api.deleteEvent(eventId);
    await loadEvents();
  };

  const addCategory = async (eventId, category) => {
    await api.addTicketCategory(eventId, category);
    await loadEvents();
  };

  const updateCategory = async (
    eventId,
    categoryId,
    updates
  ) => {
    await api.updateTicketCategory(
      eventId,
      categoryId,
      updates
    );

    await loadEvents();
  };

  const deleteCategory = async (
    eventId,
    categoryId
  ) => {
    await api.deleteTicketCategory(
      eventId,
      categoryId
    );

    await loadEvents();
  };

  const getRevenueSummary = () => {
    let totalRevenue = 0;
    let totalSold = 0;
    let totalQuota = 0;

    const perEvent = events.map((event) => {
      const categories = event.categories || [];

      const eventRevenue = categories.reduce(
        (sum, category) =>
          sum +
          Number(category.price || 0) *
          Number(category.sold || 0),
        0
      );

      const eventSold = categories.reduce(
        (sum, category) =>
          sum + Number(category.sold || 0),
        0
      );

      const eventQuota = categories.reduce(
        (sum, category) =>
          sum + Number(category.quota || 0),
        0
      );

      totalRevenue += eventRevenue;
      totalSold += eventSold;
      totalQuota += eventQuota;

      return {
        eventId: event.id,
        title: event.title,
        revenue: eventRevenue,
        sold: eventSold,
        quota: eventQuota
      };
    });

    return {
      totalRevenue,
      totalSold,
      totalQuota,
      perEvent
    };
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
    refreshEvents: loadEvents
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
    throw new Error(
      'useOrganizer harus dipakai di dalam OrganizerProvider'
    );
  }

  return context;
}
