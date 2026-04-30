import { notFound } from "next/navigation";
import { getMovieDetail, isTmdbConfigured } from "@/lib/tmdb";
import { DetailHero } from "@/components/DetailHero";

type Params = Promise<{ id: string }>;

export default async function MoviePage({ params }: { params: Params }) {
  if (!isTmdbConfigured()) {
    return (
      <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-amber-200">
        TMDb API-ключ не налаштовано. Додай <code>TMDB_API_KEY</code> у <code>.env.local</code>.
      </div>
    );
  }

  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const detail = await getMovieDetail(numericId).catch((err) => {
    console.error("Movie detail error:", err);
    return null;
  });
  if (!detail) notFound();

  return <DetailHero item={detail} />;
}

export async function generateMetadata({ params }: { params: Params }) {
  if (!isTmdbConfigured()) return { title: "Фільм" };
  const { id } = await params;
  const m = await getMovieDetail(Number(id)).catch(() => null);
  return { title: m ? `${m.title} — CineAni` : "Фільм" };
}
