import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Plus,
  Trash2,
  Loader2,
  MapPin,
  Calendar,
  Sparkles,
  Ticket,
  Search,
} from "lucide-react";
import { THEME } from "../../theme";

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 12,
  backgroundColor: THEME.surfaceAlt,
  border: `1px solid ${THEME.borderStrong}`,
  color: THEME.text,
  fontSize: "0.88rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle = {
  fontSize: "0.82rem",
  fontWeight: 600,
  color: THEME.muted,
  display: "block",
  marginBottom: 6,
};

const cardSectionStyle = {
  backgroundColor: THEME.bg,
  borderRadius: 16,
  padding: 20,
  border: `1px solid ${THEME.border}`,
  marginBottom: 20,
};

const sectionTitleStyle = {
  fontSize: "0.95rem",
  fontWeight: 800,
  color: THEME.pink,
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 14,
  textTransform: "uppercase",
  letterSpacing: "0.5px",
};

export default function EventForm({
  initialData,
  onSubmit,
  onClose,
  submitting,
}) {
  const [form, setForm] = useState({
    title: initialData?.title || "",
    artist: initialData?.artist || "",
    venue: initialData?.venue || "",
    city: initialData?.city || "",
    address: initialData?.address || "",
    date: initialData?.date ? initialData.date.split("T")[0] : "",
    time: initialData?.time || "19:00",
    description: initialData?.description || "",
    image: initialData?.image || "",
    status: initialData?.status || "published",
    category: initialData?.category || "Concert",
    doorsOpen: initialData?.doorsOpen || "18:00",
    showStarts: initialData?.showStarts || "19:00",
    ageLimit: initialData?.ageLimit || "Semua umur",
    lat: initialData?.lat || -6.2,
    lng: initialData?.lng || 106.8,
  });

  const [categories, setCategories] = useState(
    initialData?.categories?.length
      ? initialData.categories.map((c) => ({
          id: c.id,
          name: c.name || "",
          price: c.price ?? "",
          quota: c.quota ?? "",
        }))
      : [{ name: "Reguler", price: "", quota: "" }]
  );

  const [isFetchingAddress, setIsFetchingAddress] = useState(false);
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Fungsi untuk mengambil nama kota dan alamat dari koordinat (Reverse Geocoding)
  const fetchAddressFromCoords = async (lat, lng) => {
    try {
      setIsFetchingAddress(true);
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await res.json();
      
      if (data && data.address) {
        // Ambil kota (kabupaten/kota)
        const city = data.address.city || data.address.town || data.address.county || data.address.state || "";
        // Ambil alamat lengkap
        const fullAddress = data.display_name || "";
        
        setForm((prev) => ({
          ...prev,
          city: city,
          address: fullAddress
        }));
      }
    } catch (error) {
      console.error("Gagal mengambil alamat:", error);
    } finally {
      setIsFetchingAddress(false);
    }
  };

  // Inisialisasi Peta
  useEffect(() => {
    if (!window.L || !mapContainerRef.current) return;

    delete window.L.Icon.Default.prototype._getIconUrl;
    window.L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    const initLat = Number(form.lat) || -6.2;
    const initLng = Number(form.lng) || 106.8;

    const map = window.L.map(mapContainerRef.current).setView([initLat, initLng], 13);
    mapRef.current = map;

    window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap",
    }).addTo(map);

    const marker = window.L.marker([initLat, initLng], { draggable: true }).addTo(map);
    markerRef.current = marker;

    // Aksi saat marker digeser (drag)
    marker.on("dragend", () => {
      const position = marker.getLatLng();
      const newLat = Number(position.lat.toFixed(6));
      const newLng = Number(position.lng.toFixed(6));
      updateForm("lat", newLat);
      updateForm("lng", newLng);
      fetchAddressFromCoords(newLat, newLng); // Otomatis ambil alamat
    });

    // Aksi saat peta diklik
    map.on("click", (e) => {
      const newLat = Number(e.latlng.lat.toFixed(6));
      const newLng = Number(e.latlng.lng.toFixed(6));
      marker.setLatLng(e.latlng);
      updateForm("lat", newLat);
      updateForm("lng", newLng);
      fetchAddressFromCoords(newLat, newLng); // Otomatis ambil alamat
    });

    setTimeout(() => map.invalidateSize(), 200);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Aksi saat input koordinat diubah manual
  const handleManualCoordsChange = (field, val) => {
    const num = Number(val);
    updateForm(field, val);

    if (!isNaN(num) && mapRef.current && markerRef.current) {
      const newLat = field === "lat" ? num : Number(form.lat);
      const newLng = field === "lng" ? num : Number(form.lng);

      markerRef.current.setLatLng([newLat, newLng]);
      mapRef.current.panTo([newLat, newLng]);
      
      // Jika user selesai ngetik (bisa pakai debounce, tapi disederhanakan disini)
      if (newLat && newLng) {
        fetchAddressFromCoords(newLat, newLng);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanCategories = categories
      .filter((c) => c.name.trim() !== "")
      .map((c) => ({
        ...(c.id ? { id: c.id } : {}),
        name: c.name.trim(),
        price: Number(c.price),
        quota: Number(c.quota),
        sold: Number(c.sold || 0),
      }));

    if (cleanCategories.length === 0) {
      alert("Minimal harus ada 1 kategori tiket.");
      return;
    }

    onSubmit({
      ...form,
      lat: Number(form.lat) || -6.2,
      lng: Number(form.lng) || 106.8,
      categories: cleanCategories,
      price: Math.min(...cleanCategories.map((c) => Number(c.price))),
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 100, backgroundColor: "rgba(5, 5, 8, 0.88)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <style>{`
        .form-input-field:focus { border-color: ${THEME.pink} !important; box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.15); }
        .org-form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .org-form-grid-cat { display: grid; grid-template-columns: 2fr 1fr 1fr auto; gap: 8px; align-items: center; }
        
        /* Style Kustom untuk Kalender Input Date */
        input[type="date"]::-webkit-calendar-picker-indicator {
          filter: invert(1);
          opacity: 0.6;
          cursor: pointer;
        }

        @media (max-width: 600px) {
          .org-form-grid-2 { grid-template-columns: 1fr; }
          .org-form-grid-cat { grid-template-columns: 1fr; }
        }
      `}</style>

      <div style={{ backgroundColor: THEME.surface, borderRadius: 24, border: `1px solid ${THEME.border}`, maxWidth: 750, width: "100%", padding: 28, position: "relative", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)" }}>
        <button type="button" onClick={onClose} style={{ position: "absolute", top: 18, right: 18, background: "none", border: "none", color: THEME.muted, cursor: "pointer", padding: 8, borderRadius: "50%", display: "flex" }}>
          <X size={20} />
        </button>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.72rem", color: THEME.pink, fontWeight: 800, letterSpacing: 1, textTransform: "uppercase", backgroundColor: "rgba(236, 72, 153, 0.08)", padding: "4px 10px", borderRadius: 8, marginBottom: 8 }}>
            <Sparkles size={12} /> Auralis Portal EO
          </div>
          <h3 style={{ fontSize: "1.45rem", fontWeight: 900, color: THEME.text, margin: 0 }}>
            {initialData ? "Edit Konser Anda" : "Buat Konser Baru"}
          </h3>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column" }}>
          
          {/* SECTION 1: INFORMASI UTAMA */}
          <div style={cardSectionStyle}>
            <div style={sectionTitleStyle}><Ticket size={18} /> Informasi Utama</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div className="org-form-grid-2">
                <div>
                  <label style={labelStyle}>Judul Konser/Event</label>
                  <input type="text" required value={form.title} onChange={(e) => updateForm("title", e.target.value)} style={inputStyle} placeholder="Contoh: Harmoni Malam Jazz" className="form-input-field" />
                </div>
                <div>
                  <label style={labelStyle}>Artis Utama</label>
                  <input type="text" value={form.artist} onChange={(e) => updateForm("artist", e.target.value)} style={inputStyle} placeholder="Contoh: Tulus & Friends" className="form-input-field" />
                </div>
              </div>

              <div className="org-form-grid-2">
                <div>
                  <label style={labelStyle}>Kategori Musik</label>
                  <select value={form.category} onChange={(e) => updateForm("category", e.target.value)} style={{ ...inputStyle, appearance: "none" }} className="form-input-field">
                    <option value="Concert">Concert</option>
                    <option value="Festival">Festival</option>
                    <option value="Acoustic">Acoustic</option>
                    <option value="EDM">EDM</option>
                    <option value="Indie">Indie</option>
                    <option value="Jazz">Jazz</option>
                    <option value="K-Pop">K-Pop</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Status Penerbitan</label>
                  <select value={form.status} onChange={(e) => updateForm("status", e.target.value)} style={{ ...inputStyle, appearance: "none" }} className="form-input-field">
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>URL Gambar Banner</label>
                <input type="url" value={form.image} onChange={(e) => updateForm("image", e.target.value)} style={inputStyle} placeholder="https://..." className="form-input-field" />
              </div>

              <div>
                <label style={labelStyle}>Deskripsi Acara</label>
                <textarea rows={3} value={form.description} onChange={(e) => updateForm("description", e.target.value)} style={{ ...inputStyle, resize: "vertical" }} placeholder="Berikan deskripsi detail konser..." className="form-input-field" />
              </div>
            </div>
          </div>

          {/* SECTION 2: JADWAL & KETENTUAN */}
          <div style={cardSectionStyle}>
            <div style={sectionTitleStyle}><Calendar size={18} /> Jadwal & Ketentuan</div>
            <div className="org-form-grid-2" style={{ marginBottom: 14 }}>
              <div>
                <label style={labelStyle}>Tanggal Pelaksanaan</label>
                {/* INPUT DATE DENGAN KALENDER */}
                <input type="date" required value={form.date} onChange={(e) => updateForm("date", e.target.value)} style={inputStyle} className="form-input-field" />
              </div>
              <div>
                <label style={labelStyle}>Batas Usia</label>
                <select value={form.ageLimit} onChange={(e) => updateForm("ageLimit", e.target.value)} style={{ ...inputStyle, appearance: "none" }} className="form-input-field">
                  <option value="Semua umur">Semua umur</option>
                  <option value="13+">13+</option>
                  <option value="17+">17+</option>
                  <option value="18+">18+</option>
                </select>
              </div>
            </div>
            <div className="org-form-grid-2">
              <div>
                <label style={labelStyle}>Gerbang Dibuka</label>
                <input type="time" value={form.doorsOpen} onChange={(e) => updateForm("doorsOpen", e.target.value)} style={inputStyle} className="form-input-field" />
              </div>
              <div>
                <label style={labelStyle}>Konser Dimulai</label>
                <input type="time" value={form.showStarts} onChange={(e) => updateForm("showStarts", e.target.value)} style={inputStyle} className="form-input-field" />
              </div>
            </div>
          </div>

          {/* SECTION 3: LOKASI & PETA */}
          <div style={cardSectionStyle}>
            <div style={sectionTitleStyle}><MapPin size={18} /> Lokasi & Peta</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              
              <div className="org-form-grid-2">
                <div>
                  <label style={labelStyle}>Nama Venue / Gedung</label>
                  <input type="text" required value={form.venue} onChange={(e) => updateForm("venue", e.target.value)} style={inputStyle} placeholder="Contoh: Gelora Bung Karno" className="form-input-field" />
                </div>
                <div>
                  <label style={labelStyle}>Kota (Otomatis dari Peta)</label>
                  <input type="text" required value={form.city} onChange={(e) => updateForm("city", e.target.value)} style={inputStyle} placeholder="Contoh: Jakarta" className="form-input-field" />
                </div>
              </div>

              <div>
                <label style={labelStyle}>Alamat Lengkap (Otomatis dari Peta)</label>
                <input type="text" value={form.address} onChange={(e) => updateForm("address", e.target.value)} style={inputStyle} placeholder="Alamat akan terisi otomatis saat kamu klik peta" className="form-input-field" />
              </div>

              <div className="org-form-grid-2">
                <div>
                  <label style={labelStyle}>Latitude</label>
                  <input type="number" step="any" required value={form.lat} onChange={(e) => handleManualCoordsChange("lat", e.target.value)} style={inputStyle} placeholder="-6.2297" className="form-input-field" />
                </div>
                <div>
                  <label style={labelStyle}>Longitude</label>
                  <input type="number" step="any" required value={form.lng} onChange={(e) => handleManualCoordsChange("lng", e.target.value)} style={inputStyle} placeholder="106.8175" className="form-input-field" />
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <span style={labelStyle}>Pilih Lokasi di Peta (Klik / Geser Pin)</span>
                  {isFetchingAddress && <span style={{ fontSize: "0.75rem", color: THEME.pink, display: "flex", alignItems: "center", gap: 4 }}><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> Mencari Alamat...</span>}
                </div>
                <div ref={mapContainerRef} style={{ height: 240, borderRadius: 14, border: `1px solid ${THEME.borderStrong}`, overflow: "hidden", zIndex: 1 }} />
              </div>
            </div>
          </div>

          {/* SECTION 4: KATEGORI TIKET */}
          <div style={cardSectionStyle}>
            <div style={{ ...sectionTitleStyle, justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}><Ticket size={18} /> Kategori Tiket</div>
              <button type="button" onClick={() => setCategories((prev) => [...prev, { name: "", price: "", quota: "" }])} style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: "rgba(236,72,153,0.1)", color: THEME.pink, cursor: "pointer", fontSize: "0.78rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                <Plus size={14} /> Tambah
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {categories.map((cat, idx) => (
                <div key={idx} className="org-form-grid-cat">
                  <input type="text" required placeholder="Nama (VIP/Reguler)" value={cat.name} onChange={(e) => { const newC = [...categories]; newC[idx].name = e.target.value; setCategories(newC); }} style={inputStyle} className="form-input-field" />
                  <input type="number" required min="0" placeholder="Harga" value={cat.price} onChange={(e) => { const newC = [...categories]; newC[idx].price = e.target.value; setCategories(newC); }} style={inputStyle} className="form-input-field" />
                  <input type="number" required min="1" placeholder="Kuota" value={cat.quota} onChange={(e) => { const newC = [...categories]; newC[idx].quota = e.target.value; setCategories(newC); }} style={inputStyle} className="form-input-field" />
                  <button type="button" onClick={() => { if (categories.length === 1) return; setCategories(categories.filter((_, i) => i !== idx)); }} style={{ width: 40, height: 40, border: "none", borderRadius: 10, background: "rgba(239, 68, 68, 0.1)", color: THEME.danger, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" disabled={submitting} style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", fontWeight: 800, fontSize: "0.95rem", cursor: submitting ? "not-allowed" : "pointer", marginTop: 10, background: THEME.gradient, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 8px 20px rgba(236, 72, 153, 0.25)", opacity: submitting ? 0.75 : 1 }}>
            {submitting && <Loader2 size={18} style={{ animation: "spin 1s linear infinite" }} />}
            {initialData ? "Simpan Perubahan" : "Terbitkan Konser"}
          </button>
        </form>
      </div>
    </div>
  );
}