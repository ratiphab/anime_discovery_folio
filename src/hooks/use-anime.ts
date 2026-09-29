"use client";
import { useQuery } from "@tanstack/react-query";
import type { AnimeGenre, AnimePage } from "@/lib/anime";

type Filters = {
  q: string;
  type: string;
  status: string;
  genres?: number;
  collection?: string;
  page?: number;
  year?: number;
  season?: "winter" | "spring" | "summer" | "fall";
};
async function getJson<T>(url: string): Promise<T> {
  const response = await fetch(url);
  const data = (await response.json()) as T & { error?: string };
  if (!response.ok) throw new Error(data.error ?? "Something went wrong.");
  return data;
}
export function useAnime(filters: Filters, enabled = true) {
  const search = new URLSearchParams(
    Object.entries(filters)
      .filter(([, value]) => value !== undefined)
      .map(([key, value]) => [key, String(value)]),
  );
  return useQuery({
    queryKey: ["anime", filters],
    queryFn: () => getJson<AnimePage>(`/api/anime?${search}`),
    staleTime: 300_000,
    placeholderData: (previous) => previous,
    retry: 0,
    enabled,
  });
}
export function useAnimeGenres(enabled = true) {
  return useQuery({
    queryKey: ["anime-genres"],
    queryFn: () => getJson<AnimeGenre[]>("/api/anime/genres"),
    staleTime: 300_000,
    retry: 0,
    enabled,
  });
}
