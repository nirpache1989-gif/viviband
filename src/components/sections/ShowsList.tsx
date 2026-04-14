"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Show } from "@/types/database";
import Button from "@/components/ui/Button";

interface ShowsListProps {
  shows: Show[];
  className?: string;
}

export default function ShowsList({ shows, className }: ShowsListProps) {
  const t = useTranslations("shows");
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const upcoming = shows.filter((s) => !s.is_past);
  const past = shows.filter((s) => s.is_past);
  const displayed = tab === "upcoming" ? upcoming : past;

  return (
    <section data-animate="shows" className={className}>
      <div className="mx-auto max-w-content px-6 py-[var(--section-padding)]">
        {/* Section header */}
        <div className="mb-12 flex items-end justify-between">
          <h2 className="font-display text-5xl md:text-7xl">{t("title")}</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setTab("upcoming")}
              className={`font-body text-xs uppercase tracking-[0.2em] transition-colors ${
                tab === "upcoming" ? "text-accent" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t("upcoming")}
            </button>
            <span className="text-border">/</span>
            <button
              onClick={() => setTab("past")}
              className={`font-body text-xs uppercase tracking-[0.2em] transition-colors ${
                tab === "past" ? "text-accent" : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {t("past")}
            </button>
          </div>
        </div>

        {/* Shows list */}
        {displayed.length === 0 ? (
          <p className="py-16 text-center font-body text-sm text-text-secondary">
            {tab === "upcoming" ? t("noUpcoming") : t("noPast")}
          </p>
        ) : (
          <div className="divide-y divide-border">
            {displayed.map((show) => {
              const date = new Date(show.date);
              const month = date
                .toLocaleDateString("en", { month: "short" })
                .toUpperCase();
              const day = date.getDate();

              return (
                <div
                  key={show.id}
                  className="group flex flex-col gap-4 py-6 transition-colors hover:bg-bg-secondary/50 md:flex-row md:items-center md:px-4"
                >
                  {/* Date */}
                  <div className="flex items-baseline gap-2 md:w-28 md:flex-col md:items-center md:gap-0">
                    <span className="font-display text-3xl text-text-primary md:text-4xl">
                      {day}
                    </span>
                    <span className="font-body text-xs uppercase tracking-[0.2em] text-accent">
                      {month}
                    </span>
                  </div>

                  {/* Venue & City */}
                  <div className="flex-1">
                    <p className="font-display text-xl text-text-primary">
                      {show.venue}
                    </p>
                    <p className="font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                      {show.city}, {show.country}
                    </p>
                  </div>

                  {/* Ticket button */}
                  {!show.is_past && show.ticket_url && (
                    <a
                      href={show.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="secondary" size="sm">
                        {t("getTickets")}
                      </Button>
                    </a>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
