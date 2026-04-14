import { useTranslations } from "next-intl";

interface HeroProps {
  className?: string;
}

export default function Hero({ className }: HeroProps) {
  const t = useTranslations("hero");

  return (
    <section
      data-animate="hero"
      className={`relative flex min-h-screen items-center overflow-hidden ${className ?? ""}`}
    >
      {/* Background accent lines */}
      <div className="absolute left-[10%] top-0 h-full w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent" />
      <div className="absolute right-[15%] top-0 h-full w-px bg-gradient-to-b from-transparent via-border to-transparent" />

      <div className="relative mx-auto w-full max-w-content px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {/* Band Name — asymmetric, left-aligned, grid-breaking */}
          <div className="md:col-span-10 md:col-start-1">
            <h1 className="font-display text-[clamp(5rem,18vw,14rem)] leading-[0.85] tracking-tight text-text-primary">
              VIVI
              <br />
              <span className="ml-[10%] inline-block text-accent md:ml-[15%]">
                BAND
              </span>
            </h1>
          </div>

          {/* Tagline — offset to the right */}
          <div className="md:col-span-4 md:col-start-8">
            <div className="flex items-center gap-4">
              <span className="h-px w-12 bg-accent" />
              <p className="font-body text-xs uppercase tracking-[0.3em] text-text-secondary">
                {t("tagline")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-text-secondary">
            Scroll
          </span>
          <div className="h-8 w-px animate-pulse bg-accent" />
        </div>
      </div>
    </section>
  );
}
