"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import type { GalleryImage } from "@/types/database";
import Modal from "@/components/ui/Modal";

interface GalleryProps {
  images: GalleryImage[];
  className?: string;
}

export default function Gallery({ images, className }: GalleryProps) {
  const t = useTranslations("gallery");
  const locale = useLocale();
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  function getCaption(image: GalleryImage): string | null {
    return locale === "pt" ? image.caption_pt : image.caption_en;
  }

  return (
    <section data-animate="gallery" className={className}>
      <div className="mx-auto max-w-content px-6 py-[var(--section-padding)]">
        <h2 className="mb-12 font-display text-5xl md:text-7xl">
          {t("title")}
        </h2>

        {/* Masonry grid */}
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setSelectedImage(image)}
              className="group mb-4 block w-full overflow-hidden break-inside-avoid border border-border transition-colors hover:border-accent/30"
            >
              <div
                className={`relative w-full bg-bg-elevated ${
                  index % 3 === 0
                    ? "aspect-[3/4]"
                    : index % 3 === 1
                      ? "aspect-square"
                      : "aspect-[4/3]"
                }`}
              >
                <img
                  src={image.image_url}
                  alt={getCaption(image) ?? ""}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              {getCaption(image) && (
                <div className="bg-bg-secondary p-3">
                  <p className="text-left font-body text-xs text-text-secondary">
                    {getCaption(image)}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <Modal
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
      >
        {selectedImage && (
          <div className="flex flex-col items-center gap-4">
            <img
              src={selectedImage.image_url}
              alt={getCaption(selectedImage) ?? ""}
              className="max-h-[80vh] max-w-[85vw] object-contain"
            />
            {getCaption(selectedImage) && (
              <p className="font-body text-sm text-text-secondary">
                {getCaption(selectedImage)}
              </p>
            )}
          </div>
        )}
      </Modal>
    </section>
  );
}
