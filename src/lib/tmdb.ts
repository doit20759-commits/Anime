/**
 * Клієнт для TMDb API.
 *
 * Використовуємо лише server-side (Next.js route handlers / server components),
 * щоб не засвічувати TMDB_API_KEY на клієнті.
 *
 * Докі: https://developer.themoviedb.org/reference/intro/getting-started
 */

import type { MediaCard, MediaDetail } from "./types";

const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_IMG = "https://image.tmdb.org/t/p";

function getKey(): string | null {
  return process.env.TMDB_API_KEY ?? null;
}

/** Єдина обгортка для fetch-ів до TMDb з додаванням ключа */
async function tmdb<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const key = getKey();
  if (!key) {
    throw new Error("TMDB_API_KEY is not configured");
  }
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("language", "uk-UA");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  // TMDb підтримує v3 api_key query або v4 Bearer token — визначаємо евристично
  const headers: Record<string, string> = { Accept: "application/json" };
  if (key.startsWith("eyJ")) {
    headers.Authorization = `Bearer ${key}`;
  } else {
    url.searchParams.set("api_key", key);
  }

  const res = await fetch(url.toString(), {
    headers,
    // Кеш на рівні Next.js: ISR-подібне оновлення кожні 10 хв
    next: { revalidate: 600 },
  });
  if (!res.ok) {
    throw new Error(`TMDb error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

/** Побудувати URL зображення TMDb або null, якщо шлях відсутній */
function img(path: string | null | undefined, size: "w342" | "w500" | "original" = "w500"): string | null {
  return path ? `${TMDB_IMG}/${size}${path}` : null;
}

interface TmdbSearchMovieItem {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  release_date?: string;
  vote_average?: number;
  genre_ids?: number[];
}

interface TmdbGenreList {
  genres: { id: number; name: string }[];
}

let genreCache: Map<number, string> | null = null;

async function getGenres(): Promise<Map<number, string>> {
  if (genreCache) return genreCache;
  try {
    const data = await tmdb<TmdbGenreList>("/genre/movie/list");
    genreCache = new Map(data.genres.map((g) => [g.id, g.name]));
  } catch {
    genreCache = new Map();
  }
  return genreCache;
}

/** Пошук фільмів за назвою */
export async function searchMovies(query: string): Promise<MediaCard[]> {
  if (!getKey() || !query.trim()) return [];
  const [data, genres] = await Promise.all([
    tmdb<{ results: TmdbSearchMovieItem[] }>("/search/movie", { query, include_adult: "false" }),
    getGenres(),
  ]);

  return data.results.slice(0, 20).map((m) => ({
    id: m.id,
    kind: "movie" as const,
    title: m.title,
    originalTitle: m.original_title,
    posterUrl: img(m.poster_path),
    overview: m.overview || "",
    rating: typeof m.vote_average === "number" ? Number(m.vote_average.toFixed(1)) : null,
    year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    genres: (m.genre_ids ?? []).map((id) => genres.get(id)).filter((x): x is string => Boolean(x)),
  }));
}

interface TmdbMovieDetail {
  id: number;
  title: string;
  original_title?: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  vote_average?: number;
  genres?: { id: number; name: string }[];
  runtime?: number | null;
  status?: string;
  tagline?: string | null;
  videos?: { results: { key: string; site: string; type: string; official: boolean }[] };
}

/** Деталі фільму за id + офіційний трейлер з YouTube, якщо є */
export async function getMovieDetail(id: number): Promise<MediaDetail | null> {
  if (!getKey()) return null;
  const m = await tmdb<TmdbMovieDetail>(`/movie/${id}`, { append_to_response: "videos" });

  const videos = m.videos?.results ?? [];
  const trailer =
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer" && v.official) ??
    videos.find((v) => v.site === "YouTube" && v.type === "Trailer") ??
    videos.find((v) => v.site === "YouTube");

  return {
    id: m.id,
    kind: "movie",
    title: m.title,
    originalTitle: m.original_title,
    posterUrl: img(m.poster_path),
    backdropUrl: img(m.backdrop_path, "original"),
    overview: m.overview || "",
    rating: typeof m.vote_average === "number" ? Number(m.vote_average.toFixed(1)) : null,
    year: m.release_date ? Number(m.release_date.slice(0, 4)) : null,
    genres: (m.genres ?? []).map((g) => g.name),
    runtimeMinutes: m.runtime ?? null,
    status: m.status ?? null,
    youtubeKey: trailer?.key ?? null,
    tagline: m.tagline ?? null,
    releaseDate: m.release_date ?? null,
  };
}

export function isTmdbConfigured(): boolean {
  return Boolean(getKey());
}
