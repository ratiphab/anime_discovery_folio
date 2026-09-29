"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import type { Anime } from "@/lib/anime";

export function AiringCarousel({ anime }: { anime: Anime[] }) {
  const items = anime.slice(0, 5);
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  useEffect(() => {
    if (items.length < 2) return;
    const timer = window.setInterval(
      () => setActive((current) => (current + 1) % items.length),
      6500,
    );
    return () => window.clearInterval(timer);
  }, [items.length]);
  const current = items[active];
  if (!current)
    return (
      <section id="top" className="k-hero">
        <div className="hero-art" />
        <div className="hero-content">
          <p className="k-label">
            <Sparkles size={14} /> Airing signal
          </p>
          <h1>Stories that stay with you.</h1>
          <p>
            A quiet archive for discovering bright worlds, strange feelings, and
            the next anime you will love.
          </p>
        </div>
      </section>
    );
  return (
    <section id="top" className="k-hero">
      {current.image && (
        <div
          className="hero-poster"
          style={{ backgroundImage: `url(${current.image})` }}
        />
      )}
      <div className="hero-art" />
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          className="hero-content"
          initial={reduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          <p className="k-label">
            <Sparkles size={14} /> Airing signal
          </p>
          <p className="hero-jp">{current.titleJapanese ?? "今季の物語"}</p>
          <h1>{current.title}</h1>
          <p>
            {current.synopsis?.slice(0, 170) ??
              "A new story is waiting in the archive."}
          </p>
          <Link className="brush-button" href={`/anime/${current.id}`}>
            Open story <span>→</span>
          </Link>
        </motion.div>
      </AnimatePresence>
      {items.length > 1 && (
        <div className="carousel-controls">
          <button
            onClick={() =>
              setActive((active - 1 + items.length) % items.length)
            }
            aria-label="Previous airing anime"
          >
            <ChevronLeft size={19} />
          </button>
          <span>
            {String(active + 1).padStart(2, "0")} /{" "}
            {String(items.length).padStart(2, "0")}
          </span>
          <button
            onClick={() => setActive((active + 1) % items.length)}
            aria-label="Next airing anime"
          >
            <ChevronRight size={19} />
          </button>
        </div>
      )}
    </section>
  );
}
