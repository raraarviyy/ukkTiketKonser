import React, { useMemo, useState } from "react";
import {
  AlertCircle,
  Ban,
  Check,
  ChevronDown,
  CircleDollarSign,
  Eye,
  Filter,
  MoreHorizontal,
  QrCode,
  Search,
  Ticket,
  Users,
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
  active: {
    label: "Active",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  cancelled: {
    label: "Cancelled",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.active;

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

export default function AdminTickets() {
  const { tickets, cancelTicket } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        ticket.id.toLowerCase().includes(keyword) ||
        ticket.event.toLowerCase().includes(keyword) ||
        ticket.category.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        ticket.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tickets, search, statusFilter]);

  const totalQuota = tickets.reduce(
    (total, ticket) => total + ticket.quota,
    0
  );

  const totalSold = tickets.reduce(
    (total, ticket) => total + ticket.sold,
    0
  );

  const totalCheckedIn = tickets.reduce(
    (total, ticket) => total + ticket.checkedIn,
    0
  );

  const activeTickets = tickets.filter(
    (ticket) => ticket.status === "active"
  );

  const cancelledTickets = tickets.filter(
    (ticket) => ticket.status === "cancelled"
  );

  const totalTicketValue = tickets.reduce(
    (total, ticket) => total + ticket.price * ticket.sold,
    0
  );

  const sellThroughRate =
    totalQuota > 0 ? Math.round((totalSold / totalQuota) * 100) : 0;

  const checkInRate =
    totalSold > 0 ? Math.round((totalCheckedIn / totalSold) * 100) : 0;

  const handleCancel = (id) => {
    cancelTicket(id);
    setMenuId(null);

    if (selectedTicket?.id === id) {
      setSelectedTicket((current) =>
        current ? { ...current, status: "cancelled" } : current
      );
    }
  };

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
          <Ticket size={13} />
          Ticket Monitoring
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Ticket Monitoring
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Monitor harga tiket, kuota, penjualan, check-in, dan status
          tiket dari seluruh concert.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Ticket Types"
          value={formatNumber(tickets.length)}
          icon={Ticket}
          iconClass="bg-purple-500/10 text-purple-400"
        />

        <StatCard
          title="Total Quota"
          value={formatNumber(totalQuota)}
          icon={Users}
          iconClass="bg-cyan-500/10 text-cyan-400"
        />

        <StatCard
          title="Tickets Sold"
          value={formatNumber(totalSold)}
          icon={Check}
          iconClass="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Checked In"
          value={formatNumber(totalCheckedIn)}
          icon={QrCode}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Ticket GMV"
          value={formatCurrency(totalTicketValue)}
          icon={CircleDollarSign}
          iconClass="bg-yellow-500/10 text-yellow-400"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Sell Through Rate</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {sellThroughRate}%
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Ticket size={18} />
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-emerald-400 transition-all"
              style={{ width: `${Math.min(sellThroughRate, 100)}%` }}
            />
          </div>

          <p className="mt-2 text-[10px] text-slate-600">
            {formatNumber(totalSold)} dari {formatNumber(totalQuota)} tiket
            terjual
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Check-in Rate</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {checkInRate}%
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <QrCode size={18} />
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-blue-400 transition-all"
              style={{ width: `${Math.min(checkInRate, 100)}%` }}
            />
          </div>

          <p className="mt-2 text-[10px] text-slate-600">
            {formatNumber(totalCheckedIn)} tiket sudah check-in
          </p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-slate-500">Ticket Status</p>
              <p className="mt-2 text-2xl font-bold text-white">
                {formatNumber(activeTickets.length)}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <AlertCircle size={18} />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div>
              <p className="text-[10px] text-slate-600">Active</p>
              <p className="mt-1 text-xs font-semibold text-emerald-400">
                {activeTickets.length}
              </p>
            </div>

            <div className="h-7 w-px bg-white/10" />

            <div>
              <p className="text-[10px] text-slate-600">Cancelled</p>
              <p className="mt-1 text-xs font-semibold text-rose-400">
                {cancelledTickets.length}
              </p>
            </div>
          </div>
        </div>
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
              placeholder="Cari ticket ID, concert, atau kategori..."
              className="h-11 w-full rounded-xl border border-white/10 bg-[#090f1b] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/40"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="flex h-11 w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:w-44"
            >
              <span className="flex items-center gap-2">
                <Filter size={14} />

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
                    { value: "active", label: "Active" },
                    { value: "cancelled", label: "Cancelled" },
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
                          ? "bg-purple-500/10 text-purple-400"
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

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold text-white">
            Semua Ticket
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {filteredTickets.length} ticket type ditemukan
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1150px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.015] text-left">
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Ticket
                </th>

                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Concert
                </th>

                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Price
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Quota
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Sold
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Remaining
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Check-in
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
              {filteredTickets.length > 0 ? (
                filteredTickets.map((ticket) => {
                  const remaining = Math.max(
                    ticket.quota - ticket.sold,
                    0
                  );

                  const soldPercentage =
                    ticket.quota > 0
                      ? Math.round(
                          (ticket.sold / ticket.quota) * 100
                        )
                      : 0;

                  return (
                    <tr
                      key={ticket.id}
                      className="border-b border-white/5 transition hover:bg-white/[0.02]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                            <Ticket size={16} />
                          </div>

                          <div>
                            <p className="text-xs font-semibold text-white">
                              {ticket.id}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-500">
                              {ticket.category}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[200px] truncate text-xs font-medium text-slate-300">
                          {ticket.event}
                        </p>
                      </td>

                      <td className="px-5 py-4">
                        <p className="text-xs font-semibold text-white">
                          {formatCurrency(ticket.price)}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="text-xs text-slate-400">
                          {formatNumber(ticket.quota)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex flex-col items-center">
                          <span className="text-xs font-semibold text-white">
                            {formatNumber(ticket.sold)}
                          </span>

                          <span className="mt-1 text-[9px] text-slate-600">
                            {soldPercentage}%
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span
                          className={`text-xs font-semibold ${
                            remaining <= ticket.quota * 0.1
                              ? "text-rose-400"
                              : "text-slate-400"
                          }`}
                        >
                          {formatNumber(remaining)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                          <QrCode
                            size={13}
                            className="text-blue-400"
                          />
                          {formatNumber(ticket.checkedIn)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-center">
                        <StatusBadge status={ticket.status} />
                      </td>

                      <td className="px-5 py-4">
                        <div className="relative flex justify-end">
                          <button
                            type="button"
                            onClick={() =>
                              setMenuId(
                                menuId === ticket.id
                                  ? null
                                  : ticket.id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
                          >
                            <MoreHorizontal size={17} />
                          </button>

                          {menuId === ticket.id && (
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
                                    setSelectedTicket(ticket);
                                    setMenuId(null);
                                  }}
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                                >
                                  <Eye size={15} />
                                  Lihat Detail
                                </button>

                                {ticket.status === "active" && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCancel(ticket.id)
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-rose-400 transition hover:bg-rose-500/10"
                                  >
                                    <Ban size={15} />
                                    Cancel Ticket
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="9" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-600">
                        <Ticket size={20} />
                      </div>

                      <p className="mt-3 text-sm font-medium text-slate-400">
                        Ticket tidak ditemukan
                      </p>

                      <p className="mt-1 text-xs text-slate-600">
                        Coba gunakan kata kunci atau filter yang
                        berbeda.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#101827] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Detail Ticket
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Monitoring ticket dan statistik penjualan
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                      <Ticket size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {selectedTicket.id}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {selectedTicket.category}
                      </p>
                    </div>
                  </div>

                  <StatusBadge status={selectedTicket.status} />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <p className="text-[10px] text-slate-600">
                    Concert
                  </p>

                  <p className="mt-1 text-xs font-semibold text-white">
                    {selectedTicket.event}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                    <p className="text-[10px] text-slate-600">
                      Ticket Price
                    </p>

                    <p className="mt-1 text-sm font-bold text-purple-400">
                      {formatCurrency(selectedTicket.price)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                    <p className="text-[10px] text-slate-600">
                      Quota
                    </p>

                    <p className="mt-1 text-sm font-bold text-white">
                      {formatNumber(selectedTicket.quota)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                    <p className="text-[10px] text-slate-600">
                      Sold
                    </p>

                    <p className="mt-1 text-sm font-bold text-emerald-400">
                      {formatNumber(selectedTicket.sold)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                    <p className="text-[10px] text-slate-600">
                      Checked In
                    </p>

                    <p className="mt-1 text-sm font-bold text-blue-400">
                      {formatNumber(selectedTicket.checkedIn)}
                    </p>
                  </div>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] px-4 py-4">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="text-[10px] text-slate-600">
                      Sales Progress
                    </p>

                    <p className="text-[10px] font-semibold text-slate-400">
                      {selectedTicket.quota > 0
                        ? Math.round(
                            (selectedTicket.sold /
                              selectedTicket.quota) *
                              100
                          )
                        : 0}
                      %
                    </p>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-purple-400"
                      style={{
                        width: `${Math.min(
                          selectedTicket.quota > 0
                            ? (selectedTicket.sold /
                                selectedTicket.quota) *
                                100
                            : 0,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {selectedTicket.status === "active" &&
                  selectedTicket.quota -
                    selectedTicket.sold <=
                    selectedTicket.quota * 0.1 && (
                    <div className="flex items-start gap-3 rounded-xl border border-yellow-500/10 bg-yellow-500/5 px-4 py-3">
                      <AlertCircle
                        size={16}
                        className="mt-0.5 shrink-0 text-yellow-400"
                      />

                      <div>
                        <p className="text-xs font-semibold text-yellow-400">
                          Kuota hampir habis
                        </p>

                        <p className="mt-1 text-[10px] leading-5 text-slate-500">
                          Sisa tiket sudah kurang dari atau sama
                          dengan 10% dari total kuota.
                        </p>
                      </div>
                    </div>
                  )}
              </div>

              <div className="mt-5 flex gap-2">
                {selectedTicket.status === "active" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCancel(selectedTicket.id)
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20"
                  >
                    <XCircle size={15} />
                    Cancel Ticket
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
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
