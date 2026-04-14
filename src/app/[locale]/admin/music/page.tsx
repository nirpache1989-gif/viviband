"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { Music } from "@/types/database";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function AdminMusicPage() {
  const t = useTranslations("admin");
  const [tracks, setTracks] = useState<Music[]>([]);
  const [editing, setEditing] = useState<Music | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTracks();
  }, []);

  async function fetchTracks() {
    const res = await fetch("/api/admin/music");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setTracks(data);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = {
      id: editing?.id,
      title: (form.elements.namedItem("title") as HTMLInputElement).value,
      youtube_url:
        (form.elements.namedItem("youtube_url") as HTMLInputElement).value ||
        null,
      cover_url:
        (form.elements.namedItem("cover_url") as HTMLInputElement).value ||
        null,
      release_year:
        parseInt(
          (form.elements.namedItem("release_year") as HTMLInputElement).value
        ) || null,
    };

    const method = editing ? "PUT" : "POST";
    await fetch("/api/admin/music", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setEditing(null);
    setIsAdding(false);
    fetchTracks();
  }

  async function handleDelete(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    await fetch("/api/admin/music", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchTracks();
  }

  const showForm = isAdding || editing;

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-display text-4xl text-text-primary">
          {t("music")}
        </h1>
        {!showForm && (
          <Button onClick={() => setIsAdding(true)} size="sm">
            + {t("add")}
          </Button>
        )}
      </div>

      {showForm && (
        <Card hover={false} className="mb-8 p-6">
          <form onSubmit={handleSave} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.trackTitle")}
              </label>
              <input
                name="title"
                required
                defaultValue={editing?.title ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.youtubeUrl")}
              </label>
              <input
                name="youtube_url"
                type="url"
                defaultValue={editing?.youtube_url ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.coverUrl")}
              </label>
              <input
                name="cover_url"
                type="url"
                defaultValue={editing?.cover_url ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.releaseYear")}
              </label>
              <input
                name="release_year"
                type="number"
                min={1900}
                max={2100}
                defaultValue={editing?.release_year ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div className="col-span-full flex gap-3 pt-2">
              <Button type="submit" size="sm">
                {t("save")}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(null);
                  setIsAdding(false);
                }}
              >
                {t("cancel")}
              </Button>
            </div>
          </form>
        </Card>
      )}

      <div className="divide-y divide-border">
        {tracks.length === 0 && (
          <p className="py-8 text-center font-body text-sm text-text-secondary">
            {t("noResults")}
          </p>
        )}
        {tracks.map((track) => (
          <div
            key={track.id}
            className="flex items-center justify-between py-4"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center bg-bg-elevated">
                {track.cover_url ? (
                  <img
                    src={track.cover_url}
                    alt={track.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-display text-xs text-border">VB</span>
                )}
              </div>
              <div>
                <p className="font-display text-lg text-text-primary">
                  {track.title}
                </p>
                {track.release_year && (
                  <p className="font-body text-xs text-text-secondary">
                    {track.release_year}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditing(track)}
              >
                {t("edit")}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(track.id)}
              >
                {t("delete")}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
