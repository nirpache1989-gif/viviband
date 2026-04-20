"use client";

import { useEffect } from "react";

/**
 * Attaches an IntersectionObserver that fades-in + slides-up any element
 * with `[data-reveal]` attribute within the given root.
 * Matches assets/app.js:162-177.
 */
export function useScrollReveal(rootRef?: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = rootRef?.current ?? document;
    const targets = root.querySelectorAll<HTMLElement>("[data-reveal]");
    if (!targets.length) return;

    // Set initial state
    targets.forEach((el) => {
      el.style.opacity = "0";
      el.style.transform = "translateY(20px)";
      el.style.transition =
        "opacity 600ms ease, transform 600ms cubic-bezier(.65,0,.35,1)";
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target as HTMLElement;
            requestAnimationFrame(() => {
              el.style.opacity = "1";
              el.style.transform = "translateY(0)";
            });
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.15 }
    );

    targets.forEach((el) => io.observe(el));

    return () => io.disconnect();
  }, [rootRef]);
}
