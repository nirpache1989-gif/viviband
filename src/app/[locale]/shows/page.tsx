import ShowsList from "@/components/sections/ShowsList";
import type { Show } from "@/types/database";

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
    date: "2026-08-01T20:00:00Z",
    venue: "NOS Alive",
    city: "Oeiras",
    country: "Portugal",
    ticket_url: "#",
    is_past: false,
    created_at: "",
  },
  {
    id: "4",
    date: "2025-12-10T21:00:00Z",
    venue: "Casa da Música",
    city: "Porto",
    country: "Portugal",
    ticket_url: null,
    is_past: true,
    created_at: "",
  },
  {
    id: "5",
    date: "2025-09-05T22:00:00Z",
    venue: "Lux Frágil",
    city: "Lisboa",
    country: "Portugal",
    ticket_url: null,
    is_past: true,
    created_at: "",
  },
];

export default function ShowsPage() {
  return (
    <div className="pt-24">
      <ShowsList shows={placeholderShows} />
    </div>
  );
}
