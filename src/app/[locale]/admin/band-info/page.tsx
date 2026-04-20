"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import type { BandInfo } from "@/types/database";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import AdminStatus, {
  type AdminStatusState,
} from "@/components/admin/AdminStatus";
import {
  PALETTES,
  PALETTE_SWATCH,
  FONT_LABELS,
  type PaletteName,
  type DisplayFont,
} from "@/lib/siteTheme";

const PALETTE_NAMES = Object.keys(PALETTES) as PaletteName[];
const FONT_NAMES = Object.keys(FONT_LABELS) as DisplayFont[];

const EMPTY_INFO: BandInfo = {
  id: "",
  name: "Cores do Samba",
  bio_pt: null,
  bio_en: null,
  logo_url: null,
  instagram: null,
  youtube: null,
  facebook: null,
  site_palette: "neon",
  site_display_font: "bricolage",
  site_grain: 7,
};

export default function AdminBandInfoPage() {
  const t = useTranslations("admin");
  const [info, setInfo] = useState<BandInfo>(EMPTY_INFO);
  const [loaded, setLoaded] = useState(false);
  const [status, setStatus] = useState<AdminStatusState>("idle");

  const [palette, setPalette] = useState<PaletteName>("neon");
  const [font, setFont] = useState<DisplayFont>("bricolage");
  const [grain, setGrain] = useState<number>(7);

  useEffect(() => {
    fetchInfo();
  }, []);

  async function fetchInfo() {
    try {
      const res = await fetch("/api/admin/band-info");
      if (res.ok) {
        const data = await res.json();
        if (data && !data.error) {
          setInfo(data);
          setPalette((data.site_palette as PaletteName) ?? "neon");
          setFont((data.site_display_font as DisplayFont) ?? "bricolage");
          setGrain(typeof data.site_grain === "number" ? data.site_grain : 7);
        }
      }
    } finally {
      setLoaded(true);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

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
      site_palette: palette,
      site_display_font: font,
      site_grain: grain,
    };

    setStatus("saving");
    try {
      const res = await fetch("/api/admin/band-info", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      window.setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("error");
    }
  }

  if (!loaded) {
    return (
      <p className="py-8 font-body text-sm text-text-secondary">…</p>
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
              <p className="mt-1 font-body text-[11px] text-text-secondary/70">
                {t("help.logoUrl")}
              </p>
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
              <p className="mt-1 font-body text-[11px] text-text-secondary/70">
                {t("help.instagram")}
              </p>
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

          {/* Theme section */}
          <div className="mt-4 border-t border-border pt-6">
            <h2 className="mb-1 font-display text-xl text-text-primary">
              {t("theme.title")}
            </h2>
            <p className="mb-5 font-body text-[11px] text-text-secondary/70">
              {t("theme.liveEditHint")}
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {/* Palette */}
              <div>
                <label className="mb-2 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                  {t("theme.palette")}
                </label>
                <div className="flex flex-wrap gap-2">
                  {PALETTE_NAMES.map((name) => (
                    <button
                      type="button"
                      key={name}
                      onClick={() => setPalette(name)}
                      title={name}
                      aria-label={`Palette ${name}`}
                      aria-pressed={palette === name}
                      className={`h-9 w-9 rounded-full border-2 transition-all ${
                        palette === name
                          ? "border-accent ring-2 ring-accent/40"
                          : "border-border hover:border-text-secondary"
                      }`}
                      style={{ background: PALETTE_SWATCH[name] }}
                    />
                  ))}
                </div>
              </div>

              {/* Font */}
              <div>
                <label className="mb-2 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                  {t("theme.font")}
                </label>
                <select
                  value={font}
                  onChange={(e) => setFont(e.target.value as DisplayFont)}
                  className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
                >
                  {FONT_NAMES.map((name) => (
                    <option key={name} value={name}>
                      {FONT_LABELS[name]}
                    </option>
                  ))}
                </select>
              </div>

              {/* Grain */}
              <div>
                <label className="mb-2 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
                  {t("theme.grain")} · {grain}
                </label>
                <input
                  type="range"
                  min={0}
                  max={20}
                  step={1}
                  value={grain}
                  onChange={(e) => setGrain(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" size="sm" disabled={status === "saving"}>
              {status === "saving" ? "..." : t("save")}
            </Button>
            <AdminStatus state={status} />
          </div>
        </form>
      </Card>
    </div>
  );
}
