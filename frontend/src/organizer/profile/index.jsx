import React, { useEffect, useState, useRef } from "react";
import { Building2, Mail, User, Phone, ShieldCheck, Save, Loader2, Check, Camera, Link as LinkIcon, Image as ImageIcon } from "lucide-react";
import { api } from "../../api/index";
import { THEME } from "../../theme";
import { useAuth } from "../../context/AuthContext";

export default function OrganizerProfile() {
  const { updateProfile } = useAuth();
  const fileInputRef = useRef(null);
  
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ 
    name: "", 
    organization_name: "", 
    email: "", 
    profile_picture: "" 
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await api.getMyProfile();
        const data = res?.data ?? res;
        setProfile(data);
        setForm({
          name: data.name || "",
          organization_name: data.organization_name || "",
          email: data.email || "",
          profile_picture: data.profile_picture || "",
        });
      } catch (err) {
        setError(err.message || "Gagal memuat profil.");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await api.updateMyProfile({
        name: form.name,
        organization_name: form.organization_name,
        email: form.email,
        profile_picture: form.profile_picture,
      });
      const updated = res?.data ?? res;
      setProfile(updated);
      if (updateProfile) updateProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || "Gagal menyimpan profil.");
    } finally {
      setSaving(false);
    }
  };

  // Fungsi untuk mengubah file gambar menjadi Base64
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Batasi ukuran maksimal 2MB agar tidak memberatkan database
    if (file.size > 2 * 1024 * 1024) {
      alert("Ukuran gambar maksimal 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setForm((prev) => ({ ...prev, profile_picture: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  if (loading) {
    return (
      <div style={{ display: "flex", height: 300, alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
        <Loader2 size={32} color={THEME.pink} style={{ animation: "spin 1s linear infinite" }} />
        <span style={{ color: THEME.muted }}>Memuat profil...</span>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 800 }}>
      <div>
        <h1 style={{ fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text, margin: 0 }}>
          Profil Organizer
        </h1>
        <p style={{ color: THEME.muted, fontSize: "0.9rem", marginTop: 6 }}>
          Kelola informasi profil, logo, dan identitas perusahaan/EO Anda.
        </p>
      </div>

      {saved && (
        <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 16px", backgroundColor: "rgba(16, 185, 129, 0.1)", border: `1px solid ${THEME.success}`, borderRadius: 12, color: THEME.success, fontSize: "0.9rem", fontWeight: 600 }}>
          <Check size={18} /> Profil berhasil diperbarui.
        </div>
      )}

      {error && (
        <div style={{ padding: "12px 16px", backgroundColor: "rgba(239, 68, 68, 0.1)", border: `1px solid ${THEME.danger}`, borderRadius: 12, color: THEME.danger, fontSize: "0.9rem" }}>
          {error}
        </div>
      )}

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 20, padding: "clamp(20px, 4vw, 32px)" }}>
        
        {/* Header Profil & Foto */}
        <div style={{ display: "flex", alignItems: "center", gap: 24, marginBottom: 32, paddingBottom: 24, borderBottom: `1px solid ${THEME.border}`, flexWrap: "wrap" }}>
          
          {/* Avatar dengan Tombol Kamera */}
          <div style={{ position: "relative" }}>
            <div style={{ 
              width: 100, height: 100, borderRadius: 24, background: THEME.gradient, 
              display: "flex", alignItems: "center", justifyContent: "center", 
              fontSize: 36, fontWeight: 900, color: "#fff", boxShadow: "0 10px 25px rgba(236,72,153,0.3)",
              overflow: "hidden"
            }}>
              {form.profile_picture ? (
                <img src={form.profile_picture} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : form.organization_name ? (
                form.organization_name.charAt(0).toUpperCase()
              ) : (
                <Building2 size={40} />
              )}
            </div>
            
            {/* Tombol Ganti Foto */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              style={{
                position: "absolute", bottom: -8, right: -8, width: 36, height: 36,
                borderRadius: "50%", backgroundColor: THEME.surface, border: `2px solid ${THEME.pink}`,
                color: THEME.pink, display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
              }}
            >
              <Camera size={18} />
            </button>
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              style={{ display: "none" }} 
            />
          </div>

          <div>
            <h2 style={{ margin: "0 0 6px", fontSize: "1.3rem", fontWeight: 800, color: THEME.text }}>
              {form.organization_name || "Nama Perusahaan Belum Diatur"}
            </h2>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.8rem", fontWeight: 700, color: THEME.purple, backgroundColor: "rgba(168, 85, 247, 0.1)", padding: "4px 10px", borderRadius: 20 }}>
              <ShieldCheck size={14} /> Penyelenggara Resmi
            </div>
          </div>
        </div>

        {/* Form Edit */}
        <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            
            {/* Input URL Foto Manual (Opsional) */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>URL Logo / Foto (Otomatis terisi jika upload)</label>
              <div style={inputWrapper}>
                <LinkIcon size={18} color={THEME.dim} />
                <input
                  type="text"
                  value={form.profile_picture}
                  onChange={(e) => setForm({ ...form, profile_picture: e.target.value })}
                  style={inputField}
                  placeholder="https://... atau data:image/jpeg;base64,..."
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Nama Perusahaan / EO (PT, CV, dll)</label>
              <div style={inputWrapper}>
                <Building2 size={18} color={THEME.dim} />
                <input
                  type="text"
                  value={form.organization_name}
                  onChange={(e) => setForm({ ...form, organization_name: e.target.value })}
                  style={inputField}
                  placeholder="Contoh: PT Harmony Promosindo"
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Nama Penanggung Jawab</label>
              <div style={inputWrapper}>
                <User size={18} color={THEME.dim} />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  style={inputField}
                  placeholder="Nama lengkap Anda"
                />
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Email Resmi</label>
              <div style={inputWrapper}>
                <Mail size={18} color={THEME.dim} />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  style={inputField}
                  placeholder="email@perusahaan.com"
                />
              </div>
            </div>

            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Nomor Telepon PIC (Tidak dapat diubah dari sini)</label>
              <div style={{ ...inputWrapper, opacity: 0.7, backgroundColor: THEME.bg }}>
                <Phone size={18} color={THEME.dim} />
                <input
                  type="text"
                  disabled
                  value={profile?.phone_number || "-"}
                  style={{ ...inputField, cursor: "not-allowed" }}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: 12, padding: "14px 24px", borderRadius: 12, border: "none",
              background: THEME.gradient, color: "#fff", fontWeight: 800, fontSize: "0.95rem",
              cursor: saving ? "not-allowed" : "pointer", display: "inline-flex",
              alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 8px 20px rgba(236, 72, 153, 0.25)", alignSelf: "flex-start",
              opacity: saving ? 0.7 : 1
            }}
          >
            {saving ? <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} /> : <Save size={18} />}
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block", fontSize: "0.85rem", fontWeight: 600, color: THEME.muted, marginBottom: 8
};

const inputWrapper = {
  display: "flex", alignItems: "center", gap: 12, backgroundColor: THEME.surfaceAlt,
  border: `1px solid ${THEME.borderStrong}`, borderRadius: 12, padding: "0 16px"
};

const inputField = {
  flex: 1, background: "transparent", border: "none", outline: "none",
  color: THEME.text, fontSize: "0.95rem", padding: "14px 0", fontFamily: "inherit"
};