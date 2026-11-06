import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2,
  Ticket,
  QrCode,
  BarChart3,
  MapPin,
  Calendar,
  CheckCircle2,
  Sparkles,
  Zap,
  Loader2,
  ArrowRight,
  Menu,
  X,
} from "lucide-react";
import { api } from "../api/index";
import { THEME } from "../theme";

const LANDING_EVENT_LIMIT = 10;

export default function AuralisPortal() {
  const navigate = useNavigate();

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchEvents = async () => {
      try {
        setLoadingEvents(true);
        const data = await api.getFeaturedEvents(LANDING_EVENT_LIMIT);
        if (mounted) setEvents(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Gagal memuat event:", err);
      } finally {
        if (mounted) setLoadingEvents(false);
      }
    };

    fetchEvents();

    const handleDataChanged = () => fetchEvents();
    window.addEventListener("auralis:data-changed", handleDataChanged);

    return () => {
      mounted = false;
      window.removeEventListener("auralis:data-changed", handleDataChanged);
    };
  }, []);

  const goLogin = () => navigate("/login");
  const goRegister = () => navigate("/register");

  // UBAH DI SINI: Tombol Pesan Tiket langsung ke halaman Detail, BUKAN ke Login
  const handleBooking = (eventItem) => {
    navigate(`/detail/${eventItem.id}`);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: THEME.bg,
        color: THEME.text,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
        overflowX: "hidden",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        .aur-btn-gradient {
          background: ${THEME.gradient};
          color: #fff;
          transition: opacity .2s ease, transform .2s ease, box-shadow .2s ease;
        }
        .aur-btn-gradient:hover {
          opacity: .92;
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(236,72,153,0.35);
        }
        .aur-card-hover {
          transition: transform .3s ease, border-color .3s ease, box-shadow .3s ease;
        }
        .aur-card-hover:hover {
          transform: translateY(-6px);
          border-color: rgba(236,72,153,0.45) !important;
          box-shadow: 0 16px 32px rgba(236,72,153,0.15);
        }
        .aur-nav-links { display: flex; }
        .aur-mobile-menu-btn { display: none; }
        .aur-hero { grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); }
        .aur-events-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 24px;
        }
        .aur-solutions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
        }

        @media (max-width: 900px) {
          .aur-nav-links { display: none !important; }
          .aur-mobile-menu-btn { display: flex !important; }
        }
        @media (max-width: 640px) {
          .aur-hero { grid-template-columns: 1fr; }
          .aur-events-grid { grid-template-columns: 1fr; gap: 16px; }
          .aur-solutions-grid { grid-template-columns: 1fr; gap: 16px; }
        }
        @media (max-width: 480px) {
          .aur-hero-title { font-size: 1.75rem !important; }
        }
      `}</style>

      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          backgroundColor: "rgba(11,12,16,0.92)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: `1px solid ${THEME.border}`,
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div
            onClick={() => navigate("/")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                padding: "8px 10px",
                background: THEME.gradient,
                borderRadius: 12,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ticket size={20} color="#fff" />
            </div>
            <span
              style={{
                fontSize: "1.35rem",
                fontWeight: 900,
                letterSpacing: "-0.5px",
                color: THEME.text,
              }}
            >
              Aur<span style={{ color: THEME.pink }}>alis</span>
            </span>
          </div>

          <div
            className="aur-nav-links"
            style={{
              alignItems: "center",
              gap: 28,
              fontSize: "0.9rem",
              fontWeight: 500,
            }}
          >
            <a
              href="#concert-list"
              style={{ color: THEME.muted, textDecoration: "none" }}
            >
              Jadwal Konser
            </a>
            <a
              href="#venue-solutions"
              style={{ color: THEME.muted, textDecoration: "none" }}
            >
              Solusi Venue
            </a>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <button
              onClick={goLogin}
              style={{
                padding: "9px 16px",
                backgroundColor: "transparent",
                border: `1px solid ${THEME.borderStrong}`,
                color: THEME.text,
                borderRadius: 10,
                fontWeight: 600,
                cursor: "pointer",
                fontSize: "0.85rem",
                whiteSpace: "nowrap",
              }}
            >
              Masuk
            </button>
            <button
              onClick={goRegister}
              className="aur-btn-gradient"
              style={{
                padding: "10px 16px",
                border: "none",
                borderRadius: 10,
                fontWeight: 700,
                cursor: "pointer",
                fontSize: "0.85rem",
                display: "flex",
                alignItems: "center",
                gap: 6,
                whiteSpace: "nowrap",
              }}
            >
              <Building2 size={14} />
              <span>Daftar</span>
            </button>

            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className="aur-mobile-menu-btn"
              aria-label="Menu"
              style={{
                width: 40,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                background: "transparent",
                border: `1px solid ${THEME.borderStrong}`,
                borderRadius: 10,
                color: THEME.text,
                cursor: "pointer",
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div
            style={{
              borderTop: `1px solid ${THEME.border}`,
              padding: "12px 20px 16px",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <a
              href="#concert-list"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: THEME.muted,
                textDecoration: "none",
                padding: "10px 0",
                fontSize: "0.9rem",
              }}
            >
              Jadwal Konser
            </a>
            <a
              href="#venue-solutions"
              onClick={() => setMobileMenuOpen(false)}
              style={{
                color: THEME.muted,
                textDecoration: "none",
                padding: "10px 0",
                fontSize: "0.9rem",
              }}
            >
              Solusi Venue
            </a>
          </div>
        )}
      </nav>

      <section
        className="aur-hero"
        style={{
          maxWidth: 1240,
          margin: "48px auto 64px",
          padding: "0 20px",
          display: "grid",
          gap: 40,
          alignItems: "center",
        }}
      >
        <div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "6px 14px",
              borderRadius: 20,
              backgroundColor: "rgba(236,72,153,0.1)",
              border: "1px solid rgba(236,72,153,0.3)",
              color: THEME.pink,
              fontSize: "0.75rem",
              fontWeight: 700,
              marginBottom: 20,
            }}
          >
            <Sparkles size={14} />
            AURALIS TICKETING ECOSYSTEM
          </div>

          <h1
            className="aur-hero-title"
            style={{
              fontSize: "clamp(1.9rem, 4.2vw, 3.4rem)",
              fontWeight: 900,
              lineHeight: 1.15,
              marginBottom: 20,
              letterSpacing: "-1px",
              color: THEME.text,
            }}
          >
            Pesan Tiket Konser
            <br />
            <span
              style={{
                background: THEME.gradient,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Tanpa Ribet & Aman
            </span>
          </h1>

          <p
            style={{
              color: THEME.muted,
              fontSize: "1rem",
              lineHeight: 1.7,
              marginBottom: 28,
              maxWidth: 520,
            }}
          >
            Dapatkan e-ticket instan untuk konser musik favoritmu. Untuk
            pengelola venue atau EO, daftarkan tempatmu untuk sistem gate
            scanner dan laporan otomatis.
          </p>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <a
              href="#concert-list"
              className="aur-btn-gradient"
              style={{
                padding: "13px 24px",
                borderRadius: 12,
                textDecoration: "none",
                fontSize: "0.92rem",
                fontWeight: 700,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Ticket size={18} />
              Lihat Konser
            </a>
            <button
              onClick={goRegister}
              style={{
                padding: "13px 24px",
                borderRadius: 12,
                backgroundColor: "rgba(255,255,255,0.04)",
                border: `1px solid ${THEME.borderStrong}`,
                color: THEME.text,
                fontSize: "0.92rem",
                fontWeight: 600,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Building2 size={18} color={THEME.purple} />
              Registrasi Venue
            </button>
          </div>
        </div>

        <div
          style={{
            backgroundColor: THEME.surface,
            borderRadius: 24,
            padding: "clamp(20px, 4vw, 32px)",
            border: `1px solid ${THEME.border}`,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -60,
              right: -60,
              width: 180,
              height: 180,
              borderRadius: "50%",
              background: THEME.gradient,
              opacity: 0.15,
              filter: "blur(40px)",
              pointerEvents: "none",
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
              position: "relative",
            }}
          >
            <Zap color={THEME.pink} size={24} />
            <h3
              style={{
                fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
                fontWeight: 800,
                color: THEME.text,
                margin: 0,
              }}
            >
              Alur Pemesanan Cepat & Aman
            </h3>
          </div>

          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: 14,
              color: THEME.muted,
              fontSize: "0.88rem",
              position: "relative",
            }}
          >
            {[
              "Pilih Konser & Kategori Tiket",
              "Login / Verifikasi Akun",
              "Pembayaran QRIS / E-Wallet Instan",
              "E-Ticket QR Code masuk ke HP",
            ].map((t, i) => (
              <li
                key={i}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <CheckCircle2 size={16} color={THEME.success} />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="concert-list"
        style={{
          maxWidth: 1240,
          margin: "0 auto 72px",
          padding: "0 20px",
          scrollMarginTop: 90,
        }}
      >
        <div style={{ marginBottom: 28 }}>
          <span
            style={{
              color: THEME.pink,
              fontWeight: 700,
              fontSize: "0.82rem",
              letterSpacing: 1,
            }}
          >
            TIKET TERSEDIA HARI INI
          </span>
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 800,
              marginTop: 4,
              color: THEME.text,
            }}
          >
            Jadwal Konser Musik Mendatang
          </h2>
        </div>

        {loadingEvents ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: 200,
              flexDirection: "column",
              gap: 12,
            }}
          >
            <Loader2
              size={32}
              color={THEME.pink}
              style={{ animation: "spin 1s linear infinite" }}
            />
            <span style={{ color: THEME.muted, fontSize: 14 }}>
              Memuat konser...
            </span>
          </div>
        ) : events.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: THEME.surface,
              borderRadius: 20,
              border: `1px dashed ${THEME.borderStrong}`,
            }}
          >
            <Ticket size={44} color={THEME.dim} />
            <h3 style={{ margin: "12px 0 4px", color: THEME.text }}>
              Belum ada konser tersedia
            </h3>
            <p style={{ color: THEME.muted, fontSize: 13, margin: 0 }}>
              Pantau terus untuk update konser terbaru.
            </p>
          </div>
        ) : (
          <div className="aur-events-grid">
            {events.map((evt) => (
              <div
                key={evt.id}
                className="aur-card-hover"
                style={{
                  backgroundColor: THEME.surface,
                  borderRadius: 20,
                  overflow: "hidden",
                  border: `1px solid ${THEME.border}`,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    height: 170,
                    backgroundColor: THEME.surfaceAlt,
                  }}
                >
                  {evt.image && (
                    <img
                      src={evt.image}
                      alt={evt.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                      }}
                    />
                  )}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(180deg, transparent 40%, rgba(11,12,16,0.9) 100%)",
                      pointerEvents: "none",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      backgroundColor: "rgba(11,12,16,0.85)",
                      color: THEME.pink,
                      padding: "4px 10px",
                      borderRadius: 14,
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      border: `1px solid ${THEME.pink}`,
                    }}
                  >
                    {evt.category?.name || evt.category || "KONSER"}
                  </span>
                </div>

                <div
                  style={{
                    padding: 18,
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                    justifyContent: "space-between",
                    gap: 14,
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: THEME.purple,
                        fontWeight: 700,
                        fontSize: "0.78rem",
                      }}
                    >
                      {evt.artist || "Berbagai Artis"}
                    </span>
                    <h3
                      style={{
                        fontSize: "1.05rem",
                        fontWeight: 800,
                        margin: "4px 0 10px",
                        lineHeight: 1.3,
                        color: THEME.text,
                      }}
                    >
                      {evt.title}
                    </h3>

                    <div
                      style={{
                        fontSize: "0.82rem",
                        color: THEME.muted,
                        display: "flex",
                        flexDirection: "column",
                        gap: 6,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          minWidth: 0,
                        }}
                      >
                        <Calendar
                          size={14}
                          color={THEME.pink}
                          style={{ flexShrink: 0 }}
                        />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {evt.date ||
                            (evt.event_date
                              ? new Date(evt.event_date).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })
                              : "-")}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          minWidth: 0,
                        }}
                      >
                        <MapPin
                          size={14}
                          color={THEME.purple}
                          style={{ flexShrink: 0 }}
                        />
                        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {evt.venue} {evt.city ? `, ${evt.city}` : ""}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* TOMBOL PESAN TIKET -> LANGSUNG KE DETAIL */}
                  <button
                    onClick={() => handleBooking(evt)}
                    className="aur-btn-gradient"
                    style={{
                      width: "100%",
                      padding: "10px 14px",
                      borderRadius: 10,
                      border: "none",
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                  >
                    Pesan Tiket
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section
        id="venue-solutions"
        style={{
          backgroundColor: THEME.surface,
          padding: "clamp(48px, 8vw, 72px) 20px",
          borderTop: `1px solid ${THEME.border}`,
        }}
      >
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <span
              style={{
                color: THEME.pink,
                fontWeight: 700,
                fontSize: "0.82rem",
                letterSpacing: 1,
              }}
            >
              UNTUK PROMOTOR & ORGANISASI VENUE
            </span>
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.2rem)",
                fontWeight: 800,
                marginTop: 8,
                color: THEME.text,
              }}
            >
              Solusi Pengelolaan Event & Tempat
            </h2>
          </div>

          <div className="aur-solutions-grid">
            {[
              {
                icon: Building2,
                title: "Atur Jadwal & Slot Venue",
                desc: "Atur kalender booking venue, tipe tribun, dan reservasi dalam satu dashboard terpusat.",
              },
              {
                icon: QrCode,
                title: "Gate QR Scanner",
                desc: "Validasi tiket penonton secara otomatis di pintu masuk tanpa hambatan antrean.",
              },
              {
                icon: BarChart3,
                title: "Laporan Real-Time",
                desc: "Pantau total penjualan tiket dan pencairan dana langsung dari portal statistik mitra.",
              },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: THEME.surfaceAlt,
                  padding: 26,
                  borderRadius: 20,
                  border: `1px solid ${THEME.border}`,
                }}
              >
                <div
                  style={{
                    display: "inline-flex",
                    padding: 12,
                    borderRadius: 12,
                    background: "rgba(236,72,153,0.1)",
                    marginBottom: 16,
                  }}
                >
                  <Icon size={24} color={THEME.pink} />
                </div>
                <h3
                  style={{
                    fontSize: "1.05rem",
                    fontWeight: 800,
                    marginBottom: 8,
                    color: THEME.text,
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: THEME.muted,
                    fontSize: "0.86rem",
                    lineHeight: 1.6,
                    margin: 0,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer
        style={{
          borderTop: `1px solid ${THEME.border}`,
          padding: "28px 20px",
          textAlign: "center",
          color: THEME.dim,
          fontSize: "0.82rem",
        }}
      >
        <p style={{ margin: 0 }}>
          Auralis Indonesia - Ecosystem for Ticketing & Venue Management.
        </p>
      </footer>
    </div>
  );
}