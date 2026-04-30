import Link from "next/link";
import { Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";

/**
 * Головна сторінка — великий hero з полем пошуку та популярними запитами.
 * Search state тримається в URL, щоб пошук підтримував прямі лінки та SSR.
 */
export default function HomePage() {
  const suggestions = [
    "Attack on Titan",
    "Inception",
    "Frieren",
    "Interstellar",
    "Jujutsu Kaisen",
    "Dune",
  ];

  return (
    <section className="relative">
      {/* Декоративне градієнтне тло */}
      <div className="absolute inset-x-0 -top-24 -z-10 mx-auto h-80 max-w-5xl bg-gradient-to-br from-indigo-600/40 via-fuchsia-600/30 to-pink-500/40 blur-3xl" />

      <div className="mx-auto max-w-3xl pt-10 pb-8 text-center md:pt-16">
        <h1 className="text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
          Каталог фільмів та аніме <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">в одному місці</span>
        </h1>
        <p className="mt-4 text-pretty text-neutral-400 md:text-lg">
          Шукай за назвою — ми паралельно опитаємо <span className="text-neutral-200">TMDb</span>{" "}
          для фільмів та <span className="text-neutral-200">AniList</span> для аніме, покажемо постер,
          опис, рейтинг, жанр і трейлер.
        </p>

        <div className="mx-auto mt-8 max-w-2xl">
          <Suspense fallback={<div className="h-14 rounded-xl border border-white/10 bg-white/5" />}>
            <SearchBar size="lg" />
          </Suspense>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-neutral-500">Спробуй:</span>
          {suggestions.map((s) => (
            <Link
              key={s}
              href={`/search?q=${encodeURIComponent(s)}`}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-neutral-200 transition hover:border-white/20 hover:bg-white/10"
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto mt-12 grid max-w-4xl gap-4 md:grid-cols-3">
        {[
          { t: "Фільми (TMDb)", d: "Понад 700к фільмів з постерами, рейтингами й офіційними трейлерами." },
          { t: "Аніме (AniList)", d: "Повний каталог аніме з описами, жанрами й трейлерами на YouTube." },
          { t: "Обране", d: "Зареєструйся, щоб додавати фільми й аніме до свого списку." },
        ].map((f) => (
          <div key={f.t} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <h3 className="font-semibold text-white">{f.t}</h3>
            <p className="mt-1 text-sm text-neutral-400">{f.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
