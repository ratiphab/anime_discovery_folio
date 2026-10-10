import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Star } from "lucide-react";
import { getAnimeDetail, MalRequestError } from "@/lib/myanimelist";
import { AnimeActions } from "@/components/anime-actions";

export default async function AnimeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const id = Number((await params).id);
  if (!Number.isInteger(id) || id <= 0) notFound();
  let anime;
  try {
    anime = await getAnimeDetail(id);
  } catch (error) {
    if (error instanceof MalRequestError && error.status === 404) notFound();
    throw error;
  }
  return (
    <main className="detail-page">
      <nav className="detail-nav">
        <Link href="/" className="k-brand">
          Phap Kep<small>พับเก็บ</small>
        </Link>
        <Link href="/" className="back-link">
          <ArrowLeft size={16} /> Back to discovery
        </Link>
      </nav>
      <section className="detail-hero">
        {anime.image && (
          <div
            className="detail-backdrop"
            style={{ backgroundImage: `url(${anime.image})` }}
          />
        )}
        <div className="detail-ink" />
        <div className="detail-layout">
          <div className="detail-poster">
            {anime.image ? (
              <div style={{ backgroundImage: `url(${anime.image})` }} />
            ) : (
              "Phap Kep"
            )}
          </div>
          <div className="detail-copy">
            <p className="k-label">
              {anime.type ?? "Anime"} · {anime.status ?? "Unknown status"}
            </p>
            <p className="detail-jp">{anime.titleJapanese}</p>
            <h1>{anime.title}</h1>
            <div className="detail-score">
              {anime.score && (
                <>
                  <Star size={17} fill="currentColor" /> {anime.score}
                </>
              )}{" "}
              {anime.rank && <span>Rank #{anime.rank}</span>}{" "}
              {anime.episodes && <span>{anime.episodes} episodes</span>}
            </div>
            <p className="detail-synopsis">
              {anime.synopsis ??
                "No synopsis has been archived for this title yet."}
            </p>
            <AnimeActions animeId={anime.id} />
          </div>
        </div>
      </section>
      <section className="detail-information">
        <div>
          <p className="k-label">The essentials</p>
          <dl>
            <div>
              <dt>Studios</dt>
              <dd>{anime.studios.join(", ") || "—"}</dd>
            </div>
            <div>
              <dt>Genres</dt>
              <dd>{anime.genres.join(" · ") || "—"}</dd>
            </div>
            <div>
              <dt>Year</dt>
              <dd>{anime.year ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </section>
      <footer className="k-footer">
        <p>
          Anime data provided by{" "}
          <a href="https://myanimelist.net" target="_blank" rel="noreferrer">
            MyAnimeList
          </a>
          .
        </p>
      </footer>
    </main>
  );
}
