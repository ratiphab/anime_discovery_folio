"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type LibraryStore = {
  favoriteIds: number[];
  planToWatchIds: number[];
  toggleFavorite: (animeId: number) => void;
  togglePlanToWatch: (animeId: number) => void;
};

const toggle = (items: number[], item: number) =>
  items.includes(item) ? items.filter((id) => id !== item) : [...items, item];

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set) => ({
      favoriteIds: [],
      planToWatchIds: [],
      toggleFavorite: (animeId) => set((state) => ({ favoriteIds: toggle(state.favoriteIds, animeId) })),
      togglePlanToWatch: (animeId) => set((state) => ({ planToWatchIds: toggle(state.planToWatchIds, animeId) })),
    }),
    { name: "komorebi-library" },
  ),
);
