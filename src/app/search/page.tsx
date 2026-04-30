import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { MediaCardView } from "@/components/MediaCardView";
import { isTmdbConfigured, searchMovies } from "@/lib/tmdb";
import { searchAnime } from "@/lib/anilist";
import type { MediaCard } from "@/lib/types";

/**
 * Сторінка результатів пошуку (server component, SSR).
 * Запити TMDb та AniList відбуваються паралельно, кожен окремо обробляємо
 * на випадок помилок — щоб одна секція не ламала іншу.
 */
export const dynamic = "force-dynamic";

type SearchParams = Promise<{ q?: string }>;

async function runSearch(query: string): Promise<{ movies: MediaCard[]; anime: MediaCard[] }> {
  const [movies, anime] = await Promise.all([
    isTmdbConfigured()
      ? searchMovies(query).catch((err) => {
          console.error("TMDb search error:", err);
          return [] as MediaCard[];
        })
      : Promise.resolve([] as MediaCard[]),
    searchAnime(query).catch((err) => {
      console.error("AniList search error:", err);
      return [] as MediaCard[];
    }),
  ]);
  return { movies, anime };
}

export default async function SearchPage({ searchParams }: { searchParams: SearchParams }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const hasQuery = query.length > 0;
  const { movies, anime } = hasQuery ? await runSearch(query) : { movies: [], anime: [] };

  return (
    <section className="space-y-8">
      <div className="max-w-3xl">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      {!hasQuery && (
        <p className="text-neutral-400">Введи назву фільму чи аніме у полі вище.</p>
      )}

      {hasQuery && !isTmdbConfigured() && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
          TMDb API-ключ не налаштовано — показано тільки аніме з AniList. Щоб додати фільми, задай
          змінну <code>TMDB_API_KEY</code> у <code>.env.local</code> (див. README).
        </div>
      )}

      {hasQuery && (
        <>
          <Section
            title="Аніме"
            subtitle="AniList"
            accent="from-pink-500 to-rose-500"
            items={anime}
            emptyLabel="Нічого не знайдено серед аніме."
          />
          <Section
            title="Фільми"
            subtitle="TMDb"
            accent="from-indigo-500 to-sky-500"
            items={movies}
            emptyLabel={
              isTmdbConfigured()
                ? "Нічого не знайдено серед фільмів."
                : "TMDb API не сконфігуровано."
            }
          />
        </>
      )}
    </section>
  );
}

function Section({
  title,
  subtitle,
  accent,
  items,
  emptyLabel,
}: {
  title: string;
  subtitle: string;
  accent: string;
  items: MediaCard[];
  emptyLabel: string;
}) {
  return (
    <div>
      <div className="mb-3 flex items-baseline gap-3">
        <h2 className={`bg-gradient-to-r ${accent} bg-clip-text text-2xl font-bold text-transparent`}>
          {title}
        </h2>
        <span className="text-xs uppercase tracking-widest text-neutral-500">{subtitle}</span>
        <span className="ml-auto text-sm text-neutral-500">{items.length} результатів</span>
      </div>
      {items.length === 0 ? (
        <p className="text-sm text-neutral-500">{emptyLabel}</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {items.map((m) => (
            <MediaCardView key={`${m.kind}-${m.id}`} item={m} />
          ))}
        </div>
      )}
    </div>
  );
}
