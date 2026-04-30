/**
 * Клієнт для AniList GraphQL API.
 * API публічне, ключ не потрібен.
 * Докі: https://docs.anilist.co/
 */

import type { MediaCard, MediaDetail } from "./types";

const ANILIST_URL = "https://graphql.anilist.co";

interface AniListMedia {
  id: number;
  title: { romaji: string | null; english: string | null; native: string | null };
  description: string | null;
  coverImage: { large: string | null; extraLarge?: string | null };
  bannerImage: string | null;
  averageScore: number | null;
  startDate: { year: number | null } | null;
  genres: string[];
  episodes: number | null;
  duration: number | null;
  status: string | null;
  studios?: { nodes: { name: string }[] };
  trailer: { id: string | null; site: string | null } | null;
}

/**
 * AniList описи містять HTML-теги (<br>, <i>). Прибираємо для простого виводу.
 */
function stripHtml(s: string | null): string {
  if (!s) return "";
  return s.replace(/<[^>]+>/g, "").replace(/\s+\n/g, "\n").trim();
}

function pickTitle(t: AniListMedia["title"]): string {
  return t.english || t.romaji || t.native || "Без назви";
}

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const res = await fetch(ANILIST_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 600 },
  });
  if (!res.ok) {
    throw new Error(`AniList error ${res.status}: ${await res.text()}`);
  }
  const json = (await res.json()) as { data: T; errors?: { message: string }[] };
  if (json.errors?.length) {
    throw new Error(`AniList GraphQL error: ${json.errors.map((e) => e.message).join("; ")}`);
  }
  return json.data;
}

const SEARCH_QUERY = /* GraphQL */ `
  query ($search: String) {
    Page(perPage: 20) {
      media(search: $search, type: ANIME, sort: SEARCH_MATCH) {
        id
        title { romaji english native }
        description(asHtml: false)
        coverImage { large }
        averageScore
        startDate { year }
        genres
      }
    }
  }
`;

const DETAIL_QUERY = /* GraphQL */ `
  query ($id: Int) {
    Media(id: $id, type: ANIME) {
      id
      title { romaji english native }
      description(asHtml: false)
      coverImage { large extraLarge }
      bannerImage
      averageScore
      startDate { year }
      genres
      episodes
      duration
      status
      studios(isMain: true) { nodes { name } }
      trailer { id site }
    }
  }
`;

/** Пошук аніме за назвою */
export async function searchAnime(query: string): Promise<MediaCard[]> {
  if (!query.trim()) return [];
  const data = await gql<{ Page: { media: AniListMedia[] } }>(SEARCH_QUERY, { search: query });

  return data.Page.media.map((a) => ({
    id: a.id,
    kind: "anime" as const,
    title: pickTitle(a.title),
    originalTitle: a.title.native ?? a.title.romaji ?? undefined,
    posterUrl: a.coverImage.large ?? null,
    overview: stripHtml(a.description),
    // AniList має 0..100, приводимо до 0..10
    rating: typeof a.averageScore === "number" ? Number((a.averageScore / 10).toFixed(1)) : null,
    year: a.startDate?.year ?? null,
    genres: a.genres ?? [],
  }));
}

/** Деталі аніме за id */
export async function getAnimeDetail(id: number): Promise<MediaDetail | null> {
  const data = await gql<{ Media: AniListMedia | null }>(DETAIL_QUERY, { id });
  const a = data.Media;
  if (!a) return null;

  const youtubeKey = a.trailer && a.trailer.site === "youtube" ? a.trailer.id : null;

  return {
    id: a.id,
    kind: "anime",
    title: pickTitle(a.title),
    originalTitle: a.title.native ?? a.title.romaji ?? undefined,
    posterUrl: a.coverImage.extraLarge ?? a.coverImage.large ?? null,
    backdropUrl: a.bannerImage ?? null,
    overview: stripHtml(a.description),
    rating: typeof a.averageScore === "number" ? Number((a.averageScore / 10).toFixed(1)) : null,
    year: a.startDate?.year ?? null,
    genres: a.genres ?? [],
    runtimeMinutes: a.duration ?? null,
    status: a.status ?? null,
    youtubeKey,
    episodes: a.episodes ?? null,
    studios: a.studios?.nodes.map((n) => n.name) ?? [],
  };
}
