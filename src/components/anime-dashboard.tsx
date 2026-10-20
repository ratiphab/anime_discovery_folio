"use client";
import { Drawer, Select } from "antd";
import Link from "next/link";
import { BookOpen, Filter, Menu, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnimeCard } from "@/components/anime-card";
import { AiringCarousel } from "@/components/airing-carousel";
import { useAnime, useAnimeGenres } from "@/hooks/use-anime";
import { useLibraryStore } from "@/store/library-store";

const typeOptions = ["all", "tv", "movie", "ova", "ona", "special"];
const statusOptions = ["all", "airing", "complete"];
type MalSeason = "winter" | "spring" | "summer" | "fall";
const seasonOptions: { value: MalSeason; label: string }[] = [
  { value: "winter", label: "Winter" },
  { value: "spring", label: "Spring" },
  { value: "summer", label: "Summer" },
  { value: "fall", label: "Fall" },
];
function getSeasonRequest(): { year: number; season: MalSeason } {
  const date = new Date();
  const month = date.getUTCMonth() + 1;
  const season =
    month <= 3
      ? "winter"
      : month <= 6
        ? "spring"
        : month <= 9
          ? "summer"
          : "fall";
  return {
    // Winter belongs to the previous seasonal cycle in this discovery rail.
    year:
      season === "winter" ? date.getUTCFullYear() - 1 : date.getUTCFullYear(),
    season,
  };
}
function Skeletons({ count = 6 }: { count?: number }) {
  return (
    <div className="anime-grid">
      {Array.from({ length: count }, (_, i) => (
        <div className="anime-skeleton" key={i} />
      ))}
    </div>
  );
}

