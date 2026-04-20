"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import type { Music } from "@/types/database";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface MusicPlayerProps {
  tracks: Music[];
  /** Homepage preview variant \u2014 shows section-head + 3 tracks + \"all music\" CTA. */
  preview?: boolean;
  /** Full music page variant \u2014 with platform links. */
  full?: boolean;
  className?: string;
}

function getYouTubeId(url: string | null): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/
  );
  return match?.[1] ?? null;
}

const BARS = 48;

export default function MusicPlayer({
  tracks,
  preview = false,
  full = false,
  className,
}: MusicPlayerProps) {
  const t = useTranslations("music");
  const reduced = useReducedMotion();

  const visibleTracks = useMemo(
    () => (preview ? tracks.slice(0, 3) : tracks),
    [tracks, preview]
  );

  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [ytOpen, setYtOpen] = useState(false);

  const barRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Synthetic waveform RAF loop (ports assets/app.js:179-204)
  useEffect(() => {
    if (reduced) return;
    let phase = 0;
    let raf = 0;
    const loop = () => {
      if (playing) phase += 0.18;
      barRefs.current.forEach((b, i) => {
        if (!b) return;
        const baseL = playing
          ? 8 +
            Math.abs(Math.sin(phase + i * 0.4)) * 38 +
            Math.abs(Math.sin(phase * 2.3 + i * 0.13)) * 14
          : 6 + Math.sin(i * 0.5) * 3;
        b.style.height = baseL + "px";
        b.classList.toggle("active", playing && baseL > 28);
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, [playing, reduced]);

  const active = visibleTracks[activeIdx];
  const videoId = getYouTubeId(active?.youtube_url ?? null);

  const onPlayClick = () => {
    if (videoId) {
      // Real YouTube playback \u2014 open embed below player
      setYtOpen((v) => !v);
      setPlaying((v) => !v);
    } else {
      setPlaying((v) => !v);
    }
  };

  const onTrackClick = (idx: number) => {
    setActiveIdx(idx);
    setPlaying(true);
    const vid = getYouTubeId(visibleTracks[idx]?.youtube_url ?? null);
    setYtOpen(Boolean(vid));
  };

  const playerAndTracks = (
    <div className="music__wrap">
      <div className="player">
        <div className="player__cover">
          <div className={`player__vinyl ${playing ? "playing" : ""}`.trim()} />
        </div>
        <div className="player__meta">
          <div>
            <div className="player__title">{active?.title ?? "\u2014"}</div>
            <div className="player__artist">Cores do Samba</div>
          </div>
          <div className="player__year">{active?.release_year ?? ""}</div>
        </div>

        <div className="player__controls">
          <button
            className="player__play"
            onClick={onPlayClick}
            aria-label={playing ? "Pause" : "Play"}
          >
            <svg viewBox="0 0 24 24">
              {playing ? (
                <>
                  <rect x="6" y="5" width="4" height="14" />
                  <rect x="14" y="5" width="4" height="14" />
                </>
              ) : (
                <path d="M8 5v14l11-7z" />
              )}
            </svg>
          </button>

          <div className="player__waveform" aria-hidden>
            {Array.from({ length: BARS }).map((_, i) => (
              <div
                key={i}
                ref={(el) => {
                  barRefs.current[i] = el;
                }}
                className="player__bar"
              />
            ))}
          </div>
        </div>

        {ytOpen && videoId && (
          <div style={{ marginTop: 20, aspectRatio: "16/9" }}>
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              style={{ width: "100%", height: "100%", border: 0 }}
              allow="autoplay; encrypted-media"
              allowFullScreen
              title={active?.title}
            />
          </div>
        )}

        {full && (
          <div className="player__platforms">
            <a href="#">Spotify \u2197</a>
            <a href="#">YouTube \u2197</a>
            <a href="#">Apple Music \u2197</a>
            <a href="#">Tidal \u2197</a>
          </div>
        )}
      </div>

      <div className="tracklist">
        {visibleTracks.map((tr, i) => (
          <article
            key={tr.id}
            className={`track ${i === activeIdx ? "is-playing" : ""}`.trim()}
            onClick={() => onTrackClick(i)}
          >
            <div className="track__num">{String(i + 1).padStart(2, "0")}</div>
            <div className="track__title">{tr.title}</div>
            <div className="track__time">{tr.release_year ?? ""}</div>
            <div className="track__icon">\u25B6</div>
          </article>
        ))}
      </div>
    </div>
  );

  if (preview) {
    return (
      <section className={className}>
        <div className="container">
          <header className="section-head">
            <h2 className="section-head__title">
              M\u00fa<em>sica</em>
            </h2>
            <div className="section-head__meta">
              <strong>
                {String(tracks.length).padStart(2, "0")} {t("meta.tracks")}
              </strong>
              {t("meta.span")}
            </div>
          </header>

          {playerAndTracks}

          <div style={{ textAlign: "center", marginTop: 40 }}>
            <a href="/music" className="hero__cta" style={{ display: "inline-flex" }}>
              {t("viewAll")}
              <span className="hero__cta-arrow">\u2192</span>
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section style={{ paddingTop: 0 }} className={className}>
      <div className="container">{playerAndTracks}</div>
    </section>
  );
}
