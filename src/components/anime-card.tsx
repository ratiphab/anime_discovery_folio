"use client";
import Link from "next/link";
import { Bookmark, Heart, Star } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import type { Anime } from "@/lib/anime";
import { useLibraryStore } from "@/store/library-store";

export function AnimeCard({
  anime,
  index = 0,
}: {
  anime: Anime;
  index?: number;
}) {
  const reduceMotion = useReducedMotion();
  const favorites = useLibraryStore((state) => state.favoriteIds);
  const plan = useLibraryStore((state) => state.planToWatchIds);
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite);
  const togglePlan = useLibraryStore((state) => state.togglePlanToWatch);
  return (
    <motion.article
      className="anime-card"
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.045, duration: 0.35 }}
    >
      <Link
        href={`/anime/${anime.id}`}
        className="poster-link"
        aria-label={`Open ${anime.title}`}
      >
        {anime.image ? (
          <div
            className="anime-poster"
            style={{ backgroundImage: `url(${anime.image})` }}
          />
        ) : (
          <div className="anime-poster poster-fallback">Phap Kep</div>
        )}
        <span className="poster-stamp">{anime.type ?? "Anime"}</span>
      </Link>
      <div className="anime-card-actions">
        <button
          className={
            favorites.includes(anime.id)
              ? "round-action active"
              : "round-action"
          }
          onClick={() => toggleFavorite(anime.id)}
          aria-label="Toggle favorite"
        >
          <Heart
            size={15}
            fill={favorites.includes(anime.id) ? "currentColor" : "none"}
          />
        </button>
        <button
          className={
            plan.includes(anime.id) ? "round-action active" : "round-action"
          }
          onClick={() => togglePlan(anime.id)}
          aria-label="Toggle plan to watch"
        >
          <Bookmark
            size={15}
            fill={plan.includes(anime.id) ? "currentColor" : "none"}
          />
        </button>
      </div>
      <div className="anime-card-copy">
        <p>
          {anime.year ?? "—"} ·{" "}
          {anime.episodes ? `${anime.episodes} eps` : "Ongoing"}
        </p>
        <h3>{anime.title}</h3>
        <div>
          <span>{anime.genres.slice(0, 2).join(" · ") || "Animation"}</span>
          {anime.score && (
            <b>
              <Star size={13} fill="currentColor" /> {anime.score}
            </b>
          )}
        </div>
      </div>
    </motion.article>
  );
}
