import { useTranslations } from "next-intl";

interface FooterProps {
  className?: string;
}

const socialLinks = [
  { name: "Instagram", href: "#", icon: "IG" },
  { name: "YouTube", href: "#", icon: "YT" },
  { name: "Facebook", href: "#", icon: "FB" },
];

export default function Footer({ className }: FooterProps) {
  const t = useTranslations("footer");

  return (
    <footer
      className={`border-t border-border bg-bg-primary px-6 py-12 ${className ?? ""}`}
    >
      <div className="mx-auto flex max-w-content flex-col items-center gap-8 md:flex-row md:justify-between">
        {/* Band Name */}
        <span className="font-display text-lg tracking-wider text-text-primary">
          VIVIBAND
        </span>

        {/* Social Links */}
        <div className="flex items-center gap-6">
          <span className="font-body text-xs uppercase tracking-[0.2em] text-text-secondary">
            {t("followUs")}
          </span>
          {socialLinks.map(({ name, href, icon }) => (
            <a
              key={name}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-xs uppercase tracking-[0.2em] text-text-secondary transition-colors hover:text-accent"
              aria-label={name}
            >
              {icon}
            </a>
          ))}
        </div>

        {/* Copyright */}
        <p className="font-body text-xs text-text-secondary">
          &copy; {new Date().getFullYear()} ViviBand. {t("rights")}
        </p>
      </div>
    </footer>
  );
}
