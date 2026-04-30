"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { FavoriteButton } from "@/components/FavoriteButton";
import { useFavorites } from "@/components/Favorites";

export default function FavoritesPage() {
  const { user, ready } = useAuth();
  const { items } = useFavorites();

  if (!ready) return <p className="text-neutral-400">Завантаження…</p>;

  if (!user) {
    return (
      <section className="mx-auto max-w-md rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
        <h1 className="text-2xl font-bold">Обране</h1>
        <p className="mt-2 text-neutral-400">
          Увійди, щоб зберігати улюблені фільми та аніме до свого списку.
        </p>
        <div className="mt-4 flex justify-center gap-3">
          <Link href="/login" className="rounded-lg border border-white/10 px-4 py-2 hover:bg-white/10">
            Увійти
          </Link>
          <Link
            href="/register"
            className="rounded-lg bg-gradient-to-r from-indigo-500 to-pink-500 px-4 py-2 font-semibold text-white"
          >
            Реєстрація
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">Обране</h1>
      {items.length === 0 ? (
        <p className="text-neutral-400">
          Поки порожньо. Знайди щось на{" "}
          <Link href="/" className="text-indigo-300 hover:underline">
            головній
          </Link>{" "}
          і натисни сердечко.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((m) => {
            const href = m.kind === "movie" ? `/movie/${m.id}` : `/anime/${m.id}`;
            return (
              <article
                key={`${m.kind}-${m.id}`}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5"
              >
                <Link href={href}>
                  <div className="relative aspect-[2/3] w-full bg-neutral-900">
                    {m.posterUrl ? (
                      <Image
                        src={m.posterUrl}
                        alt={m.title}
                        fill
                        sizes="(max-width: 640px) 50vw, 20vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="p-3">
                    <h3 className="line-clamp-2 text-sm font-semibold">{m.title}</h3>
                    <div className="mt-1 flex justify-between text-xs text-neutral-400">
                      <span>{m.year ?? "—"}</span>
                      {m.rating != null && <span className="text-amber-300">★ {m.rating}</span>}
                    </div>
                  </div>
                </Link>
                <div className="absolute bottom-2 right-2">
                  <FavoriteButton item={m} />
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
