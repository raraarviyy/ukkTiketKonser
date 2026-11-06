import React, { useMemo, useState, useEffect } from "react";
import {
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
  X,
  Loader2,
} from "lucide-react";
import { useAdmin } from "../context/AdminContext";
import { THEME } from "../../theme";

const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(value || 0);

const settlementStatus = {
  pending: { label: "Pending", color: THEME.warning, bg: "rgba(245,158,11,0.1)" },
  processing: { label: "Processing", color: THEME.purple, bg: "rgba(168,85,247,0.1)" },
  settled: { label: "Settled", color: THEME.success, bg: "rgba(16,185,129,0.1)" },
};

function StatusBadge({ status }) {
  const config = settlementStatus[status] || settlementStatus.pending;
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

export default function AdminSettlements() {
  const { settlements, platformFee, loading, handleUpdateSettlementStatus, handleUpdatePlatformFee, handleGenerateSettlements } = useAdmin();
  
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showFilter, setShowFilter] = useState(false);
  const [menuId, setMenuId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [feeInput, setFeeInput] = useState(String(platformFee));
  const [savingFee, setSavingFee] = useState(false);
  const [genYear, setGenYear] = useState(new Date().getFullYear());
  const [genMonth, setGenMonth] = useState(new Date().getMonth() + 1);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { setFeeInput(String(platformFee)); }, [platformFee]);

  const selectedSettlement = useMemo(() => settlements.find((s) => s.id === selectedId) || null, [settlements, selectedId]);

  const totals = useMemo(() => settlements.reduce((acc, s) => {
    acc.gmv += s.gmv; acc.platformFee += s.platform_fee; acc.refund += s.refund; acc.payout += s.payout;
    return acc;
  }, { gmv: 0, platformFee: 0, refund: 0, payout: 0 }), [settlements]);

  const filtered = useMemo(() => {
    const kw = search.toLowerCase();
    return settlements.filter((s) => {
      const matchSearch = (s.settlement_code || "").toLowerCase().includes(kw) || (s.organizer?.organization_name || s.organizer?.name || "").toLowerCase().includes(kw);
      const matchStatus = statusFilter === "all" || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [settlements, search, statusFilter]);

  const pendingAmount = settlements.filter(s => s.status === "pending" || s.status === "processing").reduce((t, s) => t + s.payout, 0);
  const settledAmount = settlements.filter(s => s.status === "settled").reduce((t, s) => t + s.payout, 0);

  const saveFee = async () => {
    const v = Number(feeInput);
    if (Number.isNaN(v) || v < 0 || v > 100) return;
    setSavingFee(true);
    try { await handleUpdatePlatformFee(v); } finally { setSavingFee(false); }
  };

  const generate = async () => {
    setGenerating(true);
    try {
      await handleGenerateSettlements(Number(genYear), Number(genMonth));
      alert("Settlement berhasil digenerate");
    } catch (err) {
      alert(err.message || "Gagal generate");
    } finally { setGenerating(false); }
  };

  const handleExport = () => {
    const headers = ["Settlement Code", "Organizer", "Period", "GMV", "Platform Fee", "Refund", "Payout", "Status", "Due Date"];
    const rows = settlements.map((s) => [
      s.settlement_code, s.organizer?.organization_name || s.organizer?.name || "-",
      `${s.period_month}/${s.period_year}`, s.gmv, s.platform_fee, s.refund, s.payout, s.status,
      s.due_date ? new Date(s.due_date).toISOString().slice(0, 10) : "-",
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replaceAll('"', '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "settlement-report.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <div style={{ display: "flex", height: 300, alignItems: "center", justifyContent: "center" }}><Loader2 size={32} color={THEME.pink} style={{ animation: "spin 1s linear infinite" }} /></div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 1400 }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "clamp(1.4rem, 3vw, 1.9rem)", fontWeight: 800, color: THEME.text }}>Commission & Settlement</h1>
          <p style={{ margin: "6px 0 0", fontSize: "0.9rem", color: THEME.muted }}>Kelola platform fee, pantau pendapatan, dan proses payout organizer.</p>
        </div>
        <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", borderRadius: 12, border: `1px solid ${THEME.border}`, background: THEME.surface, color: THEME.text, fontSize: "0.85rem", fontWeight: 600, cursor: "pointer" }}>
          <Download size={15} /> Export
        </button>
      </div>

      {/* STATS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
        <StatCard title="Total GMV" value={formatCurrency(totals.gmv)} icon={CircleDollarSign} color={THEME.pink} />
        <StatCard title="Platform Rev" value={formatCurrency(totals.platformFee)} icon={Percent} color={THEME.purple} />
        <StatCard title="Pending Payout" value={formatCurrency(pendingAmount)} icon={Clock3} color={THEME.warning} />
        <StatCard title="Settled Payout" value={formatCurrency(settledAmount)} icon={Check} color={THEME.success} />
      </div>

      {/* TOOLS */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
        <div style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
             <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(236,72,153,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <Percent size={18} color={THEME.pink} />
             </div>
             <div>
               <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Platform Fee</h3>
               <p style={{ margin: 0, fontSize: "0.8rem", color: THEME.muted }}>Biaya layanan dari GMV</p>
             </div>
          </div>
          <div style={{ display: "flex", gap: 12, alignItems: "flex-end" }}>
            <div style={{ flex: 1 }}>
               <div style={{ display: "flex", alignItems: "center", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: "0 14px" }}>
                 <input type="number" min="0" max="100" value={feeInput} onChange={(e) => setFeeInput(e.target.value)} style={{ width: "100%", background: "none", border: "none", padding: "12px 0", color: THEME.text, outline: "none", fontSize: "1rem", fontWeight: 700 }} />
                 <span style={{ color: THEME.muted, fontWeight: 700 }}>%</span>
               </div>
            </div>
            <button onClick={saveFee} disabled={savingFee} style={{ padding: "12px 20px", borderRadius: 12, border: "none", background: THEME.gradient, color: "#fff", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>{savingFee ? "Menyimpan..." : "Simpan"}</button>
          </div>
        </div>

        <div style={{ background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
             <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(168,85,247,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
               <Landmark size={18} color={THEME.purple} />
             </div>
             <div>
               <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700 }}>Generate Settlement</h3>
               <p style={{ margin: 0, fontSize: "0.8rem", color: THEME.muted }}>Buat tagihan bulanan</p>
             </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input type="number" value={genYear} onChange={e => setGenYear(e.target.value)} style={{ flex: "1 1 80px", padding: "12px", borderRadius: 12, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, outline: "none" }} placeholder="Tahun" />
            <input type="number" value={genMonth} onChange={e => setGenMonth(e.target.value)} min="1" max="12" style={{ flex: "1 1 80px", padding: "12px", borderRadius: 12, background: THEME.bg, border: `1px solid ${THEME.border}`, color: THEME.text, outline: "none" }} placeholder="Bulan" />
            <button onClick={generate} disabled={generating} style={{ flex: "1 1 100%", padding: "12px 20px", borderRadius: 12, border: "none", background: "rgba(168,85,247,0.15)", color: THEME.purple, fontWeight: 700, cursor: "pointer" }}>{generating ? "Memproses..." : "Generate Data"}</button>
          </div>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, padding: 20, display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: "0 14px", flex: "1 1 300px" }}>
          <Search size={18} color={THEME.dim} />
          <input type="text" placeholder="Cari settlement code atau organizer..." value={search} onChange={e => setSearch(e.target.value)} style={{ width: "100%", background: "none", border: "none", padding: "12px", color: THEME.text, outline: "none", fontSize: "0.9rem" }} />
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowFilter(!showFilter)} style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", background: THEME.bg, border: `1px solid ${THEME.border}`, borderRadius: 12, color: THEME.text, cursor: "pointer", fontSize: "0.85rem" }}>
            <Filter size={14} /> {statusFilter === "all" ? "Semua Status" : settlementStatus[statusFilter]?.label} <ChevronDown size={14} />
          </button>
          {showFilter && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setShowFilter(false)} />
              <div style={{ position: "absolute", right: 0, top: 44, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)" }}>
                {["all", "pending", "processing", "settled"].map(s => (
                  <button key={s} onClick={() => { setStatusFilter(s); setShowFilter(false); }} style={{ display: "block", width: "100%", textAlign: "left", padding: "10px 12px", background: "none", border: "none", color: statusFilter === s ? THEME.pink : THEME.muted, fontSize: "0.85rem", cursor: "pointer", borderRadius: 8 }}>
                    {s === "all" ? "Semua Status" : settlementStatus[s]?.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* TABLE */}
      <div style={{ backgroundColor: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 18, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", minWidth: 900, borderCollapse: "collapse", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ borderBottom: `1px solid ${THEME.border}`, textAlign: "left", color: THEME.muted, background: "rgba(255,255,255,0.02)" }}>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Settlement</th>
                <th style={{ padding: "16px 20px", fontWeight: 600 }}>Organizer</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Payout</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "center" }}>Status</th>
                <th style={{ padding: "16px 20px", fontWeight: 600, textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: "40px", textAlign: "center", color: THEME.muted }}>
                    Belum ada data settlement. Lakukan transaksi dan klik "Generate Data".
                  </td>
                </tr>
              ) : filtered.map(s => (
                <tr key={s.id} style={{ borderBottom: `1px solid ${THEME.border}` }}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", color: THEME.success }}>
                        <Landmark size={16} />
                      </div>
                      <div>
                        <p style={{ margin: 0, fontWeight: 600, color: THEME.text }}>{s.settlement_code}</p>
                        <p style={{ margin: 0, fontSize: "0.75rem", color: THEME.muted }}>Periode: {s.period_month}/{s.period_year}</p>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", color: THEME.text }}>{s.organizer?.organization_name || s.organizer?.name || "-"}</td>
                  <td style={{ padding: "16px 20px", textAlign: "right", fontWeight: 600, color: THEME.success }}>{formatCurrency(s.payout)}</td>
                  <td style={{ padding: "16px 20px", textAlign: "center" }}><StatusBadge status={s.status} /></td>
                  <td style={{ padding: "16px 20px", textAlign: "right" }}>
                    <div style={{ position: "relative", display: "inline-block" }}>
                      <button onClick={() => setMenuId(menuId === s.id ? null : s.id)} style={{ background: "none", border: `1px solid ${THEME.border}`, borderRadius: 8, padding: "6px 8px", color: THEME.muted, cursor: "pointer" }}>
                        <MoreHorizontal size={16} />
                      </button>
                      {menuId === s.id && (
                        <>
                          <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setMenuId(null)} />
                          <div style={{ position: "absolute", right: 0, top: 36, background: THEME.surface, border: `1px solid ${THEME.border}`, borderRadius: 12, padding: 6, zIndex: 20, minWidth: 160, boxShadow: "0 10px 25px rgba(0,0,0,0.5)", textAlign: "left" }}>
                            <button onClick={() => { setSelectedId(s.id); setMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.text, fontSize: "0.85rem", cursor: "pointer" }}><Eye size={14} /> Detail</button>
                            {s.status === "pending" && (
                              <button onClick={() => { handleUpdateSettlementStatus(s.id, "processing"); setMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.purple, fontSize: "0.85rem", cursor: "pointer" }}><Clock3 size={14} /> Proses</button>
                            )}
                            {s.status === "processing" && (
                              <button onClick={() => { handleUpdateSettlementStatus(s.id, "settled"); setMenuId(null); }} style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "10px 12px", background: "none", border: "none", color: THEME.success, fontSize: "0.85rem", cursor: "pointer" }}><Check size={14} /> Settle</button>
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

      {/* MODAL DETAIL */}
      {selectedSettlement && (
        <div style={{ position: "fixed", inset: 0, zIndex: 100, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div style={{ background: THEME.surface, borderRadius: 20, border: `1px solid ${THEME.border}`, maxWidth: 500, width: "100%", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800 }}>Detail Settlement</h3>
              <button onClick={() => setSelectedId(null)} style={{ background: "none", border: "none", color: THEME.muted, cursor: "pointer" }}><X size={20} /></button>
            </div>
            <div style={{ background: THEME.bg, padding: 16, borderRadius: 12, marginBottom: 16 }}>
               <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>{selectedSettlement.settlement_code}</h4>
               <p style={{ margin: "4px 0 10px", fontSize: "0.85rem", color: THEME.muted }}>{selectedSettlement.organizer?.organization_name || selectedSettlement.organizer?.name || "-"}</p>
               <StatusBadge status={selectedSettlement.status} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}><span style={{ color: THEME.muted }}>GMV</span><span style={{ fontWeight: 600 }}>{formatCurrency(selectedSettlement.gmv)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}><span style={{ color: THEME.muted }}>Platform Fee</span><span style={{ fontWeight: 600, color: THEME.pink }}>- {formatCurrency(selectedSettlement.platform_fee)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}><span style={{ color: THEME.muted }}>Refund</span><span style={{ fontWeight: 600, color: THEME.purple }}>- {formatCurrency(selectedSettlement.refund)}</span></div>
              <div style={{ height: 1, background: THEME.border, margin: "4px 0" }} />
              <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: THEME.text, fontWeight: 700 }}>Payout Bersih</span><span style={{ color: THEME.success, fontWeight: 800, fontSize: "1.2rem" }}>{formatCurrency(selectedSettlement.payout)}</span></div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              {selectedSettlement.status === "pending" && <button onClick={() => { handleUpdateSettlementStatus(selectedSettlement.id, "processing"); setSelectedId(null); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "rgba(168,85,247,0.1)", color: THEME.purple, fontWeight: 700, cursor: "pointer" }}>Proses</button>}
              {selectedSettlement.status === "processing" && <button onClick={() => { handleUpdateSettlementStatus(selectedSettlement.id, "settled"); setSelectedId(null); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: THEME.success, color: "#fff", fontWeight: 700, cursor: "pointer" }}>Settle</button>}
              <button onClick={() => setSelectedId(null)} style={{ padding: "12px 20px", borderRadius: 10, border: `1px solid ${THEME.border}`, background: "transparent", color: THEME.muted, fontWeight: 600, cursor: "pointer" }}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}