"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import ShowsList from "@/components/sections/ShowsList";
import type { Show } from "@/types/database";

// Placeholder data shown until Supabase is configured and populated
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
  {
    id: "4",
    date: "2026-07-14T21:00:00Z",
    venue: "Casa de Cultura",
    city: "Recife",
    country: "Brasil",
    ticket_url: "#",
    is_past: false,
    created_at: "",
  },
  {
    id: "5",
    date: "2026-08-22T22:00:00Z",
    venue: "Circo Voador",
    city: "Rio de Janeiro",
    country: "Brasil",
    ticket_url: "#",
    is_past: false,
    created_at: "",
  },
  {
    id: "6",
    date: "2026-09-10T21:00:00Z",
    venue: "Sesc Pompeia",
    city: "S\u00e3o Paulo",
    country: "Brasil",
    ticket_url: "#",
    is_past: false,
    created_at: "",
  },
  {
    id: "7",
    date: "2025-12-10T21:00:00Z",
    venue: "Casa da M\u00fasica",
    city: "Porto",
    country: "Portugal",
    ticket_url: null,
    is_past: true,
    created_at: "",
  },
  {
    id: "8",
    date: "2025-11-22T22:00:00Z",
    venue: "Vibe Bar",
    city: "Salvador",
    country: "Brasil",
    ticket_url: null,
    is_past: true,
    created_at: "",
  },
];

export default function ShowsPage() {
  const t = useTranslations("shows");
  const [clock, setClock] = useState("\u2014:\u2014 BRT");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
      const brt = new Date(utcMs - 3 * 60 * 60 * 1000);
      const hh = String(brt.getHours()).padStart(2, "0");
      const mm = String(brt.getMinutes()).padStart(2, "0");
      setClock(`${hh}:${mm} BRT`);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div
            className="hero__meta-top"
            style={{ position: "static", padding: 0, marginBottom: 60 }}
          >
            <span>{t("page.eyebrow")}</span>
            <span>{clock}</span>
          </div>
          <h1 className="page-title">
            Shows
            <br />
            <em>2026</em>
          </h1>
          <p className="page-lede">{t("page.lede")}</p>
        </div>
      </section>

      <ShowsList shows={placeholderShows} withTabs />
    </>
  );
}
