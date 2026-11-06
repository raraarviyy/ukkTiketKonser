import { useEffect, useState } from "react";
import {
  Bell,
  CheckCheck,
  Ticket,
  CreditCard,
  AlertCircle,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { api } from "../../api";

export default function Notifications() {
  const [activeTab, setActiveTab] = useState("notifications");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [notifs, setNotifs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    api
      .getMyNotifications()
      .then((res) => setNotifs(res.data || []))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markRead = async (id) => {
    await api.markNotificationRead(id);

    setNotifs((prev) =>
      prev.map((n) =>
        n.id === id
          ? { ...n, is_read: true }
          : n
      )
    );
  };

  const markAll = async () => {
    await api.markAllNotificationsRead();

    setNotifs((prev) =>
      prev.map((n) => ({
        ...n,
        is_read: true,
      }))
    );
  };

  const getIcon = (type) => {
    switch (type) {
      case "payment":
        return <CreditCard size={20} color="#22c55e" />;

      case "booking":
        return <Ticket size={20} color="#ec4899" />;

      default:
        return <AlertCircle size={20} color="#38bdf8" />;
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
        }}
      >
        <Header
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div
          style={{
            padding: "30px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              marginBottom: "25px",
            }}
          >
            <h1
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: 0,
                fontSize: "28px",
                fontWeight: "800",
              }}
            >
              <Bell color="#ec4899" />
              Notifikasi
            </h1>

            {notifs.length > 0 && (
              <button
                onClick={markAll}
                style={{
                  background:
                    "linear-gradient(135deg,#ec4899,#db2777)",
                  border: "none",
                  color: "#fff",
                  padding:
                    "10px 16px",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <CheckCheck size={18} />
                Tandai Semua
              </button>
            )}
          </div>

          {loading && (
            <p
              style={{
                color: "#9ca3af",
              }}
            >
              Memuat notifikasi...
            </p>
          )}

          {!loading &&
            notifs.length === 0 && (
              <div
                style={{
                  background:
                    "#161826",
                  border:
                    "1px solid #1e2235",
                  borderRadius:
                    "20px",
                  padding: "40px",
                  textAlign:
                    "center",
                }}
              >
                <Bell
                  size={50}
                  color="#6b7280"
                />

                <h3>
                  Belum Ada Notifikasi
                </h3>

                <p
                  style={{
                    color:
                      "#9ca3af",
                  }}
                >
                  Semua informasi
                  transaksi dan tiket
                  akan muncul di sini.
                </p>
              </div>
            )}

          {notifs.map((n) => (
            <div
              key={n.id}
              onClick={() =>
                !n.is_read &&
                markRead(n.id)
              }
              style={{
                background:
                  n.is_read
                    ? "#161826"
                    : "rgba(236,72,153,.08)",

                border:
                  n.is_read
                    ? "1px solid #1e2235"
                    : "1px solid rgba(236,72,153,.3)",

                borderRadius:
                  "18px",

                padding: "18px",

                marginBottom:
                  "14px",

                cursor: "pointer",

                transition:
                  ".2s",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "14px",
                }}
              >
                {getIcon(n.type)}

                <div
                  style={{
                    flex: 1,
                  }}
                >
                  <div
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      alignItems:
                        "center",
                    }}
                  >
                    <strong>
                      {n.title}
                    </strong>

                    {!n.is_read && (
                      <span
                        style={{
                          background:
                            "#ec4899",

                          color:
                            "#fff",

                          fontSize:
                            "11px",

                          padding:
                            "4px 8px",

                          borderRadius:
                            "999px",
                        }}
                      >
                        Baru
                      </span>
                    )}
                  </div>

                  <p
                    style={{
                      color:
                        "#9ca3af",
                      marginTop:
                        "8px",
                      marginBottom:
                        "10px",
                    }}
                  >
                    {n.message}
                  </p>

                  <small
                    style={{
                      color:
                        "#6b7280",
                    }}
                  >
                    {new Date(
                      n.created_at
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </small>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}