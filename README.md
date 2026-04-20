# Cores do Samba

A website for a Brazilian samba band. It has shows, photos, music, and a
contact form, which are the four things every band website has, in roughly
the quantities you'd expect.

Built for [Viviane](https://github.com/vivianesalvadordossantos-ux).
Hand-crafted in Salvador. Deployed in Ireland. Rendered wherever you are.

---

## What this is

- **Next.js 14** (App Router, React Server Components, the whole setup)
- **TypeScript**, in strict mode, because we like to know when we've broken things
- **Tailwind CSS** for the 80% of layout that's mundane, and hand-written CSS in
  `src/styles/globals.css` for the 20% that isn't (custom cursor, brush trail,
  kinetic letters, that sort of thing)
- **Supabase** for the database and image storage
- **Resend** for the one email the contact form occasionally sends
- **next-intl** for Portuguese (default) and English
- **No state management library.** Components talk to each other by
  passing props around like civilised people.

It looks nothing like the default Next.js template. This is deliberate.

---

## Running it locally

```bash
npm install
cp .env.local.example .env.local   # then fill in the 5 variables
npm run dev
```

Open http://localhost:3000. It will redirect you to `/pt` because
Portuguese is the default and this is a Brazilian band, not an American one.

You'll need the env vars to actually see data. They are:

| Variable | What it is |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key (the long one starting with `eyJ`) |
| `ADMIN_PASSWORD` | Whatever you want the admin password to be. Be kind to your future self. |
| `RESEND_API_KEY` | Your Resend API key. Optional if you don't care about the contact form. |
| `BAND_CONTACT_EMAIL` | Where the contact form's emails go. |

---

## Lay of the land

```
assets/               The static HTML/CSS/JS design prototype. This is the
                      source of truth for what the site should look and feel
                      like. If you're changing visual behaviour, check here
                      first.

src/app/[locale]/     The public pages (home, shows, music, gallery, contact)
                      and the admin panel (login + CRUD).

src/components/
  fx/                 Anything that moves, glows, or follows the mouse.
                      ClientFx, KineticHeading, TweaksPanel.
  layout/             Header, Footer, LanguageToggle.
  sections/           Hero, Marquee, ShowsList, MusicPlayer, Gallery, ContactForm.
  ui/                 Button, Card, Modal. Used only by the admin panel.
                      Public pages don't use them.

src/hooks/            useReducedMotion, useScrollReveal. Small and single-
                      purpose, which is the best kind of hook.

src/lib/              Supabase client, Resend client, and siteSettings
                      (which SSR-fetches the live palette from the DB).

messages/             pt.json and en.json. All visible text lives here.
                      Don't hardcode strings in components. You will regret it.

supabase/             schema.sql for a fresh install.
                      migrations/ for additive changes to existing databases.

docs/                 progress.md — session-by-session build log.
                      session-3-deploy.md — deploy playbook with CLI commands.
                      *.pdf — one-page guides for the non-developer.
                      make_*.py — scripts that generate the PDFs, if you
                      need to regenerate them after changing the text.
```

The admin panel at `/admin` uses the older UI components in `src/components/ui/`
and looks noticeably different from the public pages. This is intentional — the
admin panel is a tool, not an experience. If you want to redesign it, go ahead,
but it works and looks fine as-is.

---

## Adding things later

### A new show, track, or photo
Log into `/admin`, find the section, click Add. The admin panel exists
precisely so that "adding a show" does not require a pull request.

### A new page (e.g. `/about`)
1. Create `src/app/[locale]/about/page.tsx`
2. Add `about: "Sobre"` (or similar) to `messages/pt.json` and `messages/en.json` under `nav`
3. Add a `<Link href="/about">` to `src/components/layout/Header.tsx` in the `NAV_ITEMS` array
4. Rebuild

The filename is the URL. The URL is the filename. The App Router is refreshingly
literal about this.

### A new section component
Put it in `src/components/sections/`. If it has an animation that follows the
mouse or runs in `requestAnimationFrame`, put the motion bits in
`src/components/fx/` instead and call it from the section.

### A new palette for the Tweaks panel
Open `src/components/fx/TweaksPanel.tsx`, find the `PALETTES` object, add a
new entry with all ten CSS-var overrides. Also add a swatch gradient to
`PALETTE_SWATCH` and a `<option>` to the palette button row. You'll probably
want to add it to the Brush-trail palette map in `ClientFx.tsx` too or the
mouse trail will keep the old colours, and looking mismatched is worse than
looking wrong.

### A new font for the Tweaks panel
In `TweaksPanel.tsx`, add an entry to the `FONTS` map with the Google Fonts URL
and the `font-family` value. Add a `<option>` to the font `<select>`. That's it.

### Changing the base colours permanently
Edit the `:root` block in `src/styles/globals.css`. If you change a name, also
update `tailwind.config.ts` where those names are exposed as Tailwind tokens.

### The motion is too much
Open your OS accessibility settings, enable "reduce motion", and the site will
politely tone itself down. The cursor stops trailing, the kinetic letters stop
swaying, and everything transitions in 0.01 milliseconds. If the band wants it
off by default: remove the `reduced` guards in `src/components/fx/ClientFx.tsx`.

---

## Deploying

The first deploy is documented step-by-step in
[`docs/session-3-deploy.md`](docs/session-3-deploy.md), including the
Vercel-CLI commands for setting up a project under the band's account using an
access token (the free-tier workaround for not being able to invite team
members). Read that file once before trying to deploy.

After the first deploy, Vercel auto-deploys on every push to `main`. Nothing
else to do.

---

## Known quirks

- **The cursor is hidden on non-touch devices.** We replace it with a small dot
  and a trailing ring. On touch devices (phones, tablets) we leave the system
  cursor alone. If you test on a touch laptop you will find an odd middle
  ground where neither works well. Touch laptops are a design edge case that
  the web still has not solved.
- **The kinetic hero letters get randomly coloured on every page load.** This
  is a feature. If it weren't random, people would ask why the C is always
  pink.
- **The homepage BRT clock is computed client-side** and will briefly show
  `—:—` during hydration. Attempting to fix this causes timezone bugs that
  outweigh the aesthetic cost.
- **Admin pages use the old design tokens** under back-compat Tailwind
  aliases. This was a deliberate trade: it keeps admin visually consistent
  with session 1 so the band owner has a stable tool, while the public site
  gets the samba aesthetic. Redesigning admin is a future session.
- **The music player's waveform is synthetic.** There is no audio. The bars
  look like they're reacting to sound, but they're driven by trigonometry.

---

## Contributing

This project serves one person, so "contributing" mostly means "hey, could
you…" messages. But if you're poking at it:

1. Make a branch
2. `npm run build` before you commit — TypeScript and ESLint run as part of it
3. Keep components single-purpose and under 200 lines where you can
4. All user-visible text through `next-intl`. `t("some.key")`, not `"Some text"`.
5. New motion effects: put them in `src/components/fx/` and respect
   `prefers-reduced-motion` and `(hover: none)`. The building blocks are
   already there; re-use `useReducedMotion()`.

---

## Credits

- Band: **Cores do Samba** — Salvador, Bahia
- Site built by: **Nir** (nirpache1989-gif) for the band
- Design prototype: the static files in [`assets/`](assets/)
- Claude Code did most of the typing

## License

All rights reserved to Cores do Samba. Don't clone this to build a website
for a different samba band, unless you ask first and the answer is yes.
