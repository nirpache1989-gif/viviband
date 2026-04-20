# Cores do Samba — Project Documentation

## Overview
Brazilian samba band website built with Next.js 14 (App Router) + TypeScript + Tailwind CSS.
Content is managed through an /admin panel. Hosted on Vercel with Supabase backend.

## Tech Stack
- **Framework**: Next.js 14, App Router, TypeScript (strict)
- **Styling**: Tailwind CSS with CSS variables in `src/styles/globals.css`
- **Database**: Supabase (PostgreSQL + Storage)
- **i18n**: next-intl v4 — Portuguese (default) + English
- **Email**: Resend (contact form notifications)
- **Animation**: GSAP + ScrollTrigger (installed, NOT wired to components yet)

## Design System
- **Base**: Wine-black `#140414` with cream ink `#f6ecd9`
- **Accent palette** (orixá-themed): magenta/cyan/violet/vermilion/amber/jade
- **Display font**: Bricolage Grotesque (variable)
- **Body font**: Familjen Grotesk
- **Hand-drawn accent**: Caveat
- **Aesthetic**: Raw + mystic + carnival — Salvador, Bahia
- All design tokens are CSS variables in `src/styles/globals.css` (see `:root`)
- Tailwind references these variables — see `tailwind.config.ts`
- Prototype source of truth: `assets/` (static HTML/CSS/JS)
- The prototype's raw RAF motion code is ported 1:1 into React hooks/components under `src/components/fx/` and `src/hooks/` — no GSAP
- Admin-gated Tweaks panel lets Viviane swap palette/font/grain live (persists to `band_info`)

## Project Structure
```
assets/                     ← Static HTML/CSS/JS design prototype (source of truth)
  HANDOFF.md                ← Porting guide for the design
  styles.css                ← Full prototype stylesheet
  app.js                    ← Cursor/trail/kinetic/player/tweaks logic
  chrome.js                 ← Nav/footer/overlays markup reference
  {index,shows,music,gallery,contact}.html

docs/
  progress.md               ← Session-by-session build log
  session-3-deploy.md       ← Deploy playbook (CLI commands, smoke test)
  cores-do-samba-setup-guide.pdf  ← Printable guide for Viviane

src/
  app/
    layout.tsx              ← Root layout (delegates to [locale])
    [locale]/
      layout.tsx            ← Reads admin cookie, fetches site settings, injects CSS vars, mounts ClientFx
      page.tsx              ← Homepage (Hero + Marquee + ShowsList preview + MusicPlayer preview)
      shows/page.tsx        ← Page-hero + tabs + full show list
      music/page.tsx        ← Page-hero + full player + album grid
      gallery/page.tsx      ← Page-hero + masonry + lightbox
      contact/page.tsx      ← Page-hero + form + info sidebar
      admin/                ← Untouched by session-2 overhaul (kept functional)
    api/
      contact/route.ts      ← POST: send email via Resend
      admin/
        auth/route.ts       ← POST: verify password, set httpOnly cookie
        shows/route.ts      ← CRUD
        music/route.ts      ← CRUD
        gallery/route.ts    ← CRUD + Storage upload
        band-info/route.ts  ← GET/PUT (now also site_palette/font/grain)
  components/
    fx/                     ← Motion/cursor/panel — added in session 2
      ClientFx.tsx          ← Root-mounted overlays + cursor + brush trail + curtain
      KineticHeading.tsx    ← Per-letter sway + hover scatter
      TweaksPanel.tsx       ← Admin-only live palette/font/grain editor
    layout/                 ← Header, Footer, LanguageToggle (matching prototype nav/footer)
    sections/               ← Hero, Marquee, ShowsList, MusicPlayer, Gallery, ContactForm
    ui/                     ← Button, Card, Modal (used by admin only)
  hooks/
    useReducedMotion.ts     ← Media query wrapper
    useScrollReveal.ts      ← IntersectionObserver on [data-reveal]
  lib/
    gsap.ts                 ← (unused — raw RAF used instead)
    supabase.ts             ← Lazy Supabase client
    resend.ts               ← Lazy Resend client
    siteSettings.ts         ← SSR fetch of band_info site_* columns + CSS-var render
  i18n/
    routing.ts              ← Locale routing config (pt default, en)
    navigation.ts           ← Typed Link / useRouter / usePathname
  i18n.ts                   ← next-intl request config
  middleware.ts             ← Locale routing + admin auth cookie check
  styles/
    globals.css             ← Full Cores do Samba stylesheet (ported from assets/styles.css)
  types/
    database.ts             ← DB row types incl. site_palette/font/grain
messages/
  pt.json                   ← Portuguese (default, includes orixá copy)
  en.json                   ← English mirror
supabase/
  schema.sql                ← Full fresh-install schema
  migrations/
    001_site_settings.sql   ← Additive migration for Tweaks panel columns
```

## Database Tables
- `band_info` — singleton: name, bio (pt/en), logo, socials (instagram, youtube, facebook), **+ site_palette, site_display_font, site_grain** (written by Tweaks panel)
- `shows` — date, venue, city, country (default `Brazil`), ticket_url, is_past
- `gallery` — image_url, caption (pt/en)
- `music` — title, youtube_url, cover_url, release_year
- `contact` — email, phone
- Storage bucket: `band-assets` (public)

## Key Conventions
- All text through next-intl (no hardcoded strings)
- Server Components for reads, API Routes for writes
- Scroll-reveal via `[data-reveal]` attributes (wire with `useScrollReveal`)
- Motion respects `prefers-reduced-motion` and `(hover: none)` touch devices
- Admin auth: password from `ADMIN_PASSWORD` env → httpOnly `admin-session` cookie (7 days)
- Tweaks panel visibility gated by that cookie, read server-side in `[locale]/layout.tsx`
- Band name: "Cores do Samba" (Brazilian samba band, Salvador, Bahia)

## Environment Variables
See `.env.local.example` for all required variables.

## Commands
- `npm run dev` — development server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint check
