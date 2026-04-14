"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

interface LanguageToggleProps {
  className?: string;
}

export default function LanguageToggle({ className }: LanguageToggleProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function toggleLocale() {
    const newLocale = locale === "pt" ? "en" : "pt";
    router.replace(pathname, { locale: newLocale });
  }

  return (
    <button
      onClick={toggleLocale}
      className={`font-body text-xs uppercase tracking-[0.2em] text-text-secondary transition-colors hover:text-accent ${className ?? ""}`}
      aria-label={locale === "pt" ? "Switch to English" : "Mudar para Português"}
    >
      <span className={locale === "pt" ? "text-text-primary" : ""}>PT</span>
      <span className="mx-1 text-border">/</span>
      <span className={locale === "en" ? "text-text-primary" : ""}>EN</span>
    </button>
  );
}
