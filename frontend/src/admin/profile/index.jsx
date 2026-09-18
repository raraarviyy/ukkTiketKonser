import React, { useMemo, useState } from "react";
import {
  Activity,
  Bell,
  Check,
  ChevronRight,
  Edit3,
  KeyRound,
  Lock,
  Mail,
  Save,
  ShieldCheck,
  User,
  X,
} from "lucide-react";

export default function AdminProfile() {
  const [profile, setProfile] = useState({
    name: "Super Admin",
    email: "admin@ticketplatform.com",
    phone: "+62 812 3456 7890",
    role: "Super Administrator",
  });

  const [form, setForm] = useState(profile);
  const [editing, setEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [saved, setSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const initials = useMemo(() => {
    return profile.name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }, [profile.name]);

  const handleSaveProfile = (event) => {
    event.preventDefault();

    setProfile(form);
    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2500);
  };

  const handleCancelEdit = () => {
    setForm(profile);
    setEditing(false);
  };

  const handleChangePassword = (event) => {
    event.preventDefault();

    if (
      !passwordForm.currentPassword ||
      !passwordForm.newPassword ||
      !passwordForm.confirmPassword
    ) {
      return;
    }

    if (
      passwordForm.newPassword !==
      passwordForm.confirmPassword
    ) {
      return;
    }

    setPasswordSaved(true);

    setPasswordForm({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });

    setTimeout(() => {
      setPasswordSaved(false);
    }, 2500);
  };

  return (
    <div className="mx-auto w-full max-w-[1200px]">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
          <User size={13} />
          Account Settings
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Profile
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Kelola informasi akun dan keamanan Super Admin.
        </p>
      </div>

      {saved && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400">
          <Check size={16} />
          Informasi profile berhasil diperbarui.
        </div>
      )}

      {passwordSaved && (
        <div className="mb-5 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-400">
          <Check size={16} />
          Password berhasil diperbarui.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422]">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-white">
                    Informasi Profile
                  </h2>

                  <p className="mt-1 text-xs text-slate-600">
                    Informasi dasar akun administrator.
                  </p>
                </div>

                {!editing && (
                  <button
                    type="button"
                    onClick={() => {
                      setForm(profile);
                      setEditing(true);
                    }}
                    className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
                  >
                    <Edit3 size={14} />
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="p-5 sm:p-6">
              <div className="flex flex-col items-center gap-4 border-b border-white/5 pb-6 sm:flex-row">
                <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/30 to-purple-500/20 text-xl font-bold text-blue-300 ring-1 ring-blue-500/20">
                  {initials}

                  <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-4 border-[#0d1422] bg-emerald-500">
                    <Check size={10} className="text-white" />
                  </div>
                </div>

                <div className="text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white">
                    {profile.name}
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    {profile.email}
                  </p>

                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-purple-500/20 bg-purple-500/10 px-2.5 py-1 text-[10px] font-semibold text-purple-400">
                    <ShieldCheck size={12} />
                    {profile.role}
                  </div>
                </div>
              </div>

              <form
                onSubmit={handleSaveProfile}
                className="mt-6 space-y-5"
              >
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Nama Lengkap
                    </label>

                    <div className="relative">
                      <User
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                      />

                      <input
                        type="text"
                        value={form.name}
                        disabled={!editing}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            name: event.target.value,
                          }))
                        }
                        className={`h-11 w-full rounded-xl border pl-10 pr-4 text-sm outline-none ${
                          editing
                            ? "border-white/10 bg-[#090f1b] text-white focus:border-blue-500/40"
                            : "border-white/5 bg-white/[0.02] text-slate-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Email
                    </label>

                    <div className="relative">
                      <Mail
                        size={15}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
                      />

                      <input
                        type="email"
                        value={form.email}
                        disabled={!editing}
                        onChange={(event) =>
                          setForm((current) => ({
                            ...current,
                            email: event.target.value,
                          }))
                        }
                        className={`h-11 w-full rounded-xl border pl-10 pr-4 text-sm outline-none ${
                          editing
                            ? "border-white/10 bg-[#090f1b] text-white focus:border-blue-500/40"
                            : "border-white/5 bg-white/[0.02] text-slate-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Nomor Telepon
                    </label>

                    <input
                      type="text"
                      value={form.phone}
                      disabled={!editing}
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          phone: event.target.value,
                        }))
                      }
                      className={`h-11 w-full rounded-xl border px-4 text-sm outline-none ${
                        editing
                          ? "border-white/10 bg-[#090f1b] text-white focus:border-blue-500/40"
                          : "border-white/5 bg-white/[0.02] text-slate-400"
                      }`}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      Role
                    </label>

                    <div className="flex h-11 items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4">
                      <ShieldCheck
                        size={15}
                        className="text-purple-400"
                      />

                      <span className="text-sm text-slate-400">
                        {profile.role}
                      </span>
                    </div>
                  </div>
                </div>

                {editing && (
                  <div className="flex flex-col gap-2 border-t border-white/5 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="rounded-xl border border-white/10 px-5 py-3 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                    >
                      Batal
                    </button>

                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-xs font-bold text-white transition hover:bg-blue-400"
                    >
                      <Save size={14} />
                      Simpan Perubahan
                    </button>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422]">
            <div className="border-b border-white/10 px-5 py-5 sm:px-6">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Keamanan Akun
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Ubah password untuk menjaga keamanan akun.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleChangePassword}
              className="p-5 sm:p-6"
            >
              <div className="space-y-5">
                <PasswordInput
                  label="Password Saat Ini"
                  value={passwordForm.currentPassword}
                  onChange={(value) =>
                    setPasswordForm((current) => ({
                      ...current,
                      currentPassword: value,
                    }))
                  }
                  visible={showPassword}
                />

                <PasswordInput
                  label="Password Baru"
                  value={passwordForm.newPassword}
                  onChange={(value) =>
                    setPasswordForm((current) => ({
                      ...current,
                      newPassword: value,
                    }))
                  }
                  visible={showPassword}
                />

                <PasswordInput
                  label="Konfirmasi Password Baru"
                  value={passwordForm.confirmPassword}
                  onChange={(value) =>
                    setPasswordForm((current) => ({
                      ...current,
                      confirmPassword: value,
                    }))
                  }
                  visible={showPassword}
                />
              </div>

              <div className="mt-5 flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                <div className="flex items-center gap-3">
                  <Lock size={15} className="text-blue-400" />

                  <p className="text-xs text-slate-400">
                    Gunakan password minimal 8 karakter.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="shrink-0 text-[10px] font-semibold text-blue-400 hover:text-blue-300"
                >
                  {showPassword ? "Sembunyikan" : "Tampilkan"}
                </button>
              </div>

              {passwordForm.newPassword &&
                passwordForm.confirmPassword &&
                passwordForm.newPassword !==
                  passwordForm.confirmPassword && (
                  <p className="mt-3 text-xs text-red-400">
                    Konfirmasi password tidak sama.
                  </p>
                )}

              <div className="mt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmPassword ||
                    passwordForm.newPassword !==
                      passwordForm.confirmPassword
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-500 px-5 py-3 text-xs font-bold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <KeyRound size={14} />
                  Ubah Password
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <ShieldCheck size={18} />
              </div>

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Account Status
                </h2>

                <p className="mt-1 text-[10px] text-slate-600">
                  Status akun administrator
                </p>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3">
              <div>
                <p className="text-xs font-semibold text-emerald-400">
                  Active
                </p>

                <p className="mt-1 text-[10px] text-slate-600">
                  Akun dapat mengakses dashboard.
                </p>
              </div>

              <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
            <h2 className="text-sm font-semibold text-white">
              Security Overview
            </h2>

            <div className="mt-5 space-y-1">
              <SecurityItem
                icon={Lock}
                title="Password"
                value="Protected"
              />

              <SecurityItem
                icon={Mail}
                title="Email"
                value="Verified"
              />

              <SecurityItem
                icon={Activity}
                title="Account Activity"
                value="Normal"
              />

              <SecurityItem
                icon={Bell}
                title="Notifications"
                value="Enabled"
              />
            </div>
          </div>

          <div className="rounded-2xl border border-blue-500/10 bg-blue-500/5 p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck
                size={18}
                className="mt-0.5 shrink-0 text-blue-400"
              />

              <div>
                <h2 className="text-sm font-semibold text-white">
                  Super Admin Access
                </h2>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Akun ini memiliki akses penuh untuk mengelola
                  organizer, concert, user, transaksi, ticket,
                  settlement, laporan, dan pengaturan platform.
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold text-blue-400">
              <span>View permissions</span>
              <ChevronRight size={13} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordInput({
  label,
  value,
  onChange,
  visible,
}) {
  return (
    <div>
      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-slate-600">
        {label}
      </label>

      <div className="relative">
        <KeyRound
          size={15}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
        />

        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Masukkan password"
          className="h-11 w-full rounded-xl border border-white/10 bg-[#090f1b] pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/40"
        />
      </div>
    </div>
  );
}

function SecurityItem({ icon: Icon, title, value }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-3 transition hover:bg-white/[0.02]">
      <div className="flex items-center gap-3">
        <Icon size={15} className="text-slate-500" />

        <span className="text-xs text-slate-400">{title}</span>
      </div>

      <span className="text-[10px] font-semibold text-emerald-400">
        {value}
      </span>
    </div>
  );
}