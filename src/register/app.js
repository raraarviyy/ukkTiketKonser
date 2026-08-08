import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  Check,
  Sparkles,
  ArrowRight,
} from "lucide-react";

/* ============================================================
   Harmonix — Create account, 100% inline styles.
   No CSS classes, no <style> tag. Hover / focus / continuous
   animation (background drift, floating glows, spinner) are
   all driven by React state + requestAnimationFrame instead
   of CSS pseudo-classes, keyframes, or media queries.
   ============================================================ */

const COLORS = {
  purple: "#a855f7",
  purpleLight: "#c084fc",
  pink: "#ec4899",
  cyan: "#22d3ee",
  bg: "#0a0a12",
  card: "rgba(20,18,30,0.72)",
  border: "rgba(255,255,255,0.08)",
  muted: "#9a97ab",
  text: "#f5f5fa",
  danger: "#ef4444",
};

const FONT = "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

function scorePassword(pw) {
  if (!pw) return 0;
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return score;
}

const STRENGTH_META = [
  { label: "Too short", color: "#ef4444" },
  { label: "Weak", color: "#f97316" },
  { label: "Okay", color: "#eab308" },
  { label: "Good", color: "#22d3ee" },
  { label: "Strong", color: "#4ade80" },
];

/* ============================================================
   HOOKS — replace @keyframes / hover / media queries
   ============================================================ */

// generic continuous float loop (used for glows and bg drift)
function useFloat({ ax = 20, ay = 20, speed = 0.0005, phase = 0 } = {}) {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const frame = useRef();
  useEffect(() => {
    const start = performance.now() + phase * 1000;
    const tick = (now) => {
      const t = (now - start) * speed;
      setPos({ x: Math.sin(t) * ax, y: Math.sin(t * 1.3) * ay });
      frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return pos;
}

// slow zoom/pan drift for the background image
function useDrift(period = 16000) {
  const [t, setT] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const progress = ((now - start) % (period * 2)) / (period * 2); // 0..1, ping-pong
      const eased = progress < 0.5 ? progress * 2 : 2 - progress * 2; // triangle wave 0->1->0
      setT(eased);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [period]);
  return t; // 0..1
}

// continuous rotation, replaces @keyframes hxSpin
function useSpin(durationMs = 700) {
  const [deg, setDeg] = useState(0);
  useEffect(() => {
    let frame;
    const start = performance.now();
    const tick = (now) => {
      const elapsed = (now - start) % durationMs;
      setDeg((elapsed / durationMs) * 360);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs]);
  return deg;
}

// mount transition helper: returns true a tick after mount, for entrance animations
function useMountedIn(delay = 30) {
  const [in_, setIn] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setIn(true), delay);
    return () => clearTimeout(id);
  }, [delay]);
  return in_;
}

/* ============================================================
   ROOT
   ============================================================ */

