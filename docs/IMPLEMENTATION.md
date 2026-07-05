# GB Fight Club — Website Implementation Plan (v1 → v2 → v2.1 → v3)

## ⛳ Status checkpoint — 2026-07-05

**Current step:** Phase 1 (v1 brochure site) code **complete and verified locally** — all 6 pages, enquiry form with WhatsApp fallback, password-gated `/admin` enquiries view, SEO/JSON-LD/sitemap. Build + lint clean, flows driven in headless browser. Per-task detail: [TRACKER.md](./TRACKER.md).

**Pending — two things only the user can do (tracker "Deploy checklist"):**
1. Run `npx convex dev` — interactive login; creates deployment and regenerates `convex/_generated` (runtime-identical placeholders stubbed so build works now). Then set `NEXT_PUBLIC_CONVEX_URL` + `ADMIN_PASSWORD` (see `.env.example`).
2. Vercel deploy + Hostinger DNS. Also replace placeholder phone/WhatsApp number in `src/lib/site.ts`.

Tip: type `! npx convex dev` in the Claude Code prompt to run the login in-session.

**Next step after deploy:** Phase 2 — v2 Events & Registration (events CRUD, public registration, admin registrations + CSV).

---

## Context

GB Fight Club is a martial arts gym on Ashoka Road, Kaloor, Ernakulam 682017 (Kochi), rated 4.9/5 on Justdial (72 reviews), opens 6:00 AM. It teaches boxing, kickboxing, Muay Thai, MMA and related disciplines. The club needs a website that grows in three stages:

- **v1** — clean brochure website for the club (brand, programs, contact)
- **v2** — event creation + online registration with data saving
- **v2.1** — interclub fighter matchmaking: clubs from any Indian state register fighters, app sorts by category, randomly matches fighters, never pairing two fighters from the same club
- **v3** — small ecommerce shop for gloves, pads, and fight accessories

One codebase evolves through all versions. Project lives at `/home/shiftd/code/gbfightclub/` (currently empty).

### Decisions already made (with user)
| Decision | Choice |
|---|---|
| Stack | Next.js (App Router) + Convex (DB, server functions, file storage, auth) |
| Payments | **Offline first** (pay at gym / UPI QR shown after registration). Razorpay added later after client discussion |
| Match categories | Discipline + weight class + gender + age group. Experience level pending client confirmation |
| Interclub registration | Club rep account registers their fighter roster (not individual fighters) |
| Admin | Full protected `/admin` dashboard |
| Hosting | Vercel + domain already bought on Hostinger (DNS pointed to Vercel) |
| Assets | Logo provided by user; stock/free photos for the rest |

### Design direction (not generic, not "AI-looking")
- **Theme:** dark, minimal, type-driven. Near-black background, off-white text, one aggressive accent (blood red or club logo color once received). No purple gradients, no glassmorphism, no emoji-icon grids.
- **Type:** bold condensed display face for headlines (e.g. Archivo Expanded/Black or Bebas-style), clean grotesk for body (Inter or similar). Big uppercase headlines, tight tracking.
- **Imagery:** gritty B&W or desaturated gym/fight photography (Unsplash/Pexels), duotone-treated to match accent. Real club photos swap in later.
- **Layout:** generous whitespace, strong grid, minimal motion — only scroll-reveal and hover states. No parallax circus.
- The `frontend-design` skill will be invoked at build time for the visual pass.

---

## Architecture

```
Next.js 15 (App Router, TypeScript, Tailwind CSS)
  ├── public site (v1 pages)            — static/ISR, SEO-focused
  ├── /events + registration (v2)       — Convex mutations
  ├── /clubs portal (v2.1)              — Convex Auth (club rep accounts)
  ├── /shop (v3)                        — catalog + orders in Convex
  └── /admin (all versions)             — Convex Auth (admin role)

Convex
  ├── schema + queries/mutations (typed)
  ├── Convex Auth (@convex-dev/auth) — email/password; roles: admin | club_rep
  ├── file storage — fighter photos, product images, event posters
  └── matchmaking logic as a server mutation (pure function, unit-testable)

Deploy: Vercel (frontend) + Convex Cloud (free tier) + Hostinger DNS → Vercel
```

