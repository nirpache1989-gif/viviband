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

export type PaletteName = "neon" | "vinyl" | "tropical" | "dusk";
export type DisplayFont = "bricolage" | "bebas" | "anton" | "archivo";

export interface SiteSettings {
  id?: string;
  palette: PaletteName;
  displayFont: DisplayFont;
  grain: number;
}

export const PALETTES: Record<PaletteName, Record<string, string>> = {
  neon: {
    "--bg-deep": "#140414",
    "--bg-mid": "#1f0a22",
    "--bg-elev": "#2a0e2e",
    "--ink": "#f6ecd9",
    "--c-magenta": "#ff1f6b",
    "--c-cyan": "#00f5d4",
    "--c-violet": "#9d4edd",
    "--c-vermillion": "#e63946",
    "--c-amber": "#ffb627",
    "--c-jade": "#06a77d",
  },
  vinyl: {
    "--bg-deep": "#1a1410",
    "--bg-mid": "#241c17",
    "--bg-elev": "#2e251f",
    "--ink": "#f5e6d3",
    "--c-magenta": "#C1272D",
    "--c-cyan": "#0A6E5C",
    "--c-violet": "#5b3a52",
    "--c-vermillion": "#C1272D",
    "--c-amber": "#F2A900",
    "--c-jade": "#0A6E5C",
  },
  tropical: {
    "--bg-deep": "#0F2419",
    "--bg-mid": "#143025",
    "--bg-elev": "#1a3d2f",
    "--ink": "#f5e6d3",
    "--c-magenta": "#E63946",
    "--c-cyan": "#06A77D",
    "--c-violet": "#264653",
    "--c-vermillion": "#E63946",
    "--c-amber": "#FFB627",
    "--c-jade": "#06A77D",
  },
  dusk: {
    "--bg-deep": "#1a0a1f",
    "--bg-mid": "#231029",
    "--bg-elev": "#2e1735",
    "--ink": "#fff4e6",
    "--c-magenta": "#ff006e",
    "--c-cyan": "#3a86ff",
    "--c-violet": "#8338ec",
    "--c-vermillion": "#fb5607",
    "--c-amber": "#ffbe0b",
    "--c-jade": "#06d6a0",
  },
};

const FONTS: Record<DisplayFont, { url: string; family: string }> = {
  bricolage: {
    url: "https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,800&display=swap",
    family: "'Bricolage Grotesque', system-ui, sans-serif",
  },
  bebas: {
    url: "https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap",
    family: "'Bebas Neue', sans-serif",
  },
  anton: {
    url: "https://fonts.googleapis.com/css2?family=Anton&display=swap",
    family: "'Anton', sans-serif",
  },
  archivo: {
    url: "https://fonts.googleapis.com/css2?family=Archivo+Black&display=swap",
    family: "'Archivo Black', sans-serif",
  },
};

const PALETTE_SWATCH: Record<PaletteName, string> = {
  neon: "linear-gradient(135deg, #ff1f6b, #00f5d4, #9d4edd)",
  vinyl: "linear-gradient(135deg, #C1272D, #F2A900, #0A6E5C)",
  tropical: "linear-gradient(135deg, #E63946, #FFB627, #06A77D)",
  dusk: "linear-gradient(135deg, #ff006e, #fb5607, #ffbe0b)",
};

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
