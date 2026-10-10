import type { Metadata } from "next";
import { AboutPage } from "@/components/about-page";

export const metadata: Metadata = {
  title: "About — Time, the maker behind Phap Kep",
  description: "Meet Ratiphab (Time), a frontend-focused fullstack software engineer based in Bangkok. Explore the experience and craft behind Phap Kep.",
};

export default function About() {
  return <AboutPage />;
}
