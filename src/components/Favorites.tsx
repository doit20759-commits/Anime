"use client";

/**
 * Хук для обраного. Ключ у localStorage прив'язаний до поточного користувача,
 * тож у гостей своє обране не зберігається між сесіями (показуємо CTA "Увійти").
 *
 * Використовуємо useSyncExternalStore, щоб уникнути useEffect для читання зі
 * external store (localStorage).
 */

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { MediaCard, MediaKind } from "@/lib/types";
import { useAuth } from "./AuthProvider";

export interface FavoriteItem {
  id: number;
  kind: MediaKind;
  title: string;
  posterUrl: string | null;
  year: number | null;
  rating: number | null;
}

function keyFor(username: string): string {
  return `cineani:favs:${username}`;
}

function toItem(m: MediaCard | FavoriteItem): FavoriteItem {
  return {
    id: m.id,
    kind: m.kind,
    title: m.title,
    posterUrl: m.posterUrl,
    year: m.year,
    rating: m.rating,
  };
}

function favId(f: { kind: MediaKind; id: number }) {
  return `${f.kind}:${f.id}`;
}

// Глобальний ключ->listeners, щоб локальні зміни (setItem) негайно ресинкали UI.
const listeners = new Map<string, Set<() => void>>();

function subscribeFav(key: string) {
  return (listener: () => void) => {
    let set = listeners.get(key);
    if (!set) {
      set = new Set();
      listeners.set(key, set);
    }
    set.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === key) listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      set!.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  };
}
function notifyFav(key: string) {
  const set = listeners.get(key);
  if (set) for (const l of set) l();
}
function getSnapshot(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}
function getServerSnapshot(): string | null {
  return null;
}

export function useFavorites() {
  const { user } = useAuth();
  const storageKey = user ? keyFor(user.username) : "cineani:favs:__guest__";

  const raw = useSyncExternalStore(
    subscribeFav(storageKey),
    () => getSnapshot(storageKey),
    getServerSnapshot,
  );

  const items = useMemo<FavoriteItem[]>(() => {
    if (!user || !raw) return [];
    try {
      return JSON.parse(raw) as FavoriteItem[];
    } catch {
      return [];
    }
  }, [raw, user]);

  const isFav = useCallback(
    (kind: MediaKind, id: number) => items.some((f) => f.kind === kind && f.id === id),
    [items],
  );

  const toggle = useCallback(
    (m: MediaCard | FavoriteItem) => {
      if (!user) return;
      const id = favId(m);
      const exists = items.some((f) => favId(f) === id);
      const next = exists ? items.filter((f) => favId(f) !== id) : [...items, toItem(m)];
      localStorage.setItem(storageKey, JSON.stringify(next));
      notifyFav(storageKey);
    },
    [items, user, storageKey],
  );

  return { items, ready: true, isFav, toggle };
}
