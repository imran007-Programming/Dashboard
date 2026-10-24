"use client";

import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { authApi, setUnauthorizedHandler } from "@/lib/api";
import { getServerSnapshot, getSnapshot, parseUser, saveUser, subscribe } from "@/lib/session";
import type { SignupInput, User } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  // false until the saved session is read on the client
  ready: boolean;
  login: (input: { email: string; password: string }) => Promise<void>;
  signup: (input: SignupInput) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const user = useMemo(() => parseUser(raw), [raw]);

  // Session expired and refresh failed: clear user and go to login
  useEffect(() => {
    setUnauthorizedHandler(() => {
      saveUser(null);
      router.replace("/login");
    });
    return () => setUnauthorizedHandler(null);
  }, [router]);

  const login = useCallback(async (input: { email: string; password: string }) => {
    const res = await authApi.login(input);
    saveUser(res.data);
  }, []);

  const signup = useCallback(async (input: SignupInput) => {
    const res = await authApi.signup(input);
    saveUser(res.data);
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout().catch(() => null);
    saveUser(null);
    router.push("/login");
  }, [router]);

  const value = useMemo(
    () => ({ user, ready: raw !== undefined, login, signup, logout }),
    [user, raw, login, signup, logout],
  );

  return <AuthContext value={value}>{children}</AuthContext>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
