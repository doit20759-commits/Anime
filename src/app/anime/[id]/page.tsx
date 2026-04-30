import { notFound } from "next/navigation";
import { getAnimeDetail } from "@/lib/anilist";
import { DetailHero } from "@/components/DetailHero";

type Params = Promise<{ id: string }>;

export default async function AnimePage({ params }: { params: Params }) {
  const { id } = await params;
  const numericId = Number(id);
  if (!Number.isFinite(numericId)) notFound();

  const detail = await getAnimeDetail(numericId).catch((err) => {
    console.error("Anime detail error:", err);
    return null;
  });
  if (!detail) notFound();

  return <DetailHero item={detail} />;
}

export async function generateMetadata({ params }: { params: Params }) {
  const { id } = await params;
  const a = await getAnimeDetail(Number(id)).catch(() => null);
  return { title: a ? `${a.title} — CineAni` : "Аніме" };
}
