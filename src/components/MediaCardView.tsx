"use client";

import Image from "next/image";
import Link from "next/link";
import type { MediaCard } from "@/lib/types";
import { FavoriteButton } from "./FavoriteButton";

/**
 * Компактна картка в сітці результатів.
 * Клік на картці веде на /movie/[id] або /anime/[id] відповідно до kind.
 */
export function MediaCardView({ item }: { item: MediaCard }) {
  const href = item.kind === "movie" ? `/movie/${item.id}` : `/anime/${item.id}`;
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:border-white/20 hover:bg-white/10">
      <Link href={href} className="block">
        <div className="relative aspect-[2/3] w-full bg-neutral-900">
          {item.posterUrl ? (
            <Image
              src={item.posterUrl}
              alt={item.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="grid h-full w-full place-items-center text-xs text-neutral-500">
              Без постера
            </div>
          )}
          {item.rating != null && (
            <span className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-1 text-xs font-semibold text-amber-300">
              ★ {item.rating}
            </span>
          )}
          <span
            className={`absolute right-2 top-2 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wide ${
              item.kind === "movie"
                ? "bg-indigo-500/90 text-white"
                : "bg-pink-500/90 text-white"
            }`}
          >
            {item.kind === "movie" ? "Фільм" : "Аніме"}
          </span>
        </div>
        <div className="p-3">
          <h3 className="line-clamp-2 text-sm font-semibold text-white">{item.title}</h3>
          <div className="mt-1 flex items-center justify-between text-xs text-neutral-400">
            <span>{item.year ?? "—"}</span>
            <span className="line-clamp-1 text-right">
              {item.genres.slice(0, 2).join(" · ") || ""}
            </span>
          </div>
        </div>
      </Link>
      <div className="absolute bottom-2 right-2">
        <FavoriteButton item={item} />
      </div>
    </article>
  );
}
