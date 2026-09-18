import React, { useMemo, useState } from "react";
import {
  Bell,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  Megaphone,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const statusConfig = {
  published: {
    label: "Published",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  draft: {
    label: "Draft",
    className:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.draft;

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-2xl font-bold text-white">
            {value}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

export default function AdminNotifications() {
  const {
    notifications,
    addNotification,
    deleteNotification,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState(null);
  const [menuId, setMenuId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    message: "",
    status: "draft",
  });

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        notification.title.toLowerCase().includes(keyword) ||
        notification.message.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        notification.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [notifications, search, statusFilter]);

  const publishedCount = notifications.filter(
    (notification) => notification.status === "published"
  ).length;

  const draftCount = notifications.filter(
    (notification) => notification.status === "draft"
  ).length;

  const handleCreate = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.message.trim()) {
      return;
    }

    addNotification({
      title: form.title.trim(),
      message: form.message.trim(),
      status: form.status,
    });

    setForm({
      title: "",
      message: "",
      status: "draft",
    });

    setShowCreate(false);
  };

  const handleDelete = (id) => {
    deleteNotification(id);
    setMenuId(null);

    if (selectedNotification?.id === id) {
      setSelectedNotification(null);
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-300">
          <Megaphone size={13} />
          Platform Announcement
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Kelola pengumuman platform yang dapat disampaikan
              kepada seluruh pengguna.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 text-xs font-bold text-white transition hover:bg-blue-400"
          >
            <Plus size={16} />
            Buat Announcement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          title="Total Announcement"
          value={notifications.length}
          icon={Bell}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Published"
          value={publishedCount}
          icon={Send}
          iconClass="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Draft"
          value={draftCount}
          icon={Clock3}
          iconClass="bg-yellow-500/10 text-yellow-400"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d1422] p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-lg">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul atau isi announcement..."
              className="h-11 w-full rounded-xl border border-white/10 bg-[#090f1b] pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/40"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="flex h-11 w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:w-44"
            >
              <span className="flex items-center gap-2">
                <ChevronDown size={14} />

                {statusFilter === "all"
                  ? "Semua Status"
                  : statusConfig[statusFilter]?.label}
              </span>

              <ChevronDown
                size={15}
                className={`transition ${
                  showFilter ? "rotate-180" : ""
                }`}
              />
            </button>

            {showFilter && (
              <>
                <button
                  type="button"
                  aria-label="Close filter"
                  onClick={() => setShowFilter(false)}
                  className="fixed inset-0 z-10 cursor-default"
                />

                <div className="absolute right-0 top-12 z-20 w-44 rounded-xl border border-white/10 bg-[#151c2c] p-1.5 shadow-2xl">
                  {[
                    { value: "all", label: "Semua Status" },
                    {
                      value: "published",
                      label: "Published",
                    },
                    {
                      value: "draft",
                      label: "Draft",
                    },
                  ].map((item) => (
                    <button
                      key={item.value}
                      type="button"
                      onClick={() => {
                        setStatusFilter(item.value);
                        setShowFilter(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                        statusFilter === item.value
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {item.label}

                      {statusFilter === item.value && (
                        <Check size={14} />
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className="group rounded-2xl border border-white/10 bg-[#0d1422] p-5 transition hover:border-white/15"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Megaphone size={19} />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-semibold text-white">
                      {notification.title}
                    </h2>

                    <StatusBadge status={notification.status} />
                  </div>

                  <p className="mt-2 max-w-4xl text-sm leading-6 text-slate-400">
                    {notification.message}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-4 text-[10px] text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <CalendarIcon />
                      {notification.createdAt}
                    </span>

                    <span className="flex items-center gap-1.5">
                      <Users size={12} />
                      Seluruh pengguna
                    </span>
                  </div>
                </div>

                <div className="relative flex justify-end">
                  <button
                    type="button"
                    onClick={() =>
                      setMenuId(
                        menuId === notification.id
                          ? null
                          : notification.id
                      )
                    }
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
                  >
                    <MoreHorizontal size={17} />
                  </button>

                  {menuId === notification.id && (
                    <>
                      <button
                        type="button"
                        aria-label="Close menu"
                        onClick={() => setMenuId(null)}
                        className="fixed inset-0 z-10 cursor-default"
                      />

                      <div className="absolute right-0 top-11 z-20 w-48 rounded-xl border border-white/10 bg-[#151c2c] p-1.5 shadow-2xl">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedNotification(
                              notification
                            );
                            setMenuId(null);
                          }}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                        >
                          <Eye size={15} />
                          Lihat Detail
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDelete(notification.id)
                          }
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-red-400 transition hover:bg-red-500/10"
                        >
                          <Trash2 size={15} />
                          Hapus
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-2xl border border-white/10 bg-[#0d1422] px-5 py-16 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-600">
              <Bell size={20} />
            </div>

            <p className="mt-3 text-sm font-medium text-slate-400">
              Announcement tidak ditemukan
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Coba gunakan kata kunci atau filter yang berbeda.
            </p>
          </div>
        )}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#101827] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Buat Announcement
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Kirim pengumuman untuk pengguna platform.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCreate(false)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5">
              <div>
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Judul
                </label>

                <input
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  placeholder="Contoh: Maintenance Platform"
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#090f1b] px-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/40"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Pesan
                </label>

                <textarea
                  value={form.message}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      message: event.target.value,
                    }))
                  }
                  rows={5}
                  placeholder="Tulis isi announcement..."
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#090f1b] px-4 py-3 text-sm leading-6 text-white outline-none placeholder:text-slate-600 focus:border-blue-500/40"
                />
              </div>

              <div className="mt-4">
                <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      status: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#090f1b] px-4 text-sm text-white outline-none focus:border-blue-500/40"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div className="mt-5 rounded-xl border border-blue-500/10 bg-blue-500/5 p-3">
                <div className="flex gap-3">
                  <Users
                    size={16}
                    className="mt-0.5 shrink-0 text-blue-400"
                  />

                  <p className="text-xs leading-5 text-slate-400">
                    Announcement ini ditujukan untuk seluruh
                    pengguna platform.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={
                    !form.title.trim() || !form.message.trim()
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <Send size={14} />
                  Simpan Announcement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedNotification && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#101827] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Announcement Detail
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Detail pengumuman platform
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <Megaphone size={19} />
                </div>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-semibold text-white">
                      {selectedNotification.title}
                    </h3>

                    <StatusBadge
                      status={selectedNotification.status}
                    />
                  </div>

                  <p className="mt-2 text-[10px] text-slate-600">
                    {selectedNotification.createdAt}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-sm leading-7 text-slate-300">
                  {selectedNotification.message}
                </p>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                <Users size={15} className="text-blue-400" />

                <span className="text-xs text-slate-400">
                  Target:{" "}
                  <span className="font-semibold text-white">
                    Seluruh pengguna platform
                  </span>
                </span>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNotification(null)}
                className="mt-5 w-full rounded-xl border border-white/10 px-4 py-3 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CalendarIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}