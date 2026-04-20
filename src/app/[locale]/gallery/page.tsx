import { getTranslations } from "next-intl/server";
import Gallery from "@/components/sections/Gallery";
import { getGalleryImages } from "@/lib/content";

export default async function GalleryPage() {
  const t = await getTranslations("gallery");
  const images = await getGalleryImages();

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div
            className="hero__meta-top"
            style={{ position: "static", padding: 0, marginBottom: 60 }}
          >
            <span>{t("page.eyebrow")}</span>
            <span>{t("page.meta")}</span>
          </div>
          <h1 className="page-title">
            Ga<em>leria</em>
          </h1>
          <p className="page-lede">{t("page.lede")}</p>
        </div>
      </section>

      <Gallery images={images} />
    </>
  );
}
