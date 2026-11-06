import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import { Lock, Save } from "lucide-react";
import { api } from "../../api";
import { useAuth } from "../../context/AuthContext";

export default function Profile() {
  const { updateProfile } = useAuth();

  const [activeTab, setActiveTab] = useState("profile");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [profile, setProfile] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
  });

  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const res = await api.getMyProfile();

      setProfile(res.data);

      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
      });
    } catch (err) {
      setError(err.message);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();

    try {
      const res = await api.updateMyProfile(form);

      setProfile(res.data);
      updateProfile(res.data);

      setMessage("Profil berhasil diperbarui");
    } catch (err) {
      setError(err.message);
    }
  };

  const savePassword = async (e) => {
    e.preventDefault();

    try {
      await api.changeMyPassword(pwForm);

      setPwForm({
        oldPassword: "",
        newPassword: "",
      });

      setMessage("Password berhasil diubah");
    } catch (err) {
      setError(err.message);
    }
  };

  if (!profile) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0b0c10",
          color: "#fff",
          display: "grid",
          placeItems: "center",
        }}
      >
        Loading...
      </div>
    );
  }

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
        }}
      >
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <div
          style={{
            padding: "30px",
            maxWidth: "900px",
            margin: "0 auto",
          }}
        >
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 800,
              marginBottom: "25px",
            }}
          >
            Profil Saya
          </h1>

          {message && (
            <div
              style={{
                background: "#14532d",
                color: "#86efac",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              {message}
            </div>
          )}

          {error && (
            <div
              style={{
                background: "#7f1d1d",
                color: "#fca5a5",
                padding: "12px",
                borderRadius: "12px",
                marginBottom: "16px",
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              background: "#161826",
              border: "1px solid #25293d",
              borderRadius: "24px",
              padding: "24px",
              marginBottom: "24px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "20px",
                marginBottom: "24px",
              }}
            >
              <div
                style={{
                  width: "80px",
                  height: "80px",
                  borderRadius: "50%",
                  background:
                    "linear-gradient(135deg,#ec4899,#8b5cf6)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "28px",
                  fontWeight: "bold",
                }}
              >
                {profile.name?.charAt(0)}
              </div>

              <div>
                <h2>{profile.name}</h2>
                <p style={{ color: "#9ca3af" }}>
                  {profile.email}
                </p>
              </div>
            </div>

            <form onSubmit={saveProfile}>
              <div style={{ marginBottom: "16px" }}>
                <label>Nama</label>

                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: "20px" }}>
                <label>Email</label>

                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              </div>

              <button style={buttonStyle}>
                <Save size={18} />
                Simpan Profil
              </button>
            </form>
          </div>

          <div
            style={{
              background: "#161826",
              border: "1px solid #25293d",
              borderRadius: "24px",
              padding: "24px",
            }}
          >
            <h2
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "20px",
              }}
            >
              <Lock size={22} />
              Ubah Password
            </h2>

            <form onSubmit={savePassword}>
              <input
                type="password"
                placeholder="Password Lama"
                value={pwForm.oldPassword}
                onChange={(e) =>
                  setPwForm({
                    ...pwForm,
                    oldPassword: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <input
                type="password"
                placeholder="Password Baru"
                value={pwForm.newPassword}
                onChange={(e) =>
                  setPwForm({
                    ...pwForm,
                    newPassword: e.target.value,
                  })
                }
                style={inputStyle}
              />

              <button style={buttonStyle}>
                <Lock size={18} />
                Ubah Password
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "8px",
  borderRadius: "14px",
  border: "1px solid #2b3148",
  background: "#0f111a",
  color: "#fff",
};

const buttonStyle = {
  background:
    "linear-gradient(135deg,#ec4899,#db2777)",
  color: "#fff",
  border: "none",
  borderRadius: "14px",
  padding: "14px 20px",
  display: "flex",
  alignItems: "center",
  gap: "10px",
  cursor: "pointer",
  fontWeight: "bold",
};
