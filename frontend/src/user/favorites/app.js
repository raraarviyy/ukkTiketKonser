import React, { useEffect, useState } from "react";
import { Heart, Trash2, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { api } from "../../api";

export default function Favorites() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("favorites");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);

      const res = await api.getMyFavorites();

      setFavorites(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (eventId) => {
    try {
      await api.removeFavorite(eventId);

      setFavorites((prev) =>
        prev.filter((item) => item.event.id !== eventId)
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#0b0c10",
        color: "#fff",
      }}
    >
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          minWidth: 0,
        }}
      >
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <div style={{ padding: "28px" }}>
          <h1
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "24px",
            }}
          >
            <Heart color="#ec4899" fill="#ec4899" />
            My Favorites
          </h1>

          {loading ? (
            <div
              style={{
                height: "300px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <Loader2
                size={32}
                color="#ec4899"
                style={{
                  animation: "spin 1s linear infinite",
                }}
              />

              <span style={{ color: "#9ca3af" }}>
                Loading favorites...
              </span>
            </div>
          ) : favorites.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "50px",
                borderRadius: "20px",
                backgroundColor: "#161826",
                border: "1px solid #1e2235",
              }}
            >
              <Heart
                size={50}
                color="#6b7280"
              />

              <h3>Belum ada event favorit</h3>

              <p style={{ color: "#9ca3af" }}>
                Tambahkan event dari Home atau Explore
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fill,minmax(260px,1fr))",
                gap: "20px",
              }}
            >
              {favorites.map((item) => {
                const event = item.event;

                return (
                  <div
                    key={item.id}
                    style={{
                      backgroundColor: "#161826",
                      borderRadius: "16px",
                      overflow: "hidden",
                      border: "1px solid #1e2235",
                    }}
                  >
                    <img
                      src={event.image}
                      alt={event.title}
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        cursor: "pointer",
                      }}
                      onClick={() =>
                        navigate(`/detail/${event.id}`)
                      }
                    />

                    <div
                      style={{
                        padding: "16px",
                      }}
                    >
                      <h3
                        style={{
                          margin: 0,
                          marginBottom: "8px",
                        }}
                      >
                        {event.title}
                      </h3>

                      <p
                        style={{
                          color: "#9ca3af",
                          fontSize: "13px",
                          marginBottom: "12px",
                        }}
                      >
                        {event.category?.name}
                      </p>

                      <button
                        onClick={() =>
                          removeFavorite(event.id)
                        }
                        style={{
                          width: "100%",
                          padding: "10px",
                          border: "none",
                          borderRadius: "10px",
                          backgroundColor: "#ef4444",
                          color: "#fff",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "8px",
                        }}
                      >
                        <Trash2 size={16} />
                        Hapus Favorit
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}