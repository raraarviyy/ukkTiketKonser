import React, { useMemo, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  MapPin,
  MoreHorizontal,
  Search,
  ShieldAlert,
  Ticket,
  X,
  XCircle,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);

const formatNumber = (value) =>
  new Intl.NumberFormat("id-ID").format(value);

const statusConfig = {
  published: {
    label: "Published",
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  pending: {
    label: "Pending",
    className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  },
  rejected: {
    label: "Rejected",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-orange-500/20 bg-orange-500/10 text-orange-400",
  },
  deleted: {
    label: "Deleted",
    className: "border-slate-500/20 bg-slate-500/10 text-slate-400",
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-white">{value}</p>
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

export default function AdminConcerts() {
  const {
    events,
    approveEvent,
    rejectEvent,
    cancelEvent,
    softDeleteEvent,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        event.name.toLowerCase().includes(keyword) ||
        event.organizer.toLowerCase().includes(keyword) ||
        event.location.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || event.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [events, search, statusFilter]);

  const publishedCount = events.filter(
    (event) => event.status === "published"
  ).length;

  const pendingCount = events.filter(
    (event) => event.status === "pending"
  ).length;

  const rejectedCount = events.filter(
    (event) => event.status === "rejected"
  ).length;

  const cancelledCount = events.filter(
    (event) => event.status === "cancelled"
  ).length;

  const handleAction = (action, id) => {
    if (action === "approve") {
      approveEvent(id);
    }

    if (action === "reject") {
      rejectEvent(id);
    }

    if (action === "cancel") {
      cancelEvent(id);
    }

    if (action === "delete") {
      softDeleteEvent(id);
    }

    setMenuId(null);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
              <CalendarDays size={13} />
              Concert Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Concert Management
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Pantau seluruh konser di platform dan lakukan approval,
              penolakan, pembatalan, atau soft delete jika diperlukan.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Concert"
          value={formatNumber(events.length)}
          icon={CalendarDays}
          iconClass="bg-purple-500/10 text-purple-400"
        />

        <StatCard
          title="Published"
          value={formatNumber(publishedCount)}
          icon={Check}
          iconClass="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Pending"
          value={formatNumber(pendingCount)}
          icon={Clock3}
          iconClass="bg-yellow-500/10 text-yellow-400"
        />

        <StatCard
          title="Rejected"
          value={formatNumber(rejectedCount)}
          icon={XCircle}
          iconClass="bg-rose-500/10 text-rose-400"
        />

        <StatCard
          title="Cancelled"
          value={formatNumber(cancelledCount)}
          icon={ShieldAlert}
          iconClass="bg-orange-500/10 text-orange-400"
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
              placeholder="Cari konser, organizer, atau lokasi..."
              className="h-11 w-full rounded-xl border border-white/10 bg-[#090f1b] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/40"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white lg:w-auto"
            >
              {statusFilter === "all"
                ? "Semua Status"
                : statusConfig[statusFilter]?.label}

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

                <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-white/10 bg-[#151c2c] p-1.5 shadow-2xl">
                  {[
                    { value: "all", label: "Semua Status" },
                    { value: "published", label: "Published" },
                    { value: "pending", label: "Pending" },
                    { value: "rejected", label: "Rejected" },
                    { value: "cancelled", label: "Cancelled" },
                    { value: "deleted", label: "Deleted" },
                  ].map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => {
                        setStatusFilter(filter.value);
                        setShowFilter(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                        statusFilter === filter.value
                          ? "bg-purple-500/10 text-purple-400"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {filter.label}

                      {statusFilter === filter.value && (
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

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold text-white">
            Semua Concert
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {filteredEvents.length} konser ditemukan
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.015] text-left">
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Concert
                </th>

                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Organizer
                </th>

                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Date & Location
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Ticket
                </th>

                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Revenue
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 text-purple-400">
                          <CalendarDays size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[220px] truncate text-sm font-semibold text-white">
                            {event.name}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-600">
                            ID #{event.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="max-w-[170px] truncate text-xs font-medium text-slate-300">
                        {event.organizer}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <CalendarDays size={13} className="text-slate-600" />
                          {event.date}
                        </div>

                        <div className="flex max-w-[220px] items-center gap-2 text-[11px] text-slate-600">
                          <MapPin size={13} className="shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <div>
                        <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-white">
                          <Ticket size={13} className="text-cyan-400" />
                          {formatNumber(event.ticketsSold)}
                        </div>

                        <p className="mt-1 text-[10px] text-slate-600">
                          / {formatNumber(event.capacity)}
                        </p>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <p className="text-xs font-semibold text-white">
                        {formatCurrency(event.revenue)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <StatusBadge status={event.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="relative flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setMenuId(
                              menuId === event.id ? null : event.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        {menuId === event.id && (
                          <>
                            <button
                              type="button"
                              aria-label="Close menu"
                              onClick={() => setMenuId(null)}
                              className="fixed inset-0 z-10 cursor-default"
                            />

                            <div className="absolute right-0 top-11 z-20 w-52 rounded-xl border border-white/10 bg-[#151c2c] p-1.5 shadow-2xl">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedEvent(event);
                                  setMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                              >
                                <Eye size={15} />
                                Lihat Detail
                              </button>

                              {event.status === "pending" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAction("approve", event.id)
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/10"
                                  >
                                    <Check size={15} />
                                    Approve Concert
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleAction("reject", event.id)
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-rose-400 transition hover:bg-rose-500/10"
                                  >
                                    <XCircle size={15} />
                                    Reject Concert
                                  </button>
                                </>
                              )}

                              {event.status === "published" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAction("cancel", event.id)
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-orange-400 transition hover:bg-orange-500/10"
                                >
                                  <ShieldAlert size={15} />
                                  Cancel Concert
                                </button>
                              )}

                              {event.status !== "deleted" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAction("delete", event.id)
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
                                >
                                  <X size={15} />
                                  Soft Delete
                                </button>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-600">
                        <CalendarDays size={20} />
                      </div>

                      <p className="mt-3 text-sm font-medium text-slate-400">
                        Konser tidak ditemukan
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Coba gunakan kata kunci atau filter yang berbeda.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#101827] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Detail Concert
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Informasi konser dan performa penjualan
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEvent(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                    <CalendarDays size={21} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-white">
                          {selectedEvent.name}
                        </h3>

                        <p className="mt-1 text-xs text-slate-500">
                          {selectedEvent.organizer}
                        </p>
                      </div>

                      <StatusBadge status={selectedEvent.status} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CalendarDays size={14} />
                    <span className="text-xs">Tanggal</span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-white">
                    {selectedEvent.date}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <MapPin size={14} />
                    <span className="text-xs">Lokasi</span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-white">
                    {selectedEvent.location}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Ticket size={14} />
                    <span className="text-xs">Ticket Sold</span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-white">
                    {formatNumber(selectedEvent.ticketsSold)} /{" "}
                    {formatNumber(selectedEvent.capacity)}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Clock3 size={14} />
                    <span className="text-xs">Occupancy</span>
                  </div>

                  <p className="mt-2 text-sm font-semibold text-white">
                    {selectedEvent.capacity > 0
                      ? `${Math.round(
                          (selectedEvent.ticketsSold /
                            selectedEvent.capacity) *
                            100
                        )}%`
                      : "0%"}
                  </p>
                </div>

                <div className="col-span-1 rounded-xl border border-white/5 bg-white/[0.02] p-4 sm:col-span-2">
                  <p className="text-xs text-slate-500">
                    Total Revenue
                  </p>

                  <p className="mt-2 text-xl font-bold text-purple-400">
                    {formatCurrency(selectedEvent.revenue)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {selectedEvent.status === "pending" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        approveEvent(selectedEvent.id);
                        setSelectedEvent(null);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-emerald-400"
                    >
                      <Check size={15} />
                      Approve
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        rejectEvent(selectedEvent.id);
                        setSelectedEvent(null);
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20"
                    >
                      <XCircle size={15} />
                      Reject
                    </button>
                  </>
                )}

                {selectedEvent.status === "published" && (
                  <button
                    type="button"
                    onClick={() => {
                      cancelEvent(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-orange-500/10 px-4 py-3 text-xs font-bold text-orange-400 transition hover:bg-orange-500/20"
                  >
                    <ShieldAlert size={15} />
                    Cancel Concert
                  </button>
                )}

                {selectedEvent.status !== "deleted" && (
                  <button
                    type="button"
                    onClick={() => {
                      softDeleteEvent(selectedEvent.id);
                      setSelectedEvent(null);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-white/5 px-4 py-3 text-xs font-bold text-slate-400 transition hover:bg-white/10 hover:text-white"
                  >
                    <X size={15} />
                    Soft Delete
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedEvent(null)}
                  className="rounded-xl border border-white/10 px-5 py-3 text-xs font-semibold text-slate-400 transition hover:bg-white/5 hover:text-white"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}