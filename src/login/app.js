// src/login/app.js
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Check, Sparkles, ArrowRight, User, Building2, Ticket, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const COLORS = {
  purple: "#a855f7", purpleLight: "#c084fc", pink: "#ec4899", cyan: "#38bdf8",
  bg: "#0b0c10", card: "#161826", border: "#1e2235", inputBg: "#1a1d2e",
  inputBorder: "#282c42", muted: "#9ca3af", text: "#f5f5fa", danger: "#ef4444",
};
const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

function useFloat({ ax = 20, ay = 20, speed = 0.0005, phase = 0 } = {}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const frame = useRef();
  useEffect(() => {
    const start = performance.now() + phase * 1000;
    const tick = (now) => { const t = (now - start) * speed; setPos({ x: Math.sin(t) * ax, y: Math.sin(t * 1.3) * ay }); frame.current = requestAnimationFrame(tick); };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line
  }, []);
  return pos;
}

function useDrift(period = 16000) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => { const progress = ((now - start) % (period * 2)) / (period * 2); const eased = progress < 0.5 ? progress * 2 : 2 - progress * 2; setT(eased); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [period]);
  return t;
}

function useSpin(durationMs = 700) {
  const [deg, setDeg] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => { const elapsed = (now - start) % durationMs; setDeg((elapsed / durationMs) * 360); frame = requestAnimationFrame(tick); };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs]);
  return deg;
}

