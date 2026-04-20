# Session 3 — QA / Coherence Findings

Generated during Track C of session 3. Split into **Must-fix** (broken functionality that blocks Viviane's workflow), **Should-fix** (IA/transitions — user decides), and **Nice-to-have** (optional polish).

---

## 🔴 Must-fix before deploy

### 1. Public pages don't read from Supabase — admin edits never show on the live site

This is the biggest finding. Viviane's admin panel lets her add/edit shows, music, and gallery, but the public site uses **hardcoded placeholder data**. Her edits will silently disappear in the void.

| Page | File | Issue |
|---|---|---|
| Homepage | [src/app/[locale]/page.tsx:8-66](src/app/[locale]/page.tsx:8) | `placeholderShows` + `placeholderTracks` consts; never fetches from DB |
| /shows | [src/app/[locale]/shows/page.tsx:9-90](src/app/[locale]/shows/page.tsx:9) | `placeholderShows` const; `"use client"` with no fetch |
| /music | [src/app/[locale]/music/page.tsx:6-17](src/app/[locale]/music/page.tsx:6) | `placeholderTracks` const |
| /gallery | [src/app/[locale]/gallery/page.tsx:25](src/app/[locale]/gallery/page.tsx:25) | Renders `<Gallery />` with no `images` prop — Gallery falls back to gradient placeholders |

**Fix:** Convert each page to async server component, fetch from Supabase, pass to the section component. Fall back to placeholder data only on fetch failure (so the dev experience without `.env.local` still shows the design).

### 2. Footer "Listen" column — Spotify / YouTube / Apple Music / Tidal are all `href="#"`

[src/components/layout/Footer.tsx:27-30](src/components/layout/Footer.tsx:27).

**Fix (minimum):** Wire YouTube to `band_info.youtube`. For Spotify/Apple/Tidal, either (a) hide them since we have no field yet, or (b) add `site_spotify`, `site_apple_music`, `site_tidal` columns to `band_info` in a new migration. Recommendation: (a) hide until she asks, so the link isn't a lie.

### 3. Footer "Newsletter" column — Subscribe / Imprensa / EPK all `href="#"`

Same file, lines 35-37. Newsletter isn't wired to anything (no Mailchimp/ConvertKit). Imprensa + EPK are meant to link to press-kit resources she doesn't have yet.

**Fix:** Hide the column for launch, or replace with a `mailto:` to `band_info.instagram`/`contact.email`. Lying with `#` links is the worst option.

### 4. ContactForm social icons — all `href="#"`

[src/components/sections/ContactForm.tsx:100-124](src/components/sections/ContactForm.tsx:100). Instagram, YouTube, Spotify icons all dead.

**Fix:** Wire to `band_info.instagram` / `band_info.youtube`. Drop the Spotify icon (no field) or hide it when empty.

### 5. Gallery lightbox close button shows literal escape sequence

[src/components/sections/Gallery.tsx:126](src/components/sections/Gallery.tsx:126): `\u00d7` renders as text instead of `×`. Same class of bug as the ContactForm arrow we just fixed.

**Fix:** Replace with the actual glyph `×`.

### 6. Homepage "Próximo show" CTA

Need to verify target. Currently: `<a href="/shows" className="hero__cta">`. Locale-aware? Should probably use next-intl `<Link>`. Low-impact; check and leave as-is unless broken.

---

## 🟡 Should-fix — user decides

### C2. Information Architecture

The core question: **does each of the 5 routes earn its own page, or is the content too thin for that shape?**

Content inventory today:

| Route | Real content density |
|---|---|
| `/` (Home) | Full (hero + marquee + shows + music player preview) |
| `/shows` | Thin (page-hero + tabs + list — will be 3-8 rows) |
| `/music` | Thin (page-hero + player + album grid) |
| `/gallery` | Medium (9-tile masonry) |
| `/contact` | Thin (form + info sidebar) |

Three IA shapes to choose from:

1. **Status quo (5 routes).** Each page has room to grow. SEO-friendly. Traditional band-site. Cost: feels sparse early; 4 click-transitions users must make.
2. **Single-page scroll.** `/` holds everything; other paths redirect to `#anchors`. Matches the `assets/` prototype energy. Cost: heavy initial load; harder to deepen later.
3. **Hybrid — rich Home + 2 depth routes.** Home becomes a long scroll (all sections anchored). `/shows` + `/music` remain as archives once filled. Gallery + Contact collapse to Home sections. Cost: Gallery loses its own landing.

**Recommendation:** Option 3 (hybrid). The band's current content is too light for 5 separate pages. Shows + Music deserve archive depth once she adds rows; Gallery and Contact work better as Home sections today.

**Decision needed:** 1 / 2 / 3, or stay status quo for now and revisit post-launch.

### C3. Page transitions

Current: `router.push` → instant DOM swap. No visual handoff. With the site's visual density, the hard cut feels abrupt.

Options:

- **(a) Keep hard navigation.** Simplest. Grain + scanlines provide visual continuity across routes.
- **(b) View Transitions API** (~200ms crossfade). Baseline in Chromium+Safari, progressive in Firefox. Zero JS overhead. Add a small wrapper around navigation.
- **(c) Reuse `fxCurtain()` magenta wipe** on route changes. On-brand but dramatic; needs throttling.
- **(d) Custom fade wrapper** keyed on `pathname` in the layout.

**Recommendation:** (b) View Transitions API. Cheapest, respects `prefers-reduced-motion`, enhances rather than replaces existing motion.

**Decision needed:** a / b / c / d.

---

## 🟢 Nice-to-have — defer

- **Bundle size:** First-load JS is 87-115 KB per route — healthy. No action.
- **Webpack warning:** `import(t)` dynamic import in next-intl extractor produces a cache warning. Cosmetic; next-intl issue, not ours.
- **Supabase region:** Project appears to be `us-east-1`. Moving to São Paulo would cut RTT ~100ms for BR users. Post-launch follow-up (requires migration via `pg_dump` + re-upload).
- **Resend sender domain:** Currently `onboarding@resend.dev`. Needs DNS on her eventual custom domain.
- **Admin onboarding screen:** Post-login, a "What to do first" checklist would reduce handover friction. Not blocking.

---

## Suggested next action

Implement items **1-5 under Must-fix** in this session (estimated ~60-90 min). Items 6 and the Should-fix block wait for user decision.
