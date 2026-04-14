"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Card from "@/components/ui/Card";

interface Stats {
  upcomingShows: number;
  totalTracks: number;
  galleryImages: number;
}

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const [stats, setStats] = useState<Stats>({
    upcomingShows: 0,
    totalTracks: 0,
    galleryImages: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const [showsRes, musicRes, galleryRes] = await Promise.all([
          fetch("/api/admin/shows"),
          fetch("/api/admin/music"),
          fetch("/api/admin/gallery"),
        ]);

        const shows = showsRes.ok ? await showsRes.json() : [];
        const music = musicRes.ok ? await musicRes.json() : [];
        const gallery = galleryRes.ok ? await galleryRes.json() : [];

        setStats({
          upcomingShows: Array.isArray(shows)
            ? shows.filter((s: { is_past: boolean }) => !s.is_past).length
            : 0,
          totalTracks: Array.isArray(music) ? music.length : 0,
          galleryImages: Array.isArray(gallery) ? gallery.length : 0,
        });
      } catch {
        // Stats unavailable — Supabase not configured yet
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const statCards = [
    { label: t("stats.upcomingShows"), value: stats.upcomingShows },
    { label: t("stats.totalTracks"), value: stats.totalTracks },
    { label: t("stats.galleryImages"), value: stats.galleryImages },
  ];

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl text-text-primary">
        {t("stats.title")}
      </h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statCards.map(({ label, value }) => (
          <Card key={label} hover={false} className="p-6">
            <p className="font-body text-xs uppercase tracking-[0.2em] text-text-secondary">
              {label}
            </p>
            <p className="mt-2 font-display text-5xl text-text-primary">
              {loading ? "—" : value}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}