export default function AuralisLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [role, setRole] = useState("user");
  const [showPw, setShowPw] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const drift = useDrift();
  const glowA = useFloat({ ax: 24, ay: 18, phase: 0 });
  const glowB = useFloat({ ax: 22, ay: 20, phase: 3 });

  const emailValid = /\S+@\S+\.\S+/.test(form.email);
  const canSubmit = emailValid && form.password.length >= 6;

  const handleChange = (key) => (e) => { setError(""); setForm(f => ({ ...f, [key]: e.target.value })); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setError("");

    setTimeout(() => {
      const result = login(form.email, form.password, role);
      setSubmitting(false);
      if (result.success) {
        setSubmitted(true);
        setTimeout(() => {
          if (role === "superadmin") navigate("/admin");
          else if (role === "organizer") navigate("/organizer");
          else navigate("/home");
        }, 900);
      } else {
        setError(result.error || "Login gagal. Coba lagi.");
      }
    }, 1200);
  };

  const bgScale = 1.05 + drift * 0.05;
  const bgTranslate = { x: -drift * 1.2, y: -drift * 0.8 };

  const roles = [
    { key: "user", label: "Penonton", icon: <User size={14} /> },
    { key: "organizer", label: "Organizer", icon: <Building2 size={14} /> },
    { key: "superadmin", label: "Super Admin", icon: <ShieldCheck size={14} /> },
  ];

  return (
    <div style={{ position: "relative", minHeight: "100vh", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", overflow: "hidden", fontFamily: FONT, color: COLORS.text, background: COLORS.bg }}>
      <style>{`
        .login-active-tab { background: linear-gradient(135deg, #ec4899 0%, #a855f7 100%); color: #fff !important; box-shadow: 0 4px 15px rgba(236,72,153,0.3); }
        .form-input-field:focus-within { border-color: #ec4899 !important; box-shadow: 0 0 0 3px rgba(236,72,153,0.15) !important; }
        @media (max-width: 480px) { .login-card { padding: 28px 20px !important; } }
      `}</style>

      <div style={{ position: "absolute", inset: 0, zIndex: 0, backgroundImage: "url(https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1800&h=1200&fit=crop)", backgroundSize: "cover", backgroundPosition: "center", filter: "brightness(0.35) saturate(1.1)", transform: `scale(${bgScale}) translate(${bgTranslate.x}%, ${bgTranslate.y}%)` }} />
      <div style={{ position: "absolute", inset: 0, zIndex: 0, background: "radial-gradient(ellipse at 50% 30%, rgba(11,12,16,0.5) 0%, rgba(11,12,16,0.92) 70%, #0b0c10 100%)" }} />
      <Glow size={420} top={-100} left={-120} color={COLORS.purple} pos={glowA} opacity={0.35} />
      <Glow size={380} bottom={-120} right={-100} color={COLORS.cyan} pos={glowB} opacity={0.3} />

      <div onClick={() => navigate("/")} style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", marginBottom: "28px" }}>
        <div style={{ padding: "8px 10px", background: "linear-gradient(135deg, #ec4899, #a855f7)", borderRadius: "12px" }}><Ticket size={22} color="#fff" /></div>
        <span style={{ fontSize: "1.6rem", fontWeight: "900", letterSpacing: "-0.5px" }}>Aur<span style={{ color: "#ec4899" }}>alis</span></span>
      </div>

      <div className="login-card" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 440, background: "rgba(22,24,38,0.85)", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: `1px solid ${COLORS.border}`, borderRadius: 24, padding: "36px 36px 32px", boxShadow: "0 30px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.05)", boxSizing: "border-box" }}>
        {submitted ? (
          <SuccessState email={form.email} role={role} />
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 24 }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: COLORS.cyan, background: "rgba(56,189,248,0.1)", border: "1px solid rgba(56,189,248,0.3)", padding: "5px 12px", borderRadius: 20, marginBottom: 12 }}>
                <Sparkles size={12} /> PORTAL AUTENTIKASI
              </span>
              <h1 style={{ fontSize: 26, fontWeight: 900, margin: "0 0 6px", letterSpacing: "-0.5px", color: "#fff" }}>Selamat Datang Kembali</h1>
              <p style={{ fontSize: 13.5, color: COLORS.muted, margin: 0 }}>Masuk ke akun Auralis Anda untuk melanjutkan</p>
            </div>

            {/* Role Tabs */}
            <div style={{ display: "flex", backgroundColor: COLORS.inputBg, padding: "4px", borderRadius: "12px", marginBottom: 24, border: `1px solid ${COLORS.border}`, gap: "3px" }}>
              {roles.map(r => (
                <button key={r.key} type="button" onClick={() => setRole(r.key)}
                  className={role === r.key ? "login-active-tab" : ""}
                  style={{ flex: 1, padding: "9px 6px", borderRadius: "10px", border: "none", fontWeight: "700", fontSize: "0.75rem", cursor: "pointer", color: COLORS.muted, background: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", transition: "all 0.2s", whiteSpace: "nowrap" }}>
                  {r.icon} {r.label}
                </button>
              ))}
            </div>

            {role === "superadmin" && (
              <div style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.3)", borderRadius: 12, padding: "10px 14px", marginBottom: 18, fontSize: 12, color: "#c084fc", display: "flex", alignItems: "center", gap: 8 }}>
                <ShieldCheck size={14} /> Gunakan: <strong style={{ color: "#fff" }}>admin@auralis.id</strong> / <strong style={{ color: "#fff" }}>admin123</strong>
              </div>
            )}

            <form style={{ display: "flex", flexDirection: "column", gap: 18 }} onSubmit={handleSubmit}>
              <Field label="Alamat Email" icon={<Mail size={16} />} type="email" required placeholder="nama@email.com" value={form.email} onChange={handleChange("email")} onFocus={() => setFocusField("email")} onBlur={() => setFocusField(null)} focused={focusField === "email"} />
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ fontSize: 13, fontWeight: 600, color: "#d8d6e2" }}>Kata Sandi</label>
                  <span onClick={() => alert("Reset Password dikirim ke email Anda.")} style={{ color: COLORS.cyan, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Lupa password?</span>
                </div>
                <div className="form-input-field" style={{ display: "flex", alignItems: "center", gap: 10, background: COLORS.inputBg, border: `1px solid ${COLORS.inputBorder}`, borderRadius: 12, padding: "0 14px", transition: "border-color .2s, box-shadow .2s" }}>
                  <span style={{ color: focusField === "password" ? COLORS.pink : "#8b889c", display: "flex" }}><Lock size={16} /></span>
                  <input type={showPw ? "text" : "password"} required placeholder="••••••••" value={form.password} onChange={handleChange("password")} onFocus={() => setFocusField("password")} onBlur={() => setFocusField(null)}
                    style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", padding: "13px 0", fontSize: 14, fontFamily: FONT }} />
                  <EyeToggle show={showPw} onToggle={() => setShowPw(s => !s)} />
                </div>
              </div>
              {error && <p style={{ color: COLORS.danger, fontSize: 12, margin: "-8px 0 0" }}>{error}</p>}
              <SubmitButton canSubmit={canSubmit} submitting={submitting} />
            </form>

            <p style={{ textAlign: "center", fontSize: 13, color: COLORS.muted, margin: "22px 0 0" }}>
              Belum punya akun?{" "}
              <span onClick={() => navigate("/register")} style={{ color: COLORS.pink, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>Daftar sekarang</span>
            </p>
          </>
        )}
      </div>
      <div style={{ position: "relative", zIndex: 1, marginTop: 24, color: COLORS.muted, fontSize: 13 }}>
        <span>Bergabung dengan 50k+ penonton konser musik</span>
      </div>
    </div>
  );
}

