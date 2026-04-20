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

## Session 3 — Admin polish + public DB wiring + QA (COMPLETE)

Waiting-time session — Viviane is handling her own Vercel deploy whenever she's ready, so we used the gap to polish the admin UX and fix structural issues in the public site before launch.

### Track B — Admin polish (9 items)
- New `/admin/contact` page + API route for email/phone
- Palette/font/grain section inside `/admin/band-info` form (mirrors floating Tweaks panel)
- Shared `<AdminStatus>` component for save/error toasts across all 5 admin forms
- Image preview in gallery upload + cover-URL preview in music form
- Help text under URL + social fields (YouTube format, Instagram handle format, image-link hint)
- PT login error ("Palavra-passe inválida. Tenta de novo.")
- Translated gallery "Image" label (was hardcoded English)
- Admin forms now render with sensible defaults when DB is unreachable (no more blank "no results")
- Default country for new shows: Portugal → Brasil

### Track C — QA + coherence review
Found and fixed five **Must-Fix** items before they became production bugs:
1. **Public pages used hardcoded placeholder data** — homepage, /shows, /music, /gallery never read from Supabase. Wired them all via new `src/lib/content.ts` SSR helper with graceful fallback to sample rows.
2. **Footer "Listen" column was all `href="#"`** — wired to `band_info.instagram/youtube/facebook`; dropped Spotify/Apple/Tidal until she has streaming fields in DB
3. **Footer "Newsletter" column was all dead links** — removed entirely; honest placeholder > fake button
4. **ContactForm social icons were `href="#"`** — wired to `band_info` socials, Spotify icon dropped
5. **Gallery lightbox close showed literal `\u00d7`** — replaced with `×` glyph (same bug fixed on ContactForm submit arrow)

Also: `docs/session-3-qa-findings.md` captures Should-fix (IA, transitions) and Nice-to-have items for session 4 to decide on.

### Floating TweaksPanel
Now hidden on `/admin/*` routes (was cluttering admin screens). Stays on public pages where live-preview makes sense.

### Hidden admin entry
5× click on the footer `© 2026` year → `/admin/login`. Invisible to casual visitors. Vivi also bookmarks `/pt/admin/login` for fast access.

### Refactors
- Extracted `PALETTES`/`FONTS`/`PALETTE_SWATCH` constants from `TweaksPanel.tsx` to `src/lib/siteTheme.ts` — now imported by both the floating panel and the admin form
- Central `src/lib/content.ts` for all SSR Supabase fetches with try/catch wrappers
- New `src/components/admin/AdminStatus.tsx` and `src/components/fx/BrtClock.tsx` (the BRT clock was inlined in /shows; extracted so the page could become a server component)

### Deploy status
- Code is committed and pushed to `main` (commit `b50bd30` + `<next-commit>` for hidden-admin)
- Real Supabase anon key + Resend key + admin password now live in `.env.local` (gitignored) for local dev
- Schema is already run on Viviane's Supabase project; no DB migration needed
- Env-var block ready to paste into Vercel when she deploys (see `docs/session-3-deploy.md` §3a)

### Build status
- `npm run build` passes, 29 pages (up from 27 — new `/admin/contact` in both locales), 0 TS/ESLint errors

## Session 4 — Deferred work (PENDING)

See `docs/session-4-plan.md` for the full breakdown. Headlines:
- D2/D3 — IA restructure + page transitions (user-decision gated, wait for real content)
- D4 — Streaming-link columns on `band_info` (Spotify/Apple/Tidal)
- D5 — Post-launch polish (Supabase BR region, Resend sender domain, custom domain)
- E1 — Newsletter signup (Resend audiences)
- E2-E7 — EPK page, real music player, IG feed, analytics, etc.
- F1-F5 — Tech debt (dead gsap imports, React cache wrapping, etc.)
