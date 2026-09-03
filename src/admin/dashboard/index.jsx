import React from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  DollarSign,
  Ticket,
  TrendingUp,
  UserRound,
  Users,
  Wallet,
  XCircle,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
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
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  pending: {
    label: "Pending",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  rejected: {
    label: "Rejected",
    className: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  },
  deleted: {
    label: "Deleted",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
};

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

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) {
    return null;
  }

  return (
    <div className="rounded-xl border border-white/10 bg-[#111827] px-4 py-3 shadow-2xl">
      <p className="mb-2 text-xs font-medium text-slate-400">{label}</p>

      {payload.map((item) => (
        <div key={item.dataKey} className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">
            {item.dataKey === "revenue"
              ? formatCurrency(item.value)
              : formatNumber(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const {
    stats,
    events,
    organizers,
    transactions,
    tickets,
  } = useAdmin();

  const recentEvents = [...events]
    .filter((event) => event.status !== "deleted")
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  const recentTransactions = transactions.slice(0, 5);

  const topOrganizers = [...organizers]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const chartData = stats.monthlySales || [];

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
              Pantau performa platform, penjualan tiket, organizer, konser,
              transaksi, dan pendapatan secara keseluruhan.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0d1422] px-4 py-2.5">
            <CalendarDays size={16} className="text-purple-400" />
            <span className="text-xs font-medium text-slate-300">
              3 September 2026
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total User"
          value={formatNumber(stats.totalUsers)}
          description="pengguna terdaftar"
          icon={Users}
          iconClass="bg-blue-500/10 text-blue-400"
          trend="+12.5%"
        />

        <StatCard
          title="Total Organizer"
          value={formatNumber(stats.totalOrganizers)}
          description="organizer terdaftar"
          icon={UserRound}
          iconClass="bg-purple-500/10 text-purple-400"
          trend="+8.2%"
        />

        <StatCard
          title="Total Concert"
          value={formatNumber(stats.totalEvents)}
          description="event di platform"
          icon={CalendarDays}
          iconClass="bg-cyan-500/10 text-cyan-400"
          trend="+15.4%"
        />

        <StatCard
          title="Tiket Terjual"
          value={formatNumber(stats.totalTicketsSold)}
          description="seluruh event"
          icon={Ticket}
          iconClass="bg-emerald-500/10 text-emerald-400"
          trend="+18.7%"
        />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <DollarSign size={19} />
            </div>

            <div>
              <p className="text-xs text-slate-500">GMV</p>
              <p className="mt-1 text-lg font-bold text-white">
                {formatCurrency(stats.gmv)}
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
              <p className="text-xs text-slate-500">Platform Revenue</p>
              <p className="mt-1 text-lg font-bold text-white">
                {formatCurrency(stats.platformRevenue)}
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
              <p className="text-xs text-slate-500">Settlement EO</p>
              <p className="mt-1 text-lg font-bold text-white">
                {formatCurrency(stats.settlement)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5 xl:col-span-2">
          <SectionHeader
            title="Revenue Overview"
            description="Perkembangan GMV platform dalam beberapa bulan terakhir"
          />

          <div className="h-[310px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{ top: 10, right: 5, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(value) => `${value / 1000000}M`}
                />

                <Tooltip content={<CustomTooltip />} />

                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#a855f7"
                  strokeWidth={2.5}
                  fill="url(#revenueGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <SectionHeader
            title="Ticket Sales"
            description="Jumlah tiket terjual setiap bulan"
          />

          <div className="h-[310px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 5, left: -15, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                />

                <Tooltip content={<CustomTooltip />} />

                <Bar
                  dataKey="sales"
                  fill="#38bdf8"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <SectionHeader
            title="Event Performance"
            description="Konser dengan penjualan tiket tertinggi"
          />

          <div className="space-y-3">
            {stats.eventSales?.length > 0 ? (
              stats.eventSales.map((event, index) => {
                const maxSold = Math.max(
                  ...stats.eventSales.map((item) => item.sold),
                  1
                );

                const percentage = Math.round((event.sold / maxSold) * 100);

                return (
                  <div key={`${event.name}-${index}`}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xs font-bold text-slate-400">
                          {index + 1}
                        </span>

                        <span className="truncate text-sm font-medium text-slate-300">
                          {event.name}
                        </span>
                      </div>

                      <span className="shrink-0 text-xs font-semibold text-white">
                        {formatNumber(event.sold)}
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
                <span className="text-xs text-slate-400">Paid</span>
              </div>

              <p className="mt-3 text-xl font-bold text-white">
                {formatNumber(stats.paidTransactions)}
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
                {formatNumber(stats.pendingTransactions)}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                menunggu pembayaran
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2">
                <CalendarDays size={16} className="text-purple-400" />
                <span className="text-xs text-slate-400">Pending Event</span>
              </div>

              <p className="mt-3 text-xl font-bold text-white">
                {formatNumber(stats.pendingEvents)}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                membutuhkan approval
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2">
                <Ticket size={16} className="text-cyan-400" />
                <span className="text-xs text-slate-400">Check-in</span>
              </div>

              <p className="mt-3 text-xl font-bold text-white">
                {formatNumber(stats.totalCheckedIn)}
              </p>

              <p className="mt-1 text-[11px] text-slate-500">
                tiket telah digunakan
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <SectionHeader
            title="Recent Concerts"
            description="Konser terbaru yang terdaftar di platform"
          />

          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px]">
              <thead>
                <tr className="border-b border-white/5 text-left">
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Concert
                  </th>
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Organizer
                  </th>
                  <th className="pb-3 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Status
                  </th>
                  <th className="pb-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                    Sold
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
                          {event.name}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          {event.date}
                        </p>
                      </td>

                      <td className="py-4 text-xs text-slate-400">
                        {event.organizer}
                      </td>

                      <td className="py-4">
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${config.className}`}
                        >
                          {config.label}
                        </span>
                      </td>

                      <td className="py-4 text-right text-xs font-semibold text-slate-300">
                        {formatNumber(event.ticketsSold)}
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
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                  <Ticket size={16} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-white">
                    {transaction.id}
                  </p>

                  <p className="mt-1 truncate text-[11px] text-slate-500">
                    {transaction.buyer} · {transaction.event}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold text-white">
                    {formatCurrency(transaction.amount)}
                  </p>

                  <span
                    className={`mt-1 inline-block text-[10px] font-medium ${
                      transaction.status === "paid"
                        ? "text-emerald-400"
                        : transaction.status === "refunded"
                        ? "text-rose-400"
                        : transaction.status === "cancelled"
                        ? "text-orange-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d1422] p-5">
        <SectionHeader
          title="Top Organizer"
          description="Organizer berdasarkan total revenue"
        />

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {topOrganizers.map((organizer, index) => (
            <div
              key={organizer.id}
              className="rounded-xl border border-white/5 bg-white/[0.02] p-4"
            >
              <div className="flex items-center justify-between">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-500/10 text-xs font-bold text-purple-400">
                  #{index + 1}
                </span>

                <span
                  className={`rounded-full border px-2 py-1 text-[9px] font-semibold ${
                    organizer.status === "active"
                      ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
                      : organizer.status === "pending"
                      ? "border-yellow-500/20 bg-yellow-500/10 text-yellow-400"
                      : "border-rose-500/20 bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {organizer.status}
                </span>
              </div>

              <p className="mt-4 truncate text-sm font-semibold text-white">
                {organizer.name}
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {formatNumber(organizer.concerts)} konser
              </p>

              <p className="mt-3 text-sm font-bold text-purple-400">
                {formatCurrency(organizer.revenue)}
              </p>
            </div>
          ))}
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
                {stats.pendingEvents} Concert
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
              <p className="text-xs text-slate-500">Refund</p>
              <p className="mt-1 text-lg font-bold text-white">
                {formatCurrency(stats.refundAmount)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Wallet size={18} />
            </div>

            <div>
              <p className="text-xs text-slate-500">Settlement</p>
              <p className="mt-1 text-lg font-bold text-white">
                {formatCurrency(stats.settlement)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 pb-4 text-center">
        <p className="text-[11px] text-slate-600">
          TicketHub Admin Platform · Super Admin Dashboard
        </p>
      </div>
    </div>
  );
}