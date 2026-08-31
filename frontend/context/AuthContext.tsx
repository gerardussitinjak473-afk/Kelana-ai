"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { AUTH_CHANGED_EVENT, hasAuthToken } from "@/services/apiClient";
import {
  clearLogin,
  getCurrentUser,
  loginAccount,
  saveLogin,
} from "@/services/authService";
import type { User } from "@/types/auth";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => void;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    if (!hasAuthToken()) {
      setUser(null);
      return null;
    }

    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch {
      clearLogin();
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  useEffect(() => {
    const syncAuthentication = () => {
      refreshUser().finally(() => setLoading(false));
    };
    window.addEventListener(AUTH_CHANGED_EVENT, syncAuthentication);
    return () => window.removeEventListener(AUTH_CHANGED_EVENT, syncAuthentication);
  }, [refreshUser]);

  const signIn = useCallback(async (email: string, password: string) => {
    const loginResponse = await loginAccount(email, password);
    saveLogin(loginResponse);
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      clearLogin();
      throw error;
    }
  }, []);

  const signOut = useCallback(() => {
    clearLogin();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, signIn, signOut, refreshUser }),
    [loading, refreshUser, signIn, signOut, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
