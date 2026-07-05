# GB Fight Club — Build Tracker

Source plan: [IMPLEMENTATION.md](./IMPLEMENTATION.md). One line per minor task. Status: `[ ]` todo · `[x]` done · `[~]` in progress · `[!]` blocked (reason noted).

> **⛳ CHECKPOINT — 2026-07-05:** v1 code complete + verified locally; committed as first git checkpoint. Pending user: `npx convex dev` login + env vars, Vercel deploy + DNS, real phone/WhatsApp in `src/lib/site.ts`. Next build step: Phase 2 (v2 events).

## Phase 0 — Scaffold
- [x] Next.js 16 (App Router, TS) + Tailwind 4 scaffold
- [x] Design tokens: warm near-black `#0A0908`, bone `#EDE6DA`, blood `#B80C24`; Big Shoulders (display) + Barlow (body) + IBM Plex Mono (data) in `globals.css` + `layout.tsx`
- [x] Convex installed + `convex/schema.ts` with `enquiries` table
- [x] `convex/_generated` placeholder stubs (runtime-identical; real codegen overwrites on first `npx convex dev`)
- [x] `.env.example` (NEXT_PUBLIC_CONVEX_URL, ADMIN_PASSWORD)
- [!] Convex deployment created — **user action**: run `npx convex dev` (interactive login), then set `NEXT_PUBLIC_CONVEX_URL`
- [!] Vercel deploy + Hostinger DNS — **user action**
- Note: no Convex client provider in v1 — server-side `ConvexHttpClient` only (form action + admin). Provider added in v2 when realtime needed.

## Phase 1 — v1 Brochure Site
### Shared shell
- [x] Site header / nav (sticky, mobile hamburger, active state)
- [x] Footer (address, phone, WhatsApp, hours, rating, page links)
- [x] Root metadata + OpenGraph defaults (`metadataBase`, title template)

### Pages
- [x] Home: hero (poster-type headline + trial-class WhatsApp CTA)
- [x] Home: disciplines strip (fight-card rows w/ bout numbers → /programs anchors)
- [x] Home: why-GB section (coaching / 4.9★ / all levels)
- [x] Home: class timings teaser (6:00 AM block)
- [x] Home: location block + Google Maps embed (dark-inverted)
- [x] Programs page (single page, anchor per discipline, per-discipline WhatsApp CTA)
- [x] Schedule & Fees page (timetable grid + fee cards — placeholder data, marked TODO(client))
- [x] Trainers page (placeholder cards, marked TODO(client))
- [x] Gallery page (masonry columns, duotone placeholder tiles until real photos)
- [x] Contact page: address, `tel:`, WhatsApp deep link, map embed
- [x] Contact page: enquiry form (name/phone/interest/message)

### Data
- [x] `enquiries` Convex mutation + server-side validation (`convex/enquiries.ts`)
- [x] Form submit → server action → ConvexHttpClient; WhatsApp fallback when Convex unset/unreachable — **verified in browser**

### Admin
- [x] `/admin` enquiries table (server-side Convex query, noindex, force-dynamic)
- [x] Admin gate — password (env `ADMIN_PASSWORD`, httpOnly cookie, 12h) — **verified in browser**; swap to Convex Auth in v2 *(deviation: Convex Auth needs live deployment, deferred to v2 where accounts are required)*

### SEO
- [x] Per-page metadata + OpenGraph (all 6 pages)
- [x] `LocalBusiness` JSON-LD (address, geo 10.0041578/76.291446, hours, 4.9/72 rating) in layout
- [x] `sitemap.ts` + `robots.ts` (admin disallowed)

### Verify
- [x] `npm run build` clean (all pages static, /admin dynamic)
- [x] `npm run lint` clean
- [x] Headless browser pass: home mobile/tablet/desktop, contact form submit → fallback, admin login → enquiries view, zero console errors
- [!] Lighthouse mobile + real device — after Vercel deploy (**user action**)

## Deploy checklist (user)
1. `npx convex dev` (login, creates deployment, regenerates `convex/_generated`)
2. Copy Convex URL → `NEXT_PUBLIC_CONVEX_URL` in `.env.local` + Vercel env
3. Set `ADMIN_PASSWORD` in `.env.local` + Vercel env
4. Vercel import → deploy → point Hostinger DNS
5. Replace placeholders in `src/lib/site.ts`: phone, WhatsApp number, closing time, domain, timetable slots

## Phase 2 — v2 Events & Registration (not started)
## Phase 3 — v2.1 Interclub Matchmaking (not started)
## Phase 4 — v3 Shop (not started)

## Open items (client input, non-blocking)
1. Club logo + brand color → final design tokens
2. Real phone/WhatsApp number → `src/lib/site.ts`
3. Fee structure, timetable, trainer bios/photos → replace placeholders
4. Razorpay yes/no (phase 4b)
5. Experience-level category dimension (v2.1 config flag)
6. Club UPI QR image (v2 payment instructions)
