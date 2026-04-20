import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Footer() {
  const t = useTranslations("footer");
  const tNav = useTranslations("nav");

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

          <div className="footer__col">
            <div className="footer__col-title">{t("cols.listen")}</div>
            <a href="#" target="_blank" rel="noopener noreferrer">Spotify</a>
            <a href="#" target="_blank" rel="noopener noreferrer">YouTube</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Apple Music</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Tidal</a>
          </div>

          <div className="footer__col">
            <div className="footer__col-title">{t("cols.newsletter")}</div>
            <a href="#">{t("newsletter.subscribe")} →</a>
            <a href="#">{t("newsletter.press")}</a>
            <a href="#">{t("newsletter.epk")}</a>
          </div>
        </div>

        <div className="footer__bottom">
          <span>
            © {new Date().getFullYear()} Cores do Samba — {t("rights")}
          </span>
          <span>{t("location")}</span>
        </div>
      </div>
    </footer>
  );
}
