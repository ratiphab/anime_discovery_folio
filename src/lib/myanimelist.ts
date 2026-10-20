import "server-only";
import { z } from "zod";
import type { Anime, AnimeGenre, AnimePage } from "@/lib/anime";

const namedSchema = z.object({ id: z.number(), name: z.string() });
const animeSchema = z.object({
  id: z.number(),
  title: z.string(),
  synopsis: z.string().nullable().optional(),
  mean: z.number().nullable().optional(),
  rank: z.number().nullable().optional(),
  media_type: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  num_episodes: z.number().nullable().optional(),
  main_picture: z
    .object({ medium: z.string().optional(), large: z.string().optional() })
    .nullable()
    .optional(),
  start_season: z
    .object({ year: z.number().optional(), season: z.string().optional() })
    .nullable()
    .optional(),
  alternative_titles: z
    .object({ ja: z.string().nullable().optional() })
    .optional(),
  genres: z.array(namedSchema).default([]),
  studios: z.array(namedSchema).default([]),
});
const listSchema = z.object({
  data: z.array(z.object({ node: animeSchema })),
  paging: z.object({ next: z.string().optional() }).optional(),
});
const genreSchema = z.object({ data: z.array(namedSchema) });

export const animeQuerySchema = z.object({
  q: z.string().trim().max(100).optional().default(""),
  type: z
    .enum(["all", "tv", "movie", "ova", "ona", "special"])
    .optional()
    .default("all"),
  status: z.enum(["all", "airing", "complete"]).optional().default("all"),
  genres: z.coerce.number().int().positive().optional(),
  page: z.coerce.number().int().positive().max(100).optional().default(1),
  collection: z
    .enum(["discover", "airing", "seasonal", "top"])
    .optional()
    .default("discover"),
  year: z.coerce.number().int().min(1917).max(2100).optional(),
  season: z.enum(["winter", "spring", "summer", "fall"]).optional(),
});
export type AnimeQuery = z.infer<typeof animeQuerySchema>;

const fields =
  "id,title,main_picture,synopsis,mean,rank,media_type,status,num_episodes,start_season,alternative_titles,genres,studios";
const genreFallback: AnimeGenre[] = [
  { id: 1, name: "Action" },
  { id: 2, name: "Adventure" },
  { id: 4, name: "Comedy" },
  { id: 8, name: "Drama" },
  { id: 10, name: "Fantasy" },
  { id: 7, name: "Mystery" },
  { id: 22, name: "Romance" },
  { id: 24, name: "Sci-Fi" },
  { id: 36, name: "Slice of Life" },
  { id: 30, name: "Sports" },
];

function getCurrentSeason(date: Date) {
  const month = date.getUTCMonth() + 1;
  if (month <= 3) return "winter";
  if (month <= 6) return "spring";
  if (month <= 9) return "summer";
  return "fall";
}

function normalize(item: z.infer<typeof animeSchema>): Anime {
  return {
    id: item.id,
    title: item.title,
    titleJapanese: item.alternative_titles?.ja ?? null,
    image: item.main_picture?.large ?? item.main_picture?.medium ?? null,
    score: item.mean ?? null,
    episodes: item.num_episodes ?? null,
    type: item.media_type ?? null,
    status: item.status ?? null,
    year: item.start_season?.year ?? null,
    genres: item.genres.map((genre) => genre.name),
    synopsis: item.synopsis ?? null,
    studios: item.studios.map((studio) => studio.name),
    trailerUrl: null,
    rank: item.rank ?? null,
  };
}

