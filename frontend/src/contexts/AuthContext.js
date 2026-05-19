import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const useAuth = () => useContext(AuthContext);

const formatApiErrorDetail = (detail) => {
  if (detail == null) return "Something went wrong. Please try again.";
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail))
    return detail.map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e))).filter(Boolean).join(" ");
  if (detail && typeof detail.msg === "string") return detail.msg;
  return String(detail);
};

// Axios interceptor for auto-refresh
const api = axios.create({ baseURL: BACKEND_URL, withCredentials: true });
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && error.response?.data?.detail === "Token expired" && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        await axios.post(`${BACKEND_URL}/api/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef(null);

  const scheduleRefresh = useCallback(() => {
    if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    // Refresh 1 minute before expiry (14 minutes)
    refreshTimerRef.current = setTimeout(async () => {
      try {
        await axios.post(`${BACKEND_URL}/api/auth/refresh`, {}, { withCredentials: true });
        scheduleRefresh();
      } catch {
        setUser(false);
      }
    }, 13 * 60 * 1000);
  }, []);

  useEffect(() => {
    checkAuth();
    return () => {
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAuth = async () => {
    try {
      const { data } = await api.get('/api/auth/me');
      setUser(data);
      scheduleRefresh();
    } catch (error) {
      setUser(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      setUser(data);
      scheduleRefresh();
      return { success: true };
    } catch (e) {
      return { success: false, error: formatApiErrorDetail(e.response?.data?.detail) || e.message };
    }
  };

  const register = async (email, password, name) => {
    try {
      const { data } = await api.post('/api/auth/register', { email, password, name });
      setUser(data);
      scheduleRefresh();
      return { success: true };
    } catch (e) {
      return { success: false, error: formatApiErrorDetail(e.response?.data?.detail) || e.message };
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      setUser(false);
      if (refreshTimerRef.current) clearTimeout(refreshTimerRef.current);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const forgotPassword = async (email) => {
    try {
      await api.post('/api/auth/forgot-password', { email });
      return { success: true };
    } catch (e) {
      return { success: false, error: formatApiErrorDetail(e.response?.data?.detail) || e.message };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await api.post('/api/auth/reset-password', { token, new_password: newPassword });
      return { success: true };
    } catch (e) {
      return { success: false, error: formatApiErrorDetail(e.response?.data?.detail) || e.message };
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, forgotPassword, resetPassword, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};
