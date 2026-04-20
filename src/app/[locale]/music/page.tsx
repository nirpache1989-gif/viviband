import { getTranslations } from "next-intl/server";
import MusicPlayer from "@/components/sections/MusicPlayer";
import type { Music } from "@/types/database";
import { getMusic } from "@/lib/content";

const FALLBACK_TRACKS: Music[] = [
  { id: "1", title: "Fogo Interior", youtube_url: null, cover_url: null, release_year: 2026, created_at: "" },
  { id: "2", title: "Rua Sem Saída", youtube_url: null, cover_url: null, release_year: 2024, created_at: "" },
  { id: "3", title: "Iansã na Chuva", youtube_url: null, cover_url: null, release_year: 2024, created_at: "" },
  { id: "4", title: "Festa de Yemanjá", youtube_url: null, cover_url: null, release_year: 2023, created_at: "" },
  { id: "5", title: "Carnaval de Rua", youtube_url: null, cover_url: null, release_year: 2022, created_at: "" },
  { id: "6", title: "Pelourinho à Meia-Noite", youtube_url: null, cover_url: null, release_year: 2021, created_at: "" },
  { id: "7", title: "Ladeira do Carmo", youtube_url: null, cover_url: null, release_year: 2021, created_at: "" },
  { id: "8", title: "Bahia de Todos os Santos", youtube_url: null, cover_url: null, release_year: 2020, created_at: "" },
  { id: "9", title: "Tambor do Pai", youtube_url: null, cover_url: null, release_year: 2020, created_at: "" },
  { id: "10", title: "Beira-Mar", youtube_url: null, cover_url: null, release_year: 2019, created_at: "" },
];

const albums = [
  {
    id: "a1",
    title: "Fogo Interior",
    year: 2026,
    meta: "EP · 5 faixas",
    gradient: "linear-gradient(135deg, var(--c-magenta), var(--c-violet))",
  },
  {
    id: "a2",
    title: "Festa de Yemanjá",
    year: 2023,
    meta: "EP · 4 faixas",
    gradient: "linear-gradient(135deg, var(--c-amber), var(--c-vermillion))",
  },
  {
    id: "a3",
    title: "Bahia de Todos os Santos",
    year: 2020,
    meta: "EP · 5 faixas",
    gradient: "linear-gradient(135deg, var(--c-cyan), var(--c-jade))",
  },
];

export default async function MusicPage() {
  const t = await getTranslations("music");
  const dbTracks = await getMusic();
  const tracks = dbTracks.length ? dbTracks : FALLBACK_TRACKS;

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div
            className="hero__meta-top"
            style={{ position: "static", padding: 0, marginBottom: 60 }}
          >
            <span>{t("page.eyebrow")}</span>
            <span>{t("page.meta")}</span>
          </div>
          <h1 className="page-title">
            Mú<em>sica</em>
          </h1>
          <p className="page-lede">{t("page.lede")}</p>
        </div>
      </section>

      <MusicPlayer tracks={tracks} full />

      <section>
        <div className="container">
          <header className="section-head">
            <h2 className="section-head__title">
              Lança<em>mentos</em>
            </h2>
            <div className="section-head__meta">
              <strong>03 EPs</strong>
              2018 — 2026
            </div>
          </header>

          <div className="album-grid">
            {albums.map((a) => (
              <article key={a.id} className="album">
                <div
                  className="album__cover"
                  style={{ background: a.gradient }}
                >
                  <span className="album__year">{a.year}</span>
                </div>
                <div className="album__title">{a.title}</div>
                <div className="album__meta">{a.meta}</div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
