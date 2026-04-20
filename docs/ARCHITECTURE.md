# Architecture (the 5-minute version)

For anyone who needs to change something and wants to know where to look.

## Request flow

```
browser ──→ middleware.ts (locale + /admin gate)
        ──→ [locale]/layout.tsx (SSR: cookies, band_info, messages)
        ──→ page.tsx (route component)
```

- `middleware.ts` handles locale prefixing and redirects unauthenticated
  visitors to `/admin/login` if they try to reach any `/admin/*` route.
- `[locale]/layout.tsx` reads the `admin-session` cookie, fetches the
  current palette/font/grain from Supabase via `lib/siteSettings.ts`, and
  injects a `<style>` tag so visitors see the active theme before JS loads.
- `ClientFx` mounts once and renders the overlays, cursor, brush trail, and
  (if admin) the Tweaks panel.

## Data flow

```
public read     Supabase ──→ Server Component ──→ HTML
admin write     Form ──→ /api/admin/* route ──→ Supabase
contact form    Form ──→ /api/contact ──→ Resend
Tweaks panel    Panel ──→ /api/admin/band-info ──→ Supabase (site_palette etc.)
```

Server components read; API routes write. No client-side Supabase calls.
The anon key is public-safe because row-level-security policies limit it to
`SELECT` on public tables and anon-writes on the ones the admin API hits.

## The motion system

One file, `src/components/fx/ClientFx.tsx`, owns:

- Two `requestAnimationFrame` loops (cursor easing, brush-trail particles)
- Global `mousemove`, `mouseover`, `mouseout` listeners for hot-zone detection
- A `resize` listener for the canvas
- `window.fxCurtain()` — the magenta wipe triggered by `ContactForm`

It unmounts cleanly (every listener and RAF is cancelled on unmount). On
touch devices it short-circuits and renders only the overlays. On
`prefers-reduced-motion` it renders the overlays and cursor (still fun) but
skips the RAF loops.

The `KineticHeading` runs its own RAF for per-letter sway. Only one of these
is mounted at a time (on the homepage), so performance cost is bounded.

The `MusicPlayer` waveform is a third RAF. Acceptable because the player is
only visible on two pages.

## The Tweaks panel

Three state values: palette, displayFont, grain.

```
user picks palette
  ──→ applyPalette() writes 10 CSS vars to document.documentElement.style
  ──→ scheduleSave() debounces 600ms
  ──→ PUT /api/admin/band-info with {site_palette, site_display_font, site_grain}
  ──→ Supabase UPDATE
```

Next SSR request picks up the new values and injects them inline. No client
cache to invalidate.

The panel only mounts when `isAdmin === true` in the root layout. There is
no client-side check — the server decides and the panel JS is simply not
shipped to non-admin browsers.

## i18n

`messages/pt.json` is the default; `en.json` should mirror every key.
Components call `useTranslations("namespace")` and then `t("key")`. If you
add a key to `pt.json` and forget in `en.json`, next-intl logs a warning at
runtime in dev mode.

Locale-aware links use `@/i18n/navigation` (not Next's `next/link`). This is
already enforced in every component — if you see a plain `import Link from
"next/link"`, that's a bug.

## Database schema

Five tables plus one storage bucket:

- `band_info` — singleton; name, bio, logo, socials, + the three Tweaks
  panel columns
- `shows` — one row per gig
- `music` — one row per track
- `gallery` — one row per image, with image URL pointing at the bucket
- `contact` — singleton; email/phone shown on the contact page

Full DDL lives in `supabase/schema.sql`. Any additive change goes in a new
file in `supabase/migrations/`.

## Deploy

GitHub → Vercel. Every push to `main` triggers a Vercel build. Env vars
live in Vercel's project settings (not in a `.env` file at deploy time).

For the initial project creation on Viviane's Vercel account, see
`docs/session-3-deploy.md`.

## Things that look weird but aren't

- `cursor: inherit` on interactive elements (`.hero__cta`, `.show`, etc.) —
  this is so the custom cursor's `cursor: none` on body cascades down. On
  touch devices the class isn't added, so inherit goes back to the default.
- `body.custom-cursor` class instead of always-on `body { cursor: none }` —
  this is so the system cursor stays visible when we don't mount the custom
  one (touch, reduced motion).
- Two `<link rel="stylesheet">` for Google Fonts — one static in
  `globals.css` for the default Bricolage, and one that `TweaksPanel`
  injects when an admin picks a different display font. Both coexist
  fine; CSS uses whichever `--font-display` var resolves to.
- The homepage has placeholder data hardcoded in `page.tsx`. This is
  deliberate until Supabase is populated. When the first real show/track is
  added via admin, delete those placeholder arrays.
