import React, { createContext, useContext, useState } from 'react';

const FavoriteContext = createContext();

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  const toggleFavorite = (event) => {
    setFavorites((prev) => {
      const exists = prev.some((item) => item.id === event.id);
      if (exists) {
        return prev.filter((item) => item.id !== event.id);
      } else {
        return [...prev, event];
      }
    });
  };

  const isFavorite = (id) => favorites.some((item) => item.id === id);

  return (
    <FavoriteContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoriteContext.Provider>
  );
}

// Custom Hook dengan validasi
export function useFavorites() {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorites harus digunakan di dalam <FavoriteProvider>");
  }
  return context;
}