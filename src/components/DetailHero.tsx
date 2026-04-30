import Image from "next/image";
import Link from "next/link";
import type { MediaDetail } from "@/lib/types";
import { FavoriteButton } from "./FavoriteButton";
import { MoviePlayer } from "./MoviePlayer";
import { TrailerPlayer } from "./TrailerPlayer";

/**
 * Шапка сторінки деталей — постер зліва, метадані справа,
 * під нею — плеєр трейлера (якщо є ключ).
 */
export function DetailHero({ item }: { item: MediaDetail }) {
  return (
    <article className="space-y-8">
      {item.backdropUrl && (
        <div className="relative -mx-4 h-48 overflow-hidden md:-mx-0 md:h-72 md:rounded-3xl">
          <Image
            src={item.backdropUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 to-transparent" />
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-[220px_1fr]">
        <div className="relative mx-auto aspect-[2/3] w-40 overflow-hidden rounded-2xl border border-white/10 bg-neutral-900 md:mx-0 md:w-full">
          {item.posterUrl ? (
            <Image
              src={item.posterUrl}
              alt={item.title}
              fill
              priority
              sizes="(max-width: 768px) 160px, 220px"
              className="object-cover"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-neutral-500">
              Без постера
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-neutral-400">
            <span
              className={`rounded-full px-2 py-0.5 font-bold ${
                item.kind === "movie" ? "bg-indigo-500/80 text-white" : "bg-pink-500/80 text-white"
              }`}
            >
              {item.kind === "movie" ? "Фільм" : "Аніме"}
            </span>
            {item.year != null && <span>{item.year}</span>}
            {item.runtimeMinutes != null && <span>{item.runtimeMinutes} хв</span>}
            {item.episodes != null && <span>{item.episodes} епізодів</span>}
            {item.status && <span>{item.status}</span>}
          </div>

          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">{item.title}</h1>
            {item.originalTitle && item.originalTitle !== item.title && (
              <span className="text-neutral-500">({item.originalTitle})</span>
            )}
          </div>

          {item.tagline && <p className="italic text-neutral-400">{item.tagline}</p>}

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {item.rating != null && (
              <span className="rounded-full bg-amber-500/20 px-3 py-1 font-semibold text-amber-200">
                ★ {item.rating}/10
              </span>
            )}
            {item.genres.map((g) => (
              <Link
                key={g}
                href={`/search?q=${encodeURIComponent(g)}`}
                className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-neutral-200 hover:bg-white/10"
              >
                {g}
              </Link>
            ))}
          </div>

          {item.studios && item.studios.length > 0 && (
            <p className="text-sm text-neutral-400">
              Студія: <span className="text-neutral-200">{item.studios.join(", ")}</span>
            </p>
          )}

          <p className="mt-2 max-w-3xl text-pretty leading-relaxed text-neutral-200">
            {item.overview || "Опис відсутній."}
          </p>

          <div className="mt-2">
            <FavoriteButton item={item} />
          </div>
        </div>
      </div>

      {item.youtubeKey ? (
        <section>
          <h2 className="mb-3 text-xl font-bold">Трейлер</h2>
          <TrailerPlayer youtubeKey={item.youtubeKey} title={item.title} />
        </section>
      ) : (
        <p className="text-sm text-neutral-500">Трейлер не доступний.</p>
      )}

      {item.kind === "movie" && (
        <MoviePlayer tmdbId={item.id} title={item.title} />
      )}
    </article>
  );
}
