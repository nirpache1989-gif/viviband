# Cores do Samba — Handoff for Claude Code

> Static HTML/CSS/JS prototype to port into the existing Next.js codebase at `ViviBAnd/`.
> Read this whole file before writing any code.

---

## 1. What's in this prototype

5 pages, all sharing the same chrome (nav, overlays, footer, tweaks panel) and motion system:

| File              | Purpose                                                          |
|-------------------|------------------------------------------------------------------|
| `index.html`      | Homepage — Kinetic hero + marquee + show preview + music preview |
| `shows.html`      | Shows page — tabs (próximos / anteriores) + show list            |
| `music.html`      | Music page — vinyl player + tracklist + album grid               |
| `gallery.html`    | Gallery page — asymmetric grid + lightbox                        |
| `contact.html`    | Contact page — form + info sidebar                               |
| `styles.css`      | All styles (single source of truth)                              |
| `app.js`          | All interactions (cursor, kinetic type, player, tweaks, etc.)    |
| `chrome.js`       | Injects nav + footer + overlays + tweaks panel into every page   |

---

## 2. Design system

### Colors (CSS variables — `:root` in `styles.css`)
```
--bg-deep:       #140414     wine-black base
--bg-mid:        #1f0a22     slightly lifted
--bg-elev:       #2a0e2e
--ink:           #f6ecd9     cream ink (not pure white)
--ink-dim:       rgba(246,236,217,0.6)
--ink-faint:     rgba(246,236,217,0.25)

--c-magenta:     #ff1f6b     hot pink — Iansã (primary accent)
--c-cyan:        #00f5d4     electric mint — Iemanjá
--c-violet:      #9d4edd     deep violet
--c-vermillion:  #e63946     vermilion red — Xangô
--c-amber:       #ffb627     sun amber — Oxum
--c-jade:        #06a77d     jade green — Oxóssi
```

The "Neon Night" palette is the default. Three alternates (`vinyl`, `tropical`, `dusk`)
are defined in `app.js` (`PALETTE_VARS`) and switchable via the Tweaks panel.

### Type
- **Display**: Bricolage Grotesque (variable, opsz 12–96, weight 800)
- **Body**: Familjen Grotesk (humanist sans, 400/500/600, italic 400)
- **Hand-drawn accents**: Caveat (500/700)

Headings are bold display, ALL CAPS, with **italic body-font words** mixed in
for the "raw editorial" feel. Examples: `Pró<em>ximos</em> shows`, `Mú<em>sica</em>`.

### Spacing & layout
- Container: `max-width: 1480px` with `clamp(20px, 4vw, 64px)` horizontal padding
- Section padding: `clamp(80px, 10vw, 160px)` vertical
- Section heads have a giant title (left) + small meta (right) divided by a 1px rule

### Surface treatments
- **Grain overlay**: SVG turbulence, `opacity: 0.07`, `mix-blend-mode: overlay`
  (`.grain` div, fixed full-viewport)
- **Scanlines**: faint repeating linear gradient (`.scanlines` div)
- **Brush trail**: `<canvas id="brush-trail">` driven by mouse — colored particles
  from the active palette, fading

---

## 3. Motion / interaction inventory

| Effect                | Where it lives                          |
|-----------------------|------------------------------------------|
| Custom cursor (dot + ring) | `app.js` — `loopCursor`             |
| Hot-zone ring scale (links/buttons) | `app.js` — `mouseover/out` listeners |
| Brush-trail particles | `app.js` — `loopTrail` on canvas        |
| Per-letter idle sway  | `app.js` — `swayLoop`, sine wave        |
| Per-letter hover scatter | `app.js` — `letters.forEach` mouseenter |
| Scroll reveal         | `app.js` — `IntersectionObserver` on `[data-reveal]` |
| Marquees (forward + reverse) | CSS keyframes `marquee` / `marquee-rev` |
| Audio-reactive bars (fake) | `app.js` — `loopWave`              |
| Vinyl spin            | CSS `spin` keyframe, paused/running via `.playing` |
| Page curtain (form submit) | `app.js` — `window.fxCurtain`      |
| Show row hover wipe   | CSS — `.show::before` with `scaleX`     |
| CTA fill from bottom  | CSS — `.hero__cta::before` with `translateY` |
| Lightbox (gallery)    | `gallery.html` inline `<script>`        |

Everything respects `prefers-reduced-motion: reduce`.

---

## 4. Tweaks panel (in-design controls)

The site supports the host's "Tweaks" toggle. Defaults live in a JSON block on every page:

```html
<script type="application/json" id="tweak-defaults">
{ "heroVariant": 1, "palette": "neon", "displayFont": "bricolage", "grain": 7 }
</script>
```

In `app.js`, `TWEAK_DEFAULTS` is wrapped in `/*EDITMODE-BEGIN*/.../*EDITMODE-END*/`
markers — that's the mechanism the host uses to persist edits to disk.

**For production, you can drop the Tweaks panel entirely** — it's a design-time tool
for picking final palette/font/grain. Once locked in, hardcode the chosen values
in `globals.css` and remove the panel + the related code.

---

## 5. How to port into the Next.js app at `ViviBAnd/`

