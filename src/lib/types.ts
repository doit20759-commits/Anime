/**
 * Спільні типи для фільмів та аніме.
 * Нормалізуємо дані з TMDb та AniList у єдиний формат,
 * щоб однаково відображати їх на сторінці результатів.
 */

export type MediaKind = "movie" | "anime";

export interface MediaCard {
  /** Унікальний id у джерелі (TMDb id або AniList id) */
  id: number;
  kind: MediaKind;
  title: string;
  originalTitle?: string;
  /** Абсолютний URL постера/обкладинки */
  posterUrl: string | null;
  /** Короткий опис (може містити HTML у AniList — очищаємо заздалегідь) */
  overview: string;
  /** Рейтинг у шкалі 0..10 */
  rating: number | null;
  /** Рік випуску */
  year: number | null;
  /** Жанри */
  genres: string[];
}

export interface MediaDetail extends MediaCard {
  backdropUrl: string | null;
  runtimeMinutes: number | null;
  status: string | null;
  /** YouTube video id (ключ для вбудованого плеєра) */
  youtubeKey: string | null;
  /** Додаткові поля */
  tagline?: string | null;
  episodes?: number | null;
  studios?: string[];
  releaseDate?: string | null;
}

export interface SearchResponse {
  query: string;
  movies: MediaCard[];
  anime: MediaCard[];
}
