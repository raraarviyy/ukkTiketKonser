import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Receipt,
  Calendar,
  Loader2,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { api } from "../../api";

export default function History() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("history");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await api.getMyOrders();
      setOrders(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "paid":
        return {
          backgroundColor: "#052e16",
          color: "#4ade80",
        };
      case "pending":
        return {
          backgroundColor: "#78350f",
          color: "#fbbf24",
        };
      case "cancelled":
        return {
          backgroundColor: "#7f1d1d",
          color: "#fca5a5",
        };
      default:
        return {
          backgroundColor: "#1f2937",
          color: "#d1d5db",
        };
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
              fontSize: "24px",
              fontWeight: "800",
              marginBottom: "24px",
            }}
          >
            <Receipt color="#ec4899" />
            Riwayat Transaksi
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
                size={34}
                color="#ec4899"
                style={{
                  animation: "spin 1s linear infinite",
                }}
              />
              <span style={{ color: "#9ca3af" }}>
                Memuat riwayat transaksi...
              </span>
            </div>
          ) : error ? (
            <div
              style={{
                backgroundColor: "#7f1d1d",
                color: "#fca5a5",
                padding: "14px",
                borderRadius: "12px",
              }}
            >
              {error}
            </div>
          ) : orders.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "#161826",
                borderRadius: "20px",
                border: "1px solid #1e2235",
              }}
            >
              <Receipt
                size={48}
                color="#6b7280"
              />
              <h3>Belum ada transaksi</h3>
              <p
                style={{
                  color: "#9ca3af",
                }}
              >
                Kamu belum pernah melakukan pembelian tiket.
              </p>
            </div>
          ) : (
            <div
              style={{
                display: "grid",
                gap: "18px",
              }}
            >
              {orders.map((order) => (
                <div
                  key={order.id}
                  onClick={() => navigate(`/order/${order.id}`)}
                  style={{
                    backgroundColor: "#161826",
                    borderRadius: "18px",
                    border: "1px solid #1e2235",
                    padding: "20px",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "16px",
                    }}
                  >
                    <div>
                      <h3
                        style={{
                          margin: 0,
                          marginBottom: "6px",
                        }}
                      >
                        {order.event?.title}
                      </h3>
                      <div
                        style={{
                          color: "#9ca3af",
                          fontSize: "13px",
                        }}
                      >
                        {order.order_code}
                      </div>
                    </div>

                    <span
                      style={{
                        ...getStatusStyle(order.status),
                        padding: "4px 12px",
                        borderRadius: "999px",
                        fontSize: "12px",
                        fontWeight: "600",
                        height: "fit-content",
                      }}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "#38bdf8",
                      marginBottom: "12px",
                      fontSize: "13px",
                    }}
                  >
                    <Calendar size={14} />
                    {new Date(
                      order.created_at
                    ).toLocaleDateString("id-ID")}
                  </div>

                  <div
                    style={{
                      color: "#9ca3af",
                      fontSize: "14px",
                    }}
                  >
                    {order.quantity}x{" "}
                    {order.ticket_type?.name}
                  </div>

                  <div
                    style={{
                      marginTop: "12px",
                      color: "#ec4899",
                      fontWeight: "700",
                      fontSize: "18px",
                    }}
                  >
                    Rp{" "}
                    {Number(order.total).toLocaleString(
                      "id-ID"
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
