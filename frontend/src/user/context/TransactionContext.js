import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../../api';

const TransactionContext = createContext(null);

export function TransactionProvider({ children }) {
  const [history, setHistory] = useState([]);
  const [myTickets, setMyTickets] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [historyData, ticketsData, notifData] = await Promise.all([
        api.getHistory(),
        api.getMyTickets(),
        api.getNotifications()
      ]);
      setHistory(historyData);
      setMyTickets(ticketsData);
      setNotifications(notifData);
    } catch (error) {
      console.error('Gagal memuat data transaksi', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const value = { history, myTickets, notifications, loading, loadData };

  return <TransactionContext.Provider value={value}>{children}</TransactionContext.Provider>;
}

export function useTransaction() {
  const ctx = useContext(TransactionContext);
  if (!ctx) {
    throw new Error('useTransaction harus dipakai di dalam TransactionProvider');
  }
  return ctx;
}