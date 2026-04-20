"use client";

/**
 * Admin-only live-edit panel for site palette / display font / grain.
 * Updates CSS vars instantly + debounced PUT to /api/admin/band-info
 * so visitors also see the changes once persisted.
 *
 * Ports assets/app.js:270-378 (PALETTE_VARS, applyPalette, applyFont, applyGrain)
 * minus the postMessage host-edit-mode protocol (production doesn't need it).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import {
  PALETTES,
  FONTS,
  PALETTE_SWATCH,
  type PaletteName,
  type DisplayFont,
  type SiteSettings,
} from "@/lib/siteTheme";

type SaveStatus = "idle" | "saving" | "saved" | "error";

interface Props {
  initial: SiteSettings;
  onPaletteChange?: (name: PaletteName) => void;
}

export default function TweaksPanel({ initial, onPaletteChange }: Props) {
  const [palette, setPalette] = useState<PaletteName>(initial.palette);
  const [font, setFont] = useState<DisplayFont>(initial.displayFont);
  const [grain, setGrain] = useState<number>(initial.grain);
  const [status, setStatus] = useState<SaveStatus>("idle");
  const saveTimerRef = useRef<number | null>(null);

  // Apply palette CSS vars
  const applyPalette = useCallback(
    (name: PaletteName) => {
      const vars = PALETTES[name];
      if (!vars) return;
      Object.entries(vars).forEach(([k, v]) =>
        document.documentElement.style.setProperty(k, v)
      );
      onPaletteChange?.(name);
    },
    [onPaletteChange]
  );

  // Apply font via dynamic Google Fonts link
  const applyFont = useCallback((name: DisplayFont) => {
    const f = FONTS[name];
    if (!f) return;
    let link = document.getElementById("font-link-extra") as HTMLLinkElement | null;
    if (!link) {
      link = document.createElement("link");
      link.id = "font-link-extra";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
    link.href = f.url;
    document.documentElement.style.setProperty("--font-display", f.family);
  }, []);

  // Apply grain opacity
  const applyGrain = useCallback((v: number) => {
    document.documentElement.style.setProperty(
      "--grain-opacity",
      String(v / 100)
    );
  }, []);

  // On mount: apply initial values (already SSR-injected, but re-apply for consistency)
  useEffect(() => {
    applyPalette(initial.palette);
    applyFont(initial.displayFont);
    applyGrain(initial.grain);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced save to server
  const scheduleSave = useCallback(
    (next: Partial<SiteSettings>) => {
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      setStatus("saving");
      saveTimerRef.current = window.setTimeout(async () => {
        try {
          const payload = {
            id: initial.id,
            site_palette: next.palette ?? palette,
            site_display_font: next.displayFont ?? font,
            site_grain: next.grain ?? grain,
          };
          const res = await fetch("/api/admin/band-info", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error();
          setStatus("saved");
          window.setTimeout(() => setStatus("idle"), 1500);
        } catch {
          setStatus("error");
        }
      }, 600);
    },
    [initial.id, palette, font, grain]
  );

  const onPalettePick = (name: PaletteName) => {
    setPalette(name);
    applyPalette(name);
    scheduleSave({ palette: name });
  };

  const onFontPick = (name: DisplayFont) => {
    setFont(name);
    applyFont(name);
    scheduleSave({ displayFont: name });
  };

  const onGrainChange = (v: number) => {
    setGrain(v);
    applyGrain(v);
    scheduleSave({ grain: v });
  };

  return (
    <div className="tweaks" role="complementary" aria-label="Admin site tweaks">
      <div className="tweaks__title">
        <span>Tweaks</span>
        {status === "saving" && (
          <span className="tweaks__status tweaks__status--saving">Saving…</span>
        )}
        {status === "saved" && (
          <span className="tweaks__status tweaks__status--saved">Saved</span>
        )}
        {status === "error" && (
          <span className="tweaks__status" style={{ color: "var(--c-vermillion)" }}>
            Error
          </span>
        )}
      </div>

      <div className="tweaks__row">
        <div className="tweaks__label">Palette</div>
        <div className="tweaks__palette" id="tw-palette">
          {(Object.keys(PALETTES) as PaletteName[]).map((name) => (
            <button
              key={name}
              className={palette === name ? "on" : ""}
              style={{ background: PALETTE_SWATCH[name] }}
              title={name}
              onClick={() => onPalettePick(name)}
              aria-label={`Palette ${name}`}
            />
          ))}
        </div>
      </div>

      <div className="tweaks__row">
        <div className="tweaks__label">Display font</div>
        <div className="tweaks__fonts">
          <select
            id="tw-font"
            value={font}
            onChange={(e) => onFontPick(e.target.value as DisplayFont)}
          >
            <option value="bricolage">Bricolage Grotesque</option>
            <option value="bebas">Bebas Neue</option>
            <option value="anton">Anton</option>
            <option value="archivo">Archivo Black</option>
          </select>
        </div>
      </div>

      <div className="tweaks__row">
        <div className="tweaks__label">Grain intensity · {grain}</div>
        <input
          type="range"
          id="tw-grain"
          min={0}
          max={20}
          value={grain}
          step={1}
          style={{ width: "100%" }}
          onChange={(e) => onGrainChange(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
