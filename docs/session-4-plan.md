# Session 4 — Plan

Opens whenever Viviane's Vercel deploy is green and the site is live. This doc captures everything deliberately deferred from session 3, grouped by urgency and shape of work so future Nir/Claude can pick up cold.

---

## Gate: before starting session 4

- [ ] Live URL exists and `docs/session-3-deploy.md` §4 smoke test passes green
- [ ] Portuguese handover message from §5 sent to Viviane with URL + admin password `DNmjwWTOY+d/jXcOB+4D74cwPfkd2upB`
- [ ] Viviane has logged in at least once and confirms she can add a show / upload a gallery image / edit band info from `/admin`

If any of the above fails, that's session 4 scope — fix the deploy before adding anything new.

---

## Track D — Carry-overs from session 3

### D1. Hidden admin entry point

Three options surfaced in session 3; user to pick:

- (a) Bookmark-only — zero code
- (b) 5× click on footer `© 2026 Cores do Samba` → `/admin/login` (recommended)
- (c) Same pattern on header logo

Implementation if (b): in `src/components/layout/Footer.tsx`, add a `useState` counter on the year span; when it hits 5 within a 2s window, `router.push('/admin/login')`. ~15 lines. Reset counter on timeout.

### D2. IA decision — the core question of session 4

**User raised this explicitly at the end of session 3:** the homepage scrolls through Shows preview + Music player preview + marquees, and the same content is reachable as full `/shows` and `/music` pages from the top nav. Same content, two surfaces. Feels redundant.

Current shape, diagrammed:

```
Home (/)                Top nav
├── Hero                ├── Shows    → /shows (full list)
├── Marquee             ├── Música   → /music  (full list + albums)
├── Shows preview (3)   ├── Galeria  → /gallery (9-tile masonry)
├── Marquee             └── Contato  → /contact (form + info)
├── Music preview (3)
```

So Home = a taste of everything; subpages = the full version. Traditional band-site shape, but with thin DB content today (3 shows, 0 uploaded tracks, 0 uploaded photos) it reads as duplicated sparseness.

**Three shapes to pick from:**

1. **Status quo (5 routes).** Keep as-is. Works fine once she has 10+ shows, 10+ tracks — the Home preview becomes a genuine teaser and the subpages become real archives. Cost: today it feels like the same content twice.

2. **Single-page scroll.** Home holds everything (hero → shows → music → gallery → contact). Top nav items scroll to `#anchors` instead of navigating routes. `/shows`, `/music`, etc. redirect to `/#shows`, `/#music`. **Matches the `assets/` prototype energy** — the prototype is 5 HTML files but designed to *feel* like one living page. Cost: heavier initial payload; harder to deepen any one section later without re-splitting.

