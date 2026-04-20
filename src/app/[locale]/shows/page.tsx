import { getTranslations } from "next-intl/server";
import ShowsList from "@/components/sections/ShowsList";
import BrtClock from "@/components/fx/BrtClock";
import type { Show } from "@/types/database";
import { getShows } from "@/lib/content";

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

export default async function ShowsPage() {
  const t = await getTranslations("shows");
  const dbShows = await getShows();
  const shows = dbShows.length ? dbShows : FALLBACK_SHOWS;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div
            className="hero__meta-top"
            style={{ position: "static", padding: 0, marginBottom: 60 }}
          >
            <span>{t("page.eyebrow")}</span>
            <BrtClock />
          </div>
          <h1 className="page-title">
            Shows
            <br />
            <em>2026</em>
          </h1>
          <p className="page-lede">{t("page.lede")}</p>
        </div>
      </section>

      <ShowsList shows={shows} withTabs />
    </>
  );
}
