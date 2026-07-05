import type { Metadata } from "next";
import { DISCIPLINES, SITE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Programs",
  description: `Boxing, kickboxing, Muay Thai and MMA programs at ${SITE.name}, Kaloor, Kochi. All levels, structured coaching, morning and evening batches.`,
};

export default function ProgramsPage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="eyebrow">Programs</p>
          <h1 className="display mt-4 text-6xl sm:text-8xl">
            Four ways
            <br />
            to <span className="text-blood">fight</span>.
          </h1>
          <p className="mt-6 max-w-md text-lg text-bone-dim">
            Every program is coached, structured and scaled to your level. Try
            one, cross-train them all.
          </p>
        </div>
      </section>

      {DISCIPLINES.map((d, i) => (
        <section
          key={d.slug}
          id={d.slug}
          className={`scroll-mt-16 border-b border-rule ${i % 2 === 1 ? "bg-coal" : ""}`}
        >
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
              <div>
                <span className="font-mono text-sm text-bone-dim">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h2 className="display mt-2 text-5xl sm:text-6xl">{d.name}</h2>
                <p className="eyebrow mt-3">{d.hook}</p>
              </div>
              <div className="max-w-xl">
                <p className="text-base leading-7 text-bone">{d.blurb}</p>
                <dl className="mt-6 space-y-3 border-t border-rule pt-6">
                  <div className="flex gap-4">
                    <dt className="eyebrow w-24 shrink-0 pt-0.5">Who</dt>
                    <dd className="text-sm text-bone-dim">{d.forWho}</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="eyebrow w-24 shrink-0 pt-0.5">When</dt>
                    <dd className="font-mono text-sm text-bone-dim">{d.slot}</dd>
                  </div>
                </dl>
                <a
                  href={waLink(`Hi ${SITE.name}, I'm interested in ${d.name}.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-block bg-blood px-5 py-3 text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot"
                >
                  Ask about {d.name}
                </a>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
