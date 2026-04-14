# Cores do Samba — Project Documentation

## Overview
Portuguese rock band website built with Next.js 14 (App Router) + TypeScript + Tailwind CSS.
Content is managed through an /admin panel. Hosted on Vercel with Supabase backend.

## Tech Stack
- **Framework**: Next.js 14, App Router, TypeScript (strict)
- **Styling**: Tailwind CSS with CSS variables in `src/styles/globals.css`
- **Database**: Supabase (PostgreSQL + Storage)
- **i18n**: next-intl v4 — Portuguese (default) + English
- **Email**: Resend (contact form notifications)
- **Animation**: GSAP + ScrollTrigger (installed, NOT wired to components yet)

## Design System
- **Accent**: Burnt orange `#E85D04` on `#0a0a0a` dark base
- **Display font**: Bebas Neue (condensed grotesque)
- **Body font**: IBM Plex Mono
- **Aesthetic**: Raw editorial meets underground music zine
- All design tokens are CSS variables in `src/styles/globals.css`
- Tailwind references these variables — see `tailwind.config.ts`

## Project Structure
```
src/
  app/
    layout.tsx              ← Root layout (delegates to [locale])
    [locale]/
      layout.tsx            ← Locale layout with providers
      page.tsx              ← Homepage
      shows/page.tsx        ← Shows listing
      music/page.tsx        ← Music with YouTube embeds
      gallery/page.tsx      ← Photo gallery
      contact/page.tsx      ← Contact form
      admin/
        layout.tsx          ← Admin sidebar layout
        login/page.tsx      ← Password login
        page.tsx            ← Dashboard
        shows/page.tsx      ← Manage shows
        music/page.tsx      ← Manage tracks
        gallery/page.tsx    ← Manage photos
        band-info/page.tsx  ← Edit band info
    api/
      contact/route.ts      ← POST: send email via Resend
      admin/
        auth/route.ts       ← POST: verify password, set cookie
        shows/route.ts      ← CRUD
        music/route.ts      ← CRUD
        gallery/route.ts    ← CRUD + Storage upload
        band-info/route.ts  ← GET/PUT
  components/
    layout/                 ← Header, Footer, LanguageToggle
    sections/               ← Hero, ShowsList, MusicPlayer, Gallery, ContactForm
    ui/                     ← Button, Card, Modal
  lib/
    gsap.ts                 ← GSAP + ScrollTrigger (ready, not wired)
    supabase.ts             ← Supabase client
    resend.ts               ← Resend client
  i18n/
    routing.ts              ← Locale routing config
    navigation.ts           ← Typed navigation helpers (Link, useRouter, etc.)
  i18n.ts                   ← next-intl request config
  middleware.ts             ← Locale routing + admin auth
  styles/
    globals.css             ← Design tokens + base styles
  types/
    database.ts             ← TypeScript interfaces for all DB tables
messages/
  pt.json                   ← Portuguese translations
  en.json                   ← English translations
```

## Database Tables
- `band_info` — singleton: name, bio (pt/en), logo, socials (instagram, youtube, facebook)
- `shows` — date, venue, city, country, ticket_url, is_past
- `gallery` — image_url, caption (pt/en)
- `music` — title, youtube_url, cover_url, release_year
- `contact` — email, phone
- Storage bucket: `band-assets` (public)

## Key Conventions
- All text through next-intl (no hardcoded strings)
- Server Components for reads, API Routes for writes
- All animatable sections use `data-animate="sectionName"` attributes
- All components accept `className` prop for GSAP ref compatibility
- No inline styles that conflict with GSAP transforms
- Admin auth: password from `ADMIN_PASSWORD` env → httpOnly cookie
- Band name: "Cores do Samba"

## Environment Variables
See `.env.local.example` for all required variables.

## Commands
- `npm run dev` — development server (port 3000)
- `npm run build` — production build
- `npm run lint` — ESLint check
