import { getSupabase } from "@/lib/supabase";
import type { SiteSettings } from "@/components/fx/TweaksPanel";
import { PALETTES } from "@/components/fx/TweaksPanel";

const DEFAULT_SETTINGS: SiteSettings = {
  palette: "neon",
  displayFont: "bricolage",
  grain: 7,
};

/**
 * Fetch the active site settings from band_info.
 * Returns defaults if Supabase is not configured or the row doesn't exist yet.
 * Called from the root layout (server component) for SSR-injected CSS vars.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("band_info")
      .select("id, site_palette, site_display_font, site_grain")
      .single();

    if (error || !data) return DEFAULT_SETTINGS;

    return {
      id: data.id,
      palette: (data.site_palette as SiteSettings["palette"]) ?? DEFAULT_SETTINGS.palette,
      displayFont:
        (data.site_display_font as SiteSettings["displayFont"]) ??
        DEFAULT_SETTINGS.displayFont,
      grain: typeof data.site_grain === "number" ? data.site_grain : DEFAULT_SETTINGS.grain,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/**
 * Build a <style> string injecting the palette + grain as :root CSS vars,
 * so visitors see the correct look before any JS runs.
 */
export function renderSettingsStyle(settings: SiteSettings): string {
  const palette = PALETTES[settings.palette] ?? PALETTES.neon;
  const vars = Object.entries(palette)
    .map(([k, v]) => `${k}:${v};`)
    .join("");
  return `:root{${vars}--grain-opacity:${settings.grain / 100};}`;
}
