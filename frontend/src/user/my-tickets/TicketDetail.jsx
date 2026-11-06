import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Ticket,
  Calendar,
  MapPin,
  ArrowLeft,
  User,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { api } from "../../api";

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("tickets");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTicket = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.getTicketById(id);
      setTicket(res.data);
    } catch (err) {
      setError(err.message || "Gagal memuat detail tiket.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadTicket();
  }, [loadTicket]);

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

        <div style={{ padding: "28px", maxWidth: "800px", margin: "0 auto" }}>
          <button
            onClick={() => navigate("/my-tickets")}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "transparent",
              border: "none",
              color: "#ec4899",
              cursor: "pointer",
              fontWeight: "600",
              fontSize: "14px",
              marginBottom: "20px",
              padding: 0,
            }}
          >
            <ArrowLeft size={18} />
            Kembali ke Tiket Saya
          </button>

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
              <span style={{ color: "#9ca3af" }}>Memuat e-tiket...</span>
            </div>
          ) : error ? (
            <div
              style={{
                backgroundColor: "#7f1d1d",
                color: "#fca5a5",
                padding: "16px",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          ) : !ticket ? (
            <div
              style={{
                textAlign: "center",
                padding: "60px 20px",
                backgroundColor: "#161826",
                borderRadius: "20px",
                border: "1px solid #1e2235",
              }}
            >
              <Ticket size={48} color="#6b7280" />
              <h3>Tiket Tidak Ditemukan</h3>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: "#161826",
                borderRadius: "24px",
                border: "1px solid #1e2235",
                overflow: "hidden",
                boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
              }}
            >
              {ticket.event?.image && (
                <div style={{ width: "100%", height: "240px", overflow: "hidden" }}>
                  <img
                    src={ticket.event.image}
                    alt={ticket.event.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              )}

              <div style={{ padding: "28px" }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    marginBottom: "16px",
                    flexWrap: "wrap",
                    gap: "12px",
                  }}
                >
                  <div>
                    <span
                      style={{
                        display: "inline-block",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#38bdf8",
                        marginBottom: "4px",
                      }}
                    >
                      {ticket.event?.category?.name || "KONSER MUSIK"}
                    </span>
                    <h1
                      style={{
                        fontSize: "24px",
                        fontWeight: "900",
                        margin: "0 0 6px",
                      }}
                    >
                      {ticket.event?.title}
                    </h1>
                    <p style={{ color: "#9ca3af", margin: 0, fontSize: "14px" }}>
                      {ticket.event?.artist}
                    </p>
                  </div>

                  <span
                    style={{
                      ...getStatusStyle(ticket.status),
                      padding: "6px 14px",
                      borderRadius: "999px",
                      fontSize: "12px",
                      fontWeight: "700",
                      textTransform: "uppercase",
                    }}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px",
                    margin: "24px 0",
                    padding: "16px",
                    backgroundColor: "#0f111a",
                    borderRadius: "16px",
                    border: "1px solid #282c42",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Calendar size={18} color="#ec4899" />
                    <div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>Waktu & Tanggal</div>
                      <div style={{ fontSize: "13px", fontWeight: "600" }}>
                        {ticket.event?.event_date
                          ? new Date(ticket.event.event_date).toLocaleDateString("id-ID", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <MapPin size={18} color="#ec4899" />
                    <div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>Lokasi Venue</div>
                      <div style={{ fontSize: "13px", fontWeight: "600" }}>
                        {ticket.event?.location || ticket.event?.venue || "-"}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <Ticket size={18} color="#ec4899" />
                    <div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>Jenis Tiket</div>
                      <div style={{ fontSize: "13px", fontWeight: "600" }}>
                        {ticket.ticket_type?.name}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <User size={18} color="#ec4899" />
                    <div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>Pemegang Tiket</div>
                      <div style={{ fontSize: "13px", fontWeight: "600" }}>
                        {ticket.user?.name || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "24px",
                    background: "linear-gradient(180deg, #121420 0%, #0b0c10 100%)",
                    borderRadius: "20px",
                    border: "1px dashed #282c42",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontSize: "13px", color: "#9ca3af", marginBottom: "8px" }}>
                    Kode Tiket Unik
                  </div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: "900",
                      letterSpacing: "2px",
                      color: "#ec4899",
                      marginBottom: "16px",
                    }}
                  >
                    {ticket.ticket_code}
                  </div>

                  {ticket.qr_code_url ? (
                    <div
                      style={{
                        padding: "12px",
                        backgroundColor: "#fff",
                        borderRadius: "16px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                      }}
                    >
                      <img
                        src={ticket.qr_code_url}
                        alt="QR Code Tiket"
                        style={{
                          width: "180px",
                          height: "180px",
                          display: "block",
                          objectFit: "contain",
                        }}
                      />
                    </div>
                  ) : null}

                  <p
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                      marginTop: "16px",
                      maxWidth: "320px",
                    }}
                  >
                    Tunjukkan QR code ini kepada petugas saat check-in di lokasi acara.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
