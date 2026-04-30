/**
 * /api/search?q=... — паралельно шукає фільми (TMDb) та аніме (AniList)
 * і повертає нормалізований JSON. Розділяє результати на дві секції,
 * аби UI міг показати їх окремо (напр., для "Attack on Titan" у секції
 * "Аніме" буде саме аніме, а у секції "Фільми" — можливі однойменні фільми).
 */

import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdb";
import { searchAnime } from "@/lib/anilist";
import type { SearchResponse } from "@/lib/types";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) {
    const empty: SearchResponse = { query: "", movies: [], anime: [] };
    return NextResponse.json(empty);
  }

  // Обидва пошуки в паралель — фільми та аніме.
  // Кожен сорс обгортаємо try/catch, щоб падіння одного не ламало іншого.
  const [movies, anime] = await Promise.all([
    searchMovies(q).catch((err) => {
      console.error("TMDb search failed:", err);
      return [];
    }),
    searchAnime(q).catch((err) => {
      console.error("AniList search failed:", err);
      return [];
    }),
  ]);

  const body: SearchResponse = { query: q, movies, anime };
  return NextResponse.json(body);
}
