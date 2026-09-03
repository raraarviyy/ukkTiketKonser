import React, { useMemo, useState } from "react";
import {
  Building2,
  Check,
  Eye,
  Mail,
  MoreHorizontal,
  Search,
  ShieldCheck,
  UserRound,
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
    className: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  pending: {
    label: "Pending",
    className: "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  },
  suspended: {
    label: "Suspended",
    className: "border-rose-500/20 bg-rose-500/10 text-rose-400",
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

function StatBox({ title, value, icon: Icon, iconClass }) {
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

export default function AdminOrganizers() {
  const {
    organizers,
    approveOrganizer,
    suspendOrganizer,
    activateOrganizer,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrganizer, setSelectedOrganizer] = useState(null);
  const [menuId, setMenuId] = useState(null);

  const filteredOrganizers = useMemo(() => {
    return organizers.filter((organizer) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        organizer.name.toLowerCase().includes(keyword) ||
        organizer.email.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || organizer.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [organizers, search, statusFilter]);

  const activeCount = organizers.filter(
    (organizer) => organizer.status === "active"
  ).length;

  const pendingCount = organizers.filter(
    (organizer) => organizer.status === "pending"
  ).length;

  const suspendedCount = organizers.filter(
    (organizer) => organizer.status === "suspended"
  ).length;

  const totalRevenue = organizers.reduce(
    (total, organizer) => total + organizer.revenue,
    0
  );

  const handleAction = (action, id) => {
    if (action === "approve") {
      approveOrganizer(id);
    }

    if (action === "suspend") {
      suspendOrganizer(id);
    }

    if (action === "activate") {
      activateOrganizer(id);
    }

    setMenuId(null);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="mb-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
              <Building2 size={13} />
              Organizer Management
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Organizer Management
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Kelola organizer yang terdaftar, approval, status akun, dan
              performa penjualan mereka.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#0d1422] px-4 py-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
              Total Revenue Organizer
            </p>
            <p className="mt-1 text-sm font-bold text-white">
              {formatCurrency(totalRevenue)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatBox
          title="Total Organizer"
          value={formatNumber(organizers.length)}
          icon={Building2}
          iconClass="bg-purple-500/10 text-purple-400"
        />

        <StatBox
          title="Active"
          value={formatNumber(activeCount)}
          icon={ShieldCheck}
          iconClass="bg-emerald-500/10 text-emerald-400"
        />

        <StatBox
          title="Pending Approval"
          value={formatNumber(pendingCount)}
          icon={UserRound}
          iconClass="bg-yellow-500/10 text-yellow-400"
        />

        <StatBox
          title="Suspended"
          value={formatNumber(suspendedCount)}
          icon={XCircle}
          iconClass="bg-rose-500/10 text-rose-400"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d1422] p-4 sm:p-5">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-md">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari organizer atau email..."
              className="h-11 w-full rounded-xl border border-white/10 bg-[#090f1b] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/40"
            />
          </div>

          <div className="flex gap-2 overflow-x-auto">
            {[
              { value: "all", label: "Semua" },
              { value: "active", label: "Active" },
              { value: "pending", label: "Pending" },
              { value: "suspended", label: "Suspended" },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatusFilter(filter.value)}
                className={`whitespace-nowrap rounded-lg px-4 py-2.5 text-xs font-semibold transition ${
                  statusFilter === filter.value
                    ? "bg-purple-500 text-white"
                    : "border border-white/10 bg-white/[0.02] text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422]">
        <div className="border-b border-white/10 px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Daftar Organizer
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {filteredOrganizers.length} organizer ditemukan
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.015] text-left">
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Organizer
                </th>
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Status
                </th>
                <th className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Concert
                </th>
                <th className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Ticket Sold
                </th>
                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Revenue
                </th>
                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredOrganizers.length > 0 ? (
                filteredOrganizers.map((organizer) => (
                  <tr
                    key={organizer.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 text-purple-400">
                          <Building2 size={18} />
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">
                            {organizer.name}
                          </p>

                          <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                            <Mail size={12} />
                            <span>{organizer.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={organizer.status} />
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="text-sm font-semibold text-slate-300">
                        {formatNumber(organizer.concerts)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="text-sm font-semibold text-slate-300">
                        {formatNumber(organizer.ticketsSold)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <span className="text-sm font-semibold text-white">
                        {formatCurrency(organizer.revenue)}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="relative flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setMenuId(
                              menuId === organizer.id ? null : organizer.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        {menuId === organizer.id && (
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
                                  setSelectedOrganizer(organizer);
                                  setMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                              >
                                <Eye size={15} />
                                Lihat Detail
                              </button>

                              {organizer.status === "pending" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAction("approve", organizer.id)
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/10"
                                >
                                  <Check size={15} />
                                  Approve Organizer
                                </button>
                              )}

                              {organizer.status === "active" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAction("suspend", organizer.id)
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-rose-400 transition hover:bg-rose-500/10"
                                >
                                  <X size={15} />
                                  Suspend Organizer
                                </button>
                              )}

                              {organizer.status === "suspended" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleAction("activate", organizer.id)
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/10"
                                >
                                  <ShieldCheck size={15} />
                                  Activate Organizer
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
                  <td colSpan="6" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-600">
                        <Search size={20} />
                      </div>

                      <p className="mt-3 text-sm font-medium text-slate-400">
                        Organizer tidak ditemukan
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

      {selectedOrganizer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#101827] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Detail Organizer
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Informasi dan performa organizer
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrganizer(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <Building2 size={21} />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {selectedOrganizer.name}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <Mail size={12} />
                    {selectedOrganizer.email}
                  </p>
                </div>

                <div className="ml-auto">
                  <StatusBadge status={selectedOrganizer.status} />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <CalendarDaysIcon />
                    <span className="text-xs">Concert</span>
                  </div>

                  <p className="mt-2 text-lg font-bold text-white">
                    {formatNumber(selectedOrganizer.concerts)}
                  </p>
                </div>

                <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex items-center gap-2 text-slate-500">
                    <Users size={14} />
                    <span className="text-xs">Ticket Sold</span>
                  </div>

                  <p className="mt-2 text-lg font-bold text-white">
                    {formatNumber(selectedOrganizer.ticketsSold)}
                  </p>
                </div>

                <div className="col-span-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <p className="text-xs text-slate-500">Total Revenue</p>
                  <p className="mt-2 text-xl font-bold text-purple-400">
                    {formatCurrency(selectedOrganizer.revenue)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                {selectedOrganizer.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => {
                      approveOrganizer(selectedOrganizer.id);
                      setSelectedOrganizer(null);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-bold text-white transition hover:bg-emerald-400"
                  >
                    <Check size={15} />
                    Approve
                  </button>
                )}

                {selectedOrganizer.status === "active" && (
                  <button
                    type="button"
                    onClick={() => {
                      suspendOrganizer(selectedOrganizer.id);
                      setSelectedOrganizer(null);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20"
                  >
                    <X size={15} />
                    Suspend
                  </button>
                )}

                {selectedOrganizer.status === "suspended" && (
                  <button
                    type="button"
                    onClick={() => {
                      activateOrganizer(selectedOrganizer.id);
                      setSelectedOrganizer(null);
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                  >
                    <ShieldCheck size={15} />
                    Activate
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedOrganizer(null)}
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

function CalendarDaysIcon() {
  return <span className="text-xs">◷</span>;
}