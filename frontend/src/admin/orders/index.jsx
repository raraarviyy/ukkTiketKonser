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
  X,
  XCircle,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { THEME } from "../../theme";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

const formatDate = (value) => {
  if (!value) return "-";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
};

const statusConfig = {
  paid: { label: "Paid", color: THEME.success, bg: "rgba(16,185,129,0.1)" },
  pending: { label: "Pending", color: THEME.warning, bg: "rgba(245,158,11,0.1)" },
  refunded: { label: "Refunded", color: THEME.purple, bg: "rgba(168,85,247,0.1)" },
  cancelled: { label: "Cancelled", color: THEME.danger, bg: "rgba(239,68,68,0.1)" },
  failed: { label: "Failed", color: THEME.danger, bg: "rgba(239,68,68,0.1)" },
  expired: { label: "Expired", color: THEME.muted, bg: "rgba(156,163,175,0.1)" },
};

function StatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.pending;
  return (
    <span style={{ padding: "4px 10px", borderRadius: 20, fontSize: "0.7rem", fontWeight: 700, backgroundColor: config.bg, color: config.color, display: "inline-block" }}>
      {config.label}
    </span>
  );
}

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 16, padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <p style={{ margin: 0, fontSize: "0.8rem", color: THEME.muted, fontWeight: 500 }}>{title}</p>
          <h3 style={{ margin: "6px 0 0", fontSize: "clamp(1.2rem, 4vw, 1.5rem)", fontWeight: 800, color: THEME.text }}>{value}</h3>
        </div>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Icon size={20} color={color} />
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useAdmin();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [menuId, setMenuId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const transactions = useMemo(() => {
    return (Array.isArray(orders) ? orders : []).map((o) => ({
      key: o.id,
      orderId: o.id,
      id: o.order_code || o.invoice_id || `ORD-${o.id}`,
      buyer: o.user?.name || "-",
      event: o.event?.title || "-",
      amount: Number(o.total || 0),
      paymentMethod: o.payment_method || "-",
      status: o.status,
      createdAt: formatDate(o.created_at),
    }));
  }, [orders]);

  const filtered = useMemo(() => {
    const kw = search.toLowerCase();
    return transactions.filter((t) => {
      const matchSearch = t.id.toLowerCase().includes(kw) || t.buyer.toLowerCase().includes(kw) || t.event.toLowerCase().includes(kw);
      const matchStatus = statusFilter === "all" || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [transactions, search, statusFilter]);

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);
  const paidAmount = transactions.filter(t => t.status === "paid").reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === "pending").reduce((sum, t) => sum + t.amount, 0);

  const handleStatus = async (t, newStatus) => {
    if (!window.confirm(`Ubah status pesanan ${t.id} menjadi ${newStatus}?`)) return;
    try {
      await updateOrderStatus(t.orderId, newStatus);
      setMenuId(null);
    } catch (err) {
      alert(err.message || "Gagal mengubah status");
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text }}>Order Management</h1>
        <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: THEME.muted }}>Pantau seluruh transaksi, status pembayaran, dan pembatalan order.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard title="Total Orders" value={transactions.length} icon={Receipt} color={THEME.pink} />
        <StatCard title="Paid" value={formatCurrency(paidAmount)} icon={Check} color={THEME.success} />
        <StatCard title="Pending" value={formatCurrency(pendingAmount)} icon={Clock3} color={THEME.warning} />
        <StatCard title="Total Nilai" value={formatCurrency(totalAmount)} icon={CreditCard} color={THEME.purple} />
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: "0 14px", flex: "1 1 300px" }}>
          <Search size={18} color={THEME.dim} />
          <input type="text" placeholder="Cari order code, pembeli, atau event..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", background: "none", border: "none", padding: "12px", color: THEME.text, outline: "none", fontSize: "0.9rem" }} />
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowFilter(!showFilter)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, color: THEME.text, cursor: "pointer", fontSize: "0.85rem" }}>
            <Filter size={14} /> {statusFilter === "all" ? "Semua Status" : statusConfig[statusFilter]?.label} <ChevronDown size={14} />
          </button>
          {showFilter && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setShowFilter(false)} />
              <div style={{ position: "absolute", right: 0, top: 44, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                {["all", "paid", "pending", "refunded", "cancelled"].map(s => (
                  <button key={s} onClick={() => { setStatusFilter(s); setShowFilter(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", color: statusFilter === s ? THEME.pink : THEME.muted, fontSize: "0.85rem", cursor: "pointer", borderRadius: 8 }}>
                    {s === "all" ? "Semua Status" : statusConfig[s]?.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${THEME.border}`, textAlign: "left", color: THEME.muted, background: "rgba(255,255,255,0.02)" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Invoice</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Buyer</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Concert</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Amount</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "center" }}>Status</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => (
                <tr key={t.key} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: THEME.pink }}>
                        <Receipt size={16} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: THEME.text }}>{t.id}</p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>{t.createdAt}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", color: THEME.text }}>{t.buyer}</td>
                  <td style={{ padding: "16px 20px", color: THEME.muted, maxWidth: 200, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.event}</td>
                  <td style={{ padding: "16px 20px", textAlign: "right", fontWeight: 600, color: THEME.text }}>{formatCurrency(t.amount)}</td>
                  <td style={{ padding: "16px 20px", textAlign: "center" }}><StatusBadge status={t.status} /></td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <button onClick={() => setMenuId(menuId === t.key ? null : t.key)} style={{ background: "none", border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "6px 8px", color: THEME.muted, cursor: "pointer" }}>
                        <MoreHorizontal size={16} />
                      </button>
                      {menuId === t.key && (
                        <>
                          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setMenuId(null)} />
                          <div style={{ position: "absolute", right: 0, top: 36, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)", textAlign: "left" }}>
                            <button onClick={() => { setSelected(t); setMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.text, fontSize: "0.85rem", cursor: "pointer" }}><Eye size={14} /> Lihat Detail</button>
                            {t.status === "paid" && (
                              <button onClick={() => handleStatus(t, "refunded")} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.purple, fontSize: "0.85rem", cursor: "pointer" }}><RefreshCcw size={14} /> Refund</button>
                            )}
                            {["paid", "pending"].includes(t.status) && (
                              <button onClick={() => handleStatus(t, "cancelled")} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.danger, fontSize: "0.85rem", cursor: "pointer" }}><XCircle size={14} /> Cancel</button>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: THEME.surface, borderRadius: 20, border: `1px solid ${THEME.border}`, maxWidth: 500, width: "100%", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Detail Transaksi</h3>
              <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: THEME.muted, cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: "1.1rem" }}>{selected.id}</p>
                <p style={{ margin: "4px 0 0", fontSize: "0.8rem", color: THEME.muted }}>{selected.createdAt}</p>
              </div>
              <StatusBadge status={selected.status} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}><span style={{ color: THEME.muted }}>Buyer</span><span style={{ color: THEME.text, fontWeight: 600 }}>{selected.buyer}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}><span style={{ color: THEME.muted }}>Concert</span><span style={{ color: THEME.text, fontWeight: 600, textAlign: "right" }}>{selected.event}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}><span style={{ color: THEME.muted }}>Metode</span><span style={{ color: THEME.text, fontWeight: 600 }}>{selected.paymentMethod}</span></div>
              <div style={{ height: 1, background: THEME.border, margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: THEME.muted }}>Total</span><span style={{ color: THEME.success, fontWeight: 800, fontSize: "1.2rem" }}>{formatCurrency(selected.amount)}</span></div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {selected.status === "paid" && (
                <button onClick={() => handleStatus(selected, "refunded")} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "rgba(168,85,247,0.1)", color: THEME.purple, fontWeight: 700, cursor: "pointer" }}>Refund</button>
              )}
              {["paid", "pending"].includes(selected.status) && (
                <button onClick={() => handleStatus(selected, "cancelled")} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "rgba(239,68,68,0.1)", color: THEME.danger, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
              )}
              <button onClick={() => setSelected(null)} style={{ padding: "12px 20px", borderRadius: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.muted, fontWeight: 600, cursor: "pointer" }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}