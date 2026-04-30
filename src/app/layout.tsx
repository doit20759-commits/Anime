import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import { AuthStatus } from "@/components/AuthStatus";

export const metadata: Metadata = {
  title: "CineAni — каталог фільмів та аніме",
  description:
    "Сучасний каталог для пошуку фільмів (TMDb) та аніме (AniList) з трейлерами, рейтингами й обраним.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-neutral-950 text-neutral-100 antialiased">
        <AuthProvider>
          <header className="sticky top-0 z-40 border-b border-white/10 bg-neutral-950/80 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
              <Link href="/" className="flex items-center gap-2 font-bold tracking-tight">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 text-sm">
                  CA
                </span>
                <span className="text-lg">CineAni</span>
              </Link>
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/" className="text-neutral-300 hover:text-white">
                  Пошук
                </Link>
                <Link href="/favorites" className="text-neutral-300 hover:text-white">
                  Обране
                </Link>
                <AuthStatus />
              </nav>
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6 md:py-10">{children}</main>
          <footer className="mt-10 border-t border-white/10 py-6 text-center text-xs text-neutral-500">
            Дані: <a className="underline hover:text-neutral-300" href="https://www.themoviedb.org/">TMDb</a>{" "}
            ·{" "}
            <a className="underline hover:text-neutral-300" href="https://anilist.co/">AniList</a>. Цей
            продукт використовує TMDb API, але не схвалений і не сертифікований TMDb.
          </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
