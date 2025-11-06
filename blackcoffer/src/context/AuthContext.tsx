import React, { createContext, useContext, useEffect, useState } from 'react';
import { API_CONFIG, API_ENDPOINTS } from '../config/api';

type AuthContextType = {
  token: string | null;
  user: any | null;
  login: (token: string, user?: any) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    // Prefer server-side cookie session: try fetching profile (cookie must be sent with credentials)
    const loadProfile = async () => {
      try {
        const res = await fetch(API_ENDPOINTS.AUTH.PROFILE, { ...API_CONFIG});
        const d = await res.json();
        if (d.success && d.user) {
          setUser(d.user);
          setToken(null);
          localStorage.removeItem('token');
          localStorage.setItem('user', JSON.stringify(d.user));
          return;
        }
      } catch (e) {
        // ignore and fallback to localStorage
        console.log('loadProfile error:', e);
      }

      const t = localStorage.getItem('token');
      const u = localStorage.getItem('user');
      if (t) setToken(t);
      if (u) {
        try {
          setUser(JSON.parse(u));
        } catch {
          setUser(u);
        }
      }
    };

    loadProfile();
  }, []);

  const login = (t: string, u?: any) => {
    // token may be empty when using httpOnly cookie flow; accept either
    if (t) {
      setToken(t);
      localStorage.setItem('token', t);
    } else {
      setToken(null);
      localStorage.removeItem('token');
    }
    if (u) {
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
    }
  };

  const logout = () => {
    // notify server to clear httpOnly cookie (if used)
    try {
      fetch(API_ENDPOINTS.AUTH.LOGOUT, { method: 'POST', ...API_CONFIG }).catch(() => {});
    } catch {
      // ignore
    }
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
