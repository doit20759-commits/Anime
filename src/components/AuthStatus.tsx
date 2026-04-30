"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export function AuthStatus() {
  const { user, ready, logout } = useAuth();

  // До гідратації — нічого, щоб не мерехтіло
  if (!ready) return <span className="w-16" />;

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Link href="/login" className="text-neutral-300 hover:text-white">
          Увійти
        </Link>
        <Link
          href="/register"
          className="rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 px-3 py-1.5 font-medium text-white hover:opacity-90"
        >
          Реєстрація
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <span className="hidden text-neutral-300 sm:inline">
        Привіт, <span className="text-white">{user.username}</span>
      </span>
      <button
        type="button"
        onClick={logout}
        className="rounded-lg border border-white/10 px-3 py-1.5 text-neutral-200 hover:bg-white/5"
      >
        Вийти
      </button>
    </div>
  );
}
