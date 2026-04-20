"use client";

/**
 * Global site FX: mounted once at the root layout.
 *  - Grain + scanlines overlays
 *  - Custom cursor (dot + trailing ring) with hot-zone detection
 *  - Mouse brush trail (colored particles) on a <canvas>
 *  - fx-curtain element + window.fxCurtain() helper for form submit transition
 *  - Mounts <TweaksPanel /> when isAdmin is true
 *  - Respects prefers-reduced-motion and touch devices
 *
 * Ports assets/chrome.js overlays + assets/app.js cursor/trail/curtain logic.
 */

import { useEffect, useRef } from "react";
import TweaksPanel, { type SiteSettings, PALETTES } from "./TweaksPanel";

declare global {
  interface Window {
    fxCurtain?: () => void;
  }
}

interface ClientFxProps {
  isAdmin: boolean;
  initialSettings: SiteSettings;
}

const TRAIL_PALETTES: Record<string, string[]> = {
  neon: ["#ff1f6b", "#00f5d4", "#9d4edd", "#ffb627"],
  vinyl: ["#C1272D", "#0A6E5C", "#F2A900", "#1A1A1A"],
  tropical: ["#E63946", "#FFB627", "#06A77D", "#F4A261"],
  dusk: ["#ff006e", "#fb5607", "#ffbe0b", "#8338ec"],
};

export default function ClientFx({ isAdmin, initialSettings }: ClientFxProps) {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const paletteRef = useRef<string>(initialSettings.palette);

  // Expose fxCurtain globally (ContactForm calls it)
  useEffect(() => {
    window.fxCurtain = () => {
      const c = curtainRef.current;
      if (!c) return;
      c.style.transition = "transform 600ms cubic-bezier(.65,0,.35,1)";
      c.style.transformOrigin = "bottom";
      c.style.transform = "scaleY(1)";
      window.setTimeout(() => {
        c.style.transformOrigin = "top";
        c.style.transform = "scaleY(0)";
      }, 700);
    };
    return () => {
      delete window.fxCurtain;
    };
  }, []);

  // Allow TweaksPanel to update trail palette in real-time
  const handlePaletteChange = (name: string) => {
    paletteRef.current = name;
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch) return;

    // Enable custom cursor class on body so `cursor: none` applies
    document.body.classList.add("custom-cursor");

    const dot = dotRef.current;
    const ring = ringRef.current;
    const canvas = canvasRef.current;
    if (!dot || !ring || !canvas) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%, -50%)`;
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const loopCursor = () => {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loopCursor);
    };
    if (!reduced) loopCursor();

    // Hot-zone detection
    const HOT_SELECTOR =
      "a, button, .show, .track, .tile, .hero__cta, .player__play, input, textarea, select";
    const onOver = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest(HOT_SELECTOR)) {
        ring.classList.add("hot");
      }
    };
    const onOut = (e: MouseEvent) => {
      if ((e.target as HTMLElement)?.closest(HOT_SELECTOR)) {
        ring.classList.remove("hot");
      }
    };
    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout", onOut);

    // ---- Brush trail canvas ----
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = innerWidth * dpr;
      canvas.height = innerHeight * dpr;
      canvas.style.width = innerWidth + "px";
      canvas.style.height = innerHeight + "px";
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const trail: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      r: number;
      c: string;
    }> = [];
    let lastEmit = 0;

    const onTrailMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastEmit < 16) return;
      lastEmit = now;
      const cols = TRAIL_PALETTES[paletteRef.current] || TRAIL_PALETTES.neon;
      trail.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        life: 1,
        r: 2 + Math.random() * 5,
        c: cols[Math.floor(Math.random() * cols.length)],
      });
      if (trail.length > 80) trail.shift();
    };
    if (!reduced) window.addEventListener("mousemove", onTrailMove);

    let trailRaf = 0;
    const loopTrail = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;
        if (p.life <= 0) {
          trail.splice(i, 1);
          continue;
        }
        ctx.globalAlpha = p.life * 0.7;
        ctx.fillStyle = p.c;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2);
        ctx.fill();
      }
      trailRaf = requestAnimationFrame(loopTrail);
    };
    if (!reduced) loopTrail();

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousemove", onTrailMove);
      window.removeEventListener("resize", resize);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout", onOut);
      if (raf) cancelAnimationFrame(raf);
      if (trailRaf) cancelAnimationFrame(trailRaf);
      document.body.classList.remove("custom-cursor");
    };
  }, []);

  return (
    <>
      <div className="grain" aria-hidden />
      <div className="scanlines" aria-hidden />
      <canvas ref={canvasRef} id="brush-trail" aria-hidden />
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div ref={curtainRef} className="fx-curtain" aria-hidden />
      {isAdmin && (
        <TweaksPanel
          initial={initialSettings}
          onPaletteChange={handlePaletteChange}
        />
      )}
    </>
  );
}

export { PALETTES };
export type { SiteSettings };
