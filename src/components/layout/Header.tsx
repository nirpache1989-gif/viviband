"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import LanguageToggle from "./LanguageToggle";

interface HeaderProps {
  className?: string;
}

const navItems = [
  { href: "/", key: "home" },
  { href: "/shows", key: "shows" },
  { href: "/music", key: "music" },
  { href: "/gallery", key: "gallery" },
  { href: "/contact", key: "contact" },
] as const;

export default function Header({ className }: HeaderProps) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 ${className ?? ""}`}
    >
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-5">
        {/* Logo / Band Name */}
        <Link
          href="/"
          className="font-display text-2xl tracking-wider text-text-primary"
        >
          VIVIBAND
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map(({ href, key }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={key}
                href={href}
                className={`font-body text-xs uppercase tracking-[0.2em] transition-colors hover:text-accent ${
                  isActive ? "text-accent" : "text-text-secondary"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Language Toggle */}
        <div className="hidden md:block">
          <LanguageToggle />
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          <span
            className={`h-px w-6 bg-text-primary transition-all duration-300 ${
              menuOpen ? "translate-y-[3.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-text-primary transition-all duration-300 ${
              menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center bg-bg-primary transition-opacity duration-300 md:hidden ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      >
        <nav className="flex flex-col items-center gap-8">
          {navItems.map(({ href, key }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={key}
                href={href}
                onClick={() => setMenuOpen(false)}
                className={`font-display text-4xl uppercase tracking-wider transition-colors hover:text-accent ${
                  isActive ? "text-accent" : "text-text-primary"
                }`}
              >
                {t(key)}
              </Link>
            );
          })}
        </nav>
        <div className="mt-12">
          <LanguageToggle />
        </div>
      </div>
    </header>
  );
}
