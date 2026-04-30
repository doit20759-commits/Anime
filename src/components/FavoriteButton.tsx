"use client";

import { useAuth } from "./AuthProvider";
import { useFavorites, type FavoriteItem } from "./Favorites";
import type { MediaCard } from "@/lib/types";

/**
 * Кнопка-сердечко. Для гостей відкриває tooltip-підказку.
 */
export function FavoriteButton({ item }: { item: MediaCard | FavoriteItem }) {
  const { user } = useAuth();
  const { isFav, toggle } = useFavorites();
  const active = isFav(item.kind, item.id);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
          alert("Увійди, щоб зберігати улюблене.");
          return;
        }
        toggle(item);
      }}
      aria-label={active ? "Прибрати з обраного" : "Додати в обране"}
      title={user ? (active ? "Прибрати з обраного" : "Додати в обране") : "Потрібен вхід"}
      className={`grid h-9 w-9 place-items-center rounded-full border border-white/10 backdrop-blur transition ${
        active ? "bg-pink-500 text-white" : "bg-black/60 text-white hover:bg-black/80"
      }`}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        className="h-4 w-4"
        aria-hidden
      >
        <path d="M12 21s-7-4.534-9.333-9.2C1.267 8.934 2.933 5 6.667 5c2 0 3.4 1.133 4 2.267h1.333C12.6 6.133 14 5 16 5c3.733 0 5.4 3.933 4 6.8C19 16.467 12 21 12 21z" />
      </svg>
    </button>
  );
}
