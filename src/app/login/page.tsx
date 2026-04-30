"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { AuthCard } from "@/components/AuthCard";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      await login(username, password);
      router.push("/favorites");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не вдалось увійти");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthCard title="Увійти">
      <form onSubmit={submit} className="space-y-3">
        <Field label="Логін" value={username} onChange={setUsername} autoComplete="username" />
        <Field
          label="Пароль"
          value={password}
          onChange={setPassword}
          type="password"
          autoComplete="current-password"
        />
        {error && <p className="text-sm text-rose-400">{error}</p>}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 py-2.5 font-semibold text-white hover:opacity-90 disabled:opacity-50"
        >
          {busy ? "Вхід…" : "Увійти"}
        </button>
      </form>
      <p className="mt-4 text-sm text-neutral-400">
        Ще не маєш акаунту?{" "}
        <Link href="/register" className="text-indigo-300 hover:underline">
          Зареєструватись
        </Link>
      </p>
    </AuthCard>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-neutral-300">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        autoComplete={autoComplete}
        required
        className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 outline-none transition focus:border-indigo-400 focus:bg-white/10"
      />
    </label>
  );
}
