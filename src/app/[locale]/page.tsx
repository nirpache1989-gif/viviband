import Hero from "@/components/sections/Hero";
import Marquee from "@/components/sections/Marquee";
import ShowsList from "@/components/sections/ShowsList";
import MusicPlayer from "@/components/sections/MusicPlayer";
import type { Show, Music } from "@/types/database";
import { getShows, getMusic } from "@/lib/content";

const FALLBACK_SHOWS: Show[] = [
  {
    id: "1",
    date: "2026-05-15T21:00:00Z",
    venue: "Coliseu dos Recreios",
    city: "Lisboa",
    country: "Portugal",
    ticket_url: null,
    is_past: false,
    created_at: "",
  },
  {
    id: "2",
    date: "2026-06-20T22:00:00Z",
    venue: "Hard Club",
    city: "Porto",
    country: "Portugal",
    ticket_url: null,
    is_past: false,
    created_at: "",
  },
  {
    id: "3",
    date: "2026-07-02T22:00:00Z",
    venue: "Pelourinho — Largo Tereza Batista",
    city: "Salvador",
    country: "Brasil",
    ticket_url: null,
    is_past: false,
    created_at: "",
  },
];

const FALLBACK_TRACKS: Music[] = [
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
    title: "Rua Sem Saída",
    youtube_url: null,
    cover_url: null,
    release_year: 2024,
    created_at: "",
  },
  {
    id: "3",
    title: "Iansã na Chuva",
    youtube_url: null,
    cover_url: null,
    release_year: 2024,
    created_at: "",
  },
];

export default async function HomePage() {
  const [dbShows, dbTracks] = await Promise.all([getShows(), getMusic()]);
  const shows = dbShows.length ? dbShows : FALLBACK_SHOWS;
  const tracks = dbTracks.length ? dbTracks : FALLBACK_TRACKS;

  return (
    <>
      <Hero />

      <Marquee
        items={[
          { label: "Próximo · Lisboa · Coliseu dos Recreios", dotColor: "var(--c-magenta)" },
          { label: "15 maio", italic: true },
          { label: "Hard Club · Porto", dotColor: "var(--c-amber)" },
          { label: "20 junho", italic: true },
          { label: "Pelourinho · Salvador", dotColor: "var(--c-cyan)" },
          { label: "02 julho", italic: true },
        ]}
      />

      <ShowsList shows={shows} preview />

      <Marquee
        reverse
        inverse
        items={[
          { label: "ouça", italic: true },
          { label: "·" },
          { label: "FOGO INTERIOR" },
          { label: "·" },
          { label: "novo single", italic: true },
          { label: "·" },
          { label: "RUA SEM SAÍDA" },
          { label: "·" },
          { label: "spotify · youtube · tidal", italic: true },
          { label: "·" },
        ]}
      />

      <MusicPlayer tracks={tracks} preview />
    </>
  );
}