export default function HarmonixRegisterInline() {
  const mounted = useMountedIn();

  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [focusField, setFocusField] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const drift = useDrift();
  const glowA = useFloat({ ax: 24, ay: 18, phase: 0 });
  const glowB = useFloat({ ax: 22, ay: 20, phase: 3 });
  const glowC = useFloat({ ax: 16, ay: 14, phase: 6 });

  const strength = useMemo(() => scorePassword(form.password), [form.password]);
  const confirmMismatch = form.confirm.length > 0 && form.confirm !== form.password;
  const canSubmit =
    form.name.trim().length > 1 &&
    /\S+@\S+\.\S+/.test(form.email) &&
    strength >= 2 &&
    form.confirm === form.password &&
    agreed;

  const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 1400);
  };

  const bgScale = 1.05 + drift * 0.07; // 1.05 -> 1.12
  const bgTranslate = { x: -drift * 1.5, y: -drift * 1 };

  return (
    <div
      style={{
        position: "relative",
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 20px",
        overflow: "hidden",
        fontFamily: FONT,
        color: COLORS.text,
        background: COLORS.bg,
      }}
    >
      {/* background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          backgroundImage:
            "url(https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1800&h=1200&fit=crop)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(1.2)",
          transform: `scale(${bgScale}) translate(${bgTranslate.x}%, ${bgTranslate.y}%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 0,
          background:
            "radial-gradient(ellipse at 50% 30%, rgba(10,8,20,0.55) 0%, rgba(8,6,16,0.92) 65%, #07060c 100%)",
        }}
      />
      <Glow size={420} top={-100} left={-120} color={COLORS.purple} pos={glowA} opacity={0.4} />
      <Glow size={380} bottom={-120} right={-100} color={COLORS.cyan} pos={glowB} opacity={0.4} />
      <Glow size={260} top="40%" left="60%" color={COLORS.pink} pos={glowC} opacity={0.25} />

      {/* card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 460,
          background: COLORS.card,
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 24,
          padding: "40px 38px 34px",
          boxShadow: "0 30px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
          opacity: mounted ? 1 : 0,
          transform: mounted ? "translateY(0) scale(1)" : "translateY(24px) scale(0.98)",
          transition: "opacity .6s cubic-bezier(.22,1,.36,1), transform .6s cubic-bezier(.22,1,.36,1)",
        }}
      >
        {submitted ? (
          <SuccessState name={form.name} onReset={() => setSubmitted(false)} />
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 26 }}>
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 10.5,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  color: COLORS.cyan,
                  background: "rgba(34,211,238,0.12)",
                  border: "1px solid rgba(34,211,238,0.35)",
                  padding: "5px 12px",
                  borderRadius: 20,
                  marginBottom: 14,
                }}
              >
                <Sparkles size={13} /> PREMIUM ACCESS
              </span>
              <h1
                style={{
                  fontSize: 34,
                  fontWeight: 800,
                  margin: "0 0 6px",
                  letterSpacing: 0.5,
                  background: `linear-gradient(90deg, ${COLORS.purpleLight}, ${COLORS.pink})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Harmonix
              </h1>
              <p style={{ fontSize: 13.5, color: COLORS.muted, margin: 0 }}>
                Join the rhythm of premium ticketing
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
              <SocialButton label="Google" icon={<GoogleIcon />} />
              <SocialButton label="Apple" icon={<AppleIcon />} />
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                margin: "22px 0",
                color: "#77748a",
                fontSize: 10.5,
                fontWeight: 700,
                letterSpacing: "0.08em",
              }}
            >
              <span style={{ flex: 1, height: 1, background: COLORS.border }} />
              <span>OR CONTINUE WITH EMAIL</span>
              <span style={{ flex: 1, height: 1, background: COLORS.border }} />
            </div>

            <form style={{ display: "flex", flexDirection: "column", gap: 18 }} onSubmit={handleSubmit}>
              <Field
                label="Full Name"
                icon={<User size={16} />}
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange("name")}
                onFocus={() => setFocusField("name")}
                onBlur={() => setFocusField(null)}
                focused={focusField === "name"}
              />

              <Field
                label="Email Address"
                icon={<Mail size={16} />}
                type="email"
                placeholder="name@example.com"
                value={form.email}
                onChange={handleChange("email")}
                onFocus={() => setFocusField("email")}
                onBlur={() => setFocusField(null)}
                focused={focusField === "email"}
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                <Field
                  label="Password"
                  icon={<Lock size={16} />}
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange("password")}
                  onFocus={() => setFocusField("password")}
                  onBlur={() => setFocusField(null)}
                  focused={focusField === "password"}
                  trailing={
                    <EyeToggle show={showPw} onToggle={() => setShowPw((s) => !s)} />
                  }
                />
                <Field
                  label="Confirm"
                  icon={<ShieldCheck size={16} />}
                  type={showConfirm ? "text" : "password"}
                  placeholder="••••••••"
                  value={form.confirm}
                  onChange={handleChange("confirm")}
                  onFocus={() => setFocusField("confirm")}
                  onBlur={() => setFocusField(null)}
                  focused={focusField === "confirm"}
                  error={confirmMismatch}
                  trailing={
                    <EyeToggle show={showConfirm} onToggle={() => setShowConfirm((s) => !s)} />
                  }
                />
              </div>

              {form.password.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: -6 }}>
                  <div style={{ flex: 1, height: 4, borderRadius: 4, background: "rgba(255,255,255,0.08)", overflow: "hidden" }}>
                    <div
                      style={{
                        height: "100%",
                        borderRadius: 4,
                        width: `${(strength / 4) * 100}%`,
                        background: STRENGTH_META[strength].color,
                        transition: "width .35s ease, background .35s ease",
                      }}
                    />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, minWidth: 52, textAlign: "right", color: STRENGTH_META[strength].color }}>
                    {STRENGTH_META[strength].label}
                  </span>
                </div>
              )}
              {confirmMismatch && (
                <p style={{ color: COLORS.danger, fontSize: 12, margin: "-8px 0 0" }}>
                  Passwords don't match yet.
                </p>
              )}

              <AgreeCheckbox checked={agreed} onChange={setAgreed} />

              <SubmitButton canSubmit={canSubmit} submitting={submitting} />
            </form>

            <p style={{ textAlign: "center", fontSize: 13, color: COLORS.muted, margin: "22px 0 0" }}>
              Already have an account? <SignInLink />
            </p>
          </>
        )}
      </div>

      {!submitted && (
        <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 10, marginTop: 24, color: COLORS.muted, fontSize: 13 }}>
          <div style={{ display: "flex" }}>
            {[
              "https://images.unsplash.com/photo-1547153760-18fc86324498?w=100&h=100&fit=crop",
              "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=100&h=100&fit=crop",
              "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
            ].map((src, i) => (
              <div
                key={src}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  backgroundImage: `url(${src})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  border: `2px solid ${COLORS.bg}`,
                  marginLeft: i === 0 ? 0 : -8,
                }}
              />
            ))}
          </div>
          <span>Join 50k+ fans tonight</span>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PIECES
   ============================================================ */

function Glow({ size, top, left, right, bottom, color, pos, opacity }) {
  return (
    <div
      style={{
        position: "absolute",
        width: size,
        height: size,
        top,
        left,
        right,
        bottom,
        borderRadius: "50%",
        background: color,
        filter: "blur(90px)",
        zIndex: 0,
        opacity,
        transform: `translate(${pos.x}px, ${pos.y}px)`,
      }}
    />
  );
}

function Field({ label, icon, trailing, focused, error, ...inputProps }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: "#d8d6e2" }}>{label}</label>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: focused ? "rgba(168,85,247,0.06)" : "rgba(255,255,255,0.04)",
          border: `1px solid ${error ? COLORS.danger : focused ? COLORS.purple : COLORS.border}`,
          borderRadius: 12,
          padding: "0 14px",
          boxShadow: error
            ? "0 0 0 3px rgba(239,68,68,0.15)"
            : focused
            ? "0 0 0 3px rgba(168,85,247,0.18)"
            : "none",
          transition: "border-color .2s ease, box-shadow .2s ease, background .2s ease",
        }}
      >
        <span style={{ color: focused ? COLORS.purpleLight : "#8b889c", display: "flex" }}>{icon}</span>
        <input
          {...inputProps}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#fff",
            padding: "13px 0",
            fontSize: 14,
            fontFamily: FONT,
          }}
        />
        {trailing}
      </div>
    </div>
  );
}

