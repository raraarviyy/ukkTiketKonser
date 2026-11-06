import React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  Loader2,
  Ticket,
  TrendingUp,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value || 0);

const formatNumber = (value) =>
  new Intl.NumberFormat("id-ID").format(value || 0);

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  iconClass,
  trend,
  trendPositive = true,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422] p-5 transition duration-300 hover:-translate-y-1 hover:border-white/15">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-purple-500/5 blur-2xl transition group-hover:bg-purple-500/10" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>

          <h3 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {value}
          </h3>

          <div className="mt-3 flex items-center gap-2">
            {trend && (
              <span
                className={`flex items-center gap-1 text-xs font-semibold ${
                  trendPositive ? "text-emerald-400" : "text-rose-400"
                }`}
              >
                {trendPositive ? (
                  <ArrowUpRight size={13} />
                ) : (
                  <ArrowDownRight size={13} />
                )}
                {trend}
              </span>
            )}

            <span className="text-xs text-slate-500">{description}</span>
          </div>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClass}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-semibold text-white">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">{description}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { stats, events, orders, loading } = useAdmin();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "300px",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <Loader2
          size={32}
          color="#a855f7"
          style={{ animation: "spin 1s linear infinite" }}
        />
        <span style={{ color: "#94a3b8", fontSize: "14px" }}>
          Memuat data dashboard...
        </span>
      </div>
    );
  }

  const overview = stats?.overview || {};
  const eventsBreakdown = stats?.events_breakdown || {};
  const usersBreakdown = stats?.users_breakdown || {};
  const recentTransactions = stats?.recent_transactions || [];
  const topPerformingEvents = stats?.top_performing_events || [];

  const recentEvents = [...events]
    .sort(
      (a, b) =>
        new Date(b.event_date || b.created_at) -
        new Date(a.event_date || a.created_at)
    )
    .slice(0, 5);

  const recentOrders = recentTransactions.slice(0, 5);

  const statusConfig = {
    approved: {
      label: "Approved",
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
  };

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="mb-8">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/20 bg-purple-500/10 px-3 py-1.5 text-xs font-medium text-purple-300">
              <span className="h-1.5 w-1.5 rounded-full bg-purple-400" />
              Platform Overview
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Dashboard Platform
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Pantau performa platform, penjualan tiket, event, transaksi, dan
              pendapatan secara keseluruhan.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0d1422] px-4 py-2.5">
            <CalendarDays size={16} className="text-purple-400" />
            <span className="text-xs font-medium text-slate-300">
              {new Date().toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total User"
          value={formatNumber(overview.totalUsers)}
          description="pengguna terdaftar"
          icon={Users}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Total Event"
          value={formatNumber(overview.totalEvents)}
          description="event di platform"
          icon={CalendarDays}
          iconClass="bg-cyan-500/10 text-cyan-400"
        />

        <StatCard
          title="Tiket Terjual"
          value={formatNumber(overview.totalTicketsSold)}
          description="seluruh event"
          icon={Ticket}
          iconClass="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Total Pendapatan"
          value={formatCurrency(overview.totalRevenue)}
          description="transaksi lunas"
          icon={TrendingUp}
          iconClass="bg-purple-500/10 text-purple-400"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <DollarSign size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Pendapatan Hari Ini</p>
              <p className="mt-1 text-lg font-bold text-white">
                {formatCurrency(overview.todayRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Wallet size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Order Lunas Hari Ini</p>
              <p className="mt-1 text-lg font-bold text-white">
                {formatNumber(overview.paidOrdersToday)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Total Orders</p>
              <p className="mt-1 text-lg font-bold text-white">
                {formatNumber(overview.totalOrders)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <SectionHeader
            title="Top Performing Events"
            description="Event dengan order terbanyak di platform"
          />

          <div className="space-y-3">
            {topPerformingEvents.length > 0 ? (
              topPerformingEvents.map((event, index) => {
                const maxOrders = Math.max(
                  ...topPerformingEvents.map((e) => e._count?.orders || 0),
                  1
                );
                const count = event._count?.orders || 0;
                const percentage = Math.round((count / maxOrders) * 100);

                return (
                  <div key={event.id}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-slate-400">
                          {index + 1}
                        </span>

                        <span className="truncate text-sm font-medium text-slate-300">
                          {event.title}
                        </span>
                      </div>

                      <span className="shrink-0 text-xs font-semibold text-white">
                        {formatNumber(count)} orders
                      </span>
                    </div>

                    <div className="ml-10 h-1.5 overflow-hidden rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-slate-500">
                Belum ada data event.
              </div>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <SectionHeader
            title="Platform Status"
            description="Ringkasan kondisi operasional platform"
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span className="text-xs text-slate-400">Paid Orders</span>
              </div>

              <p className="mt-3 text-xl font-bold text-white">
                {formatNumber(overview.totalOrders - (overview.pendingOrders || 0) - (overview.cancelledOrders || 0))}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                transaksi berhasil
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2">
                <Clock3 size={16} className="text-yellow-400" />
                <span className="text-xs text-slate-400">Pending</span>
              </div>

              <p className="mt-3 text-xl font-bold text-white">
                {formatNumber(overview.pendingOrders)}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                menunggu pembayaran
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-purple-400" />
                <span className="text-xs text-slate-400">Pending Events</span>
              </div>

              <p className="mt-3 text-xl font-bold text-white">
                {formatNumber(eventsBreakdown.pending_moderation)}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                butuh approval
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2">
                <XCircle size={16} className="text-rose-400" />
                <span className="text-xs text-slate-400">Cancelled</span>
              </div>

              <p className="mt-3 text-xl font-bold text-white">
                {formatNumber(overview.cancelledOrders)}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                order dibatalkan
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <SectionHeader
            title="Recent Events"
            description="Event terbaru yang terdaftar di platform"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Event
                  </th>
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Organizer
                  </th>
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Status
                  </th>
                  <th className="pb-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Orders
                  </th>
                </tr>
              </thead>

              <tbody>
                {recentEvents.map((event) => {
                  const config =
                    statusConfig[event.status] || statusConfig.pending;

                  return (
                    <tr
                      key={event.id}
                      className="border-b border-white/5 last:border-0"
                    >
                      <td className="py-4">
                        <p className="max-w-[190px] truncate text-sm font-medium text-white">
                          {event.title}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {event.event_date
                            ? new Date(event.event_date).toLocaleDateString(
                                "id-ID"
                              )
                            : "-"}
                        </p>
                      </td>

                      <td className="py-4 text-xs text-slate-400">
                        {event.organizer?.name ||
                          event.organizer?.organization_name ||
                          "-"}
                      </td>

                      <td className="py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
                        >
                          {config.label}
                        </span>
                      </td>

                      <td className="py-4 text-right text-xs font-semibold text-slate-300">
                        {formatNumber(event._count?.orders || 0)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <SectionHeader
            title="Recent Transactions"
            description="Transaksi terbaru dari seluruh pengguna"
          />

          <div className="space-y-2">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                    <Ticket size={16} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-white">
                      {order.order_code || `#${order.id}`}
                    </p>

                    <p className="mt-1 truncate text-[11px] text-slate-500">
                      {order.user?.name} · {order.event?.title}
                    </p>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs font-semibold text-white">
                      {formatCurrency(order.total)}
                    </p>

                    <span
                      className={`mt-1 inline-block text-[10px] font-medium ${
                        order.status === "paid"
                          ? "text-emerald-400"
                          : order.status === "cancelled"
                          ? "text-rose-400"
                          : "text-yellow-400"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-slate-500">
                Belum ada transaksi.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-yellow-500/10 bg-yellow-500/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
              <Clock3 size={18} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Pending Approval</p>
              <p className="mt-1 text-lg font-bold text-white">
                {eventsBreakdown.pending_moderation || 0} Event
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle2 size={18} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Event Approved</p>
              <p className="mt-1 text-lg font-bold text-white">
                {eventsBreakdown.approved || 0} Event
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-500/10 bg-rose-500/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <XCircle size={18} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Event Rejected</p>
              <p className="mt-1 text-lg font-bold text-white">
                {eventsBreakdown.rejected || 0} Event
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pb-4 text-center">
        <p className="text-[11px] text-slate-600">
          Tiket Konser Admin Platform · Super Admin Dashboard
        </p>
      </div>
    </div>
  );
}