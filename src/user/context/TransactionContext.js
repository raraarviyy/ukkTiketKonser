import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { api } from '../../api';

const TransactionContext = createContext();

export const useTransaction = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  const [myTickets, setMyTickets] = useState([]);
  const [history, setHistory] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [ticketsData, historyData, notifData] = await Promise.all([
        api.getTickets(),
        api.getHistory(),
        api.getNotifications()
      ]);
      setMyTickets(ticketsData);
      setHistory(historyData);
      setNotifications(notifData);
    } catch (error) {
      console.error("Failed to load transaction data", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const markAllAsRead = async () => {
    const updated = await api.markNotificationsRead();
    setNotifications(updated);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <TransactionContext.Provider value={{
      myTickets, history, notifications, loading, loadData, markAllAsRead, unreadCount
    }}>
      {children}
    </TransactionContext.Provider>
  );
};
