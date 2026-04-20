import { useTranslations } from "next-intl";
import ContactForm from "@/components/sections/ContactForm";

export default function ContactPage() {
  const t = useTranslations("contact");

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
            Con<em>tato</em>
          </h1>
          <p className="page-lede">{t("page.lede")}</p>
        </div>
      </section>

      <section style={{ paddingTop: 0 }}>
        <div className="container">
          <ContactForm />
        </div>
      </section>
    </>
  );
}
