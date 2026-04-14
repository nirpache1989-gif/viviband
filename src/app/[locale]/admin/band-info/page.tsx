"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { BandInfo } from "@/types/database";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function AdminBandInfoPage() {
  const t = useTranslations("admin");
  const [info, setInfo] = useState<BandInfo | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchInfo();
  }, []);

  async function fetchInfo() {
    const res = await fetch("/api/admin/band-info");
    if (res.ok) {
      const data = await res.json();
      if (data && !data.error) setInfo(data);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!info) return;

    setSaving(true);
    setSaved(false);

    const form = e.currentTarget;
    const body = {
      id: info.id,
      name: (form.elements.namedItem("name") as HTMLInputElement).value,
      bio_pt: (form.elements.namedItem("bio_pt") as HTMLTextAreaElement).value,
      bio_en: (form.elements.namedItem("bio_en") as HTMLTextAreaElement).value,
      logo_url:
        (form.elements.namedItem("logo_url") as HTMLInputElement).value || null,
      instagram:
        (form.elements.namedItem("instagram") as HTMLInputElement).value || null,
      youtube:
        (form.elements.namedItem("youtube") as HTMLInputElement).value || null,
      facebook:
        (form.elements.namedItem("facebook") as HTMLInputElement).value || null,
    };

    await fetch("/api/admin/band-info", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (!info) {
    return (
      <p className="py-8 font-body text-sm text-text-secondary">
        {t("noResults")}
      </p>
    );
  }

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl text-text-primary">
        {t("bandInfo")}
      </h1>

      <Card hover={false} className="p-6">
        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.bandName")}
              </label>
              <input
                name="name"
                defaultValue={info.name}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.logoUrl")}
              </label>
              <input
                name="logo_url"
                type="url"
                defaultValue={info.logo_url ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
              {t("fields.bio")} (PT)
            </label>
            <textarea
              name="bio_pt"
              rows={4}
              defaultValue={info.bio_pt ?? ""}
              className="w-full resize-none border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>

          <div>
            <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
              {t("fields.bio")} (EN)
            </label>
            <textarea
              name="bio_en"
              rows={4}
              defaultValue={info.bio_en ?? ""}
              className="w-full resize-none border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.instagram")}
              </label>
              <input
                name="instagram"
                defaultValue={info.instagram ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.youtube")}
              </label>
              <input
                name="youtube"
                defaultValue={info.youtube ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
            <div>
              <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                {t("fields.facebook")}
              </label>
              <input
                name="facebook"
                defaultValue={info.facebook ?? ""}
                className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? "..." : t("save")}
            </Button>
            {saved && (
              <span className="font-body text-xs text-accent">Saved!</span>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
}
