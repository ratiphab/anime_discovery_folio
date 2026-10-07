import type { Metadata } from "next";
import { AboutPage } from "@/components/about-page";

export const metadata: Metadata = {
  title: "About — Time, the maker behind PHLIRU",
  description: "Meet Ratiphab (Time), a frontend-focused fullstack software engineer based in Bangkok. Explore the experience and craft behind PHLIRU.",
};

export default function About() {
  return <AboutPage />;
}
