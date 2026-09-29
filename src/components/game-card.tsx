"use client";

import { motion, useReducedMotion } from "motion/react";
import { Bookmark, Check, Plus, Star } from "lucide-react";
import type { Game } from "@/lib/games";
import { useLibraryStore } from "@/store/library-store";

export function GameCard({ game, index = 0 }: { game: Game; index?: number }) {
  const shouldReduceMotion = useReducedMotion();
  const wishlist = useLibraryStore((state) => state.wishlist);
  const collection = useLibraryStore((state) => state.collection);
  const toggleWishlist = useLibraryStore((state) => state.toggleWishlist);
  const toggleCollection = useLibraryStore((state) => state.toggleCollection);
  const isWishlisted = wishlist.includes(game.id);
  const isCollected = collection.includes(game.id);

  return (
    <motion.article
      className="game-card group"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055, duration: 0.42 }}
      whileHover={shouldReduceMotion ? undefined : { y: -6 }}
    >
      <div className="game-art" style={{ backgroundImage: `url(${game.image})` }}>
        <div className="game-art-overlay" />
        <div className="game-card-actions">
          <button
            className={isWishlisted ? "icon-button is-active" : "icon-button"}
            onClick={() => toggleWishlist(game.id)}
            aria-label={`${isWishlisted ? "Remove" : "Add"} ${game.title} ${isWishlisted ? "from" : "to"} wishlist`}
          >
            <Bookmark size={16} fill={isWishlisted ? "currentColor" : "none"} />
          </button>
          <button
            className={isCollected ? "icon-button is-active" : "icon-button"}
            onClick={() => toggleCollection(game.id)}
            aria-label={`${isCollected ? "Remove" : "Add"} ${game.title} ${isCollected ? "from" : "to"} collection`}
          >
            {isCollected ? <Check size={17} /> : <Plus size={17} />}
          </button>
        </div>
        <div className="game-card-copy">
          <div className="flex items-center justify-between gap-3 text-xs text-white/75">
            <span>{game.releaseYear}</span>
            <span className="flex items-center gap-1"><Star size={13} fill="currentColor" className="text-acid-lime" />{game.rating}</span>
          </div>
          <h3>{game.title}</h3>
          <p className="game-card-meta">{game.genres.join(" · ")}</p>
        </div>
      </div>
    </motion.article>
  );
}
