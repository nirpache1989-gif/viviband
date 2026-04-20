import { useTranslations } from "next-intl";
import ContactForm from "@/components/sections/ContactForm";
import { getContactInfo, getBandInfo } from "@/lib/content";

export default async function ContactPage() {
  const [contact, bandInfo] = await Promise.all([
    getContactInfo(),
    getBandInfo(),
  ]);

  return (
    <ContactPageInner
      email={contact?.email ?? null}
      phone={contact?.phone ?? null}
      instagram={bandInfo?.instagram ?? null}
      youtube={bandInfo?.youtube ?? null}
      facebook={bandInfo?.facebook ?? null}
    />
  );
}

function ContactPageInner({
  email,
  phone,
  instagram,
  youtube,
  facebook,
}: {
  email: string | null;
  phone: string | null;
  instagram: string | null;
  youtube: string | null;
  facebook: string | null;
}) {
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
          <ContactForm
            email={email}
            phone={phone}
            instagram={instagram}
            youtube={youtube}
            facebook={facebook}
          />
        </div>
      </section>
    </>
  );
}
