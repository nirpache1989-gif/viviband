"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { Music } from "@/types/database";
import Card from "@/components/ui/Card";

interface MusicPlayerProps {
  tracks: Music[];
  className?: string;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?#]+)/
  );
  return match?.[1] ?? null;
}

export default function MusicPlayer({ tracks, className }: MusicPlayerProps) {
  const t = useTranslations("music");
  const [activeTrack, setActiveTrack] = useState<string | null>(null);

  return (
    <section data-animate="music" className={className}>
      <div className="mx-auto max-w-content px-6 py-[var(--section-padding)]">
        <h2 className="mb-12 font-display text-5xl md:text-7xl">
          {t("title")}
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tracks.map((track) => {
            const videoId = track.youtube_url
              ? getYouTubeId(track.youtube_url)
              : null;
            const isActive = activeTrack === track.id;

            return (
              <Card key={track.id} className="overflow-hidden">
                {/* Cover / Video */}
                <div className="relative aspect-video bg-bg-elevated">
                  {isActive && videoId ? (
                    <iframe
                      src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                      className="absolute inset-0 h-full w-full"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title={track.title}
                    />
                  ) : (
                    <button
                      onClick={() => setActiveTrack(track.id)}
                      className="group absolute inset-0 flex items-center justify-center"
                    >
                      {/* Cover image or fallback */}
                      {track.cover_url ? (
                        <img
                          src={track.cover_url}
                          alt={track.title}
                          className="absolute inset-0 h-full w-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-bg-elevated">
                          <span className="font-display text-4xl text-border">
                            VB
                          </span>
                        </div>
                      )}
                      {/* Play overlay */}
                      {videoId && (
                        <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-text-primary/30 bg-bg-primary/60 transition-all group-hover:border-accent group-hover:bg-accent/20">
                          <svg
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="ml-1 h-5 w-5 text-text-primary"
                          >
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      )}
                    </button>
                  )}
                </div>

                {/* Track info */}
                <div className="p-4">
                  <h3 className="font-display text-lg text-text-primary">
                    {track.title}
                  </h3>
                  {track.release_year && (
                    <p className="mt-1 font-body text-xs text-text-secondary">
                      {t("releaseYear")}: {track.release_year}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
