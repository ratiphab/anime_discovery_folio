import "server-only";
import { z } from "zod";
import type { Anime, AnimeGenre, AnimePage } from "@/lib/anime";

const namedSchema = z.object({ id: z.number(), name: z.string() });
const animeSchema = z.object({
  id: z.number(), title: z.string(), synopsis: z.string().nullable().optional(), mean: z.number().nullable().optional(), rank: z.number().nullable().optional(),
  media_type: z.string().nullable().optional(), status: z.string().nullable().optional(), num_episodes: z.number().nullable().optional(),
  main_picture: z.object({ medium: z.string().optional(), large: z.string().optional() }).nullable().optional(),
  start_season: z.object({ year: z.number().optional(), season: z.string().optional() }).nullable().optional(),
  alternative_titles: z.object({ ja: z.string().nullable().optional() }).optional(), genres: z.array(namedSchema).default([]), studios: z.array(namedSchema).default([]),
});
const listSchema = z.object({ data: z.array(z.object({ node: animeSchema })), paging: z.object({ next: z.string().optional() }).optional() });
const genreSchema = z.object({ data: z.array(namedSchema) });

export const animeQuerySchema = z.object({ q: z.string().trim().max(100).optional().default(""), type: z.enum(["all", "tv", "movie", "ova", "ona", "special"]).optional().default("all"), status: z.enum(["all", "airing", "complete"]).optional().default("all"), genres: z.coerce.number().int().positive().optional(), page: z.coerce.number().int().positive().max(100).optional().default(1), collection: z.enum(["discover", "airing", "seasonal", "top"]).optional().default("discover") });
export type AnimeQuery = z.infer<typeof animeQuerySchema>;

const fields = "id,title,main_picture,synopsis,mean,rank,media_type,status,num_episodes,start_season,alternative_titles,genres,studios";
const genreFallback: AnimeGenre[] = [{ id: 1, name: "Action" }, { id: 2, name: "Adventure" }, { id: 4, name: "Comedy" }, { id: 8, name: "Drama" }, { id: 10, name: "Fantasy" }, { id: 7, name: "Mystery" }, { id: 22, name: "Romance" }, { id: 24, name: "Sci-Fi" }, { id: 36, name: "Slice of Life" }, { id: 30, name: "Sports" }];

function normalize(item: z.infer<typeof animeSchema>): Anime { return { id: item.id, title: item.title, titleJapanese: item.alternative_titles?.ja ?? null, image: item.main_picture?.large ?? item.main_picture?.medium ?? null, score: item.mean ?? null, episodes: item.num_episodes ?? null, type: item.media_type ?? null, status: item.status ?? null, year: item.start_season?.year ?? null, genres: item.genres.map((genre) => genre.name), synopsis: item.synopsis ?? null, studios: item.studios.map((studio) => studio.name), trailerUrl: null, rank: item.rank ?? null }; }

async function malFetch(path: string) {
  const clientId = process.env.MAL_CLIENT_ID;
  if (!clientId) throw new MalRequestError(503, "MyAnimeList is not configured. Add MAL_CLIENT_ID to .env.local.");
  const response = await fetch(`https://api.myanimelist.net/v2${path}`, { next: { revalidate: 300 }, headers: { Accept: "application/json", "X-MAL-CLIENT-ID": clientId } });
  if (!response.ok) throw new MalRequestError(response.status, response.status === 401 || response.status === 403 ? "MyAnimeList credentials were rejected." : response.status === 429 ? "MyAnimeList is busy. Please try again shortly." : "MyAnimeList is temporarily unavailable.");
  return response.json();
}

export async function getAnime(query: AnimeQuery): Promise<AnimePage> {
  const params = new URLSearchParams({ limit: "12", offset: String((query.page - 1) * 12), fields, nsfw: "false" });
  let path = "/anime";
  if (query.collection === "airing") { path = "/anime/ranking"; params.set("ranking_type", "airing"); }
  else if (query.collection === "seasonal") { const date = new Date(); const season = ["winter", "spring", "summer", "fall"][Math.floor(date.getUTCMonth() / 3)]; path = `/anime/season/${date.getUTCFullYear()}/${season}`; }
  else if (query.collection === "top" || !query.q) { path = "/anime/ranking"; params.set("ranking_type", "all"); }
  else params.set("q", query.q);
  const parsed = listSchema.safeParse(await malFetch(`${path}?${params}`));
  if (!parsed.success) throw new MalRequestError(502, "MyAnimeList returned an unexpected response.");
  let items = parsed.data.data.map(({ node }) => normalize(node));
  if (query.type !== "all") items = items.filter((item) => item.type?.toLowerCase() === query.type);
  if (query.status !== "all") items = items.filter((item) => query.status === "airing" ? item.status === "currently_airing" : item.status === "finished_airing");
  if (query.genres) items = items.filter((item) => parsed.data.data.find(({ node }) => node.id === item.id)?.node.genres.some((genre) => genre.id === query.genres));
  return { items, total: items.length, page: query.page, hasNextPage: Boolean(parsed.data.paging?.next) };
}

export async function getAnimeDetail(id: number) { const parsed = animeSchema.safeParse(await malFetch(`/anime/${id}?fields=${fields}`)); if (!parsed.success) throw new MalRequestError(502, "MyAnimeList returned an unexpected response."); return normalize(parsed.data); }
export async function getAnimeGenres(): Promise<AnimeGenre[]> { try { const parsed = genreSchema.safeParse(await malFetch("/anime/genres")); return parsed.success ? parsed.data.data : genreFallback; } catch { return genreFallback; } }
export class MalRequestError extends Error { constructor(public readonly status: number, message: string) { super(message); } }
