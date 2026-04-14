import Gallery from "@/components/sections/Gallery";
import type { GalleryImage } from "@/types/database";

// Placeholder data until Supabase is wired
const placeholderImages: GalleryImage[] = [
  {
    id: "1",
    image_url: "",
    caption_pt: "Ao vivo no Coliseu",
    caption_en: "Live at Coliseu",
    created_at: "",
  },
  {
    id: "2",
    image_url: "",
    caption_pt: "Bastidores",
    caption_en: "Backstage",
    created_at: "",
  },
  {
    id: "3",
    image_url: "",
    caption_pt: "Ensaio",
    caption_en: "Rehearsal",
    created_at: "",
  },
  {
    id: "4",
    image_url: "",
    caption_pt: null,
    caption_en: null,
    created_at: "",
  },
  {
    id: "5",
    image_url: "",
    caption_pt: "Festival de Verão",
    caption_en: "Summer Festival",
    created_at: "",
  },
  {
    id: "6",
    image_url: "",
    caption_pt: null,
    caption_en: null,
    created_at: "",
  },
];

export default function GalleryPage() {
  return (
    <div className="pt-24">
      <Gallery images={placeholderImages} />
    </div>
  );
}
