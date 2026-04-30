"use client";

/**
 * Дуже проста клієнтська авторизація для демо.
 *
 * Зберігає користувачів (username + hash пароля) у localStorage,
 * плюс поточну сесію. Жодних реальних серверних викликів.
 *
 * Це свідома спрощена реалізація для демонстраційного каталогу;
 * у продакшені слід замінити на NextAuth або бекенд з БД.
 */

import { createContext, useCallback, useContext, useMemo, useSyncExternalStore } from "react";

interface StoredUser {
  username: string;
  passwordHash: string;
}

interface AuthContextValue {
  user: { username: string } | null;
  ready: boolean;
  register: (username: string, password: string) => Promise<void>;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const USERS_KEY = "cineani:users";
const SESSION_KEY = "cineani:session";

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Простий event-bus, щоб useSyncExternalStore міг відстежувати зміни
 * у localStorage, які ми самі робимо (storage event тригериться лише
 * з інших вкладок).
 */
const sessionListeners = new Set<() => void>();
function subscribeSession(listener: () => void) {
  sessionListeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === SESSION_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    sessionListeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}
function notifySession() {
  for (const l of sessionListeners) l();
}
function getSessionSnapshot(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(SESSION_KEY);
}
function getServerSessionSnapshot(): string | null {
  return null;
}

/** Простий SubtleCrypto-хеш пароля. Не замінює bcrypt, але значно краще за plain-text. */
async function hashPassword(password: string): Promise<string> {
  const enc = new TextEncoder().encode(`cineani:${password}`);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function loadUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? "[]") as StoredUser[];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // useSyncExternalStore сам коректно обробляє SSR (getServerSnapshot = null)
  // та гідратацію на клієнті (підтягне реальне значення з localStorage).
  const sessionRaw = useSyncExternalStore(subscribeSession, getSessionSnapshot, getServerSessionSnapshot);
  const user = useMemo<{ username: string } | null>(() => {
    if (!sessionRaw) return null;
    try {
      return JSON.parse(sessionRaw) as { username: string };
    } catch {
      return null;
    }
  }, [sessionRaw]);

  const register = useCallback(async (username: string, password: string) => {
    const uname = username.trim().toLowerCase();
    if (uname.length < 3) throw new Error("Логін має містити щонайменше 3 символи");
    if (password.length < 6) throw new Error("Пароль має містити щонайменше 6 символів");
    const users = loadUsers();
    if (users.some((u) => u.username === uname)) {
      throw new Error("Користувач з таким логіном вже існує");
    }
    const passwordHash = await hashPassword(password);
    users.push({ username: uname, passwordHash });
    saveUsers(users);
    const session = { username: uname };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    notifySession();
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    const uname = username.trim().toLowerCase();
    const users = loadUsers();
    const found = users.find((u) => u.username === uname);
    if (!found) throw new Error("Користувача не знайдено");
    const hash = await hashPassword(password);
    if (hash !== found.passwordHash) throw new Error("Невірний пароль");
    const session = { username: uname };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    notifySession();
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    notifySession();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, ready: true, register, login, logout }),
    [user, register, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
