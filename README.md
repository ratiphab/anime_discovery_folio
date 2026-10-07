# PHLIRU

**ผลิรู้ · ให้ทุกการค้นพบ ค่อย ๆ ผลิบาน**

The name combines the Thai words for budding (ผลิ) and knowing (รู้), expressing learning that gradually blossoms through discovery and creation.

PHLIRU is a soft manga-inspired anime discovery experience. Browse popular seasonal anime, search the MyAnimeList catalogue, refine by format, status, genre, year, and season, then keep a personal local watchlist.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![MyAnimeList](https://img.shields.io/badge/Data-MyAnimeList-2e51a2)

## Features

- Live anime discovery and title search powered by MyAnimeList API v2
- Filters for format, airing status, genre, year, and seasonal release window
- Seasonal rail ranked by MyAnimeList list popularity
- Airing spotlight carousel
- About page introducing the maker, technical skills, and professional journey
- Shareable server-rendered anime detail pages
- Local-only Favorites and Plan to Watch lists, persisted in `localStorage`
- Responsive soft-manga UI with keyboard focus and reduced-motion support
- Server-side API proxy, validation with Zod, caching, and upstream error states

## Tech stack

- Next.js App Router and React
- TypeScript
- TanStack Query
- Zustand
- Zod
- Ant Design, Motion, and Lucide icons
- MyAnimeList API v2

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure MyAnimeList

Create a `.env.local` file in the project root:

```bash
MAL_CLIENT_ID=your_myanimelist_client_id
```

`MAL_CLIENT_ID` is used only on the server. Do not prefix it with `NEXT_PUBLIC_`, and never commit `.env.local`.

### 3. Start the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available commands

```bash
npm run dev       # Start the development server
npm run lint      # Run ESLint
npm run typecheck # Check TypeScript types
npm run build     # Create a production build
npm run start     # Run the production build locally
```

## Data flow

The browser never calls MyAnimeList directly. It requests the internal API routes instead, keeping the MyAnimeList Client ID private on the server.

```text
Browser → /api/anime → MyAnimeList API v2
```

| Route | Purpose |
| --- | --- |
| `GET /api/anime` | Discover, search, filtering, and seasonal listings |
| `GET /api/anime/[id]` | Anime detail data |
| `GET /api/anime/genres` | Genre options |
| `/anime/[id]` | Shareable anime detail page |
| `/library` | Local Favorites and Plan to Watch lists |
| `/about` | Meet the maker and explore their experience |

For seasonal discovery, PHLIRU resolves the active release period and requests:

```text
GET https://api.myanimelist.net/v2/anime/season/{year}/{season}
```

Seasonal results are ordered using `anime_num_list_users`, then checked against their returned `start_season` so older long-running series do not appear in the selected season.

## Data attribution

Anime data and images are provided by [MyAnimeList](https://myanimelist.net/). PHLIRU is an independent portfolio project and is not affiliated with MyAnimeList.

## License

This project is intended as a portfolio project. Add a license file before redistributing or accepting contributions.
