"use client";

import { useEffect, useState, useRef } from "react";
import { useTranslations } from "next-intl";
import type { GalleryImage } from "@/types/database";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import AdminStatus, {
  type AdminStatusState,
} from "@/components/admin/AdminStatus";

export default function AdminGalleryPage() {
  const t = useTranslations("admin");
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [status, setStatus] = useState<AdminStatusState>("idle");
  const [preview, setPreview] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function fetchImages() {
    const res = await fetch("/api/admin/gallery");
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setImages(data);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const file = (form.elements.namedItem("file") as HTMLInputElement)
      .files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "caption_pt",
      (form.elements.namedItem("caption_pt") as HTMLInputElement).value
    );
    formData.append(
      "caption_en",
      (form.elements.namedItem("caption_en") as HTMLInputElement).value
    );

    setStatus("saving");
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error();
      setStatus("saved");
      form.reset();
      if (preview) URL.revokeObjectURL(preview);
      setPreview(null);
      fetchImages();
      window.setTimeout(() => setStatus("idle"), 1500);
    } catch {
      setStatus("error");
    }
  }

  async function handleDelete(image: GalleryImage) {
    if (!confirm(t("confirmDelete"))) return;
    try {
      const res = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: image.id, image_url: image.image_url }),
      });
      if (!res.ok) throw new Error();
      fetchImages();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div>
      <h1 className="mb-8 font-display text-4xl text-text-primary">
        {t("gallery")}
      </h1>

      {/* Upload form */}
      <Card hover={false} className="mb-8 p-6">
        <form onSubmit={handleUpload} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-3">
            <label className="mb-1 block font-body text-xs uppercase tracking-[0.15em] text-text-secondary">
              {t("fields.image")}
            </label>
            <div className="flex items-start gap-4">
              <div className="flex-1">
                <input
                  ref={fileRef}
                  name="file"
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  className="w-full font-body text-sm text-text-secondary file:mr-3 file:border file:border-border file:bg-bg-primary file:px-3 file:py-1.5 file:font-body file:text-xs file:uppercase file:tracking-[0.15em] file:text-text-secondary"
                />
                <p className="mt-1 font-body text-[11px] text-text-secondary/70">
                  {t("help.galleryFile")}
                </p>
              </div>
              {preview && (
                <img
                  src={preview}
                  alt=""
                  className="h-20 w-20 shrink-0 border border-border object-cover"
                />
              )}
            </div>
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
          <div className="flex items-center gap-3 sm:col-span-3">
            <Button type="submit" size="sm" disabled={status === "saving"}>
              {status === "saving" ? "..." : `+ ${t("upload")}`}
            </Button>
            <AdminStatus state={status} />
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
