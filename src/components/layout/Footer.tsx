import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import FooterCopyright from "./FooterYear";

interface FooterProps {
  instagram?: string | null;
  youtube?: string | null;
  facebook?: string | null;
}

function normalizeInstagram(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  const handle = value.replace(/^@/, "").trim();
  return handle ? `https://instagram.com/${handle}` : null;
}

function normalizeUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("http://") || value.startsWith("https://")) return value;
  return `https://${value}`;
}

export default function Footer({ instagram, youtube, facebook }: FooterProps) {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

  const igUrl = normalizeInstagram(instagram);
  const ytUrl = normalizeUrl(youtube);
  const fbUrl = normalizeUrl(facebook);
  const hasListen = igUrl || ytUrl || fbUrl;

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            Cores<br />
            do <em>samba</em>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">{t("cols.site")}</div>
            <Link href="/shows">{tNav("shows")}</Link>
            <Link href="/music">{tNav("music")}</Link>
            <Link href="/gallery">{tNav("gallery")}</Link>
            <Link href="/contact">{tNav("contact")}</Link>
          </div>

          {hasListen && (
            <div className="footer__col">
              <div className="footer__col-title">{t("cols.listen")}</div>
              {ytUrl && (
                <a href={ytUrl} target="_blank" rel="noopener noreferrer">
                  YouTube
                </a>
              )}
              {igUrl && (
                <a href={igUrl} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
              {fbUrl && (
                <a href={fbUrl} target="_blank" rel="noopener noreferrer">
                  Facebook
                </a>
              )}
            </div>
          )}
        </div>

        <div className="footer__bottom">
          <FooterCopyright year={new Date().getFullYear()} />
          <span>{t("location")}</span>
        </div>
      </div>
    </footer>
  );
}
