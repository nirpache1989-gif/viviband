"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import KineticHeading from "@/components/fx/KineticHeading";

export default function Hero() {
  const t = useTranslations("hero");
  const [clock, setClock] = useState("—:— BRT");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const utcMs = now.getTime() + now.getTimezoneOffset() * 60_000;
      const brt = new Date(utcMs - 3 * 60 * 60 * 1000);
      const hh = String(brt.getHours()).padStart(2, "0");
      const mm = String(brt.getMinutes()).padStart(2, "0");
      setClock(`${hh}:${mm} BRT`);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <section className="hero hero-v1" data-hero="1">
      <div className="hero__meta-top">
        <span>{t("eyebrow")}</span>
        <span>{clock}</span>
      </div>

      <div className="container">
        <KineticHeading
          rows={[
            { words: [{ text: "CORES" }] },
            {
              words: [{ text: "DO" }],
              extra: <span className="tagline">{t("tagline")}</span>,
            },
            { className: "row--samba", words: [{ text: "samba" }] },
          ]}
        />

        <div className="hero__under">
          <p
            style={{
              maxWidth: 420,
              color: "var(--ink-dim)",
              fontSize: 15,
              lineHeight: 1.6,
            }}
          >
            {t("lede")}
          </p>
          <Link href="/shows" className="hero__cta">
            {t("cta")}
            <span className="hero__cta-arrow">→</span>
          </Link>
        </div>
      </div>

      <div className="hero__meta-bottom">
        <span>{t("coords")}</span>
        <div className="scroll-indicator">
          <span>{t("scroll")}</span>
          <div className="scroll-indicator__bar" />
        </div>
        <span>{t("volume")}</span>
      </div>
    </section>
  );
}