3. **Hybrid (recommended).** Home becomes the long scroll. `/shows` and `/music` stay as deep archives for when she fills them up. Gallery and Contact collapse to Home anchors (since they're naturally lighter). Top nav on Home = anchors; on archive pages = real links. Cost: slight asymmetry in how nav behaves depending on which page you're on.

**Recommendation:** start with **option 2 (single-page)** for launch, revisit once she has real content density. Reason: she's launching with near-empty DB; a single scrolling page with sample content sells the aesthetic better than a nav with three pages that all say "no results yet." If/when she has 10+ shows, we can split Shows + Music back out into real archive pages.

**Migration sketch for option 2:**
- Keep `/shows`, `/music`, `/gallery`, `/contact` routes but each becomes a `redirect(`/${locale}#${section}`)` via `next/navigation`
- Home page (`src/app/[locale]/page.tsx`) grows sections with `id="shows"`, `id="music"`, etc.
- Top nav in `Header.tsx` changes `<Link href="/shows">` → `<a href={isHome ? "#shows" : "/#shows"}>`
- Gallery + ContactForm move into Home as `<section id="gallery">` / `<section id="contact">`
- `useScrollReveal` already handles the reveal animations for new sections

**Decision gate:** user must pick 1/2/3 before any code lands. Don't assume.

### D3. Transitions decision (from findings C3)

Today: hard `router.push` navigation. Options:

- (a) Keep hard nav
- (b) **View Transitions API crossfade** (recommended) — baseline in Chromium + Safari, ~50 lines of wrapper code around a `<Link>` component
- (c) Reuse `fxCurtain()` magenta wipe on route change — dramatic, on-brand, might fatigue
- (d) Custom fade via `RouteTransition` client component keyed on `pathname`

Implementation if (b): create `src/components/fx/ViewTransitionLink.tsx` that wraps `next-intl`'s `Link` and calls `document.startViewTransition(() => router.push(href))` when available, falls back to plain push when not. Add a `:root { view-transition-name: page }` CSS rule. Respect `prefers-reduced-motion`.

### D4. Socials wiring — add streaming services

Today: `band_info` has `instagram`, `youtube`, `facebook`. Footer + ContactForm read these and hide empty slots. Missing: Spotify, Apple Music, Tidal.

Fix: add additive migration `supabase/migrations/002_streaming_links.sql` with `spotify_url`, `apple_music_url`, `tidal_url` text columns on `band_info`. Add fields in `/admin/band-info` form. Surface in Footer "Listen" column + ContactForm socials (new SVG icons).

Effort: ~45 min. Requires a second schema migration to run on her live DB.

### D5. Post-launch polish follow-ups

From session-3-qa-findings "Nice-to-have":

- **Supabase region migration** to São Paulo (`sa-east-1`). ~100ms RTT win for BR visitors. Requires `pg_dump` + new project + restore + re-upload `band-assets` Storage bucket + swap env vars in Vercel. 1-2hr work. Do after she has real traffic.
- **Resend sender domain.** Currently uses `onboarding@resend.dev` → contact emails arrive from a generic address. Needs DNS records on her domain (when she has one). Upgrade to `booking@coresdosamba.com` style once configured.
- **Custom domain** via Vercel → Domains → Add. Triggers DNS setup, auto-HTTPS. Blocks on her buying/pointing a domain.
- **Dashboard onboarding.** Post-login `/admin` page could show a 3-step checklist: "1. Set band bio · 2. Upload logo · 3. Add first show". Reduces first-login friction for Vivi. ~1hr UI work.

---

## Track E — Feature proposals (ordered by expected value)

Not in scope today; pitch these to the user and ship the ones she picks.

### E1. Newsletter signup (low-complexity, high-impact)

Band websites without newsletters leak the audience. Options:

- **Mailchimp embed** — drop-in `<form action=…>`, no backend. Free tier = 500 contacts. ~20 min.
- **Resend audience** — reuse existing Resend key, store contacts in Resend's audience DB, send from the same infra. Requires wiring their audiences API. ~2hr, but no new third party.
- **Supabase `subscribers` table + Resend broadcast** — fully custom, cleanest long-term. ~3-4hr.

Recommendation: Resend audience — reuses infra we already have.

### E2. EPK / press kit page (`/pt/epk`)

Bands get asked for "EPK" (electronic press kit). Would be: bio, high-res photos, streaming links, contact, downloadable PDF.

Content-managed via admin would be overkill for v1 — static page + one `epk.pdf` upload to the `band-assets` Storage bucket would cover 90% of requests. ~1.5hr.

### E3. Real music player (not just a vinyl spinner)

Current `MusicPlayer.tsx` spins a vinyl and pulses a waveform but doesn't actually play audio — clicking "play" opens the YouTube URL in a new tab.

Upgrade options:

- **Embedded YouTube iframe** on click (inline, no tab swap). ~1hr.
- **Spotify embed** once we have spotify_url (see D4). ~45 min.
- **Custom audio player** with her tracks hosted on Supabase Storage. 3-4hr. Requires uploading `.mp3` files (new admin flow).

### E4. Instagram feed embed on Home or Gallery

Pulls her latest 6-9 posts via Instagram Basic Display API or a static cache. Keeps the Gallery page fresh without her manually uploading. Instagram API has rate limits + requires a Facebook app — moderate setup, ~2-3hr first time.

Alternative: a "Latest posts" block that links out to her Instagram (no API, just outbound links with thumbnails from `band_info`). ~30 min for the static version.

### E5. Admin activity log

Under the dashboard, show last 10 actions ("show added", "gallery photo uploaded", "palette changed to dusk"). Requires an `audit_log` table + a trigger on each write. ~3-4hr. Low priority — Viviane is the only user; there's no audit story to tell yet.

### E6. Multi-user admin

Right now admin is a single password. If the band adds a manager, they'd share the password. Real fix: proper auth (Supabase Auth + role table). Big lift, ~1 day. Defer until someone actually asks.

### E7. Analytics

Drop-in options:

- **Vercel Analytics** — one package + one env var. Free tier decent. ~5 min.
- **Plausible** (privacy-first) — self-hosted or cloud. €9/mo cloud. Simpler dashboards.
- **Umami** (open-source) — self-host on same Supabase or a cheap VPS.

Recommendation: Vercel Analytics for session 4 (zero friction since we're already on Vercel). Upgrade later if she wants more.

---

## Track F — Technical debt

### F1. `lib/gsap.ts` is dead code

[src/lib/gsap.ts](src/lib/gsap.ts) was scaffolded in session 1 but session 2 ported everything to raw RAF instead. The file is imported by nothing. Delete it + remove `gsap` + `@gsap/react` from `package.json` if they're still there. Saves bundle weight.

### F2. `next-intl` dynamic-import warning

On every build, webpack logs "Parsing of next-intl extractor/format/index.js for build dependencies failed at 'import(t)'". Upstream bug in next-intl. Cosmetic. Check if newer next-intl version fixes it; bump if so.

### F3. Storage-bucket cleanup on gallery delete

`DELETE /api/admin/gallery` removes the row but — unverified — may not delete the actual file from the `band-assets` Storage bucket. Left to rot, the bucket grows without bound. Check and fix if leaking.

### F4. Shared URL-normalization helpers

`Footer.tsx` and `ContactForm.tsx` each have their own `normalizeInstagram` / `normalizeUrl` functions. Extract to `src/lib/urls.ts`. 10 min.

### F5. React cache for repeat fetches

Session 3's `/pt/contact` server component calls `getContactInfo()` AND `getBandInfo()`; layout also calls `getBandInfo()`. Wrap `getBandInfo` in React's `cache()` so the same request only fires once per render. 5 min.

---

## Suggested session 4 shape

If budgets are tight, do in this order:

1. **D1** hidden admin entry (15 min) — remove the "how do I reach admin" annoyance
2. **E7** Vercel Analytics (5 min) — cheapest insight
3. **D4** streaming-link columns + admin form + Footer (45 min) — removes the "why is Spotify link missing" awkwardness
4. **E1** newsletter signup (2hr) — biggest value add
5. Check back with Viviane on D2/D3 (IA / transitions) once she's seen the site with real content
