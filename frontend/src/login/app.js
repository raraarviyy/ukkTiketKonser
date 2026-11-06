import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Mail, Lock, Eye, EyeOff, Check, Sparkles, ArrowRight, Ticket, Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { THEME } from "../theme";

export default function AuralisLogin() {
  const navigate = useNavigate();
  const location = useLocation(); // IMPORT UNTUK MENGAMBIL STATE REDIRECT
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [focus, setFocus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const canSubmit = /\S+@\S+\.\S+/.test(form.email) && form.password.length >= 6;

  const handleChange = (key) => (e) => {
    setError("");
    setForm((p) => ({ ...p, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim()) return setError("Email wajib diisi.");
    if (!/\S+@\S+\.\S+/.test(form.email.trim())) return setError("Format email tidak valid.");
    if (!form.password) return setError("Password wajib diisi.");
    if (submitting) return;

    setSubmitting(true);
    try {
      const result = await login(form.email.trim(), form.password);
      if (!result.success) {
        setError(result.error || "Login gagal. Coba lagi.");
        return;
      }
      setSubmitted(true);
      const role = result.role;
      
      // AMBIL URL REDIRECT (JIKA USER TADI MAU BELI TIKET)
      const redirectUrl = location.state?.redirectAfterLogin;

      setTimeout(() => {
        if (redirectUrl) {
          navigate(redirectUrl); // Balik ke halaman detail event
        } else if (role === "Admin") {
          navigate("/admin");
        } else if (role === "Penyelenggara") {
          navigate("/organizer");
        } else {
          navigate("/home");
        }
      }, 900);
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat login.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: THEME.bg, padding: "60px 20px 40px", fontFamily: "'Inter', sans-serif", color: THEME.text, position: "relative", overflow: "hidden" }}>
      <style>{`
        .aur-login-input:focus-within {
          border-color: ${THEME.pink} !important;
          box-shadow: 0 0 0 3px rgba(236,72,153,0.15) !important;
        }
        .aur-login-card { padding: 40px 32px 32px; }
        @media (max-width: 480px) { .aur-login-card { padding: 28px 20px 24px !important; } }
      `}</style>

      <div style={{ position: "absolute", top: -120, left: -120, width: 400, height: 400, borderRadius: "50%", background: THEME.purple, filter: "blur(120px)", opacity: 0.2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: THEME.pink, filter: "blur(120px)", opacity: 0.2, pointerEvents: "none" }} />

      <div onClick={() => navigate("/")} style={{ position: "absolute", top: 24, left: 24, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", zIndex: 2 }}>
        <div style={{ padding: "8px 10px", background: THEME.gradient, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ticket size={20} color="#fff" />
        </div>
        <span style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.5px", color: THEME.text }}>
          Aur<span style={{ color: THEME.pink }}>alis</span>
        </span>
      </div>

      <div className="aur-login-card" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 420, background: "rgba(22,24,38,0.92)", backdropFilter: "blur(20px)", border: `1px solid ${THEME.border}`, borderRadius: 24, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center", background: THEME.gradient, boxShadow: "0 10px 30px rgba(236,72,153,0.4)" }}>
              <Check size={26} color="#fff" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 8px", color: THEME.text }}>Berhasil Masuk</h2>
            <p style={{ fontSize: 13, color: THEME.muted, margin: 0 }}>Menghubungkan ke dashboard...</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: THEME.pink, background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", padding: "5px 12px", borderRadius: 20, marginBottom: 14 }}>
                <Sparkles size={12} /> WELCOME BACK
              </div>
              <h1 style={{ fontSize: "clamp(1.3rem, 4vw, 1.5rem)", fontWeight: 900, margin: "0 0 6px", letterSpacing: "-0.5px", color: THEME.text }}>Selamat Datang</h1>
              <p style={{ fontSize: 13, color: THEME.muted, margin: 0 }}>Masuk ke akun Auralis Anda</p>
            </div>

            <form style={{ display: "flex", flexDirection: "column", gap: 18 }} onSubmit={handleSubmit}>
              <Field
                label="Email"
                icon={<Mail size={16} />}
                type="email"
                placeholder="nama@email.com"
                value={form.email}
                onChange={handleChange("email")}
                onFocus={() => setFocus("email")}
                onBlur={() => setFocus(null)}
                focused={focus === "email"}
                autoComplete="email"
              />

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: 12, fontWeight: 600, color: THEME.muted }}>Password</label>
                  <span onClick={() => alert("Reset password dikirim ke email Anda.")} style={{ color: THEME.pink, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Lupa password?</span>
                </div>

                <div className="aur-login-input" style={{ display: "flex", alignItems: "center", gap: 10, background: THEME.surfaceAlt, border: `1px solid ${THEME.borderStrong}`, borderRadius: 12, padding: "0 14px", transition: "all 0.2s" }}>
                  <Lock size={16} color={focus === "password" ? THEME.pink : THEME.dim} />
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={form.password}
                    onChange={handleChange("password")}
                    onFocus={() => setFocus("password")}
                    onBlur={() => setFocus(null)}
                    autoComplete="current-password"
                    style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: THEME.text, padding: "13px 0", fontSize: 14, fontFamily: "inherit" }}
                  />
                  <button type="button" onClick={() => setShowPw((v) => !v)} style={{ background: "none", border: "none", color: THEME.dim, cursor: "pointer", padding: 4, display: "flex", flexShrink: 0 }}>
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {error && <p style={{ color: THEME.danger, fontSize: 12, margin: 0 }}>{error}</p>}

              <button type="submit" disabled={!canSubmit || submitting} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 12, border: "none", cursor: !canSubmit || submitting ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", color: "#fff", background: THEME.gradient, opacity: !canSubmit || submitting ? 0.5 : 1, boxShadow: "0 10px 30px rgba(236,72,153,0.25)", transition: "all 0.2s" }}>
                {submitting ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> MEMPROSES...</> : <>MASUK <ArrowRight size={16} /></>}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: 13, color: THEME.muted, margin: "22px 0 0" }}>
              Belum punya akun?{" "}
              <span 
                onClick={() => navigate("/register", { state: { redirectAfterLogin: location.state?.redirectAfterLogin } })} 
                style={{ color: THEME.pink, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                Daftar sekarang
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, icon, focused, ...inputProps }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: THEME.muted }}>{label}</label>
      <div className="aur-login-input" style={{ display: "flex", alignItems: "center", gap: 10, background: THEME.surfaceAlt, border: `1px solid ${THEME.borderStrong}`, borderRadius: 12, padding: "0 14px", transition: "all 0.2s" }}>
        <span style={{ color: focused ? THEME.pink : THEME.dim, display: "flex", flexShrink: 0 }}>{icon}</span>
        <input {...inputProps} style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: THEME.text, padding: "13px 0", fontSize: 14, fontFamily: "inherit" }} />
      </div>
    </div>
  );
}