"use client";

import { useState } from "react";

/**
 * Плеєр для повного фільму через сторонні embed-сервіси.
 * Усі провайдери приймають TMDB-ID, тож користувач може перемикати джерело,
 * якщо одне не грає через блокування/рекламу. ВАЖЛИВО: це неофіційні grey-area
 * сервіси, не ліцензовані студіями — використовуй на свій розсуд.
 */
type Provider = {
  id: string;
  label: string;
  buildUrl: (tmdbId: number) => string;
};

const PROVIDERS: Provider[] = [
  {
    id: "vidsrc-to",
    label: "vidsrc.to",
    buildUrl: (id) => `https://vidsrc.to/embed/movie/${id}`,
  },
  {
    id: "vidsrc-xyz",
    label: "vidsrc.xyz",
    buildUrl: (id) => `https://vidsrc.xyz/embed/movie?tmdb=${id}`,
  },
  {
    id: "2embed",
    label: "2embed.cc",
    buildUrl: (id) => `https://www.2embed.cc/embed/${id}`,
  },
  {
    id: "multiembed",
    label: "multiembed.mov",
    buildUrl: (id) => `https://multiembed.mov/?video_id=${id}&tmdb=1`,
  },
];

export function MoviePlayer({ tmdbId, title }: { tmdbId: number; title: string }) {
  const [providerId, setProviderId] = useState<string>(PROVIDERS[0].id);
  const provider = PROVIDERS.find((p) => p.id === providerId) ?? PROVIDERS[0];
  const src = provider.buildUrl(tmdbId);

  return (
    <section>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Дивитись фільм</h2>
        <label className="flex items-center gap-2 text-sm text-neutral-300">
          <span className="text-neutral-400">Джерело:</span>
          <select
            value={providerId}
            onChange={(e) => setProviderId(e.target.value)}
            className="rounded-lg border border-white/10 bg-neutral-900 px-2 py-1 text-neutral-100 focus:border-indigo-400 focus:outline-none"
          >
            {PROVIDERS.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
        <iframe
          key={src}
          src={src}
          title={`Плеєр: ${title}`}
          loading="lazy"
          referrerPolicy="no-referrer"
          allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>

      <p className="mt-2 text-xs text-neutral-500">
        Плеєр використовує сторонні неофіційні сервіси. Якщо одне джерело не грає або показує
        рекламу — обери інше у списку вище.
      </p>
    </section>
  );
}
