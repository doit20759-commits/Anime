# CineAni — каталог фільмів та аніме

Next.js-додаток для пошуку фільмів (TMDb) та аніме (AniList) з деталями,
YouTube-трейлерами, embed-плеєром для фільмів, авторизацією та обраним.

## Стек

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4
- TMDb REST API (сервер)
- AniList GraphQL API (сервер)
- Клієнтська авторизація (localStorage + SHA-256) — демо-патерн

## Запуск локально

```bash
pnpm install
cp .env.example .env.local
# Вкажи TMDB_API_KEY у .env.local (див. нижче)
pnpm dev
```

Відкрий <http://localhost:3000>.

## Ключі API

### TMDb (обов'язково)

1. Зареєструйся на <https://www.themoviedb.org/signup>.
2. Перейди у <https://www.themoviedb.org/settings/api> і створи
   «Developer» application.
3. Скопіюй **API Key (v3 auth)** або **Read Access Token (v4)**.
4. Поклади значення у `TMDB_API_KEY` в `.env.local` — код автоматично визначає,
   який формат використовується, і правильно формує заголовки.

### AniList

Ключ не потрібен — публічний GraphQL-ендпоінт <https://graphql.anilist.co>.

## Функції

- **Головна** (`/`) — пошук за назвою.
- **Результати** (`/search?q=…`) — дві окремі секції «Аніме» (AniList) та
  «Фільми» (TMDb) з постером, рейтингом, роком, жанрами.
- **Деталі фільму** (`/movie/:id`) — повна інформація, YouTube-трейлер і
  **embed-плеєр з вибором провайдера** (vidsrc.to / vidsrc.xyz /
  2embed.cc / multiembed.mov). Усі провайдери приймають TMDB-ID, тож
  користувач може перемикати джерело, якщо одне не грає.
  > ⚠️ Плеєри — неофіційні сторонні сервіси, не ліцензовані студіями.
- **Деталі аніме** (`/anime/:id`) — повна інформація + YouTube-трейлер.
- **Авторизація** (`/register`, `/login`) — демонстраційна локальна авторизація
  у `localStorage` з SHA-256-хешуванням.
- **Обране** (`/favorites`) — збережені фільми/аніме для залогіненого юзера.

## Деплой на Vercel

1. Підключи репозиторій у Vercel.
2. У Settings → Environment Variables додай `TMDB_API_KEY` з тим самим
   значенням, що й локально (production + preview + development).
3. Redeploy — AniList-частина працює одразу, фільми з'являться після
   додавання ключа.
