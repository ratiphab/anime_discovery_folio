export type Anime = {
  id: number;
  title: string;
  titleJapanese: string | null;
  image: string | null;
  score: number | null;
  episodes: number | null;
  type: string | null;
  status: string | null;
  year: number | null;
  genres: string[];
  synopsis: string | null;
  studios: string[];
  trailerUrl: string | null;
  rank: number | null;
};

export type AnimePage = { items: Anime[]; total: number; page: number; hasNextPage: boolean };
export type AnimeGenre = { id: number; name: string };
