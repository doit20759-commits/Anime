"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { AuthCard } from "@/components/AuthCard";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await register(username, password);
      router.push("/favorites");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалось зареєструватись");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard title="Реєстрація">
      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm text-neutral-300">Логін</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoComplete="username"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-indigo-400 focus:bg-white/10"
          />
        </label>
        <label className="block">
          <span className="mb-1 block text-sm text-neutral-300">Пароль (мін. 6 символів)</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none focus:border-indigo-400 focus:bg-white/10"
          />
        </label>
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Створення…" : "Створити акаунт"}
        </button>
      </form>
      <p className="mt-4 text-sm text-neutral-400">
        Маєш акаунт?{" "}
        <Link href="/login" className="text-indigo-300 hover:underline">
          Увійти
        </Link>
      </p>
      <p className="mt-3 text-xs text-neutral-500">
        Для демо акаунти зберігаються локально у браузері (localStorage).
      </p>
    </AuthCard>
  );
}
