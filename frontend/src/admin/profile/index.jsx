import React, { useEffect, useMemo, useState } from "react";
import { Activity, Bell, Check, Edit3, Eye, EyeOff, KeyRound, Loader2, Lock, Mail, Save, ShieldCheck, User, X } from "lucide-react";
import { api } from "../../api/index";
import { THEME } from "../../theme";
import { useAuth } from "../../context/AuthContext";

export default function AdminProfile() {
  const { updateProfile } = useAuth();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ name: "", email: "" });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [savingPassword, setSavingPassword] = useState(false);
  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await api.getMyProfile();
        const u = res?.data ?? res;
        setProfile(u);
        setForm({ name: u?.name || "", email: u?.email || "" });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const initials = useMemo(() => (profile?.name || "").split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase(), [profile]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !/\S+@\S+\.\S+/.test(form.email)) return setError("Data tidak valid.");
    try {
      setSaving(true);
      const res = await api.updateMyProfile({ name: form.name.trim(), email: form.email.trim() });
      const u = res?.data ?? res;
      setProfile(prev => ({ ...prev, ...u }));
      updateProfile?.(u);
      setEditing(false); setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) { setError(err.message); } finally { setSaving(false); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (passwordForm.newPassword.length < 6) return setPasswordError("Password minimal 6 karakter.");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) return setPasswordError("Konfirmasi tidak sama.");
    try {
      setSavingPassword(true);
      await api.changeMyPassword({ oldPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2500);
    } catch (err) { setPasswordError(err.message); } finally { setSavingPassword(false); }
  };

  if (loading) return <div style={{ display: "flex", height: 300, alignItems: "center", justifyContent: "center" }}><Loader2 size={32} color={THEME.pink} style={{ animation: "spin 1s linear infinite" }} /></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1000 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text }}>Profile</h1>
        <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: THEME.muted }}>Kelola informasi akun dan keamanan Super Admin.</p>
      </div>

      {saved && <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(16,185,129,0.1)", border: `1px solid ${THEME.success}`, color: THEME.success, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8 }}><Check size={16} /> Profil diperbarui.</div>}
      {error && <div style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(239,68,68,0.1)", border: `1px solid ${THEME.danger}`, color: THEME.danger, fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 8 }}><X size={16} /> {error}</div>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
        <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 20, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>Informasi Profile</h2>
            {!editing && <button onClick={() => setEditing(true)} style={{ background: "none", border: "none", color: THEME.pink, cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: "0.85rem", fontWeight: 600 }}><Edit3 size={14} /> Edit</button>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 24 }}>
            <div style={{ width: 70, height: 70, borderRadius: 20, background: THEME.gradient, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 800 }}>{initials}</div>
            <div>
              <h3 style={{ margin: 0, fontSize: "1.2rem" }}>{profile?.name}</h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: THEME.muted }}>{profile?.email}</p>
              <span style={{ display: "inline-block", marginTop: 8, padding: "4px 10px", borderRadius: 20, background: "rgba(236,72,153,0.1)", color: THEME.pink, fontSize: "0.7rem", fontWeight: 700 }}><ShieldCheck size={12} style={{ display: "inline", marginRight: 4 }} />{profile?.role_relation?.name || "Admin"}</span>
            </div>
          </div>
          <form onSubmit={handleSaveProfile} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", fontSize: "0.8rem", color: THEME.muted, marginBottom: 6 }}>Nama</label><input type="text" disabled={!editing} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: 12, background: editing ? THEME.bg : "transparent", border: `1px solid ${THEME.border}`, color: THEME.text, outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", color: THEME.muted, marginBottom: 6 }}>Email</label><input type="email" disabled={!editing} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: 12, background: editing ? THEME.bg : "transparent", border: `1px solid ${THEME.border}`, color: THEME.text, outline: "none" }} /></div>
            {editing && <div style={{ display: "flex", gap: 8, marginTop: 8 }}><button type="button" onClick={() => setEditing(false)} style={{ flex: 1, padding: 10, borderRadius: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.muted, cursor: "pointer" }}>Batal</button><button type="submit" disabled={saving} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: THEME.gradient, color: "#fff", cursor: "pointer" }}>{saving ? "..." : "Simpan"}</button></div>}
          </form>
        </div>

        <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 20, padding: 24 }}>
          <h2 style={{ margin: "0 0 20px", fontSize: "1.1rem", fontWeight: 700 }}>Keamanan Akun</h2>
          {passwordSaved && <div style={{ marginBottom: 16, padding: "10px", borderRadius: 10, background: "rgba(16,185,129,0.1)", color: THEME.success, fontSize: "0.8rem" }}>Password diubah.</div>}
          {passwordError && <div style={{ marginBottom: 16, padding: "10px", borderRadius: 10, background: "rgba(239,68,68,0.1)", color: THEME.danger, fontSize: "0.8rem" }}>{passwordError}</div>}
          <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div><label style={{ display: "block", fontSize: "0.8rem", color: THEME.muted, marginBottom: 6 }}>Password Lama</label><input type={showPassword ? "text" : "password"} value={passwordForm.currentPassword} onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: 12, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", color: THEME.muted, marginBottom: 6 }}>Password Baru</label><input type={showPassword ? "text" : "password"} value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: 12, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, outline: "none" }} /></div>
            <div><label style={{ display: "block", fontSize: "0.8rem", color: THEME.muted, marginBottom: 6 }}>Konfirmasi</label><input type={showPassword ? "text" : "password"} value={passwordForm.confirmPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} style={{ width: "100%", padding: "12px", borderRadius: 12, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, outline: "none" }} /></div>
            <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ alignSelf: "flex-start", background: "none", border: "none", color: THEME.pink, fontSize: "0.8rem", cursor: "pointer" }}>{showPassword ? "Sembunyikan Password" : "Tampilkan Password"}</button>
            <button type="submit" disabled={savingPassword} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: THEME.gradient, color: "#fff", fontWeight: 700, cursor: "pointer", marginTop: 8 }}>{savingPassword ? "Menyimpan..." : "Ubah Password"}</button>
          </form>
        </div>
      </div>
    </div>
  );
}