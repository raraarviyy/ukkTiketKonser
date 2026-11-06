import React, { useMemo, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  User, Mail, Lock, ShieldCheck, Eye, EyeOff, Check, Sparkles, ArrowRight, Building2, Ticket, Phone, Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { THEME } from "../theme";

const STRENGTH_META = [
  { label: "Sangat Lemah", color: "#ef4444" },
  { label: "Lemah", color: "#f97316" },
  { label: "Cukup", color: "#eab308" },
  { label: "Baik", color: "#38bdf8" },
  { label: "Sangat Kuat", color: "#34d399" },
];

function scorePassword(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

export default function AuralisRegister() {
  const navigate = useNavigate();
  const location = useLocation(); // AMBIL STATE REDIRECT
  const { register } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [role, setRole] = useState("user");
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [focus, setFocus] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const strength = useMemo(() => scorePassword(form.password), [form.password]);
  const confirmMismatch = form.confirm.length > 0 && form.confirm !== form.password;

  const canSubmit = form.name.trim().length > 1 && /\S+@\S+\.\S+/.test(form.email) && form.phone.trim().length >= 9 && strength >= 2 && form.confirm === form.password && agreed;

  const handleChange = (key) => (e) => {
    setError("");
    setForm((f) => ({ ...f, [key]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    setError("");

    const backendRole = role === "organizer" ? "Penyelenggara" : "User";

    try {
      const result = await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: backendRole,
        phone_number: form.phone.trim(),
        ...(backendRole === "Penyelenggara" && { organization_name: form.name.trim() }),
      });

      if (!result.success) {
        setError(result.error || "Registrasi gagal. Coba lagi.");
        return;
      }

      setSubmitted(true);
      
      // SETELAH DAFTAR, LEMPAR KE LOGIN SAMBIL BAWA STATE REDIRECT
      const redirectUrl = location.state?.redirectAfterLogin;
      setTimeout(() => {
        navigate("/login", { state: { redirectAfterLogin: redirectUrl } });
      }, 1500);

    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat mendaftar.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: THEME.bg, padding: "60px 20px 40px", fontFamily: "'Inter', sans-serif", color: THEME.text, position: "relative", overflow: "hidden" }}>
      <style>{`
        * { box-sizing: border-box; }
        .aur-reg-input:focus-within { border-color: ${THEME.pink} !important; box-shadow: 0 0 0 3px rgba(236,72,153,0.15) !important; }
        .aur-reg-card { padding: 36px 32px 30px; }
        .aur-role-btn { flex: 1; padding: 10px; border-radius: 10px; border: none; font-weight: 700; font-size: 0.8rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s; background: transparent; color: ${THEME.muted}; }
        .aur-role-btn.active { background: ${THEME.gradient}; color: #fff; box-shadow: 0 4px 15px rgba(236,72,153,0.3); }
        .aur-pw-grid { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); gap: 14px; width: 100%; }
        @media (max-width: 480px) { .aur-reg-card { padding: 28px 20px 24px !important; } .aur-pw-grid { grid-template-columns: minmax(0, 1fr); } }
      `}</style>

      <div style={{ position: "absolute", top: -120, left: -120, width: 400, height: 400, borderRadius: "50%", background: THEME.purple, filter: "blur(120px)", opacity: 0.2, pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -120, right: -120, width: 400, height: 400, borderRadius: "50%", background: THEME.pink, filter: "blur(120px)", opacity: 0.2, pointerEvents: "none" }} />

      <div onClick={() => navigate("/")} style={{ position: "absolute", top: 24, left: 24, display: "flex", alignItems: "center", gap: 10, cursor: "pointer", zIndex: 2 }}>
        <div style={{ padding: "8px 10px", background: THEME.gradient, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Ticket size={20} color="#fff" />
        </div>
        <span style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.5px", color: THEME.text }}>Aur<span style={{ color: THEME.pink }}>alis</span></span>
      </div>

      <div className="aur-reg-card" style={{ position: "relative", zIndex: 1, width: "100%", maxWidth: 460, background: "rgba(22,24,38,0.92)", backdropFilter: "blur(20px)", border: `1px solid ${THEME.border}`, borderRadius: 24, boxShadow: "0 30px 80px rgba(0,0,0,0.6)" }}>
        {submitted ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ width: 56, height: 56, borderRadius: "50%", margin: "0 auto 18px", display: "flex", alignItems: "center", justifyContent: "center", background: THEME.gradient, boxShadow: "0 10px 30px rgba(236,72,153,0.4)" }}>
              <Check size={26} color="#fff" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, margin: "0 0 8px", color: THEME.text }}>Registrasi Berhasil</h2>
            <p style={{ fontSize: 13, color: THEME.muted, margin: "0 0 22px", lineHeight: 1.5 }}>Selamat bergabung{form.name ? `, ${form.name.split(" ")[0]}` : ""}!<br />Mengalihkan ke portal login...</p>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 22 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 10, fontWeight: 800, letterSpacing: "0.1em", color: THEME.pink, background: "rgba(236,72,153,0.1)", border: "1px solid rgba(236,72,153,0.3)", padding: "5px 12px", borderRadius: 20, marginBottom: 12 }}>
                <Sparkles size={12} /> {role === "organizer" ? "PARTNER ACCESS" : "PREMIUM ACCESS"}
              </div>
              <h1 style={{ fontSize: "clamp(1.2rem, 4vw, 1.4rem)", fontWeight: 900, margin: "0 0 6px", letterSpacing: "-0.5px", color: THEME.text }}>
                {role === "organizer" ? "Daftar Mitra Venue" : "Buat Akun Baru"}
              </h1>
              <p style={{ fontSize: 13, color: THEME.muted, margin: 0 }}>
                {role === "organizer" ? "Kelola event dan jual tiket dengan sistem Auralis" : "Bergabunglah untuk memesan tiket dengan mudah"}
              </p>
            </div>

            <div style={{ display: "flex", backgroundColor: THEME.surfaceAlt, padding: 4, borderRadius: 12, marginBottom: 22, border: `1px solid ${THEME.border}` }}>
              <button type="button" onClick={() => setRole("user")} className={`aur-role-btn ${role === "user" ? "active" : ""}`}><User size={14} /> Akun Penonton</button>
              <button type="button" onClick={() => setRole("organizer")} className={`aur-role-btn ${role === "organizer" ? "active" : ""}`}><Building2 size={14} /> Mitra Venue / EO</button>
            </div>

            <form style={{ display: "flex", flexDirection: "column", gap: 16 }} onSubmit={handleSubmit}>
              <Field label={role === "organizer" ? "Nama Perusahaan / EO" : "Nama Lengkap"} icon={<User size={16} />} required placeholder={role === "organizer" ? "PT Harmony Promosindo" : "John Doe"} value={form.name} onChange={handleChange("name")} onFocus={() => setFocus("name")} onBlur={() => setFocus(null)} focused={focus === "name"} autoComplete="name" />
              <Field label="Alamat Email" icon={<Mail size={16} />} type="email" required placeholder="nama@email.com" value={form.email} onChange={handleChange("email")} onFocus={() => setFocus("email")} onBlur={() => setFocus(null)} focused={focus === "email"} autoComplete="email" />
              <Field label="Nomor WhatsApp" icon={<Phone size={16} />} type="tel" required placeholder="081234567890" value={form.phone} onChange={handleChange("phone")} onFocus={() => setFocus("phone")} onBlur={() => setFocus(null)} focused={focus === "phone"} autoComplete="tel" />

              <div className="aur-pw-grid">
                <Field label="Kata Sandi" icon={<Lock size={16} />} type={showPw ? "text" : "password"} required placeholder="Min. 8 karakter" value={form.password} onChange={handleChange("password")} onFocus={() => setFocus("password")} onBlur={() => setFocus(null)} focused={focus === "password"} autoComplete="new-password" trailing={<EyeToggle show={showPw} onToggle={() => setShowPw((s) => !s)} />} />
                <Field label="Konfirmasi" icon={<ShieldCheck size={16} />} type={showConfirm ? "text" : "password"} required placeholder="Ulangi sandi" value={form.confirm} onChange={handleChange("confirm")} onFocus={() => setFocus("confirm")} onBlur={() => setFocus(null)} focused={focus === "confirm"} autoComplete="new-password" error={confirmMismatch} trailing={<EyeToggle show={showConfirm} onToggle={() => setShowConfirm((s) => !s)} />} />
              </div>

              {form.password.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: -4 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div style={{ height: "100%", borderRadius: 4, width: `${(strength / 4) * 100}%`, background: STRENGTH_META[strength].color, transition: "width .35s ease, background .35s ease" }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, minWidth: 70, textAlign: "right", color: STRENGTH_META[strength].color }}>{STRENGTH_META[strength].label}</span>
                </div>
              )}

              {confirmMismatch && <p style={{ color: THEME.danger, fontSize: 12, margin: "-8px 0 0" }}>Konfirmasi kata sandi tidak cocok.</p>}

              <AgreeCheckbox checked={agreed} onChange={setAgreed} />

              {error && <p style={{ color: THEME.danger, fontSize: 12, margin: "-4px 0 0" }}>{error}</p>}

              <button type="submit" disabled={!canSubmit || submitting} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "14px", borderRadius: 12, border: "none", cursor: !canSubmit || submitting ? "not-allowed" : "pointer", fontSize: 13, fontWeight: 800, letterSpacing: "0.04em", color: "#fff", background: THEME.gradient, opacity: !canSubmit || submitting ? 0.5 : 1, boxShadow: "0 10px 30px rgba(236,72,153,0.25)", transition: "all 0.2s", marginTop: 4 }}>
                {submitting ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> MEMPROSES...</> : <>{role === "organizer" ? "DAFTAR SEBAGAI MITRA" : "BUAT AKUN"} <ArrowRight size={16} /></>}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: 13, color: THEME.muted, margin: "20px 0 0" }}>
              Sudah punya akun?{" "}
              <span onClick={() => navigate("/login", { state: { redirectAfterLogin: location.state?.redirectAfterLogin } })} style={{ color: THEME.pink, fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}>
                Masuk
              </span>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

function Field({ label, icon, trailing, focused, error, ...inputProps }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 0 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: THEME.muted }}>{label}</label>
      <div className="aur-reg-input" style={{ display: "flex", alignItems: "center", gap: 10, background: THEME.surfaceAlt, border: `1px solid ${error ? THEME.danger : THEME.borderStrong}`, borderRadius: 12, padding: "0 14px", transition: "all 0.2s", minWidth: 0, width: "100%" }}>
        <span style={{ color: focused ? THEME.pink : THEME.dim, display: "flex", flexShrink: 0 }}>{icon}</span>
        <input {...inputProps} style={{ flex: 1, minWidth: 0, background: "transparent", border: "none", outline: "none", color: THEME.text, padding: "12px 0", fontSize: 14, fontFamily: "inherit" }} />
        {trailing}
      </div>
    </div>
  );
}

function EyeToggle({ show, onToggle }) {
  const [hover, setHover] = useState(false);
  return (
    <button type="button" onClick={onToggle} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} aria-label="Tampilkan sandi" style={{ background: "none", border: "none", color: hover ? THEME.text : THEME.dim, cursor: "pointer", display: "flex", padding: 4, flexShrink: 0 }}>
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );
}

function AgreeCheckbox({ checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 12, color: "#c9c7d6", lineHeight: 1.5 }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ display: "none" }} />
      <span style={{ width: 18, height: 18, borderRadius: 5, border: `1px solid ${checked ? "transparent" : THEME.borderStrong}`, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", marginTop: 1, color: checked ? "#fff" : "transparent", background: checked ? THEME.gradient : "transparent", transition: "all .2s ease" }}>
        <Check size={12} />
      </span>
      <span>
        Saya menyetujui <span style={{ color: THEME.pink, textDecoration: "underline" }}>Syarat dan Ketentuan</span> serta <span style={{ color: THEME.pink, textDecoration: "underline" }}>Kebijakan Privasi</span> Auralis.
      </span>
    </label>
  );
}