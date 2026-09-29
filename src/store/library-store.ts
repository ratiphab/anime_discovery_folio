"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type LibraryStore = {
  wishlist: number[];
  collection: number[];
  toggleWishlist: (gameId: number) => void;
  toggleCollection: (gameId: number) => void;
};

const toggle = (items: number[], item: number) =>
  items.includes(item) ? items.filter((id) => id !== item) : [...items, item];

export const useLibraryStore = create<LibraryStore>()(
  persist(
    (set) => ({
      wishlist: [],
      collection: [],
      toggleWishlist: (gameId) => set((state) => ({ wishlist: toggle(state.wishlist, gameId) })),
      toggleCollection: (gameId) => set((state) => ({ collection: toggle(state.collection, gameId) })),
    }),
    { name: "play-field-library" },
  ),
);
