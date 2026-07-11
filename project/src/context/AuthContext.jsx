import { createContext, useContext, useState, useCallback, useMemo, useEffect } from 'react';
import { API_BASE_URL } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('khao_pio_token') || null);

  useEffect(() => {
    if (token) {
      localStorage.setItem('khao_pio_token', token);
    } else {
      localStorage.removeItem('khao_pio_token');
    }
  }, [token]);

  useEffect(() => {
    const storedUser = localStorage.getItem('khao_pio_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const persistSession = useCallback((payload) => {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem('khao_pio_user', JSON.stringify(payload.user));
  }, []);

  const login = useCallback(async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    persistSession(data);
    return data;
  }, [persistSession]);

  const signup = useCallback(async (name, email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Signup failed');
    }

    persistSession(data);
    return data;
  }, [persistSession]);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('khao_pio_user');
    localStorage.removeItem('khao_pio_token');
  }, []);

  const value = useMemo(() => ({ user, token, login, signup, logout }), [user, token, login, signup, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
