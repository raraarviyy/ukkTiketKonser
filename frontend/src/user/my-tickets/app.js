import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Ticket,
  Calendar,
  QrCode,
  Loader2,
} from "lucide-react";

import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { api } from "../../api";

export default function MyTickets() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tickets");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      setLoading(true);

      const res = await api.getMyTickets();

      setTickets(res.data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }


  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "used":
        return {
          backgroundColor: "#374151",
          color: "#d1d5db",
        };

      case "cancelled":
        return {
          backgroundColor: "#7f1d1d",
          color: "#fca5a5",
        };

      default:
        return {
          backgroundColor: "rgba(236,72,153,.15)",
          color: "#ec4899",
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
    > <style>{`
.tickets-content {
padding: 28px;
}
    .tickets-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill,minmax(320px,1fr));
      gap: 20px;
    }

    @media(max-width:640px){
      .tickets-content{
        padding:16px;
      }

      .tickets-grid{
        grid-template-columns:1fr;
      }
    }
  `}</style>

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

        <div className="tickets-content">
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
            <Ticket color="#ec4899" />
            My Tickets
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
                Loading tickets...
              </span>
            </div>
          ) : error ? (
            <div
              style={{
                backgroundColor: "#7f1d1d",
                padding: "14px",
                borderRadius: "12px",
                color: "#fca5a5",
              }}
            >
              {error}
            </div>
          ) : tickets.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "#161826",
                borderRadius: "20px",
                border: "1px solid #1e2235",
              }}
            >
              <Ticket
                size={48}
                color="#6b7280"
              />

              <h3>Belum ada tiket</h3>

              <p
                style={{
                  color: "#9ca3af",
                }}
              >
                Kamu belum membeli tiket event.
              </p>
            </div>
          ) : (
            <div className="tickets-grid">
              {tickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() =>
                    navigate(`/tickets/${ticket.id}`)
                  }
                  style={{
                    backgroundColor: "#161826",
                    borderRadius: "18px",
                    border: "1px solid #1e2235",
                    overflow: "hidden",
                    cursor: "pointer",
                  }}
                >
                  <div
                    style={{
                      padding: "18px",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "14px",
                      }}
                    >
                      <div>
                        <h3
                          style={{
                            margin: 0,
                            marginBottom: "6px",
                            fontSize: "18px",
                          }}
                        >
                          {ticket.event?.title}
                        </h3>

                        <p
                          style={{
                            margin: 0,
                            color: "#9ca3af",
                            fontSize: "13px",
                          }}
                        >
                          {ticket.ticket_type?.name}
                        </p>
                      </div>

                      <span
                        style={{
                          ...getStatusStyle(ticket.status),
                          padding: "4px 10px",
                          borderRadius: "999px",
                          fontSize: "12px",
                          fontWeight: "600",
                        }}
                      >
                        {ticket.status}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        color: "#38bdf8",
                        fontSize: "13px",
                        marginBottom: "8px",
                      }}
                    >
                      <Calendar size={14} />

                      {ticket.event?.event_date
                        ? new Date(
                          ticket.event.event_date
                        ).toLocaleDateString("id-ID")
                        : "-"}
                    </div>

                    <div
                      style={{
                        color: "#9ca3af",
                        fontSize: "13px",
                        marginBottom: "16px",
                      }}
                    >
                      Kode Tiket:
                      <br />
                      <strong
                        style={{
                          color: "#fff",
                        }}
                      >
                        {ticket.ticket_code}
                      </strong>
                    </div>

                    {ticket.qr_code_url && (
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={ticket.qr_code_url}
                          alt="QR Code"
                          style={{
                            width: "120px",
                            height: "120px",
                            objectFit: "contain",
                            backgroundColor: "#fff",
                            padding: "8px",
                            borderRadius: "12px",
                          }}
                        />
                      </div>
                    )}

                    <div
                      style={{
                        marginTop: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "8px",
                        color: "#ec4899",
                        fontWeight: "600",
                      }}
                    >
                      <QrCode size={16} />
                      View Ticket
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};