function EyeToggle({ show, onToggle }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Toggle password visibility"
      style={{
        background: "none",
        border: "none",
        color: hover ? "#fff" : "#8b889c",
        cursor: "pointer",
        display: "flex",
        padding: 4,
        transition: "color .2s ease",
      }}
    >
      {show ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  );
}

function SocialButton({ label, icon }) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "12px 0",
        borderRadius: 12,
        border: `1px solid ${hover ? "rgba(255,255,255,0.18)" : COLORS.border}`,
        background: hover ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.03)",
        color: "#fff",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: FONT,
        transform: hover ? "translateY(-2px)" : "translateY(0)",
        transition: "background .2s ease, transform .2s ease, border-color .2s ease",
      }}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function AgreeCheckbox({ checked, onChange }) {
  return (
    <label style={{ display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer", fontSize: 13, color: "#c9c7d6" }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{ display: "none" }}
      />
      <span
        style={{
          width: 18,
          height: 18,
          borderRadius: 5,
          border: `1px solid ${checked ? "transparent" : "#4a4760"}`,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 1,
          color: checked ? "#fff" : "transparent",
          background: checked ? `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.pink})` : "transparent",
          transition: "background .2s ease, border-color .2s ease, color .2s ease",
        }}
      >
        <Check size={12} />
      </span>
      <span>
        I agree to the <TextLink>Terms of Service</TextLink> and <TextLink>Privacy Policy</TextLink>.
      </span>
    </label>
  );
}

function TextLink({ children }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ color: COLORS.cyan, textDecoration: hover ? "underline" : "none" }}
    >
      {children}
    </a>
  );
}

