# Session 3 — Deploy Playbook

Everything needed to ship Cores do Samba live, end-to-end. Execute top-to-bottom.

**Deployment path chosen:** Viviane deploys via her own Vercel + GitHub integration (she's already a collaborator on the repo). This is simpler than the access-token CLI flow and doesn't require Nir to run commands. The old CLI/token path is documented at the bottom as a fallback.

---

## 0. Prerequisites checklist

Before starting, confirm:

- [ ] **Nir accepted Supabase invite** to `nirpache1989@gmail.com` — makes her Supabase project visible in your dashboard.
- [ ] **Viviane is a GitHub collaborator** on `nirpache1989-gif/viviband` — verified via `gh api repos/nirpache1989-gif/viviband/collaborators`. (Already done.)
- [ ] Supabase anon key in hand: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwemd5a3RpaWN2a3N2enp0ZHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODQ5MTEsImV4cCI6MjA5MTc2MDkxMX0.Hzybnk0z9hk7PER3ojfvZw8HgM4my3aoVX3DDtSWBew`
- [ ] Resend API key: `re_WQAc7PsB_L4Mp3gi62nx6UgfU89q9m7y9`
- [ ] Contact email: `vivianesalvadordossantos@gmail.com`
- [ ] GitHub repo up-to-date: `nirpache1989-gif/viviband` with session-2 design overhaul merged (commit `d729d10` or later)

---

## 1. Run the schema on her Supabase

Once Nir has access to her Supabase project:

1. Open `https://supabase.com/dashboard/project/vpzgyktiicvksvzztdun/sql/new`
2. Paste the **full contents** of `supabase/schema.sql` and click **Run**
3. Verify in **Table Editor**: tables `band_info`, `shows`, `gallery`, `music`, `contact` all exist
4. Verify **Storage** → bucket `band-assets` exists and is public

If she already ran an older schema without the site-settings columns, run this additive migration instead:
- Paste `supabase/migrations/001_site_settings.sql` in the SQL Editor and click Run

---

## 2. Generate a secure admin password

```bash
openssl rand -base64 24
```

Save the output — Viviane will use this to log into `/admin` on the live site.

---

## 3. Deploy to her Vercel via GitHub integration (preferred)

Viviane handles this herself from her Vercel dashboard. Nir sends her the env vars and waits for the URL.

### 3a. Send Viviane the env vars message

Paste this into WhatsApp / email, filled in:

```
NEXT_PUBLIC_SUPABASE_URL=https://vpzgyktiicvksvzztdun.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwemd5a3RpaWN2a3N2enp0ZHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYxODQ5MTEsImV4cCI6MjA5MTc2MDkxMX0.Hzybnk0z9hk7PER3ojfvZw8HgM4my3aoVX3DDtSWBew
ADMIN_PASSWORD=<the-password-from-step-2>
RESEND_API_KEY=re_WQAc7PsB_L4Mp3gi62nx6UgfU89q9m7y9
BAND_CONTACT_EMAIL=vivianesalvadordossantos@gmail.com
```

Also send the PDF `docs/cores-do-samba-vercel-deploy.pdf` — it walks her through the Vercel import UI.

### 3b. Wait for her to deploy

She will:
1. Go to https://vercel.com/new
2. Connect GitHub if she hasn't already (grant access to at least `nirpache1989-gif/viviband`)
3. Import the repo
4. Paste the env vars (Vercel's env-var input accepts a whole `.env` block pasted at once)
5. Click Deploy
6. Send Nir the live URL

### 3c. Alternative: CLI via access token (fallback)

If for any reason the GitHub integration doesn't work (e.g. she can't grant Vercel access to Nir's repo from her GitHub), fall back to CLI with her access token. See **Appendix A** at the end of this file.

---

## 4. Smoke test the live site

Against the production URL:

- [ ] `/pt` homepage loads. Custom cursor visible, brush trail follows mouse, kinetic "CORES DO SAMBA" letters sway, marquees scroll, BRT clock ticks.
- [ ] `/pt/shows` — tabs switch between Próximos / Anteriores, hover wipe on rows.
- [ ] `/pt/music` — vinyl spins when play button clicked, waveform bars pulse.
- [ ] `/pt/gallery` — tile click opens lightbox, Escape closes it.
- [ ] `/pt/contact` — submit form with a test message. Check inbox `vivianesalvadordossantos@gmail.com` received the email via Resend.
- [ ] Language toggle PT/EN — pages re-render in English correctly.
- [ ] Admin flow:
  - `/pt/admin/login` → paste the password → redirects to `/pt/admin` dashboard.
  - Add a test show, refresh `/pt/shows` → it appears.
  - Delete the test show.
- [ ] **Tweaks panel gating:**
  - Open homepage in **incognito** → no panel visible.
  - Log into `/admin` → panel appears bottom-right on public pages.
  - Change palette → site updates live, status shows "Saved".
  - Reload page in incognito — new palette persists (proves SSR is reading the DB).
- [ ] Reduced motion — enable OS "reduce motion", confirm cursor + sway disable, content still readable.
- [ ] Touch — Chrome DevTools mobile emulator, confirm system cursor is restored and no brush trail.

---

## 5. Send Viviane the handover message

When everything is green:

> Olá Vivi! O site está no ar:
> - **Link público**: https://cores-do-samba.vercel.app
> - **Admin**: https://cores-do-samba.vercel.app/pt/admin
> - **Senha do admin**: `<the-password-from-step-2>`
>
> No admin você pode:
> - Adicionar shows, músicas e fotos
> - Editar a bio da banda e links sociais
> - Trocar a paleta de cores do site (ícone no canto inferior direito quando logada)
>
> Me avisa se algo não parecer certo!

---

## 6. Post-deploy follow-ups (optional, not blocking)

- Custom domain: when she has one (e.g. `coresdosamba.com`), add via Vercel → Domains → Add.
- Upload real photos via `/admin/gallery` — until then, gradient placeholders show.
- Upload real YouTube URLs via `/admin/music` — play button on homepage player will embed the video.
- Configure Resend sender domain instead of `onboarding@resend.dev` (requires DNS on her domain).
- Optional: transfer the GitHub repo from `nirpache1989-gif/viviband` to her GitHub account once she's set up long-term.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Build fails on Vercel with `Missing NEXT_PUBLIC_SUPABASE_URL` | Env var wasn't set for Production scope | Re-run `vercel env add ... production` and redeploy |
| Pages render but no data | Schema not run, or wrong anon key | Re-run `supabase/schema.sql`, verify key matches project |
| Admin login always fails | `ADMIN_PASSWORD` not set or mismatched | Reset via `vercel env rm ADMIN_PASSWORD production` then `vercel env add ...` |
| Tweaks panel never appears after login | `admin-session` cookie blocked or domain mismatch | Confirm login POST returned 200 and cookie set; check DevTools → Application → Cookies |
| Contact form "Failed to send" | Resend key missing or `BAND_CONTACT_EMAIL` unset | Check Resend dashboard → Logs; confirm both env vars present |
| Palette change doesn't persist for visitors | `001_site_settings.sql` not run | Run the migration — panel writes succeed silently but SSR can't read missing columns |

---

## Appendix A — CLI deploy via Vercel access token (fallback)

Only use this if the GitHub-integration path doesn't work (e.g. GitHub-GitLab-Bitbucket dropdown doesn't show the repo).

### A1. Install Vercel CLI

```bash
npm i -g vercel
```

### A2. Ask Viviane for an access token

Generate at https://vercel.com/account/tokens — scope "Full Account", no expiration.

### A3. Link + deploy

```bash
export VERCEL_TOKEN="<paste-her-token>"
vercel link --yes --token=$VERCEL_TOKEN
# (pick her personal scope)

echo "https://vpzgyktiicvksvzztdun.supabase.co" | vercel env add NEXT_PUBLIC_SUPABASE_URL production --token=$VERCEL_TOKEN
echo "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." | vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production --token=$VERCEL_TOKEN
echo "<password>" | vercel env add ADMIN_PASSWORD production --token=$VERCEL_TOKEN
echo "re_WQAc7PsB_L4Mp3gi62nx6UgfU89q9m7y9" | vercel env add RESEND_API_KEY production --token=$VERCEL_TOKEN
echo "vivianesalvadordossantos@gmail.com" | vercel env add BAND_CONTACT_EMAIL production --token=$VERCEL_TOKEN

vercel deploy --prod --token=$VERCEL_TOKEN
```