function Glow({ size, top, left, right, bottom, color, pos, opacity }) {
  return <div style={{ position: "absolute", width: size, height: size, top, left, right, bottom, borderRadius: "50%", background: color, filter: "blur(90px)", zIndex: 0, opacity, transform: `translate(${pos.x}px, ${pos.y}px)` }} />;
}

function Field({ label, icon, trailing, focused, error, ...inputProps }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#d8d6e2" }}>{label}</label>
      <div className="form-input-field" style={{ display: "flex", alignItems: "center", gap: 10, background: "#1a1d2e", border: `1px solid ${error ? "#ef4444" : "#282c42"}`, borderRadius: 12, padding: "0 14px", transition: "border-color .2s, box-shadow .2s" }}>
        <span style={{ color: focused ? "#ec4899" : "#8b889c", display: "flex" }}>{icon}</span>
        <input {...inputProps} style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#fff", padding: "13px 0", fontSize: 14, fontFamily: "'Inter', sans-serif" }} />
        {trailing}
      </div>
    </div>
  );
}

function EyeToggle({ show, onToggle }) {
  const [hover, setHover] = useState(false);
  return (
    <button type="button" onClick={onToggle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} aria-label="Toggle password" style={{ background: "none", border: "none", color: hover ? "#fff" : "#8b889c", cursor: "pointer", display: "flex", padding: 4, transition: "color .2s" }}>
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );
}

function SubmitButton({ canSubmit, submitting }) {
  const [hover, setHover] = useState(false);
  const spin = useSpin();
  const disabled = !canSubmit || submitting;
  return (
    <button type="submit" disabled={disabled} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "15px 0", borderRadius: 12, border: "none", cursor: disabled ? "not-allowed" : "pointer", fontSize: 14, fontWeight: 800, letterSpacing: "0.04em", color: "#fff", fontFamily: "'Inter', sans-serif", background: "linear-gradient(90deg, #ec4899, #a855f7)", opacity: canSubmit ? 1 : 0.45, boxShadow: canSubmit ? (hover ? "0 16px 36px rgba(236,72,153,0.35)" : "0 12px 30px rgba(168,85,247,0.25)") : "none", transform: hover && canSubmit && !submitting ? "translateY(-2px)" : "translateY(0)", transition: "transform .2s ease, box-shadow .2s ease, opacity .2s ease", marginTop: 4 }}>
      {submitting ? <span style={{ width: 18, height: 18, borderRadius: "50%", border: "2.5px solid rgba(255,255,255,0.35)", borderTopColor: "#fff", transform: `rotate(${spin}deg)` }} /> : <><span>MASUK KE PORTAL</span><ArrowRight size={16} /></>}
    </button>
  );
}

function SuccessState({ email, role }) {
  const roleLabel = role === "superadmin" ? "Super Admin" : role === "organizer" ? "Organizer" : "Penonton";
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", background: "linear-gradient(135deg, #ec4899, #a855f7)", boxShadow: "0 10px 30px rgba(236,72,153,0.4)" }}>
        <Check size={26} />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 900, margin: "0 0 8px" }}>Berhasil Masuk!</h2>
      <p style={{ fontSize: 13.5, color: "#9ca3af", margin: 0, lineHeight: "1.5" }}>
        Masuk sebagai <strong style={{ color: "#fff" }}>{email}</strong> ({roleLabel}).<br />Menghubungkan ke dashboard...
      </p>
    </div>
  );
}