"use client";

/**
 * Per-letter kinetic heading with idle sway + hover scatter.
 * Ports assets/app.js:119-160.
 *
 * Accepts a list of rows, each row is a list of words. Each word has
 * a `text`, an optional `italic` flag (uses body font italic),
 * and an optional `extra` (renders after the word — used for the hand-drawn tagline).
 */

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ACCENT_CLASSES = [
  "",
  "letter--accent",
  "letter--cyan",
  "letter--amber",
  "letter--jade",
  "letter--violet",
];

interface Word {
  text: string;
  italic?: boolean;
}

interface Row {
  words: Word[];
  extra?: React.ReactNode;
  italic?: boolean; // whole-row italic (used for "samba")
  className?: string;
}

interface Props {
  rows: Row[];
  className?: string;
}

export default function KineticHeading({ rows, className }: Props) {
  const rootRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!rootRef.current || reduced) return;
    const root = rootRef.current;
    const letters = Array.from(root.querySelectorAll<HTMLElement>(".letter"));

    // Assign random accent classes (~45% get accent color)
    letters.forEach((L) => {
      if (Math.random() > 0.55) {
        const cls = ACCENT_CLASSES[Math.floor(Math.random() * ACCENT_CLASSES.length)];
        if (cls) L.classList.add(cls);
      }
    });

    // Sway loop
    let t = 0;
    let raf = 0;
    const loop = () => {
      t += 0.018;
      letters.forEach((L, i) => {
        const phase = i * 0.35;
        const r = Math.sin(t + phase) * 1.8;
        const y = Math.sin(t * 1.3 + phase) * 1.2;
        L.style.transform = `translateY(${y}px) rotate(${r}deg)`;
      });
      raf = requestAnimationFrame(loop);
    };
    loop();

    // Hover scatter
    const handlers: Array<{ el: HTMLElement; fn: () => void }> = [];
    letters.forEach((L) => {
      const fn = () => {
        L.style.transition =
          "transform 220ms cubic-bezier(.65,0,.35,1), color 200ms";
        const dx = (Math.random() - 0.5) * 30;
        const dy = (Math.random() - 0.5) * 30;
        const r = (Math.random() - 0.5) * 40;
        L.style.transform = `translate(${dx}px, ${dy}px) rotate(${r}deg) scale(1.15)`;
        window.setTimeout(() => {
          L.style.transition = "none";
        }, 240);
      };
      L.addEventListener("mouseenter", fn);
      handlers.push({ el: L, fn });
    });

    return () => {
      cancelAnimationFrame(raf);
      handlers.forEach(({ el, fn }) => el.removeEventListener("mouseenter", fn));
    };
  }, [reduced, rows]);

  return (
    <h1 ref={rootRef} className={`hero__title ${className ?? ""}`.trim()}>
      {rows.map((row, ri) => (
        <div key={ri} className={`row ${row.className ?? ""}`.trim()}>
          {row.words.map((w, wi) => (
            <span key={wi} className="word">
              {Array.from(w.text).map((ch, ci) => (
                <span key={ci} className="letter" data-i={ci}>
                  {ch}
                </span>
              ))}
            </span>
          ))}
          {row.extra}
        </div>
      ))}
    </h1>
  );
}
