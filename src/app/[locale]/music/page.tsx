import MusicPlayer from "@/components/sections/MusicPlayer";
import type { Music } from "@/types/database";

// Placeholder data until Supabase is wired
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
  {
    id: "3",
    title: "Pedra & Sal",
    youtube_url: null,
    cover_url: null,
    release_year: 2024,
    created_at: "",
  },
  {
    id: "4",
    title: "Último Grito",
    youtube_url: null,
    cover_url: null,
    release_year: 2023,
    created_at: "",
  },
];

export default function MusicPage() {
  return (
    <div className="pt-24">
      <MusicPlayer tracks={placeholderTracks} />
    </div>
  );
}
