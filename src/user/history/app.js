import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { 
  FileText, CheckCircle2, XCircle, Download, X, Loader2 
} from 'lucide-react';
import { useTransaction } from '../context/TransactionContext';

export default function History() {
  const [activeTab, setActiveTab] = useState('history');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const { history, loading } = useTransaction();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0b0c10', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        .history-card { transition: all 0.2s ease; border: 1px solid #1e2235; }
        .history-card:hover { border-color: #282c42; backgroundColor: #1c1f33; }
        @media (max-width: 768px) {
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>

      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Reusable Header */}
        <Header setIsSidebarOpen={setIsSidebarOpen} />

        <main style={{ padding: '28px', flex: 1, overflowY: 'auto' }}>
          <div style={{ marginBottom: '24px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: '900', margin: 0, letterSpacing: '-0.5px' }}>Transaction History</h1>
            <p style={{ color: '#6b7280', fontSize: '13px', margin: '4px 0 0 0' }}>
              View payment receipts and financial logs of your ticket purchases.
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '12px' }}>
              <Loader2 size={36} color="#38bdf8" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ color: '#9ca3af', fontSize: '14px' }}>Loading history...</span>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {history.length > 0 ? history.map((tx) => (
                <div
                  key={tx.invoiceId}
                  className="history-card"
                  style={{
                    backgroundColor: '#161826', borderRadius: '16px', padding: '20px 24px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1, minWidth: '260px' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '12px',
                      backgroundColor: tx.status === 'PAID' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                      color: tx.status === 'PAID' ? '#22c55e' : '#ef4444',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                    }}>
                      {tx.status === 'PAID' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
                    </div>

                    <div>
                      <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: '700' }}>{tx.invoiceId}</span>
                      <h3 style={{ fontSize: '16px', fontWeight: '800', margin: '2px 0 4px 0' }}>{tx.eventName}</h3>
                      <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                        {tx.itemDetails} • <span style={{ color: '#38bdf8' }}>{tx.paymentMethod}</span>
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div>
                      <span style={{ fontSize: '18px', fontWeight: '900', color: '#fff', display: 'block' }}>
                        ${tx.totalAmount}
                      </span>
                      <span style={{
                        fontSize: '10px', fontWeight: '800', padding: '2px 8px', borderRadius: '6px',
                        backgroundColor: tx.status === 'PAID' ? 'rgba(34, 197, 94, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: tx.status === 'PAID' ? '#22c55e' : '#ef4444'
                      }}>
                        {tx.status}
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedInvoice(tx)}
                      style={{
                        padding: '10px 16px', borderRadius: '10px', border: '1px solid #282c42',
                        backgroundColor: '#222638', color: '#fff', fontSize: '12px', fontWeight: '700',
                        cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                      }}
                    >
                      <FileText size={14} /> Receipt
                    </button>
                  </div>
                </div>
              )) : (
                <div style={{ textAlign: 'center', padding: '60px 20px', backgroundColor: '#161826', borderRadius: '20px', border: '1px dashed #282c42' }}>
                  <FileText size={48} color="#6b7280" style={{ marginBottom: '12px' }} />
                  <h3 style={{ fontSize: '18px', fontWeight: '700', margin: '0 0 6px 0' }}>No Transactions Yet</h3>
                  <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>You haven't made any ticket purchases.</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Modal Popup Invoice Receipt */}
      {selectedInvoice && (
        <div style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
          zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px'
        }}>
          <div style={{
            backgroundColor: '#161826', borderRadius: '20px', width: '100%', maxWidth: '440px',
            padding: '28px', border: '1px solid #282c42', color: '#fff', position: 'relative'
          }}>
            <button onClick={() => setSelectedInvoice(null)} style={{ position: 'absolute', right: '20px', top: '20px', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer' }}>
              <X size={20} />
            </button>

            <span style={{ fontSize: '11px', fontWeight: '800', color: '#38bdf8', letterSpacing: '1px', textTransform: 'uppercase' }}>OFFICIAL INVOICE</span>
            <h2 style={{ fontSize: '18px', fontWeight: '800', margin: '4px 0 16px 0' }}>{selectedInvoice.invoiceId}</h2>

            <div style={{ borderTop: '1px solid #282c42', borderBottom: '1px solid #282c42', padding: '16px 0', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Date:</span>
                <span>{selectedInvoice.purchaseDate}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Event:</span>
                <span style={{ fontWeight: '700' }}>{selectedInvoice.eventName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Item:</span>
                <span>{selectedInvoice.itemDetails}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Payment Method:</span>
                <span>{selectedInvoice.paymentMethod}</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
                <span>Subtotal</span>
                <span>${selectedInvoice.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
                <span>Service Fee</span>
                <span>${selectedInvoice.serviceFee}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#9ca3af' }}>
                <span>Tax</span>
                <span>${selectedInvoice.tax}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '800', fontSize: '16px', color: '#fff', borderTop: '1px dashed #282c42', paddingTop: '10px', marginTop: '4px' }}>
                <span>Total Paid</span>
                <span style={{ color: '#38bdf8' }}>${selectedInvoice.totalAmount}</span>
              </div>
            </div>

            <button style={{
              width: '100%', padding: '12px', borderRadius: '12px', border: 'none',
              background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)', color: '#fff',
              fontWeight: '700', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
            }}>
              <Download size={16} /> Download Invoice (PDF)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}