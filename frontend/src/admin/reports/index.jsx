import React, { useMemo, useState } from "react";
import {
  ArrowDownToLine,
  Check,
  ChevronDown,
  CircleDollarSign,
  Clock3,
  Download,
  Eye,
  Filter,
  Landmark,
  MoreHorizontal,
  Percent,
  Search,
  Wallet,
  X,
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

const settlementStatus = {
  pending: {
    label: "Pending",
    className:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  },
  processing: {
    label: "Processing",
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },
  settled: {
    label: "Settled",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
};

const initialSettlements = [
  {
    id: "SET-2026-001",
    organizer: "Soundwave Organizer",
    period: "September 2026",
    gmv: 420000000,
    platformFee: 21000000,
    refund: 150000,
    payout: 398850000,
    status: "pending",
    dueDate: "2026-09-30",
  },
  {
    id: "SET-2026-002",
    organizer: "Nusantara Event",
    period: "September 2026",
    gmv: 312000000,
    platformFee: 15600000,
    refund: 0,
    payout: 296400000,
    status: "processing",
    dueDate: "2026-09-30",
  },
  {
    id: "SET-2026-003",
    organizer: "Urban Stage",
    period: "August 2026",
    gmv: 86000000,
    platformFee: 4300000,
    refund: 1000000,
    payout: 80700000,
    status: "settled",
    dueDate: "2026-09-05",
  },
  {
    id: "SET-2026-004",
    organizer: "Live Project",
    period: "August 2026",
    gmv: 110000000,
    platformFee: 5500000,
    refund: 0,
    payout: 104500000,
    status: "settled",
    dueDate: "2026-09-05",
  },
];

function StatusBadge({ status }) {
  const config =
    settlementStatus[status] || settlementStatus.pending;

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

export default function AdminSettlements() {
  const { platformFee, updatePlatformFee } = useAdmin();

  const [settlements, setSettlements] = useState(
    initialSettlements
  );

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [selectedSettlement, setSelectedSettlement] =
    useState(null);
  const [feeInput, setFeeInput] = useState(platformFee);

  const totals = useMemo(() => {
    return settlements.reduce(
      (result, settlement) => {
        result.gmv += settlement.gmv;
        result.platformFee += settlement.platformFee;
        result.refund += settlement.refund;
        result.payout += settlement.payout;

        return result;
      },
      {
        gmv: 0,
        platformFee: 0,
        refund: 0,
        payout: 0,
      }
    );
  }, [settlements]);

  const filteredSettlements = useMemo(() => {
    return settlements.filter((settlement) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        settlement.id.toLowerCase().includes(keyword) ||
        settlement.organizer.toLowerCase().includes(keyword) ||
        settlement.period.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        settlement.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [settlements, search, statusFilter]);

  const pendingAmount = settlements
    .filter(
      (settlement) =>
        settlement.status === "pending" ||
        settlement.status === "processing"
    )
    .reduce((total, settlement) => total + settlement.payout, 0);

  const settledAmount = settlements
    .filter((settlement) => settlement.status === "settled")
    .reduce((total, settlement) => total + settlement.payout, 0);

  const handleSaveFee = () => {
    const value = Number(feeInput);

    if (Number.isNaN(value) || value < 0 || value > 100) {
      return;
    }

    updatePlatformFee(value);

    setSettlements((current) =>
      current.map((settlement) => {
        const newPlatformFee =
          Math.round((settlement.gmv * value) / 100);

        return {
          ...settlement,
          platformFee: newPlatformFee,
          payout: Math.max(
            settlement.gmv -
              newPlatformFee -
              settlement.refund,
            0
          ),
        };
      })
    );
  };

  const handleProcessSettlement = (id) => {
    setSettlements((current) =>
      current.map((settlement) =>
        settlement.id === id
          ? { ...settlement, status: "processing" }
          : settlement
      )
    );

    setMenuId(null);

    if (selectedSettlement?.id === id) {
      setSelectedSettlement((current) =>
        current
          ? { ...current, status: "processing" }
          : current
      );
    }
  };

  const handleCompleteSettlement = (id) => {
    setSettlements((current) =>
      current.map((settlement) =>
        settlement.id === id
          ? { ...settlement, status: "settled" }
          : settlement
      )
    );

    setMenuId(null);

    if (selectedSettlement?.id === id) {
      setSelectedSettlement((current) =>
        current
          ? { ...current, status: "settled" }
          : current
      );
    }
  };

  const handleExport = () => {
    const headers = [
      "Settlement ID",
      "Organizer",
      "Period",
      "GMV",
      "Platform Fee",
      "Refund",
      "Payout",
      "Status",
      "Due Date",
    ];

    const rows = settlements.map((settlement) => [
      settlement.id,
      settlement.organizer,
      settlement.period,
      settlement.gmv,
      settlement.platformFee,
      settlement.refund,
      settlement.payout,
      settlement.status,
      settlement.dueDate,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value).replaceAll('"', '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "settlement-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-300">
          <Wallet size={13} />
          Commission & Settlement
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Commission & Settlement
            </h1>

            <p className="mt-2 max-w-2xl text-sm text-slate-400">
              Kelola platform fee, pantau pendapatan platform,
              dan proses payout organizer.
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
          >
            <Download size={15} />
            Export Settlement
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total GMV"
          value={formatCurrency(totals.gmv)}
          icon={CircleDollarSign}
          iconClass="bg-purple-500/10 text-purple-400"
        />

        <StatCard
          title="Platform Revenue"
          value={formatCurrency(totals.platformFee)}
          icon={Percent}
          iconClass="bg-cyan-500/10 text-cyan-400"
        />

        <StatCard
          title="Refund"
          value={formatCurrency(totals.refund)}
          icon={ArrowDownToLine}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Pending Payout"
          value={formatCurrency(pendingAmount)}
          icon={Clock3}
          iconClass="bg-yellow-500/10 text-yellow-400"
        />

        <StatCard
          title="Settled Payout"
          value={formatCurrency(settledAmount)}
          icon={Check}
          iconClass="bg-emerald-500/10 text-emerald-400"
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <Percent size={18} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Platform Fee
              </h2>

              <p className="mt-1 text-xs leading-5 text-slate-500">
                Fee platform dihitung dari GMV transaksi tiket
                sebelum payout kepada EO.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-2 block text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                Commission Percentage
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={feeInput}
                  onChange={(event) =>
                    setFeeInput(event.target.value)
                  }
                  className="h-11 w-full rounded-xl border border-white/10 bg-[#090f1b] px-4 pr-10 text-sm font-semibold text-white outline-none transition focus:border-emerald-500/40"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-600">
                  %
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleSaveFee}
              className="h-11 rounded-xl bg-emerald-500 px-5 text-xs font-bold text-black transition hover:bg-emerald-400"
            >
              Simpan Fee
            </button>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[10px] text-slate-600">
                Current Fee
              </p>

              <p className="mt-1 text-sm font-bold text-emerald-400">
                {platformFee}%
              </p>
            </div>

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-[10px] text-slate-600">
                Est. Platform Revenue
              </p>

              <p className="mt-1 text-sm font-bold text-white">
                {formatCurrency(
                  Math.round((totals.gmv * platformFee) / 100)
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#0d1422] p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400">
              <Landmark size={18} />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Settlement Summary
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Ringkasan dana yang akan dibayarkan ke EO.
              </p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Gross Merchandise Value
              </span>

              <span className="text-xs font-semibold text-white">
                {formatCurrency(totals.gmv)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Platform Fee
              </span>

              <span className="text-xs font-semibold text-purple-400">
                - {formatCurrency(totals.platformFee)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Refund
              </span>

              <span className="text-xs font-semibold text-blue-400">
                - {formatCurrency(totals.refund)}
              </span>
            </div>

            <div className="border-t border-white/10 pt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">
                  Total EO Payout
                </span>

                <span className="text-base font-bold text-emerald-400">
                  {formatCurrency(totals.payout)}
                </span>
              </div>
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
              placeholder="Cari settlement ID, organizer, atau periode..."
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
                  : settlementStatus[statusFilter]?.label}
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
                    { value: "pending", label: "Pending" },
                    {
                      value: "processing",
                      label: "Processing",
                    },
                    { value: "settled", label: "Settled" },
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
            Settlement Organizer
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {filteredSettlements.length} settlement ditemukan
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.015] text-left">
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Settlement
                </th>

                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Organizer
                </th>

                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  GMV
                </th>

                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Platform Fee
                </th>

                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Refund
                </th>

                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  EO Payout
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
              {filteredSettlements.length > 0 ? (
                filteredSettlements.map((settlement) => (
                  <tr
                    key={settlement.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                          <Landmark size={16} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-white">
                            {settlement.id}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-600">
                            {settlement.period}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-slate-300">
                        {settlement.organizer}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs font-semibold text-white">
                        {formatCurrency(settlement.gmv)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <p className="text-xs font-semibold text-purple-400">
                        {formatCurrency(settlement.platformFee)}
                      </p>

                      <p className="mt-1 text-[9px] text-slate-600">
                        {platformFee}%
                      </p>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <p className="text-xs font-semibold text-blue-400">
                        {formatCurrency(settlement.refund)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <p className="text-xs font-bold text-emerald-400">
                        {formatCurrency(settlement.payout)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <StatusBadge status={settlement.status} />
                    </td>

                    <td className="px-5 py-4">
                      <div className="relative flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setMenuId(
                              menuId === settlement.id
                                ? null
                                : settlement.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        {menuId === settlement.id && (
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
                                  setSelectedSettlement(
                                    settlement
                                  );
                                  setMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                              >
                                <Eye size={15} />
                                Lihat Detail
                              </button>

                              {settlement.status === "pending" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleProcessSettlement(
                                      settlement.id
                                    )
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-blue-400 transition hover:bg-blue-500/10"
                                >
                                  <Clock3 size={15} />
                                  Process Settlement
                                </button>
                              )}

                              {settlement.status === "processing" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCompleteSettlement(
                                      settlement.id
                                    )
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-emerald-400 transition hover:bg-emerald-500/10"
                                >
                                  <Check size={15} />
                                  Mark as Settled
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
                  <td colSpan="8" className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 text-slate-600">
                        <Landmark size={20} />
                      </div>

                      <p className="mt-3 text-sm font-medium text-slate-400">
                        Settlement tidak ditemukan
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

      {selectedSettlement && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#101827] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Settlement Detail
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Rincian payout organizer
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedSettlement(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                      <Landmark size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {selectedSettlement.id}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-500">
                        {selectedSettlement.organizer}
                      </p>
                    </div>
                  </div>

                  <StatusBadge
                    status={selectedSettlement.status}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <span className="text-xs text-slate-500">
                    Settlement Period
                  </span>

                  <span className="text-xs font-semibold text-white">
                    {selectedSettlement.period}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <span className="text-xs text-slate-500">
                    Due Date
                  </span>

                  <span className="text-xs font-semibold text-white">
                    {selectedSettlement.dueDate}
                  </span>
                </div>

                <div className="space-y-2 rounded-xl border border-white/5 bg-white/[0.02] p-4">
                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">
                      GMV
                    </span>

                    <span className="text-xs font-semibold text-white">
                      {formatCurrency(selectedSettlement.gmv)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">
                      Platform Fee ({platformFee}%)
                    </span>

                    <span className="text-xs font-semibold text-purple-400">
                      -{" "}
                      {formatCurrency(
                        selectedSettlement.platformFee
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-xs text-slate-500">
                      Refund
                    </span>

                    <span className="text-xs font-semibold text-blue-400">
                      -{" "}
                      {formatCurrency(
                        selectedSettlement.refund
                      )}
                    </span>
                  </div>

                  <div className="border-t border-white/10 pt-3">
                    <div className="flex justify-between">
                      <span className="text-xs font-semibold text-slate-400">
                        EO Payout
                      </span>

                      <span className="text-base font-bold text-emerald-400">
                        {formatCurrency(
                          selectedSettlement.payout
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                {selectedSettlement.status === "pending" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleProcessSettlement(
                        selectedSettlement.id
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500/10 px-4 py-3 text-xs font-bold text-blue-400 transition hover:bg-blue-500/20"
                  >
                    <Clock3 size={15} />
                    Process
                  </button>
                )}

                {selectedSettlement.status === "processing" && (
                  <button
                    type="button"
                    onClick={() =>
                      handleCompleteSettlement(
                        selectedSettlement.id
                      )
                    }
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                  >
                    <Check size={15} />
                    Mark Settled
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedSettlement(null)}
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