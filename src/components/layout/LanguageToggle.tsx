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

  function go(target: "pt" | "en") {
    if (target === locale) return;
    router.replace(pathname, { locale: target });
  }

  return (
    <div className={`nav__lang ${className ?? ""}`.trim()}>
      <a
        onClick={() => go("pt")}
        className={locale === "pt" ? "on" : ""}
        role="button"
        aria-label="Português"
      >
        PT
      </a>
      /
      <a
        onClick={() => go("en")}
        className={locale === "en" ? "on" : ""}
        role="button"
        aria-label="English"
      >
        EN
      </a>
    </div>
  );
}
