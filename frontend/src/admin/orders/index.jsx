import React, { useMemo, useState } from "react";
import {
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  Eye,
  Filter,
  MoreHorizontal,
  Receipt,
  RefreshCcw,
  Search,
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
  paid: {
    label: "Paid",
    className:
      "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  },
  pending: {
    label: "Pending",
    className:
      "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  },
  refunded: {
    label: "Refunded",
    className:
      "border-blue-500/20 bg-blue-500/10 text-blue-400",
  },
  cancelled: {
    label: "Cancelled",
    className:
      "border-rose-500/20 bg-rose-500/10 text-rose-400",
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;

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

export default function AdminOrders() {
  const {
    transactions,
    refundTransaction,
    cancelTransaction,
  } = useAdmin();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [showPaymentFilter, setShowPaymentFilter] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      const keyword = search.toLowerCase();

      const matchesSearch =
        transaction.id.toLowerCase().includes(keyword) ||
        transaction.buyer.toLowerCase().includes(keyword) ||
        transaction.event.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" ||
        transaction.status === statusFilter;

      const matchesPayment =
        paymentFilter === "all" ||
        transaction.paymentMethod === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [transactions, search, statusFilter, paymentFilter]);

  const totalAmount = transactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const paidAmount = transactions
    .filter((transaction) => transaction.status === "paid")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const pendingAmount = transactions
    .filter((transaction) => transaction.status === "pending")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const refundedAmount = transactions
    .filter((transaction) => transaction.status === "refunded")
    .reduce((total, transaction) => total + transaction.amount, 0);

  const handleRefund = (id) => {
    refundTransaction(id);
    setMenuId(null);
  };

  const handleCancel = (id) => {
    cancelTransaction(id);
    setMenuId(null);
  };

  return (
    <div className="mx-auto w-full max-w-[1600px]">
      <div className="mb-8">
        <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1.5 text-xs font-medium text-cyan-300">
          <Receipt size={13} />
          Order Management
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          Order Management
        </h1>

        <p className="mt-2 max-w-2xl text-sm text-slate-400">
          Pantau seluruh transaksi pembelian tiket, status pembayaran,
          refund, dan pembatalan order.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard
          title="Total Orders"
          value={formatNumber(transactions.length)}
          icon={Receipt}
          iconClass="bg-purple-500/10 text-purple-400"
        />

        <StatCard
          title="Paid Amount"
          value={formatCurrency(paidAmount)}
          icon={Check}
          iconClass="bg-emerald-500/10 text-emerald-400"
        />

        <StatCard
          title="Pending Amount"
          value={formatCurrency(pendingAmount)}
          icon={Clock3}
          iconClass="bg-yellow-500/10 text-yellow-400"
        />

        <StatCard
          title="Refunded"
          value={formatCurrency(refundedAmount)}
          icon={RefreshCcw}
          iconClass="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Transaction Value"
          value={formatCurrency(totalAmount)}
          icon={CreditCard}
          iconClass="bg-cyan-500/10 text-cyan-400"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d1422] p-4 sm:p-5">
        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="relative w-full xl:max-w-lg">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari invoice, buyer, atau concert..."
              className="h-11 w-full rounded-xl border border-white/10 bg-[#090f1b] pl-10 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/40"
            />
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowStatusFilter(!showStatusFilter);
                  setShowPaymentFilter(false);
                }}
                className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:w-40"
              >
                <span className="flex items-center gap-2">
                  <Filter size={14} />

                  {statusFilter === "all"
                    ? "Status"
                    : statusConfig[statusFilter]?.label}
                </span>

                <ChevronDown
                  size={15}
                  className={`transition ${
                    showStatusFilter ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showStatusFilter && (
                <>
                  <button
                    type="button"
                    aria-label="Close status filter"
                    onClick={() => setShowStatusFilter(false)}
                    className="fixed inset-0 z-10 cursor-default"
                  />

                  <div className="absolute right-0 top-12 z-20 w-44 rounded-xl border border-white/10 bg-[#151c2c] p-1.5 shadow-2xl">
                    {[
                      { value: "all", label: "Semua Status" },
                      { value: "paid", label: "Paid" },
                      { value: "pending", label: "Pending" },
                      { value: "refunded", label: "Refunded" },
                      { value: "cancelled", label: "Cancelled" },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(item.value);
                          setShowStatusFilter(false);
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

            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setShowPaymentFilter(!showPaymentFilter);
                  setShowStatusFilter(false);
                }}
                className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white sm:w-44"
              >
                <span className="flex items-center gap-2">
                  <CreditCard size={14} />

                  {paymentFilter === "all"
                    ? "Payment"
                    : paymentFilter}
                </span>

                <ChevronDown
                  size={15}
                  className={`transition ${
                    showPaymentFilter ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showPaymentFilter && (
                <>
                  <button
                    type="button"
                    aria-label="Close payment filter"
                    onClick={() => setShowPaymentFilter(false)}
                    className="fixed inset-0 z-10 cursor-default"
                  />

                  <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-white/10 bg-[#151c2c] p-1.5 shadow-2xl">
                    {[
                      { value: "all", label: "Semua Payment" },
                      { value: "QRIS", label: "QRIS" },
                      {
                        value: "Bank Transfer",
                        label: "Bank Transfer",
                      },
                      {
                        value: "E-Wallet",
                        label: "E-Wallet",
                      },
                    ].map((item) => (
                      <button
                        key={item.value}
                        type="button"
                        onClick={() => {
                          setPaymentFilter(item.value);
                          setShowPaymentFilter(false);
                        }}
                        className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-xs transition ${
                          paymentFilter === item.value
                            ? "bg-purple-500/10 text-purple-400"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {item.label}

                        {paymentFilter === item.value && (
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
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1422]">
        <div className="border-b border-white/10 px-5 py-4">
          <h2 className="text-sm font-semibold text-white">
            Semua Transaksi
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {filteredTransactions.length} transaksi ditemukan
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.015] text-left">
                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Invoice
                </th>

                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Buyer
                </th>

                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Concert
                </th>

                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Amount
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Payment
                </th>

                <th className="px-5 py-4 text-center text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Status
                </th>

                <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Created
                </th>

                <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b border-white/5 transition hover:bg-white/[0.02]"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-500/10 text-purple-400">
                          <Receipt size={16} />
                        </div>

                        <div>
                          <p className="text-xs font-semibold text-white">
                            {transaction.id}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-600">
                            Order
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs font-medium text-slate-300">
                        {transaction.buyer}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <p className="max-w-[200px] truncate text-xs text-slate-400">
                        {transaction.event}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <p className="text-xs font-semibold text-white">
                        {formatCurrency(transaction.amount)}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                        <CreditCard
                          size={13}
                          className="text-slate-600"
                        />
                        {transaction.paymentMethod}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-center">
                      <StatusBadge status={transaction.status} />
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-xs text-slate-500">
                        {transaction.createdAt}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <div className="relative flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            setMenuId(
                              menuId === transaction.id
                                ? null
                                : transaction.id
                            )
                          }
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-slate-400 transition hover:bg-white/5 hover:text-white"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        {menuId === transaction.id && (
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
                                  setSelectedTransaction(transaction);
                                  setMenuId(null);
                                }}
                                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition hover:bg-white/5 hover:text-white"
                              >
                                <Eye size={15} />
                                Lihat Detail
                              </button>

                              {transaction.status === "paid" && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRefund(transaction.id)
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-blue-400 transition hover:bg-blue-500/10"
                                  >
                                    <RefreshCcw size={15} />
                                    Refund Transaction
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleCancel(transaction.id)
                                    }
                                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-rose-400 transition hover:bg-rose-500/10"
                                  >
                                    <XCircle size={15} />
                                    Cancel Order
                                  </button>
                                </>
                              )}

                              {transaction.status === "pending" && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleCancel(transaction.id)
                                  }
                                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-rose-400 transition hover:bg-rose-500/10"
                                >
                                  <XCircle size={15} />
                                  Cancel Order
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
                        <Receipt size={20} />
                      </div>

                      <p className="mt-3 text-sm font-medium text-slate-400">
                        Transaksi tidak ditemukan
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

      {selectedTransaction && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#101827] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <h2 className="text-base font-semibold text-white">
                  Detail Transaction
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Informasi pembayaran dan order tiket
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedTransaction(null)}
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
                      <Receipt size={19} />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-white">
                        {selectedTransaction.id}
                      </p>

                      <p className="mt-1 text-[11px] text-slate-600">
                        {selectedTransaction.createdAt}
                      </p>
                    </div>
                  </div>

                  <StatusBadge
                    status={selectedTransaction.status}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <span className="text-xs text-slate-500">
                    Buyer
                  </span>

                  <span className="text-xs font-semibold text-white">
                    {selectedTransaction.buyer}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4 rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <span className="shrink-0 text-xs text-slate-500">
                    Concert
                  </span>

                  <span className="text-right text-xs font-semibold text-white">
                    {selectedTransaction.event}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3">
                  <span className="text-xs text-slate-500">
                    Payment Method
                  </span>

                  <span className="flex items-center gap-2 text-xs font-semibold text-white">
                    <CreditCard size={14} className="text-cyan-400" />
                    {selectedTransaction.paymentMethod}
                  </span>
                </div>

                <div className="rounded-xl border border-purple-500/10 bg-purple-500/5 px-4 py-4">
                  <p className="text-xs text-slate-500">
                    Transaction Amount
                  </p>

                  <p className="mt-2 text-xl font-bold text-purple-400">
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex gap-2">
                {selectedTransaction.status === "paid" && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        refundTransaction(selectedTransaction.id);
                        setSelectedTransaction({
                          ...selectedTransaction,
                          status: "refunded",
                        });
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-500/10 px-4 py-3 text-xs font-bold text-blue-400 transition hover:bg-blue-500/20"
                    >
                      <RefreshCcw size={15} />
                      Refund
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        cancelTransaction(selectedTransaction.id);
                        setSelectedTransaction({
                          ...selectedTransaction,
                          status: "cancelled",
                        });
                      }}
                      className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20"
                    >
                      <XCircle size={15} />
                      Cancel
                    </button>
                  </>
                )}

                {selectedTransaction.status === "pending" && (
                  <button
                    type="button"
                    onClick={() => {
                      cancelTransaction(selectedTransaction.id);
                      setSelectedTransaction({
                        ...selectedTransaction,
                        status: "cancelled",
                      });
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rose-500/10 px-4 py-3 text-xs font-bold text-rose-400 transition hover:bg-rose-500/20"
                  >
                    <XCircle size={15} />
                    Cancel Order
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setSelectedTransaction(null)}
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