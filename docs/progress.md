# Cores do Samba — Build Progress

## Phase 1: Project Scaffold + Design System - COMPLETE
- [x] Next.js 14 scaffold (App Router, TypeScript, Tailwind)
- [x] Dependencies: gsap, @supabase/supabase-js, next-intl, next-themes, resend
- [x] Design system: CSS variables in `src/styles/globals.css`
- [x] Tailwind config with custom colors/fonts from CSS variables
- [x] Lib files: gsap.ts (GSAP+ScrollTrigger), supabase.ts (lazy-init), resend.ts (lazy-init)
- [x] i18n setup: routing.ts, navigation.ts, i18n.ts (request config)
- [x] Translation files: messages/pt.json, messages/en.json
- [x] Middleware: locale routing + admin auth protection
- [x] Type definitions: src/types/database.ts
- [x] CLAUDE.md, docs/progress.md, .env.local.example
- [x] .claude/launch.json (dev server config with autoPort)
- [x] Build verified

## Phase 2: Layout + Shared Components - COMPLETE
- [x] Root layout delegates to [locale]/layout.tsx
- [x] Locale layout with NextIntlClientProvider, Header, Footer
- [x] Header: nav links, language toggle, mobile hamburger menu
- [x] Footer: band name, social links (IG/YT/FB), copyright
- [x] LanguageToggle: PT/EN switcher using next-intl navigation
- [x] Button: primary/secondary/ghost variants, sm/md/lg sizes, Link support
- [x] Card: bg-secondary with border, optional hover effect
- [x] Modal: overlay, close button, escape key, click outside, scroll lock
- [x] Build verified

## Phase 3: Public Pages - COMPLETE
- [x] Homepage: Hero + ShowsList preview + MusicPlayer preview + CTAs
- [x] Hero: full-viewport, asymmetric typographic treatment, scroll indicator
- [x] Shows page: upcoming/past tabs, date/venue/city cards, ticket buttons
- [x] Music page: track grid with lazy YouTube embed, cover fallback (VB initials)
- [x] Gallery page: masonry grid with varied aspect ratios, lightbox modal
- [x] Contact page: form (name/email/subject/message) + contact info sidebar
- [x] All sections have data-animate attributes for GSAP readiness
- [x] All pages use placeholder data (ready to wire to Supabase)
- [x] Build verified

## Phase 4: API Routes - COMPLETE
- [x] POST /api/contact — validate + send email via Resend
- [x] POST/DELETE /api/admin/auth — password check, cookie set/clear
- [x] CRUD /api/admin/shows — full CRUD with Supabase
- [x] CRUD /api/admin/music — full CRUD with Supabase
- [x] POST/GET/DELETE /api/admin/gallery — upload to Storage + DB
- [x] GET/PUT /api/admin/band-info — singleton row update
- [x] All routes marked force-dynamic for runtime-only deps
- [x] Build verified

## Phase 5: Admin Panel - COMPLETE
- [x] Login page: password form → set httpOnly cookie
- [x] Admin layout: sidebar nav (desktop), horizontal scroll nav (mobile)
- [x] Dashboard: stats cards (upcoming shows, tracks, photos)
- [x] Shows management: table + add/edit/delete form with date picker
- [x] Music management: table + add/edit/delete form
- [x] Gallery management: file upload form + image grid with delete
- [x] Band info editor: name, bio (pt/en), logo URL, social links
- [x] Build verified

## Phase 6: Database + Final Integration - COMPLETE
- [x] supabase/schema.sql — all tables, RLS policies, storage bucket
- [x] Final documentation update
- [x] Build verified (27 pages + 6 API routes)

## What's Next (for the client)
1. Create Supabase project and run schema.sql
2. Set environment variables (see .env.local.example)
3. Deploy to Vercel
4. Sign up for Resend and add API key
5. ~~Replace "ViviBand" placeholder with actual band name~~ DONE — now "Cores do Samba"
6. Wire GSAP animations (lib/gsap.ts is ready, components have data-animate attrs)

## Known Issues
- None — all pages build and render correctly
- Supabase env vars must be set for API routes to function
