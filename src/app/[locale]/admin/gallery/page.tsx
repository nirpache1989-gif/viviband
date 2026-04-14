"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import type { GalleryImage } from "@/types/database";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";

export default function AdminGalleryPage() {
  const t = useTranslations("admin");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  async function fetchImages() {
    const res = await fetch("/api/admin/gallery");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setImages(data);
    }
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setUploading(true);

    const form = e.currentTarget;
    const formData = new FormData();
    const file = (form.elements.namedItem("file") as HTMLInputElement)
      .files?.[0];
    if (!file) return;

    formData.append("file", file);
    formData.append(
      "caption_pt",
      (form.elements.namedItem("caption_pt") as HTMLInputElement).value
    );
    formData.append(
      "caption_en",
      (form.elements.namedItem("caption_en") as HTMLInputElement).value
    );

    await fetch("/api/admin/gallery", {
      method: "POST",
      body: formData,
    });

    form.reset();
    setUploading(false);
    fetchImages();
  }

  async function handleDelete(image: GalleryImage) {
    if (!confirm(t("confirmDelete"))) return;
    await fetch("/api/admin/gallery", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: image.id, image_url: image.image_url }),
    });
    fetchImages();
  }

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl text-text-primary">
        {t("gallery")}
      </h1>

      {/* Upload form */}
      <Card hover={false} className="mb-8 p-6">
        <form onSubmit={handleUpload} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
              Image
            </label>
            <input
              ref={fileRef}
              name="file"
              type="file"
              accept="image/*"
              required
              className="w-full font-body text-sm text-text-secondary file:mr-3 file:border file:border-border file:bg-bg-primary file:px-3 file:py-1.5 file:font-body file:text-xs file:uppercase file:tracking-[0.15em] file:text-text-secondary"
            />
          </div>
          <div>
            <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
              {t("fields.caption")} (PT)
            </label>
            <input
              name="caption_pt"
              className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
              {t("fields.caption")} (EN)
            </label>
            <input
              name="caption_en"
              className="w-full border border-border bg-bg-primary px-3 py-2 font-body text-sm text-text-primary outline-none focus:border-accent"
            />
          </div>
          <div className="sm:col-span-3">
            <Button type="submit" size="sm" disabled={uploading}>
              {uploading ? "..." : `+ ${t("upload")}`}
            </Button>
          </div>
        </form>
      </Card>

      {/* Image grid */}
      {images.length === 0 ? (
        <p className="py-8 text-center font-body text-sm text-text-secondary">
          {t("noResults")}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {images.map((image) => (
            <div key={image.id} className="group relative">
              <div className="aspect-square overflow-hidden border border-border bg-bg-elevated">
                {image.image_url ? (
                  <img
                    src={image.image_url}
                    alt={image.caption_pt ?? ""}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <span className="font-display text-2xl text-border">
                      VB
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => handleDelete(image)}
                className="absolute right-2 top-2 bg-bg-primary/80 px-2 py-1 font-body text-[10px] uppercase tracking-[0.15em] text-red-400 opacity-0 transition-opacity group-hover:opacity-100"
              >
                {t("delete")}
              </button>
              {image.caption_pt && (
                <p className="mt-1 truncate font-body text-xs text-text-secondary">
                  {image.caption_pt}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
