import { useTranslations } from "next-intl";
import MusicPlayer from "@/components/sections/MusicPlayer";
import type { Music } from "@/types/database";

// Placeholder data shown until Supabase is configured and populated
const placeholderTracks: Music[] = [
  { id: "1", title: "Fogo Interior", youtube_url: null, cover_url: null, release_year: 2026, created_at: "" },
  { id: "2", title: "Rua Sem Sa\u00edda", youtube_url: null, cover_url: null, release_year: 2024, created_at: "" },
  { id: "3", title: "Ians\u00e3 na Chuva", youtube_url: null, cover_url: null, release_year: 2024, created_at: "" },
  { id: "4", title: "Festa de Yemanj\u00e1", youtube_url: null, cover_url: null, release_year: 2023, created_at: "" },
  { id: "5", title: "Carnaval de Rua", youtube_url: null, cover_url: null, release_year: 2022, created_at: "" },
  { id: "6", title: "Pelourinho \u00e0 Meia-Noite", youtube_url: null, cover_url: null, release_year: 2021, created_at: "" },
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
    meta: "EP \u00b7 5 faixas",
    gradient: "linear-gradient(135deg, var(--c-magenta), var(--c-violet))",
  },
  {
    id: "a2",
    title: "Festa de Yemanj\u00e1",
    year: 2023,
    meta: "EP \u00b7 4 faixas",
    gradient: "linear-gradient(135deg, var(--c-amber), var(--c-vermillion))",
  },
  {
    id: "a3",
    title: "Bahia de Todos os Santos",
    year: 2020,
    meta: "EP \u00b7 5 faixas",
    gradient: "linear-gradient(135deg, var(--c-cyan), var(--c-jade))",
  },
];

export default function MusicPage() {
  const t = useTranslations("music");

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
            M\u00fa<em>sica</em>
          </h1>
          <p className="page-lede">{t("page.lede")}</p>
        </div>
      </section>

      <MusicPlayer tracks={placeholderTracks} full />

      <section>
        <div className="container">
          <header className="section-head">
            <h2 className="section-head__title">
              Lan\u00e7a<em>mentos</em>
            </h2>
            <div className="section-head__meta">
              <strong>03 EPs</strong>
              2018 \u2014 2026
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
