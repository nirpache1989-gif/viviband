"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageToggle from "./LanguageToggle";

interface HeaderProps {
  locale?: string;
}

const NAV_ITEMS = [
  { href: "/shows", key: "shows" },
  { href: "/music", key: "music" },
  { href: "/gallery", key: "gallery" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header(_props: HeaderProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav className="nav">
        <Link href="/" className="nav__brand">
          Cores<span className="dot" />do Samba
        </Link>

        <div className="nav__links">
          {NAV_ITEMS.map(({ href, key }) => (
            <Link
              key={key}
              href={href}
              className={isActive(href) ? "is-active" : ""}
            >
              {t(key)}
            </Link>
          ))}
        </div>

        <LanguageToggle />

        <button
          className={`nav__hamburger ${menuOpen ? "open" : ""}`}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span />
          <span />
        </button>
      </nav>

      <div className={`nav__mobile ${menuOpen ? "open" : ""}`}>
        {NAV_ITEMS.map(({ href, key }) => (
          <Link
            key={key}
            href={href}
            onClick={() => setMenuOpen(false)}
            className={isActive(href) ? "is-active" : ""}
          >
            {t(key)}
          </Link>
        ))}
        <LanguageToggle />
      </div>
    </>
  );
}
