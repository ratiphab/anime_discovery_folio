export type Game = {
  id: number;
  title: string;
  releaseYear: number;
  rating: number;
  genres: string[];
  platforms: string[];
  image: string;
  tagline: string;
  featured?: boolean;
};

export const games: Game[] = [
  {
    id: 1,
    title: "Eclipse Protocol",
    releaseYear: 2026,
    rating: 4.8,
    genres: ["Action", "Sci-fi"],
    platforms: ["PC", "PS5"],
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1800&q=85",
    tagline: "A city at the edge of a signal.",
    featured: true,
  },
  {
    id: 2,
    title: "Wanderlight",
    releaseYear: 2025,
    rating: 4.6,
    genres: ["Adventure", "Indie"],
    platforms: ["PC", "Switch"],
    image: "https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1200&q=85",
    tagline: "Find the way through a world that remembers.",
  },
  {
    id: 3,
    title: "Neon Divide",
    releaseYear: 2026,
    rating: 4.7,
    genres: ["Racing", "Arcade"],
    platforms: ["PC", "PS5", "Xbox"],
    image: "https://images.unsplash.com/photo-1603481546238-487240415921?auto=format&fit=crop&w=1200&q=85",
    tagline: "Every corner is a wager.",
  },
  {
    id: 4,
    title: "Omen of the Deep",
    releaseYear: 2024,
    rating: 4.4,
    genres: ["RPG", "Fantasy"],
    platforms: ["PC", "PS5"],
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=85",
    tagline: "The sea does not keep its secrets.",
  },
  {
    id: 5,
    title: "Moss & Moon",
    releaseYear: 2025,
    rating: 4.5,
    genres: ["Puzzle", "Indie"],
    platforms: ["PC", "Switch"],
    image: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=85",
    tagline: "Small worlds. Strange gravity.",
  },
  {
    id: 6,
    title: "Sable Circuit",
    releaseYear: 2026,
    rating: 4.3,
    genres: ["Strategy", "Sci-fi"],
    platforms: ["PC", "Xbox"],
    image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=1200&q=85",
    tagline: "Outthink the stars.",
  },
];

export const genres = ["All", "Action", "Adventure", "Arcade", "Fantasy", "Indie", "Puzzle", "RPG", "Racing", "Sci-fi", "Strategy"];
export const platforms = ["All", "PC", "PS5", "Switch", "Xbox"];
