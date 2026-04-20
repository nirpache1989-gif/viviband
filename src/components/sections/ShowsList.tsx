"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { Show } from "@/types/database";

interface ShowsListProps {
  shows: Show[];
  /** If true, renders as a homepage preview with a section-head + "view all" CTA. */
  preview?: boolean;
  /** If true, renders with upcoming/past tabs (used on /shows page). */
  withTabs?: boolean;
  className?: string;
}

function formatMonth(date: Date, locale: string) {
  const m = date.toLocaleDateString(locale, { month: "long" });
  return m.toUpperCase();
}

function formatDay(date: Date, locale: string) {
  // Portuguese weekdays are "segunda-feira"; strip the "-feira" suffix.
  const w = date.toLocaleDateString(locale, { weekday: "long" });
  const first = w.split("-")[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function ShowRow({ show, locale }: { show: Show; locale: string }) {
  const date = new Date(show.date);
  const day = date.getDate();
  const month = formatMonth(date, locale);
  const weekday = formatDay(date, locale);
  const past = show.is_past;

  return (
    <article className={`show ${past ? "show--past" : ""}`.trim()} data-reveal>
      <div className="show__date">
        {day}
        <span>{month}</span>
      </div>
      <div className="show__day">{weekday}</div>
      <div className="show__venue">{show.venue}</div>
      <div className="show__city">
        {show.city} · {show.country}
      </div>
      {past ? (
        <span className="show__cta show__cta--past">Encerrado</span>
      ) : show.ticket_url ? (
        <a
          href={show.ticket_url}
          target="_blank"
          rel="noopener noreferrer"
          className="show__cta"
        >
          Bilhetes →
        </a>
      ) : (
        <span className="show__cta show__cta--past">—</span>
      )}
    </article>
  );
}

export default function ShowsList({
  shows,
  preview = false,
  withTabs = false,
  className,
}: ShowsListProps) {
  const t = useTranslations("shows");
  const locale = useLocale();
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const upcoming = shows.filter((s) => !s.is_past);
  const past = shows.filter((s) => s.is_past);

  if (preview) {
    // Homepage preview — 3 shows + header + CTA to full page
    const items = upcoming.slice(0, 3);
    return (
      <section className={className}>
        <div className="container">
          <header className="section-head">
            <h2 className="section-head__title">
              Pró<em>ximos</em>
              <br />
              shows
            </h2>
            <div className="section-head__meta">
              <strong>
                {String(upcoming.length).padStart(2, "0")} {t("meta.datas")}
              </strong>
              {t("meta.confirmed")}
            </div>
          </header>

          <div className="shows__list">
            {items.length ? (
              items.map((s) => <ShowRow key={s.id} show={s} locale={locale} />)
            ) : (
              <p
                style={{
                  padding: "60px 0",
                  textAlign: "center",
                  color: "var(--ink-dim)",
                }}
              >
                {t("noUpcoming")}
              </p>
            )}
          </div>

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a href="/shows" className="hero__cta" style={{ display: "inline-flex" }}>
              {t("viewAll")}
              <span className="hero__cta-arrow">→</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  if (withTabs) {
    const displayed = tab === "upcoming" ? upcoming : past;
    return (
      <section style={{ paddingTop: 0 }} className={className}>
        <div className="container">
          <div className="tabs">
            <button
              className={`tab ${tab === "upcoming" ? "on" : ""}`}
              onClick={() => setTab("upcoming")}
            >
              {t("upcoming")} · {String(upcoming.length).padStart(2, "0")}
            </button>
            <button
              className={`tab ${tab === "past" ? "on" : ""}`}
              onClick={() => setTab("past")}
            >
              {t("past")} · {String(past.length).padStart(2, "0")}
            </button>
          </div>

          <div className="shows__list">
            {displayed.length ? (
              displayed.map((s) => <ShowRow key={s.id} show={s} locale={locale} />)
            ) : (
              <p
                style={{
                  padding: "60px 0",
                  textAlign: "center",
                  color: "var(--ink-dim)",
                }}
              >
                {tab === "upcoming" ? t("noUpcoming") : t("noPast")}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Fallback — bare list
  return (
    <div className={`shows__list ${className ?? ""}`.trim()}>
      {shows.map((s) => (
        <ShowRow key={s.id} show={s} locale={locale} />
      ))}
    </div>
  );
}
