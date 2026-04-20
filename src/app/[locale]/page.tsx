import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import ShowsList from "@/components/sections/ShowsList";
import MusicPlayer from "@/components/sections/MusicPlayer";
import type { Show, Music } from "@/types/database";

// Placeholder data until Supabase is wired with real content
const placeholderShows: Show[] = [
  {
    id: "1",
    date: "2026-05-15T21:00:00Z",
    venue: "Coliseu dos Recreios",
    city: "Lisboa",
    country: "Portugal",
    ticket_url: "#",
    is_past: false,
    created_at: "",
  },
  {
    id: "2",
    date: "2026-06-20T22:00:00Z",
    venue: "Hard Club",
    city: "Porto",
    country: "Portugal",
    ticket_url: "#",
    is_past: false,
    created_at: "",
  },
  {
    id: "3",
    date: "2026-07-02T22:00:00Z",
    venue: "Pelourinho \u2014 Largo Tereza Batista",
    city: "Salvador",
    country: "Brasil",
    ticket_url: "#",
    is_past: false,
    created_at: "",
  },
];

const placeholderTracks: Music[] = [
  {
    id: "1",
    title: "Fogo Interior",
    youtube_url: null,
    cover_url: null,
    release_year: 2026,
    created_at: "",
  },
  {
    id: "2",
    title: "Rua Sem Sa\u00edda",
    youtube_url: null,
    cover_url: null,
    release_year: 2024,
    created_at: "",
  },
  {
    id: "3",
    title: "Ians\u00e3 na Chuva",
    youtube_url: null,
    cover_url: null,
    release_year: 2024,
    created_at: "",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <Marquee
        items={[
          { label: "Pr\u00f3ximo \u00b7 Lisboa \u00b7 Coliseu dos Recreios", dotColor: "var(--c-magenta)" },
          { label: "15 maio", italic: true },
          { label: "Hard Club \u00b7 Porto", dotColor: "var(--c-amber)" },
          { label: "20 junho", italic: true },
          { label: "Pelourinho \u00b7 Salvador", dotColor: "var(--c-cyan)" },
          { label: "02 julho", italic: true },
        ]}
      />

      <ShowsList shows={placeholderShows} preview />

      <Marquee
        reverse
        inverse
        items={[
          { label: "ou\u00e7a", italic: true },
          { label: "\u00b7" },
          { label: "FOGO INTERIOR" },
          { label: "\u00b7" },
          { label: "novo single", italic: true },
          { label: "\u00b7" },
          { label: "RUA SEM SA\u00cdDA" },
          { label: "\u00b7" },
          { label: "spotify \u00b7 youtube \u00b7 tidal", italic: true },
          { label: "\u00b7" },
        ]}
      />

      <MusicPlayer tracks={placeholderTracks} preview />
    </>
  );
}
