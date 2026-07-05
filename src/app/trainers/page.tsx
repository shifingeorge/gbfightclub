import type { Metadata } from "next";
import { SITE, waLink } from "@/lib/site";

export const metadata: Metadata = {
  title: "Trainers",
  description: `Meet the coaching team at ${SITE.name} — boxing, kickboxing, Muay Thai and MMA coaches in Kaloor, Kochi.`,
};

// TODO(client): real names, credentials and photos.
const TRAINERS = [
  { name: "Head Coach", discipline: "Boxing · Kickboxing", credentials: "Bio coming soon." },
  { name: "Coach", discipline: "Muay Thai", credentials: "Bio coming soon." },
  { name: "Coach", discipline: "MMA", credentials: "Bio coming soon." },
];

export default function TrainersPage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="eyebrow">Trainers</p>
          <h1 className="display mt-4 text-6xl sm:text-8xl">
            The corner
            <br />
            you <span className="text-blood">trust</span>.
          </h1>
          <p className="mt-6 max-w-md text-lg text-bone-dim">
            Full coach profiles are on their way. Until then, come meet them in
            person — first class is the best introduction.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="grid gap-px border border-rule bg-rule sm:grid-cols-3">
            {TRAINERS.map((t, i) => (
              <div key={i} className="bg-ink p-6">
                <div className="flex aspect-4/5 items-end bg-coal p-4">
                  <span className="display text-6xl text-bone-dim/30">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <h2 className="mt-5 text-lg font-semibold uppercase tracking-wide">
                  {t.name}
                </h2>
                <p className="eyebrow mt-1">{t.discipline}</p>
                <p className="mt-3 text-sm text-bone-dim">{t.credentials}</p>
              </div>
            ))}
          </div>
          <a
            href={waLink(`Hi ${SITE.name}, I'd like to know more about the coaches.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-block bg-blood px-6 py-3 text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot"
          >
            Meet them — book a trial
          </a>
        </div>
      </section>
    </>
  );
}
