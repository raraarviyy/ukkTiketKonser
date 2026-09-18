import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../../api';

const FavoriteContext = createContext(null);

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = useCallback(async () => {
    try {
      const data = await api.getFavorites();
      setFavorites(data);
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
    const updated = await api.toggleFavorite(event);
    setFavorites(updated);
  };

  const isFavorite = (eventId) => favorites.some((f) => f.id === eventId);

  const value = { favorites, loading, toggleFavorite, isFavorite };

  return <FavoriteContext.Provider value={value}>{children}</FavoriteContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoriteContext);
  if (!ctx) {
    throw new Error('useFavorites harus dipakai di dalam FavoriteProvider');
  }
  return ctx;
}