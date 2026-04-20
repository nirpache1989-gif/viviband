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

export const FONTS: Record<DisplayFont, { url: string; family: string }> = {
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

export const PALETTE_SWATCH: Record<PaletteName, string> = {
  neon: "linear-gradient(135deg, #ff1f6b, #00f5d4, #9d4edd)",
  vinyl: "linear-gradient(135deg, #C1272D, #F2A900, #0A6E5C)",
  tropical: "linear-gradient(135deg, #E63946, #FFB627, #06A77D)",
  dusk: "linear-gradient(135deg, #ff006e, #fb5607, #ffbe0b)",
};

export const FONT_LABELS: Record<DisplayFont, string> = {
  bricolage: "Bricolage Grotesque",
  bebas: "Bebas Neue",
  anton: "Anton",
  archivo: "Archivo Black",
};
