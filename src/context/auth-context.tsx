"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import {
  ChatAuthSession,
  ChatAuthRegisterPayload,
  ChatAuthLoginPayload,
  registerChatAuth,
  loginChatAuth,
} from "@/lib/chat-auth";
import { getStoredSession, setStoredSession, clearStoredSession } from "@/lib/session";

interface AuthContextType {
  session: ChatAuthSession | null;
  isAuthenticated: boolean;
  loading: boolean;
  register: (payload: ChatAuthRegisterPayload) => Promise<ChatAuthSession>;
  login: (payload: ChatAuthLoginPayload) => Promise<ChatAuthSession>;
  logout: () => void;
  setStoreId: (storeId: string) => void;
  clearStoreId: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<ChatAuthSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSession(getStoredSession());
    setLoading(false);
  }, []);

  const persist = useCallback((next: ChatAuthSession) => {
    setSession(next);
    setStoredSession(next);
  }, []);

  const register = useCallback(
    async (payload: ChatAuthRegisterPayload) => {
      const result = await registerChatAuth(payload);
      persist(result);
      return result;
    },
    [persist]
  );

  const login = useCallback(
    async (payload: ChatAuthLoginPayload) => {
      const result = await loginChatAuth(payload);
      persist(result);
      return result;
    },
    [persist]
  );

  const logout = useCallback(() => {
    setSession(null);
    clearStoredSession();
  }, []);

  const setStoreId = useCallback(
    (storeId: string) => {
      setSession((prev) => {
        if (!prev) return prev;
        const next = { ...prev, storeId };
        setStoredSession(next);
        return next;
      });
    },
    []
  );

  const clearStoreId = useCallback(() => {
    setSession((prev) => {
      if (!prev) return prev;
      const next = { ...prev, storeId: null };
      setStoredSession(next);
      return next;
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ session, isAuthenticated: !!session, loading, register, login, logout, setStoreId, clearStoreId }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
