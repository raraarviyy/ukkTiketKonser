import React, { useMemo, useState } from "react";
import {
  Activity,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  FileText,
  Filter,
  Search,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const actionConfig = {
  "Approve Concert": {
    label: "Approve Concert",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  "Reject Concert": {
    label: "Reject Concert",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  "Cancel Concert": {
    label: "Cancel Concert",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  "Soft Delete Concert": {
    label: "Soft Delete Concert",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  "Approve Organizer": {
    label: "Approve Organizer",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  "Suspend Organizer": {
    label: "Suspend Organizer",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  "Activate Organizer": {
    label: "Activate Organizer",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  "Suspend User": {
    label: "Suspend User",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  "Activate User": {
    label: "Activate User",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  "Change User Role": {
    label: "Change User Role",
    className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  "Refund Transaction": {
    label: "Refund Transaction",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  "Cancel Transaction": {
    label: "Cancel Transaction",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  "Cancel Ticket": {
    label: "Cancel Ticket",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  "Update Platform Fee": {
    label: "Update Platform Fee",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  "Create Announcement": {
    label: "Create Announcement",
    className: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  },
  "Delete Announcement": {
    label: "Delete Announcement",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  "Update Review": {
    label: "Update Review",
    className: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  },
  "Delete Review": {
    label: "Delete Review",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
};

function getActionConfig(action) {
  return (
    actionConfig[action] || {
      label: action,
      className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    }
  );
}

function StatCard({ title, value, icon: Icon, iconClass }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
      <div className="flex items-center justify-between gap-4">
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

function ActionBadge({ action }) {
  const config = getActionConfig(action);

  return (
    <span
      className={`inline-flex max-w-full rounded-full border px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}

export default function AdminAuditLog() {
  const { auditLogs } = useAdmin();

  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);

  const actionOptions = useMemo(() => {
    return [...new Set(auditLogs.map((log) => log.action))];
  }, [auditLogs]);

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        log.actor.toLowerCase().includes(keyword) ||
        log.action.toLowerCase().includes(keyword) ||
        log.target.toLowerCase().includes(keyword);

      const matchesAction =
        actionFilter === "all" || log.action === actionFilter;

      return matchesSearch && matchesAction;
    });
  }, [auditLogs, search, actionFilter]);

  const todayLogs = auditLogs.filter((log) =>
    String(log.createdAt).startsWith("2026-09-03")
  ).length;

  const uniqueActors = new Set(
    auditLogs.map((log) => log.actor)
  ).size;

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
          <ShieldCheck size={13} />
          Security & Activity
        </div>

        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Audit Log
          </h1>

          <p className="mt-2 max-w-2xl text-sm text-slate-400">
            Riwayat aktivitas penting yang dilakukan oleh Super Admin
            di dalam platform.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Activity"
          value={auditLogs.length}
          icon={Activity}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Activity Today"
          value={todayLogs}
          icon={CalendarDays}
          iconClass="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Action Type"
          value={actionOptions.length}
          icon={FileText}
          iconClass="bg-purple-500/10 text-purple-400"
        />

        <StatCard
          title="Active Actor"
          value={uniqueActors}
          icon={User}
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
              placeholder="Cari actor, action, atau target..."
              className="h-11 w-full rounded-xl border border-white/10 bg-[#090f1b] pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-600 focus:border-blue-500/40"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setShowFilter(!showFilter)}
              className="flex h-11 w-full items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:w-56"
            >
              <span className="flex items-center gap-2">
                <Filter size={14} />

                {actionFilter === "all"
                  ? "Semua Aktivitas"
                  : actionFilter}
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

                <div className="absolute right-0 top-12 z-20 max-h-80 w-64 overflow-y-auto rounded-xl border border-white/10 bg-[#151c2c] p-1.5 shadow-2xl">
                  <button
                    type="button"
                    onClick={() => {
                      setActionFilter("all");
                      setShowFilter(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                      actionFilter === "all"
                        ? "bg-blue-500/10 text-blue-400"
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    Semua Aktivitas

                    {actionFilter === "all" && (
                      <Check size={14} />
                    )}
                  </button>

                  {actionOptions.map((action) => (
                    <button
                      key={action}
                      type="button"
                      onClick={() => {
                        setActionFilter(action);
                        setShowFilter(false);
                      }}
                      className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                        actionFilter === action
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <span className="truncate">{action}</span>

                      {actionFilter === action && (
                        <Check size={14} className="shrink-0" />
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
        <div className="border-b border-white/10 bg-white/[0.02] px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Activity History
              </h2>

              <p className="mt-1 text-[10px] text-slate-600">
                Semua aktivitas administratif tercatat di sini.
              </p>
            </div>

            <div className="hidden items-center gap-2 text-[10px] text-slate-600 sm:flex">
              <ShieldCheck size={13} />
              Protected Log
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px]">
            <thead>
              <tr className="border-b border-white/10">
                <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Actor
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Action
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Target
                </th>

                <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Date & Time
                </th>

                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Detail
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.015]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-purple-500/10 text-purple-400">
                          <ShieldCheck size={15} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-white">
                            {log.actor}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-600">
                            Administrator
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <ActionBadge action={log.action} />
                    </td>

                    <td className="max-w-[260px] px-5 py-4">
                      <p className="truncate text-xs font-medium text-slate-300">
                        {log.target}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock3 size={13} />
                        {log.createdAt}
                      </div>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
                      >
                        <Eye size={15} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-5 py-16 text-center">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-600">
                      <Activity size={20} />
                    </div>

                    <p className="mt-3 text-sm font-medium text-slate-400">
                      Aktivitas tidak ditemukan
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      Coba gunakan kata kunci atau filter yang
                      berbeda.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-white/5 px-5 py-4">
          <p className="text-[10px] text-slate-600">
            Menampilkan{" "}
            <span className="font-semibold text-slate-400">
              {filteredLogs.length}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-slate-400">
              {auditLogs.length}
            </span>{" "}
            aktivitas
          </p>
        </div>
      </div>

      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#101827] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Activity Detail
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Informasi aktivitas administrator
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
                  <ShieldCheck size={19} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-white">
                    {selectedLog.actor}
                  </p>

                  <p className="mt-1 text-[10px] text-slate-600">
                    Administrator
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Action
                </p>

                <div className="mt-2">
                  <ActionBadge action={selectedLog.action} />
                </div>
              </div>

              <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Target
                </p>

                <p className="mt-2 break-words text-sm font-medium text-white">
                  {selectedLog.target}
                </p>
              </div>

              <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Timestamp
                </p>

                <div className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                  <CalendarDays size={15} className="text-blue-400" />
                  {selectedLog.createdAt}
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-xl border border-emerald-500/10 bg-emerald-500/5 px-4 py-3">
                <Check
                  size={15}
                  className="shrink-0 text-emerald-400"
                />

                <p className="text-xs leading-5 text-slate-400">
                  Aktivitas ini tercatat sebagai bagian dari
                  audit trail platform.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedLog(null)}
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