Why Convex over Neon+Drizzle: admin dashboard and live match-card updates come nearly free (realtime queries), no ORM/API wiring, one deploy step. Supabase excluded (user: unavailable/banned in India).

---

## V1 — Club Website (brochure)

### Pages & sections
1. **Home** — full-bleed hero (headline + train-with-us CTA), disciplines strip (Boxing / Kickboxing / Muay Thai / MMA), why-GB section (coaching, 4.9★ rating, all levels), class timings teaser, location block with embedded map, footer.
2. **Programs** — one section per discipline: what it is, who it's for, schedule slot. Single page with anchors (not 4 thin pages).
3. **Schedule & Fees** — weekly timetable grid, batch timings (opens 6 AM), fee structure *(content needed from club — placeholder until then)*.
4. **Trainers** — cards: photo, name, discipline, credentials *(content from club)*.
5. **Gallery** — masonry grid, stock now, real photos later.
6. **Contact** — address (Ashoka Road, Kaloor), phone with `tel:` link, **WhatsApp deep link** (primary CTA — this is how Kerala gyms actually get enquiries), Google Maps embed, enquiry form (name/phone/interest → saved to Convex `enquiries` table + admin sees them).

### v1 technical
- Static generation for all pages; metadata + OpenGraph per page; `LocalBusiness` JSON-LD schema (name, address, geo 10.0041578/76.291446, hours, rating) for local SEO ("boxing gym kochi", "muay thai kaloor").
- Mobile-first — audience is almost entirely phones.
- Sitemap + robots. Google Business Profile link-out.
- Only Convex usage in v1: `enquiries` table (form works day one, no mailbox setup needed).

---

## V2 — Events & Registration

