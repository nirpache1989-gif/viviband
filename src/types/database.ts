export interface BandInfo {
  id: string;
  name: string;
  bio_pt: string | null;
  bio_en: string | null;
  logo_url: string | null;
  instagram: string | null;
  youtube: string | null;
  facebook: string | null;
  site_palette: "neon" | "vinyl" | "tropical" | "dusk" | null;
  site_display_font: "bricolage" | "bebas" | "anton" | "archivo" | null;
  site_grain: number | null;
}

export interface Show {
  id: string;
  date: string;
  venue: string;
  city: string;
  country: string;
  ticket_url: string | null;
  is_past: boolean;
  created_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  caption_pt: string | null;
  caption_en: string | null;
  created_at: string;
}

export interface Music {
  id: string;
  title: string;
  youtube_url: string | null;
  cover_url: string | null;
  release_year: number | null;
  created_at: string;
}

export interface ContactInfo {
  id: string;
  email: string | null;
  phone: string | null;
}
