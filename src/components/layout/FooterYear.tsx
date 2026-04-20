"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

const TRIGGER_COUNT = 5;
const TRIGGER_WINDOW_MS = 2000;

export default function FooterCopyright({ year }: { year: number }) {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("footer");
  const count = useRef(0);
  const timer = useRef<number | null>(null);

  function handleClick() {
    count.current += 1;
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      count.current = 0;
    }, TRIGGER_WINDOW_MS);
    if (count.current >= TRIGGER_COUNT) {
      count.current = 0;
      if (timer.current) window.clearTimeout(timer.current);
      router.push(`/${locale}/admin/login`);
    }
  }

  return (
    <span
      onClick={handleClick}
      style={{ cursor: "default", userSelect: "none" }}
      aria-label="© copyright"
    >
      © {year} Cores do Samba — {t("rights")}
    </span>
  );
}