The existing Next.js scaffold already has:
- `data-animate` attrs on sections (ready for GSAP)
- next-intl with PT (default) + EN
- Component split: `Hero`, `ShowsList`, `MusicPlayer`, `Gallery`, `ContactForm`
- `lib/gsap.ts` ready but not wired

### Recommended porting steps

1. **Replace design tokens** in `src/styles/globals.css` with the new palette + fonts
   from this prototype's `styles.css` `:root`. Update `tailwind.config.ts` if any
   new color names are added (e.g. `accent.magenta`, `accent.cyan`).

2. **Swap fonts**. Update the Google Fonts `@import` to:
   ```
   Bricolage+Grotesque:opsz,wght@12..96,400;800
   Familjen+Grotesk:ital,wght@0,400;0,500;0,600;1,400
   Caveat:wght@500;700
   ```
   Update `--font-display` and `--font-body` accordingly.

3. **Port section-by-section**. Each prototype section maps 1:1 to an existing component:
   - `Hero.tsx` ← `index.html` `.hero-v1` block
   - `ShowsList.tsx` ← `.shows__list` block
   - `MusicPlayer.tsx` ← `.player` + `.tracklist` blocks (also page version in `music.html`)
   - `Gallery.tsx` ← `.gallery__grid` + lightbox from `gallery.html`
   - `ContactForm.tsx` ← `.contact__form` block from `contact.html`
   - `Header.tsx` ← `.nav` block
   - `Footer.tsx` ← `<footer>` block

4. **Move `app.js` interactions into React**:
   - The custom cursor, brush trail, and grain overlays should live in the root
     `[locale]/layout.tsx` as a single `<ClientFx />` component (mounts once, persists
     across route changes).
   - Per-letter kinetic type → make a `<KineticHeading text="CORES DO SAMBA" />`
     component that splits the text into spans, runs the sway loop in a `useEffect`,
     and binds hover scatter on each letter. Use `useReducedMotion()`.
   - Player controls + waveform → state inside `MusicPlayer.tsx`. The current vinyl
     CSS animation works as-is.
   - Marquees → already pure CSS, just port the markup.
   - Scroll reveal → `IntersectionObserver` in a `useScrollReveal` hook, OR replace
     with GSAP ScrollTrigger (already installed in `lib/gsap.ts`) for richer effects.

5. **Localize all text** through next-intl. The prototype hardcodes Portuguese; the
   existing `messages/pt.json` and `messages/en.json` already cover the keys. Add
   missing keys for: tagline (`um axé só nosso`), section subtitles, lede paragraphs,
   day-of-week labels, etc.

6. **Wire dynamic data**. The prototype uses placeholder shows/tracks/photos. Wire
   to Supabase via the existing API routes:
   - Shows from `band_info`/`shows` tables
   - Tracks from `music` table
   - Gallery from `gallery` table
   - Contact submits to `/api/contact` (already implemented)

7. **Drop the Tweaks panel** for production. Keep one canonical palette (Neon Night
   recommended) and one display font (Bricolage Grotesque).

---

## 6. Things the prototype does NOT do

These are deliberately left for the developer:

- **Real audio playback** — the waveform is decorative. Wire to actual MP3s or
  YouTube embeds. The existing `MusicPlayer.tsx` already handles YouTube.
- **Real images** — every photo is a labeled gradient placeholder. Caption format
  (`// foto principal — banda no palco`) tells you what should go there.
- **Actual ticket links** — all `href="#"` for `Bilhetes →` buttons.
- **Form submission** — uses a CSS curtain animation; submit to `/api/contact`.
- **Mobile nav** — current `Header.tsx` has the hamburger; keep that pattern.
- **Admin panel** — untouched, keep as-is.
- **GSAP** — prototype uses raw `requestAnimationFrame` + IntersectionObserver.
  Feel free to upgrade to GSAP if it makes the kinetic type / scroll reveals nicer.

---

## 7. Brand voice & copy

Portuguese-first (Brazilian audience). Tone:
- Raw and earthy — references to *axé*, *chão*, *santo*, *suor*
- Mystic / orixá undertone — color names paired with orixás (Iansã, Iemanjá,
  Xangô, Oxóssi, Oxum, Nanã)
- Avoid touristy clichés (no beach/coconut imagery, no carnival hats)
- Geographic anchor: Salvador, Bahia (S 12°58′ — W 38°30′)

Section copy patterns:
- Eyebrow: small caps, letter-spaced, prefixed with a magenta line
- Section title: huge caps with one italic body-font word (`Pró<em>ximos</em>`)
- Section meta (top-right): `<strong>06 datas</strong>` + descriptor

---

## 8. File map for Claude Code

```
/ (project root)
├── index.html        ← homepage
├── shows.html
├── music.html
├── gallery.html
├── contact.html
├── styles.css        ← all styles
├── app.js            ← all interactions + tweaks logic
├── chrome.js         ← shared nav/footer/tweaks injection
└── HANDOFF.md        ← this file
```

**Read order for a fresh agent:**
1. `HANDOFF.md` (this file) — full picture
2. `styles.css` `:root` block — design tokens
3. `index.html` — see how the chrome, hero, sections compose
4. `app.js` — interaction patterns

That's it. Start with the design tokens + Hero, get one page looking right in
Next.js, then port the rest.
