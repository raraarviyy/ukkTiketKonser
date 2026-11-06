// src/user/context/FavoriteContext.js

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { api } from "../../api";

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const res = await api.getMyFavorites();

      setFavorites(
        (res.data || []).map((item) => item.event.id)
      );
    } catch (err) {
      console.error(err);
    }
  };

  const isFavorite = (eventId) => {
    return favorites.includes(eventId);
  };

  const toggleFavorite = async (event) => {
    try {
      const res = await api.toggleFavorite(event.id);

      if (res.data?.favorited) {
        setFavorites((prev) => [...prev, event.id]);
      } else {
        setFavorites((prev) =>
          prev.filter((id) => id !== event.id)
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <FavoriteContext.Provider
      value={{
        favorites,
        isFavorite,
        toggleFavorite,
        loadFavorites,
      }}
    >
      {children}
    </FavoriteContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoriteContext);
}