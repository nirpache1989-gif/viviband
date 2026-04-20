import { getSupabase } from "@/lib/supabase";
import type {
  Show,
  Music,
  GalleryImage,
  BandInfo,
  ContactInfo,
} from "@/types/database";

async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch {
    return fallback;
  }
}

export async function getShows(): Promise<Show[]> {
  return safe(async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("shows")
      .select("*")
      .order("date", { ascending: true });
    if (error || !data) return [];
    return data as Show[];
  }, []);
}

export async function getMusic(): Promise<Music[]> {
  return safe(async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("music")
      .select("*")
      .order("release_year", { ascending: false });
    if (error || !data) return [];
    return data as Music[];
  }, []);
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  return safe(async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });
    if (error || !data) return [];
    return data as GalleryImage[];
  }, []);
}

export async function getBandInfo(): Promise<BandInfo | null> {
  return safe(async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("band_info")
      .select("*")
      .single();
    if (error || !data) return null;
    return data as BandInfo;
  }, null);
}

export async function getContactInfo(): Promise<ContactInfo | null> {
  return safe(async () => {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("contact")
      .select("*")
      .single();
    if (error || !data) return null;
    return data as ContactInfo;
  }, null);
}