async function malFetch(path: string) {
  const clientId = process.env.MAL_CLIENT_ID;
  if (!clientId)
    throw new MalRequestError(
      503,
      "MyAnimeList is not configured. Add MAL_CLIENT_ID to .env.local.",
    );
  const response = await fetch(`https://api.myanimelist.net/v2${path}`, {
    next: { revalidate: 300 },
    headers: { Accept: "application/json", "X-MAL-CLIENT-ID": clientId },
  });
  const payload = await response.json();
  if (!response.ok)
    throw new MalRequestError(
      response.status,
      response.status === 401 || response.status === 403
        ? "MyAnimeList credentials were rejected."
        : response.status === 429
          ? "MyAnimeList is busy. Please try again shortly."
          : "MyAnimeList is temporarily unavailable.",
    );
  return payload;
}

export async function getAnime(query: AnimeQuery): Promise<AnimePage> {
  // MAL does not support these filters on its search/ranking endpoints.
  // Filter a larger upstream batch and retain paging even if it has no matches.
  const filtered = query.type !== "all" || query.status !== "all" || !!query.genres;
  const limit = filtered || query.year || query.collection === "seasonal" ? 50 : 12;
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String((query.page - 1) * limit),
    fields,
    nsfw: "false",
  });
  const seasonal = query.year !== undefined || query.collection === "seasonal";
  let pages: z.infer<typeof listSchema>[];
  if (seasonal) {
    const date = new Date();
    const season = query.season ?? getCurrentSeason(date);
    const year = query.year ??
      (season === "winter" ? date.getUTCFullYear() - 1 : date.getUTCFullYear());
    const seasons = query.season ? [query.season] : query.year
      ? ["winter", "spring", "summer", "fall"]
      : [season];
    params.set("sort", "anime_num_list_users");
    pages = await Promise.all(seasons.map(async (season) => {
      const parsed = listSchema.safeParse(
        await malFetch(`/anime/season/${year}/${season}?${params}`),
      );
      if (!parsed.success)
        throw new MalRequestError(502, "MyAnimeList returned an unexpected response.");
      return {
        ...parsed.data,
        data: parsed.data.data.filter(({ node }) =>
          node.start_season?.year === year && node.start_season.season === season),
      };
    }));
  } else {
    let path = "/anime";
    if (query.collection === "airing" || query.collection === "top" || !query.q) {
      path = "/anime/ranking";
      params.set("ranking_type", query.collection === "airing" ? "airing" : "all");
    } else params.set("q", query.q);
    const parsed = listSchema.safeParse(await malFetch(`${path}?${params}`));
    if (!parsed.success)
      throw new MalRequestError(502, "MyAnimeList returned an unexpected response.");
    pages = [parsed.data];
  }
  const entries = [...new Map(pages.flatMap((page) => page.data)
    .map(({ node }) => [node.id, node])).values()];
  const needle = query.q.toLocaleLowerCase();
  const items = entries.filter((node) => {
    if (seasonal && needle && !node.title.toLocaleLowerCase().includes(needle) &&
      !node.alternative_titles?.ja?.toLocaleLowerCase().includes(needle)) return false;
    if (query.type !== "all" && node.media_type?.toLowerCase() !== query.type) return false;
    if (query.status !== "all" && node.status !==
      (query.status === "airing" ? "currently_airing" : "finished_airing")) return false;
    if (query.genres && !node.genres.some((genre) => genre.id === query.genres)) return false;
    return true;
  }).map(normalize);
  return {
    items,
    total: items.length,
    page: query.page,
    hasNextPage: query.page < 100 && pages.some((page) => Boolean(page.paging?.next)),
  };
}

export async function getAnimeDetail(id: number) {
  const parsed = animeSchema.safeParse(
    await malFetch(`/anime/${id}?fields=${fields}`),
  );
  if (!parsed.success)
    throw new MalRequestError(
      502,
      "MyAnimeList returned an unexpected response.",
    );
  return normalize(parsed.data);
}
export async function getAnimeGenres(): Promise<AnimeGenre[]> {
  try {
    const parsed = genreSchema.safeParse(await malFetch("/anime/genres"));
    return parsed.success ? parsed.data.data : genreFallback;
  } catch {
    return genreFallback;
  }
}
export class MalRequestError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
