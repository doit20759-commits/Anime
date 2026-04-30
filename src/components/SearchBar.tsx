"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

/**
 * Контрольоване поле пошуку, яке пушить новий URL у /search?q=...
 * На головній використовується великий варіант (size="lg").
 *
 * `key` на враппері забезпечує ре-маунт при зміні q у URL,
 * тому value синхронізується з URL без useEffect.
 */
export function SearchBar({ size = "md" }: { size?: "md" | "lg" }) {
  const params = useSearchParams();
  return <SearchBarInner key={params.get("q") ?? ""} initial={params.get("q") ?? ""} size={size} />;
}

function SearchBarInner({ initial, size = "md" }: { initial: string; size?: "md" | "lg" }) {
  const router = useRouter();
  const [value, setValue] = useState(initial);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  const sizes =
    size === "lg"
      ? "h-14 text-lg px-5"
      : "h-11 text-base px-4";

  return (
    <form onSubmit={submit} className="w-full">
      <div className="flex w-full items-stretch gap-2">
        <input
          type="search"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder='Спробуй "Attack on Titan", "Inception", "Frieren"…'
          className={`flex-1 rounded-xl border border-white/10 bg-white/5 ${sizes} outline-none transition focus:border-indigo-400 focus:bg-white/10`}
          aria-label="Пошук за назвою"
        />
        <button
          type="submit"
          className={`rounded-xl bg-gradient-to-r from-indigo-500 to-pink-500 px-5 font-semibold text-white transition hover:opacity-90 ${size === "lg" ? "text-lg" : "text-base"}`}
        >
          Шукати
        </button>
      </div>
    </form>
  );
}