export function AnimeDashboard() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [genre, setGenre] = useState<number | undefined>();
  const [year, setYear] = useState<number | undefined>();
  const [season, setSeason] = useState<MalSeason | undefined>();
  const [page, setPage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loadAiring, setLoadAiring] = useState(false);
  const [loadSeasonal, setLoadSeasonal] = useState(false);
  const seasonalRequest = useMemo(() => getSeasonRequest(), []);
  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedQ(q);
      setPage(1);
    }, 350);
    return () => window.clearTimeout(timer);
  }, [q]);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoadAiring(true), 900);
    return () => window.clearTimeout(timer);
  }, []);
  useEffect(() => {
    const timer = window.setTimeout(() => setLoadSeasonal(true), 1800);
    return () => window.clearTimeout(timer);
  }, []);
  const query = useAnime({
    q: debouncedQ,
    type,
    status,
    genres: genre,
    page,
    ...(year ? { collection: "seasonal", year, season } : {}),
  });
  const airing = useAnime(
    { q: "", type: "all", status: "all", collection: "airing" },
    loadAiring,
  );
  const seasonal = useAnime(
    {
      q: "",
      type: "all",
      status: "all",
      collection: "seasonal",
      ...seasonalRequest,
    },
    loadSeasonal,
  );
  const genres = useAnimeGenres();
  const favoriteIds = useLibraryStore((s) => s.favoriteIds);
  const planToWatchIds = useLibraryStore((s) => s.planToWatchIds);

  const changeFilter = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };
  const clear = () => {
    setPage(1);
    setQ("");
    setType("all");
    setStatus("all");
    setGenre(undefined);
    setYear(undefined);
    setSeason(undefined);
  };
  const controls = (
    <div className="filter-controls manga-controls">
      <label>
        Format
        <Select
          value={type}
          onChange={changeFilter(setType)}
          options={typeOptions.map((value) => ({
            value,
            label: value === "all" ? "All formats" : value.toUpperCase(),
          }))}
        />
      </label>
      <label>
        Status
        <Select
          value={status}
          onChange={changeFilter(setStatus)}
          options={statusOptions.map((value) => ({
            value,
            label:
              value === "all"
                ? "Any status"
                : value === "complete"
                  ? "Completed"
                  : "Airing",
          }))}
        />
      </label>
      <label>
        Genre
        <Select
          value={genre}
          onChange={changeFilter(setGenre)}
          placeholder="All genres"
          allowClear
          options={genres.data?.map((item) => ({
            value: item.id,
            label: item.name,
          }))}
          loading={genres.isLoading}
        />
      </label>
      <label>
        Year
        <Select
          value={year}
          onChange={(value) => {
            setPage(1);
            setYear(value);
            if (!value) setSeason(undefined);
          }}
          placeholder="Any year"
          allowClear
          options={Array.from({ length: new Date().getUTCFullYear() - 2000 + 1 }, (_, index) => {
            const value = new Date().getUTCFullYear() - index;
            return { value, label: String(value) };
          })}
        />
      </label>
      <label>
        Season
        <Select
          value={season}
          onChange={changeFilter(setSeason)}
          placeholder="Any season"
          allowClear
          disabled={!year}
          options={seasonOptions}
        />
      </label>
      <button className="ink-button" onClick={clear}>
        Clear
      </button>
    </div>
  );
  return (
    <main className="phap-kep-main">
      <nav className="k-nav">
        <a href="#top" className="k-brand">
          Phap Kep<small>พับเก็บ</small>
        </a>
        <div className="discovery-nav-links">
          <a href="#discover">Discover</a>
          <a href="#seasonal">This season</a>
          <Link href="/about">About us</Link>
          <Link href="/library">
            Library <i>{favoriteIds.length + planToWatchIds.length}</i>
          </Link>
        </div>
        <button
          className="mobile-menu-button"
          aria-label="Open navigation"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen(true)}
        >
          <Menu size={20} /> Menu
        </button>
      </nav>
      <Drawer title="Phap Kep" open={menuOpen} onClose={() => setMenuOpen(false)}>
        <nav id="mobile-navigation" className="mobile-navigation" aria-label="Main navigation">
          <a href="#discover" onClick={() => setMenuOpen(false)}>Discover</a>
          <a href="#seasonal" onClick={() => setMenuOpen(false)}>This season</a>
          <Link href="/about" onClick={() => setMenuOpen(false)}>About us</Link>
          <Link href="/library" onClick={() => setMenuOpen(false)}>
            Library ({favoriteIds.length + planToWatchIds.length})
          </Link>
        </nav>
      </Drawer>
      <AiringCarousel
        anime={airing.data?.items ?? seasonal.data?.items ?? []}
      />
      <section id="discover" className="discover-paper">
        <div className="section-heading">
          <div>
            <p className="k-label">
              <BookOpen size={14} /> Browse the archive
            </p>
            <h2>
              Something beautiful
              <br />
              <em>is waiting.</em>
            </h2>
          </div>
          <p>
            Search across an ever-growing shelf of anime, one feeling at a time.
          </p>
        </div>
        <div className="anime-search">
          <Search size={19} />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search a title..."
            maxLength={100}
            aria-label="Search anime"
          />
          {q && (
            <button onClick={() => setQ("")} aria-label="Clear search">
              <X size={16} />
            </button>
          )}
          <button
            className="filter-trigger"
            onClick={() => setFilterOpen(true)}
          >
            <Filter size={16} /> Filter
          </button>
        </div>
        <div className="desktop-filters">{controls}</div>
        <Drawer
          title="Refine the archive"
          placement="bottom"
          open={filterOpen}
          onClose={() => setFilterOpen(false)}
          className="manga-drawer"
          size="large"
        >
          {controls}
        </Drawer>
        <div className="result-line" aria-live="polite">
          <span>
            {query.isLoading
              ? "Searching the shelves…"
              : query.isError ? "Search unavailable" : `${query.data?.items.length ?? 0} stories in this batch`}
          </span>
          {query.isFetching && <span>Updating</span>}
        </div>
        <p className="discovery-note">
          Filters apply to each batch from MyAnimeList. Browse the next batch for more matches.
          {year && !season ? ` Showing all four seasons of ${year}.` : ""}
        </p>
        {query.isLoading ? (
          <Skeletons />
        ) : query.isError ? (
          <div className="archive-state">
            <p className="k-label">Archive unavailable</p>
            <h3>{query.error.message}</h3>
            <button className="ink-button" onClick={() => query.refetch()}>Try again</button>
          </div>
        ) : query.data?.items.length ? (
          <div className="anime-grid">
            {query.data.items.map((anime, index) => (
              <AnimeCard key={anime.id} anime={anime} index={index} />
            ))}
          </div>
        ) : (
          <div className="archive-state">
            <p className="k-label">No matches in this batch</p>
            <h3>{query.data?.hasNextPage
              ? "Try the next batch or change your filters."
              : "Try a different title or filter."}</h3>
            <button
              className="ink-button"
              onClick={() => {
                setQ("");
                clear();
              }}
            >
              Reset filters
            </button>
          </div>
        )}
        {!query.isError && query.data && (
          <nav className="pagination-controls" aria-label="Discovery results">
            <button className="ink-button" disabled={page === 1 || query.isFetching || q !== debouncedQ}
              onClick={() => setPage((current) => current - 1)}>Previous</button>
            <span aria-current="page">Batch {page}</span>
            <button className="ink-button"
              disabled={!query.data.hasNextPage || query.isFetching || q !== debouncedQ}
              onClick={() => setPage((current) => current + 1)}>Next</button>
          </nav>
        )}
      </section>
      <section id="seasonal" className="seasonal-section">
        <div className="rail-heading">
          <div>
            <p className="k-label">This season</p>
            <h2>Fresh from the studio.</h2>
          </div>
          <span>NOW AIRING</span>
        </div>
        {seasonal.isLoading ? (
          <Skeletons count={4} />
        ) : seasonal.data ? (
          <div className="anime-rail">
            {seasonal.data.items.slice(0, 12).map((anime, index) => (
              <AnimeCard anime={anime} index={index} key={anime.id} />
            ))}
          </div>
        ) : (
          <p className="rail-error">
            Seasonal stories are resting. Check back soon.
          </p>
        )}
      </section>
      <footer id="library" className="k-footer">
        <a href="#top" className="k-brand">
          Phap Kep<small>พับเก็บ</small>
        </a>
        <p>Keep your favorite stories close. <Link href="/about">Meet the maker ↗</Link></p>
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
