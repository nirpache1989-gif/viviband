import Hero from "@/components/sections/Hero";
import ShowsList from "@/components/sections/ShowsList";
import MusicPlayer from "@/components/sections/MusicPlayer";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";
import type { Show, Music } from "@/types/database";

// Placeholder data until Supabase is wired
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
    date: "2025-12-10T21:00:00Z",
    venue: "Casa da Música",
    city: "Porto",
    country: "Portugal",
    ticket_url: null,
    is_past: true,
    created_at: "",
  },
];

const placeholderTracks: Music[] = [
  {
    id: "1",
    title: "Fogo Interior",
    youtube_url: null,
    cover_url: null,
    release_year: 2025,
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
];

export default function HomePage() {
  const t = useTranslations("common");

  return (
    <>
      <Hero />

      {/* Shows preview */}
      <ShowsList shows={placeholderShows.slice(0, 3)} />
      <div className="flex justify-center pb-8">
        <Button href="/shows" variant="ghost">
          {t("viewAll")} &rarr;
        </Button>
      </div>

      {/* Music preview */}
      <MusicPlayer tracks={placeholderTracks} />
      <div className="flex justify-center pb-16">
        <Button href="/music" variant="ghost">
          {t("viewAll")} &rarr;
        </Button>
      </div>
    </>
  );
}
