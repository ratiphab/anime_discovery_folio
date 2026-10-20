"use client";

import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { AnimeCard } from "@/components/anime-card";
import type { Anime } from "@/lib/anime";
import { createRequestQueue } from "@/lib/request-queue";
import { useLibraryStore } from "@/store/library-store";

const loadSavedAnime = createRequestQueue(4);

async function getAnime(id: number, signal: AbortSignal): Promise<Anime> {
  const response = await fetch(`/api/anime/${id}`, { signal });
  const data = (await response.json()) as Anime & { error?: string };
  if (!response.ok)
    throw new Error(data.error ?? "Saved anime is unavailable.");
  return data;
}

function Shelf({ title, ids }: { title: string; ids: number[] }) {
  const queries = useQueries({
    queries: ids.map((id) => ({
      queryKey: ["anime-detail", id],
      queryFn: ({ signal }) => loadSavedAnime(() => getAnime(id, signal)),
      staleTime: 300_000,
      retry: 0,
    })),
  });
  const anime = queries.flatMap((query) => (query.data ? [query.data] : []));
  const failed = queries.filter((query) => query.isError);
  const loading = queries.filter((query) => query.isPending || query.isFetching).length;
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
        <>
          <p className="library-load-status" role="status">
            {anime.length} of {ids.length} stories loaded{loading ? ` · Loading ${loading}…` : ""}
          </p>
          <div className="anime-grid">
            {anime.map((item, index) => (
              <AnimeCard anime={item} index={index} key={item.id} />
            ))}
            {Array.from({ length: Math.min(loading, 4) }, (_, index) => (
              <div className="anime-skeleton" key={`loading-${index}`} aria-hidden="true" />
            ))}
          </div>
          {failed.length > 0 && (
            <div className="archive-state" role="alert">
              <p className="k-label">Some stories could not be loaded</p>
              <h3>{failed.length} saved {failed.length === 1 ? "story is" : "stories are"} unavailable.</h3>
              <p>Your saved list is still kept on this device.</p>
              <button className="ink-button" onClick={() => {
                void Promise.all(failed.map((query) => query.refetch()));
              }}>Try again</button>
            </div>
          )}
        </>
      )}
    </section>
  );
}

export function LibraryPage() {
  const favorites = useLibraryStore((state) => state.favoriteIds);
  const planned = useLibraryStore((state) => state.planToWatchIds);
  return (
    <main className="phap-kep-main">
      <nav className="detail-nav">
        <Link href="/" className="k-brand">
          Phap Kep<small>พับเก็บ</small>
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
