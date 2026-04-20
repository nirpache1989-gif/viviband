"use client";

/**
 * Gallery grid + lightbox. Masonry of 9 asymmetric tiles (a-i) from prototype.
 * If images from Supabase exist, they fill the slots; otherwise shows labeled
 * gradient placeholders matching the prototype.
 */

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";
import type { GalleryImage } from "@/types/database";

const TILE_CLASSES = [
  "tile--a",
  "tile--b",
  "tile--c",
  "tile--d",
  "tile--e",
  "tile--f",
  "tile--g",
  "tile--h",
  "tile--i",
];

const FALLBACK_GRADIENTS = [
  "linear-gradient(135deg, var(--c-magenta), var(--c-violet))",
  "linear-gradient(135deg, var(--c-amber), var(--c-vermillion))",
  "linear-gradient(135deg, var(--c-cyan), var(--c-jade))",
  "linear-gradient(135deg, var(--c-vermillion), var(--bg-mid))",
  "linear-gradient(135deg, var(--c-violet), var(--c-magenta))",
  "linear-gradient(135deg, var(--c-jade), var(--c-cyan))",
  "linear-gradient(135deg, var(--c-amber), var(--c-magenta))",
  "linear-gradient(135deg, var(--c-vermillion), var(--c-violet))",
  "linear-gradient(135deg, var(--c-cyan), var(--c-magenta))",
];

const FALLBACK_CAPTIONS = [
  "// foto principal",
  "// percuss\u00e3o",
  "// p\u00fablico",
  "// vocal",
  "// bastidores",
  "// rua",
  "// cavaquinho",
  "// retrato",
  "// final do show",
];

interface Slot {
  id: string;
  gradient?: string;
  imageUrl?: string;
  caption: string;
}

interface GalleryProps {
  images?: GalleryImage[];
  className?: string;
}

export default function Gallery({ images, className }: GalleryProps) {
  const locale = useLocale();
  const [open, setOpen] = useState<Slot | null>(null);

  const slots: Slot[] = TILE_CLASSES.map((_, i) => {
    const img = images?.[i];
    if (img) {
      const caption = (locale === "pt" ? img.caption_pt : img.caption_en) ?? FALLBACK_CAPTIONS[i];
      return { id: img.id, imageUrl: img.image_url, caption };
    }
    return {
      id: `fb-${i}`,
      gradient: FALLBACK_GRADIENTS[i],
      caption: FALLBACK_CAPTIONS[i],
    };
  });

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <section style={{ paddingTop: 0 }} className={className}>
      <div className="container">
        <div className="gallery__grid">
          {slots.map((slot, i) => (
            <div
              key={slot.id}
              className={`tile ${TILE_CLASSES[i]}`}
              style={
                slot.imageUrl
                  ? undefined
                  : { background: slot.gradient }
              }
              onClick={() => setOpen(slot)}
              role="button"
              tabIndex={0}
              aria-label={slot.caption}
            >
              {slot.imageUrl && (
                <div
                  className="tile__art"
                  style={{ backgroundImage: `url(${slot.imageUrl})` }}
                />
              )}
              <div className="tile__caption">{slot.caption}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={`lightbox ${open ? "open" : ""}`.trim()}
        onClick={(e) => {
          if (e.target === e.currentTarget) setOpen(null);
        }}
      >
        <button
          className="lightbox__close"
          onClick={() => setOpen(null)}
          aria-label="Fechar"
        >
          ×
        </button>
        <div
          className="lightbox__inner"
          style={
            open?.imageUrl
              ? { backgroundImage: `url(${open.imageUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
              : open
                ? { background: open.gradient }
                : undefined
          }
        />
        {open && <div className="lightbox__caption">{open.caption}</div>}
      </div>
    </section>
  );
}
