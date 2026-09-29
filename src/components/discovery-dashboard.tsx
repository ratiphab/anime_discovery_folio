"use client";

import { Drawer, Select, Tooltip } from "antd";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Filter, Menu, Search, Sparkles, X } from "lucide-react";
import { useMemo, useState } from "react";
import { GameCard } from "@/components/game-card";
import { games, genres, platforms } from "@/lib/games";
import { useLibraryStore } from "@/store/library-store";

export function DiscoveryDashboard() {
  const reduceMotion = useReducedMotion();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("All");
  const [platform, setPlatform] = useState("All");
  const [year, setYear] = useState("All");
  const [minimumRating, setMinimumRating] = useState("All");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const wishlist = useLibraryStore((state) => state.wishlist);
  const feature = games.find((game) => game.featured)!;

  const results = useMemo(() => games.filter((game) => {
    const matchQuery = game.title.toLowerCase().includes(query.trim().toLowerCase());
    const matchGenre = genre === "All" || game.genres.includes(genre);
    const matchPlatform = platform === "All" || game.platforms.includes(platform);
    const matchYear = year === "All" || String(game.releaseYear) === year;
    const matchRating = minimumRating === "All" || game.rating >= Number(minimumRating);
    return matchQuery && matchGenre && matchPlatform && matchYear && matchRating;
  }), [genre, minimumRating, platform, query, year]);

  const clearFilters = () => {
    setGenre("All"); setPlatform("All"); setYear("All"); setMinimumRating("All");
  };

  const filterControls = (
    <div className="filter-controls">
      <label>Genre<Select value={genre} onChange={setGenre} options={genres.map((value) => ({ value, label: value }))} /></label>
      <label>Platform<Select value={platform} onChange={setPlatform} options={platforms.map((value) => ({ value, label: value }))} /></label>
      <label>Year<Select value={year} onChange={setYear} options={["All", "2026", "2025", "2024"].map((value) => ({ value, label: value }))} /></label>
      <label>Rating<Select value={minimumRating} onChange={setMinimumRating} options={["All", "4", "4.5"].map((value) => ({ value, label: value === "All" ? "Any rating" : `${value}+` }))} /></label>
      <button className="text-button" onClick={clearFilters}>Reset</button>
    </div>
  );

  return (
    <main>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="brand" href="#top" aria-label="Play Field home">PLAY<span>{"//"}</span>FIELD</a>
        <div className="desktop-nav"><a href="#discover">Discover</a><a href="#trending">Trending</a><a href="#collection">Collection <span>{wishlist.length}</span></a></div>
        <Tooltip title="Navigation coming in the next slice"><button className="menu-button" aria-label="Open menu"><Menu size={20} /></button></Tooltip>
      </nav>

      <section id="top" className="hero-section" style={{ backgroundImage: `url(${feature.image})` }}>
        <div className="hero-shade" />
        <motion.div className="hero-copy" initial={reduceMotion ? false : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65 }}>
          <p className="eyebrow"><Sparkles size={14} /> Featured this week</p>
          <p className="hero-kicker">{feature.genres.join(" / ")} · {feature.releaseYear}</p>
          <h1>{feature.title}</h1>
          <p className="hero-description">{feature.tagline} Step inside a neon-soaked tactical thriller where every choice changes the city.</p>
          <div className="hero-actions"><a href="#discover" className="primary-button">Enter discovery</a><button className="secondary-button">Watch signal</button></div>
        </motion.div>
        <div className="hero-index" aria-hidden="true"><span>01</span><i /><span>06</span></div>
      </section>

      <section id="discover" className="discovery-section">
        <div className="section-heading"><div><p className="eyebrow">Your next obsession</p><h2>Find a game<br /><em>that hits different.</em></h2></div><p className="section-intro">Browse a living field of worlds, moods, and midnight missions.</p></div>
        <div className="search-row">
          <div className="search-box"><Search size={19} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by title, world, or feeling..." aria-label="Search games" />{query && <button onClick={() => setQuery("")} aria-label="Clear search"><X size={17} /></button>}</div>
          <button className="filter-trigger" onClick={() => setFiltersOpen(true)}><Filter size={17} /> Filters</button>
        </div>
        <div className="desktop-filters">{filterControls}</div>
        <Drawer title="Refine discovery" placement="bottom" open={filtersOpen} onClose={() => setFiltersOpen(false)} className="filter-drawer" height="auto">{filterControls}</Drawer>

        <div className="results-bar"><span>{results.length} {results.length === 1 ? "world" : "worlds"} detected</span><span>Sorted by <b>signal strength</b></span></div>
        <AnimatePresence mode="wait">
          {results.length ? <motion.div key={`${query}-${genre}-${platform}-${year}-${minimumRating}`} className="game-grid" initial={reduceMotion ? false : { opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>{results.map((game, index) => <GameCard key={game.id} game={game} index={index} />)}</motion.div> : <div className="empty-state"><p className="eyebrow">No signal found</p><h3>That world is outside our radar.</h3><button className="text-button" onClick={() => { setQuery(""); clearFilters(); }}>Clear discovery filters</button></div>}
        </AnimatePresence>
      </section>

      <section id="trending" className="rail-section"><div className="rail-heading"><div><p className="eyebrow">Trending now</p><h2>Fresh on the field.</h2></div><a href="#discover">View all <span>↗</span></a></div><div className="game-rail">{games.slice(1).map((game, index) => <GameCard key={game.id} game={game} index={index} />)}</div></section>
      <footer id="collection" className="site-footer"><a className="brand" href="#top">PLAY<span>{"//"}</span>FIELD</a><p>A game discovery study by Ratiphab.</p><p className="rawg-attribution">Game data and images will be provided by <a href="https://rawg.io/" target="_blank" rel="noreferrer">RAWG</a>.</p></footer>
    </main>
  );
}
