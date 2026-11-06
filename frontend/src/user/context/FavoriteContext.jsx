import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../../api';

const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    const token = localStorage.getItem('auralis_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.getMyFavorites();
      const raw = res.data ?? res;
      setFavorites(Array.isArray(raw) ? raw : []);
    } catch (error) {
      console.error('Gagal memuat favorit', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  const toggleFavorite = async (event) => {
    const eventId = typeof event === 'number' ? event : event.id;
    try {
      await api.toggleFavorite(eventId);
      await loadFavorites();
    } catch (error) {
      console.error('Gagal toggle favorit', error);
    }
  };

  const isFavorite = (eventId) =>
    favorites.some((f) => {
      const fid = f.event_id ?? f.event?.id ?? f.id;
      return fid === eventId;
    });

  const value = { favorites, loading, toggleFavorite, isFavorite, loadFavorites };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoriteContext);
  if (!ctx) {
    throw new Error('useFavorites harus dipakai di dalam FavoriteProvider');
  }
  return ctx;
}