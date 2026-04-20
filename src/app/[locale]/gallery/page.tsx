import { useTranslations } from "next-intl";
import Gallery from "@/components/sections/Gallery";

export default function GalleryPage() {
  const t = useTranslations("gallery");

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

      <Gallery />
    </>
  );
}
