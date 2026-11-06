import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { api } from "../api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const raw = localStorage.getItem("auralis_current_user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem("auralis_token");
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("auralis_token");
    const savedUser = localStorage.getItem("auralis_current_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem("auralis_token");
        localStorage.removeItem("auralis_current_user");
        localStorage.removeItem("auralis_logged_in");
        localStorage.removeItem("auralis_user_role");
      }
    }

    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const result = await api.login({
        email,
        password,
      });

      const user = result.data;
      const backendToken = result.token;
      const backendRole = result.role;

      localStorage.setItem("auralis_token", backendToken);
      localStorage.setItem("auralis_current_user", JSON.stringify(user));
      localStorage.setItem("auralis_logged_in", "true");
      localStorage.setItem("auralis_user_role", backendRole);

      setToken(backendToken);
      setCurrentUser(user);

      return {
        success: true,
        role: backendRole,
        user,
        token: backendToken,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Login gagal.",
      };
    }
  }, []);

  const register = useCallback(async (data) => {
    try {
      const result = await api.register(data);

      return {
        success: true,
        data: result.data,
        role: result.role,
        token: result.token,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Gagal mendaftar.",
      };
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auralis_token");
    localStorage.removeItem("auralis_current_user");
    localStorage.removeItem("auralis_logged_in");
    localStorage.removeItem("auralis_user_role");

    setToken(null);
    setCurrentUser(null);
  }, []);

  const updateProfile = useCallback((updates) => {
    setCurrentUser((prev) => {
      if (!prev) return null;

      const updated = {
        ...prev,
        ...updates,
      };

      localStorage.setItem(
        "auralis_current_user",
        JSON.stringify(updated)
      );

      return updated;
    });
  }, []);

  const value = {
    currentUser,
    user: currentUser,
    token,

    isLoggedIn: !!currentUser && !!token,
    isAuthenticated: !!currentUser && !!token,

    loading,

    login,
    register,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be inside AuthProvider");
  }

  return ctx;
}