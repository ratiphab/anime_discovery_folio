"use client";

import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { AnimeCard } from "@/components/anime-card";
import type { Anime } from "@/lib/anime";
import { useLibraryStore } from "@/store/library-store";

async function getAnime(id: number): Promise<Anime> {
  const response = await fetch(`/api/anime/${id}`);
  const data = (await response.json()) as Anime & { error?: string };
  if (!response.ok)
    throw new Error(data.error ?? "Saved anime is unavailable.");
  return data;
}

function Shelf({ title, ids }: { title: string; ids: number[] }) {
  const queries = useQueries({
    queries: ids.map((id, index) => ({
      queryKey: ["anime-detail", id],
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, index * 900));
        return getAnime(id);
      },
      staleTime: 300_000,
      retry: 0,
    })),
  });
  const anime = queries.flatMap((query) => (query.data ? [query.data] : []));
  return (
    <section className="library-shelf">
      <div className="rail-heading">
        <h2>{title}</h2>
        <span>{ids.length} saved</span>
      </div>
      {ids.length === 0 ? (
        <div className="archive-state">
          <h3>Your shelf is waiting.</h3>
          <Link className="ink-button" href="/">
            Discover anime
          </Link>
        </div>
      ) : (
        <div className="anime-grid">
          {anime.map((item, index) => (
            <AnimeCard anime={item} index={index} key={item.id} />
          ))}
          {queries.some((query) => query.isLoading) && (
            <div className="anime-skeleton" />
          )}
        </div>
      )}
    </section>
  );
}

export function LibraryPage() {
  const favorites = useLibraryStore((state) => state.favoriteIds);
  const planned = useLibraryStore((state) => state.planToWatchIds);
  return (
    <main className="komorebi-main">
      <nav className="detail-nav">
        <Link href="/" className="k-brand">
          KOMOREBI<small>木漏れ日</small>
        </Link>
        <Link href="/" className="back-link">
          ← Discovery
        </Link>
      </nav>
      <div className="library-header">
        <p className="k-label">Your small archive</p>
        <h1>
          Stories you
          <br />
          <em>kept close.</em>
        </h1>
      </div>
      <Shelf title="Favorites" ids={favorites} />
      <Shelf title="Plan to watch" ids={planned} />
    </main>
  );
}
