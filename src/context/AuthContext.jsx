// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';

const AuthContext = createContext(null);

const ADMIN_CREDENTIALS = {
  email: 'admin@auralis.id',
  password: 'admin123',
  role: 'superadmin',
  name: 'Super Admin Auralis',
  avatar: null,
  id: 'admin-001'
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem('auralis_current_user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const login = useCallback((email, password, role) => {
    // Super Admin credentials
    if (role === 'superadmin') {
      if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
        const user = { ...ADMIN_CREDENTIALS };
        localStorage.setItem('auralis_current_user', JSON.stringify(user));
        localStorage.setItem('auralis_logged_in', 'true');
        localStorage.setItem('auralis_user_role', 'superadmin');
        setCurrentUser(user);
        return { success: true, role: 'superadmin' };
      }
      return { success: false, error: 'Kredensial Super Admin salah.' };
    }

    // Organizer / User — any valid email + 6+ char password
    const userId = 'usr-' + Date.now();
    let name = 'User Auralis';
    try {
      const usersRaw = localStorage.getItem('auralis_users_data');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const found = users.find(u => u.email === email);
      if (found) {
        if (found.role !== role) {
          return { success: false, error: 'Role tidak cocok untuk akun ini.' };
        }
        name = found.name;
        const user = { id: found.id, name, email, role: found.role, avatar: found.avatar || null };
        localStorage.setItem('auralis_current_user', JSON.stringify(user));
        localStorage.setItem('auralis_logged_in', 'true');
        localStorage.setItem('auralis_user_role', role);
        setCurrentUser(user);
        return { success: true, role };
      }
    } catch {}

    // New user
    name = email.split('@')[0];
    const user = { id: userId, name, email, role, avatar: null };

    // Persist to users list
    try {
      const usersRaw = localStorage.getItem('auralis_users_data');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      users.unshift({ ...user, createdAt: new Date().toISOString(), status: 'active' });
      localStorage.setItem('auralis_users_data', JSON.stringify(users));
    } catch {}

    localStorage.setItem('auralis_current_user', JSON.stringify(user));
    localStorage.setItem('auralis_logged_in', 'true');
    localStorage.setItem('auralis_user_role', role);
    setCurrentUser(user);
    return { success: true, role };
  }, []);

  const register = useCallback((data) => {
    const { name, email, password, role } = data;
    try {
      const usersRaw = localStorage.getItem('auralis_users_data');
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      const exists = users.find(u => u.email === email);
      if (exists) return { success: false, error: 'Email sudah terdaftar.' };

      const newUser = {
        id: 'usr-' + Date.now(),
        name, email, role,
        avatar: null,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      users.unshift(newUser);
      localStorage.setItem('auralis_users_data', JSON.stringify(users));
      return { success: true };
    } catch {
      return { success: false, error: 'Gagal mendaftar.' };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('auralis_current_user');
    localStorage.removeItem('auralis_logged_in');
    localStorage.removeItem('auralis_user_role');
    setCurrentUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('auralis_current_user', JSON.stringify(updated));
      // Also update in users list
      try {
        const usersRaw = localStorage.getItem('auralis_users_data');
        const users = usersRaw ? JSON.parse(usersRaw) : [];
        const idx = users.findIndex(u => u.id === updated.id);
        if (idx !== -1) {
          users[idx] = { ...users[idx], ...updates };
          localStorage.setItem('auralis_users_data', JSON.stringify(users));
        }
      } catch {}
      return updated;
    });
  }, []);

  const value = {
    currentUser,
    isLoggedIn: !!currentUser,
    login,
    register,
    logout,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