### Features
- **Admin creates events**: name, poster (Convex file storage), date/venue, description, discipline(s), registration deadline, fee amount (display only — payment offline), max participants (optional).
- **Public `/events`** — upcoming/past events. Event detail page with poster + register CTA.
- **Registration form** (public, no account needed in v2): name, age/DOB, gender, phone, email, discipline, weight (kg), experience note, emergency contact. Server-side validation in Convex mutation.
- **Post-submit screen**: confirmation + registration ID + "pay at gym / UPI QR" instructions (club's UPI QR image configurable in admin).
- **Admin**: per-event registrations table — search/filter, mark payment received (manual toggle), mark attended, **CSV export**.

### Data model (Convex)
```
events:        name, slug, posterId, date, venue, description,
               disciplines[], deadline, feeInr, maxParticipants?, status
registrations: eventId, name, dob, gender, phone, email, discipline,
               weightKg, experienceNote?, emergencyContact,
               paymentStatus: "pending"|"received", attended?, createdAt
enquiries:     name, phone, interest, message?, createdAt   (from v1)
```

---

## V2.1 — Interclub Matchmaking System

### Flow
1. **Club registration**: club rep signs up (Convex Auth) → submits club profile: club name, city, **state** (dropdown of Indian states), coach name, phone. Status `pending` until **admin approves** (prevents junk clubs).
2. **Fighter roster**: approved club rep adds fighters to an open event: name, DOB, gender, discipline, weight (kg), photo (optional). Roster editable until registration deadline.
3. **Auto-categorization**: app derives category key per fighter:
   `discipline + gender + ageGroup(DOB→ event-configured brackets) + weightClass(kg→ standard bands per discipline)`.
   Weight bands and age brackets are **configurable per event in admin** (sensible defaults seeded, e.g. Muay Thai bands −48/−51/−54/−57/−60/−63.5/−67/−71/−75/−81/+81). Experience-level dimension left as optional config flag (pending client confirmation).
4. **Matchmaking (admin triggers)** — per category:
   - shuffle fighters (seeded RNG so a run is reproducible),
   - greedy pairing with hard constraint **`fighter.clubId !== opponent.clubId`**,
   - backtracking pass when greedy dead-ends (e.g. remaining pool all same club),
   - odd fighter or unpairable fighter → **BYE**, flagged for admin,
   - categories with 1 fighter or all-one-club → flagged "no valid matches" for admin to manually merge into adjacent category if desired.
   - Pure TypeScript function, unit-tested (same-club never paired; bye handling; all-same-club edge case).
5. **Admin review**: sees draft bracket → can **reroll** a category, manually swap fighters (with same-club violation warning), then **publish**.
6. **Published match card**: public page `/events/[slug]/matches` — bouts grouped by category: Red corner vs Blue corner, club names, state. Clubs see it live (Convex realtime). Printable/simple layout.

### Data model additions
```
clubs:    name, city, state, coachName, phone, ownerUserId,
          status: "pending"|"approved"|"rejected"
fighters: clubId, eventId, name, dob, gender, discipline, weightKg,
          photoId?, categoryKey (derived)
matches:  eventId, categoryKey, redFighterId, blueFighterId|null (bye),
          boutNumber, status: "draft"|"published"
eventCategoryConfig: eventId, discipline, ageBrackets[], weightBands[]
```

### v2 → v2.1 note
v2's public individual registration stays for GB's own local events; v2.1 club-roster flow applies to events flagged `type: "interclub"`. One events system, two registration modes.

---

## V3 — Ecommerce (accessories shop)

Deliberately light — not a marketplace, a club shop.

- **Catalog** `/shop`: products (gloves, pads, wraps, guards, apparel), category filter, product page with images, sizes/variants, price, stock.
- **Cart** (localStorage) → **checkout form**: name, phone, address OR "pickup at gym" toggle.
- **Payment v3.0**: offline — order placed as `pending`, UPI QR / pay-on-pickup instructions shown. **Razorpay slot designed in** (order flow already has `paymentStatus`; adding Razorpay later = checkout step swap, no schema change).
- **Admin**: product CRUD with image upload, stock/variant management, orders list with status pipeline (pending → confirmed → ready/shipped → completed), mark paid.
- Order confirmation via WhatsApp deep link ("Hi, I placed order #123") — no email infra needed.

### Data model additions
```
products: name, slug, description, category, priceInr, imageIds[],
          variants[{label, stock}], active
orders:   items[{productId, variant, qty, priceInr}], name, phone,
          address?, fulfillment: "delivery"|"pickup",
          paymentStatus, orderStatus, createdAt
```

---

## Admin Dashboard (grows per version)

`/admin` — Convex Auth, role `admin`. Sidebar sections appear as versions ship:
- v1: Enquiries
- v2: Events CRUD, Registrations (+CSV export, payment toggle)
- v2.1: Club approvals, Fighters overview, Matchmaking (run/reroll/swap/publish), category config
- v3: Products, Orders

---

## Build order & milestones

| Phase | Deliverable | Scope |
|---|---|---|
| 0 | Scaffold | Next.js + Tailwind + Convex + Convex Auth wired, deployed to Vercel, domain connected, design tokens (colors/type) set from logo |
| 1 | **v1 live** | All 6 pages, enquiry form, SEO/JSON-LD, mobile polish, admin enquiries view |
| 2 | **v2 live** | Events CRUD, public registration, confirmation w/ UPI instructions, admin registrations + CSV |
| 3 | **v2.1 live** | Club auth + approval, roster, category engine, matchmaking algorithm + tests, admin bracket review, public match card |
| 4 | **v3 live** | Catalog, cart, offline checkout, admin products/orders. (4b: Razorpay when client confirms) |

Each phase ships independently — v1 goes live before v2 work starts.

## Verification
- **Matchmaking**: unit tests (Vitest) on the pure pairing function — no same-club pair across 1000 random rosters, bye correctness, all-same-club category flagged.
- **Flows**: drive each end-to-end after build (gstack headless browser) — enquiry submit → appears in admin; event registration → CSV export; club signup → approve → roster → run match → publish → public card; shop order → admin order pipeline.
- **v1**: Lighthouse mobile pass, JSON-LD validation, real-device check.

## Open items (need client / user input, don't block build)
1. Club logo file + brand color (blocks final design tokens, not scaffold)
2. Fee structure, timetable, trainer bios/photos (v1 content — placeholders till then)
3. Razorpay yes/no + KYC (phase 4b)
4. Experience-level as a match category dimension (config flag ready either way)
5. Club UPI QR image for payment instructions

## First implementation step (after approval)
Write this plan as `docs/IMPLEMENTATION.md` inside `gbfightclub/`, then Phase 0 scaffold.
