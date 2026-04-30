/**
 * Вбудований YouTube-плеєр для трейлерів.
 * Використовуємо nocookie-домен і lazy loading, щоб не тягнути великі скрипти одразу.
 */
export function TrailerPlayer({ youtubeKey, title }: { youtubeKey: string; title: string }) {
  const src = `https://www.youtube-nocookie.com/embed/${youtubeKey}?rel=0&modestbranding=1`;
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black">
      <iframe
        src={src}
        title={`Трейлер: ${title}`}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="absolute inset-0 h-full w-full"
      />
    </div>
  );
}
