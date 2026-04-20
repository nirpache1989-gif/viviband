# Cores do Samba — Build Progress

## Session 1 — Scaffold (COMPLETE)
- Next.js 14 scaffold (App Router, TypeScript, Tailwind)
- Supabase + Resend + next-intl (PT default, EN) set up
- Admin panel: login + CRUD for shows / music / gallery / band-info
- API routes + middleware auth
- 27 pages built + verified

## Session 2 — Real content + Design overhaul (COMPLETE)

### Renaming + origin
- Placeholder "ViviBand" → real name **Cores do Samba**
- Site description: Portuguese rock band → **Brazilian samba band** (Salvador, Bahia)
- Default country on `shows` table: Portugal → Brazil
- Added band identity: S 12°58′ — W 38°30′, "um axé só nosso", orixá-themed copy

### Design overhaul (ported from `assets/` prototype)
New design system — wine-black `#140414` base with six orixá accent colors:
- `--c-magenta` Iansã · `--c-cyan` Iemanjá · `--c-violet` orixá
- `--c-vermillion` Xangô · `--c-amber` Oxum · `--c-jade` Oxóssi

Fonts: **Bricolage Grotesque** (display 800/600/400) + **Familjen Grotesk** (body) + **Caveat** (hand-drawn accents).

Global FX system:
- SVG grain overlay (tunable opacity)
- CRT scanline overlay
- Custom cursor (dot + trailing ring, hot-zone scale on interactive elements)
- Colored brush-trail canvas following mouse
- `fx-curtain` element for form-submit transition
- Kinetic typography (per-letter sway + hover scatter on hero title)
- Marquees (forward + reverse CSS-only)
- Vinyl spinner + synthetic 48-bar waveform on music player
- Gallery masonry grid (9 asymmetric tiles a–i) with lightbox
- Scroll-reveal via `IntersectionObserver` on `[data-reveal]`
- Respects `prefers-reduced-motion` and `(hover: none)` (touch devices get system cursor)

Admin-gated **Tweaks panel** (visible only when `admin-session` cookie is set):
- Live palette switcher: neon (default) / vinyl / tropical / dusk
- Display font switcher: bricolage (default) / bebas / anton / archivo
- Grain intensity slider 0–20 (7 default)
- Changes persist to Supabase `band_info.site_palette`, `site_display_font`, `site_grain`
- Visitors see Viviane's chosen look via SSR-injected `<style>` tag

### Files added
- `src/components/fx/ClientFx.tsx` — mounts overlays + motion loops once at root
- `src/components/fx/KineticHeading.tsx` — per-letter sway + scatter
- `src/components/fx/TweaksPanel.tsx` — admin live editor
- `src/components/sections/Marquee.tsx` — CSS-driven scroller
- `src/hooks/useReducedMotion.ts`, `src/hooks/useScrollReveal.ts`
- `src/lib/siteSettings.ts` — SSR fetch + CSS-var render
- `supabase/migrations/001_site_settings.sql` — additive migration (3 new columns on `band_info`)

### Files overhauled
- `src/styles/globals.css` (complete rewrite)
- `tailwind.config.ts` (new tokens + back-compat aliases for admin)
- `src/app/[locale]/layout.tsx` (reads admin cookie, fetches settings, injects SSR palette)
- `src/components/layout/{Header,Footer,LanguageToggle}.tsx`
- `src/components/sections/{Hero,ShowsList,MusicPlayer,Gallery,ContactForm}.tsx`
- All 5 public pages: `/`, `/shows`, `/music`, `/gallery`, `/contact`
- `messages/{pt,en}.json` — new keys: hero, marquee, footer cols, info blocks, page ledes

### Not touched (per plan)
- Admin panel (`src/app/[locale]/admin/**`) — intentionally kept as-is
- API routes, Supabase client, i18n routing
- `lib/gsap.ts` (ready but unused; prototype uses raw RAF)

### Accounts set up (via browser, Viviane's side)
- Supabase project `vpzgyktiicvksvzztdun` created on her account
- Resend account created
- Vercel free Hobby account created
- GitHub username: `vivianesalvadordossantos-ux` — added as collaborator on `nirpache1989-gif/viviband`

### Keys received
- Supabase URL: `https://vpzgyktiicvksvzztdun.supabase.co`
- Supabase anon key: captured
- Resend API key: captured
- Contact email: `vivianesalvadordossantos@gmail.com`

### Build status
- `npm run build` passes — 27 pages, no TS / ESLint errors

## Session 3 — Deploy (PENDING)
Blocked on two things from Viviane/Nir:
1. **Nir accepts Supabase invite** (email to `nirpache1989@gmail.com`)
2. **Viviane generates Vercel API token** — free-tier Hobby plan doesn't support team members, so we use a personal access token instead

See `docs/session-3-deploy.md` for the full playbook.