function SignInLink() {
  const [hover, setHover] = useState(false);
  return (
    <a
      href="#"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ color: COLORS.purpleLight, fontWeight: 700, textDecoration: hover ? "underline" : "none" }}
    >
      Sign In
    </a>
  );
}

function SubmitButton({ canSubmit, submitting }) {
  const [hover, setHover] = useState(false);
  const spin = useSpin();
  const disabled = !canSubmit || submitting;

  return (
    <button
      type="submit"
      disabled={disabled}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        padding: "15px 0",
        borderRadius: 12,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        fontSize: 14,
        fontWeight: 800,
        letterSpacing: "0.04em",
        color: "#fff",
        fontFamily: FONT,
        background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.pink})`,
        opacity: canSubmit ? 1 : 0.45,
        boxShadow: canSubmit
          ? hover
            ? "0 16px 36px rgba(236,72,153,0.45)"
            : "0 12px 30px rgba(168,85,247,0.35)"
          : "none",
        transform: hover && canSubmit && !submitting ? "translateY(-2px)" : "translateY(0)",
        transition: "transform .2s ease, box-shadow .2s ease, opacity .2s ease",
        marginTop: 4,
      }}
    >
      {submitting ? (
        <span
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            border: "2.5px solid rgba(255,255,255,0.35)",
            borderTopColor: "#fff",
            transform: `rotate(${spin}deg)`,
          }}
        />
      ) : (
        <>
          CREATE ACCOUNT <ArrowRight size={16} />
        </>
      )}
    </button>
  );
}

function SuccessState({ name, onReset }) {
  const in_ = useMountedIn(0);
  return (
    <div style={{ textAlign: "center", padding: "20px 0" }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          margin: "0 auto 18px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
          background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.cyan})`,
          boxShadow: "0 10px 30px rgba(168,85,247,0.4)",
          transform: in_ ? "scale(1)" : "scale(0)",
          transition: "transform .5s cubic-bezier(.34,1.56,.64,1)",
        }}
      >
        <Check size={26} />
      </div>
      <h2 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>
        You're in{name ? `, ${name.split(" ")[0]}` : ""}!
      </h2>
      <p style={{ fontSize: 13.5, color: COLORS.muted, margin: "0 0 22px" }}>
        Your Harmonix account is ready. Check your inbox to verify your email.
      </p>
      <button
        type="button"
        onClick={onReset}
        style={{
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          padding: "13px 26px",
          borderRadius: 12,
          border: "none",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: 800,
          color: "#fff",
          fontFamily: FONT,
          background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.pink})`,
        }}
      >
        Back to form
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.4 29.3 35 24 35c-6.1 0-11-4.9-11-11s4.9-11 11-11c2.8 0 5.3 1 7.3 2.7l5.7-5.7C33.6 6.5 29 4.5 24 4.5 13.2 4.5 4.5 13.2 4.5 24S13.2 43.5 24 43.5 43.5 34.8 43.5 24c0-1.2-.1-2.4-.3-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 18.9 13 24 13c2.8 0 5.3 1 7.3 2.7l5.7-5.7C33.6 6.5 29 4.5 24 4.5c-7.6 0-14.1 4.3-17.4 10.5z" />
      <path fill="#4CAF50" d="M24 43.5c5 0 9.5-1.9 12.9-5.1l-6-5c-2 1.4-4.5 2.2-6.9 2.2-5.3 0-9.7-3.4-11.3-8.1l-6.5 5C9.8 39 16.4 43.5 24 43.5z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.3 5.7l6 5c-.4.4 6.5-4.7 6.5-14.7 0-1.2-.1-2.4-.3-3.5z" />
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 384 512" fill="#fff">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5c0 26.2 4.8 53.3 14.4 81.2 12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zM255.7 65.7c27-32.2 24.6-61.5 23.8-72.7-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 25.9 2 49.5-11.6 69.7-34.1z" />
    </svg>
  );
}