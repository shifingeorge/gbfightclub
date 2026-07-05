import Link from "next/link";
import type { Metadata } from "next";
import { DISCIPLINES, SITE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: `${SITE.name} — Boxing, Kickboxing, Muay Thai & MMA in Kaloor, Kochi`,
  description: SITE.description,
};

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-24">
          <p className="eyebrow">
            Est. Kaloor · Ernakulam · ★ {SITE.rating.value} on{" "}
            {SITE.rating.source}
          </p>
          <h1 className="display mt-6 text-[17vw] leading-[0.88] sm:text-8xl lg:text-9xl">
            Walk in.
            <br />
            <span className="text-blood">Fight</span> your
            <br />
            way out.
          </h1>
          <p className="mt-8 max-w-md text-lg text-bone-dim">
            Boxing, kickboxing, Muay Thai and MMA under real coaching — from
            your first class to your first fight. Doors open {SITE.opens} AM.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href={waLink(`Hi ${SITE.name}, I want to book a trial class.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blood px-7 py-4 text-base font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot"
            >
              Book a trial class
            </a>
            <Link
              href="/programs"
              className="border border-rule px-7 py-4 text-base font-semibold uppercase tracking-wide text-bone transition-colors hover:border-bone"
            >
              See programs
            </Link>
          </div>
        </div>
      </section>

      {/* Disciplines strip — fight-card rows */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <p className="eyebrow">Tonight&apos;s card — every night&apos;s card</p>
          <ul className="mt-8">
            {DISCIPLINES.map((d, i) => (
              <li key={d.slug} className="border-t border-rule last:border-b">
                <Link
                  href={`/programs#${d.slug}`}
                  className="group flex items-baseline gap-4 py-6 transition-colors hover:bg-coal sm:gap-8"
                >
                  <span className="font-mono text-sm text-bone-dim">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="display text-4xl transition-colors group-hover:text-blood-hot sm:text-6xl">
                    {d.name}
                  </span>
                  <span className="ml-auto hidden font-mono text-xs text-bone-dim sm:block">
                    {d.hook}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Why GB */}
      <section className="border-b border-rule bg-coal">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="display text-4xl sm:text-5xl">
            Why people stay<span className="text-blood">.</span>
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            <div className="border-l-2 border-blood pl-5">
              <h3 className="text-lg font-semibold uppercase tracking-wide">
                Real coaching
              </h3>
              <p className="mt-2 text-sm leading-6 text-bone-dim">
                Structured sessions, corrected technique, honest feedback. Not
                a cardio class with gloves on.
              </p>
            </div>
            <div className="border-l-2 border-blood pl-5">
              <h3 className="text-lg font-semibold uppercase tracking-wide">
                {SITE.rating.value}★ rated
              </h3>
              <p className="mt-2 text-sm leading-6 text-bone-dim">
                {SITE.rating.count} reviews on {SITE.rating.source}. The
                reputation is earned round by round.
              </p>
            </div>
            <div className="border-l-2 border-blood pl-5">
              <h3 className="text-lg font-semibold uppercase tracking-wide">
                All levels
              </h3>
              <p className="mt-2 text-sm leading-6 text-bone-dim">
                First-timers train beside amateur fighters. Everyone starts
                somewhere; everyone gets coached.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Timings teaser */}
      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">Bell rings at</p>
              <p className="display mt-3 text-7xl text-blood sm:text-8xl">
                6:00 AM
              </p>
              <p className="mt-3 max-w-sm text-sm text-bone-dim">
                Morning and evening batches, six days a week. Full timetable on
                the schedule page.
              </p>
            </div>
            <Link
              href="/schedule"
              className="border border-rule px-6 py-3 text-sm font-semibold uppercase tracking-wide transition-colors hover:border-bone"
            >
              Full schedule & fees
            </Link>
          </div>
        </div>
      </section>

      {/* Location */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-10 md:grid-cols-2">
            <div>
              <p className="eyebrow">The gym</p>
              <h2 className="display mt-4 text-4xl sm:text-5xl">
                Ashoka Road,
                <br />
                Kaloor.
              </h2>
              <address className="mt-6 text-base not-italic leading-7 text-bone-dim">
                {SITE.address.street}, {SITE.address.locality}
                <br />
                {SITE.address.region} {SITE.address.postalCode}
              </address>
              <div className="mt-6 flex flex-wrap gap-4">
                <a
                  href={SITE.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold uppercase tracking-wide text-blood-hot underline-offset-4 hover:underline"
                >
                  Open in Google Maps →
                </a>
                <a
                  href={`tel:${SITE.phone}`}
                  className="text-sm font-semibold uppercase tracking-wide underline-offset-4 hover:underline"
                >
                  Call {SITE.phoneDisplay}
                </a>
              </div>
            </div>
            <div className="min-h-72 border border-rule">
              <iframe
                title={`${SITE.name} location map`}
                src={SITE.mapsEmbed}
                className="h-full min-h-72 w-full grayscale invert-[.92] contrast-90"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
