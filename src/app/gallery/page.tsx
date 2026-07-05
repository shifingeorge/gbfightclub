import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Gallery",
  description: `Inside ${SITE.name} — training floor, bags, ring and fight nights in Kaloor, Kochi.`,
};

// Placeholder tiles until real club photos arrive. Varied aspect ratios give
// the masonry rhythm; each tile is a duotone block with fight-card captions.
const TILES = [
  { label: "Bag rounds", h: "h-64" },
  { label: "Pad work", h: "h-44" },
  { label: "Sparring night", h: "h-80" },
  { label: "Clinch drills", h: "h-52" },
  { label: "Morning batch", h: "h-64" },
  { label: "Wraps on", h: "h-44" },
  { label: "Fight team", h: "h-72" },
  { label: "Open mat", h: "h-52" },
  { label: "The ring", h: "h-64" },
];

export default function GalleryPage() {
  return (
    <>
      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="eyebrow">Gallery</p>
          <h1 className="display mt-4 text-6xl sm:text-8xl">
            Sweat is
            <br />
            the <span className="text-blood">decor</span>.
          </h1>
          <p className="mt-6 max-w-md text-lg text-bone-dim">
            Real photos from the floor are coming soon. Better yet, come see it
            live.
          </p>
        </div>
      </section>

      <section>
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="columns-2 gap-4 md:columns-3">
            {TILES.map((t, i) => (
              <figure
                key={t.label}
                className={`mb-4 break-inside-avoid border border-rule ${t.h} relative flex items-end overflow-hidden`}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(${135 + i * 20}deg, #171310 0%, #241a15 55%, rgba(184,12,36,0.25) 100%)`,
                  }}
                />
                <figcaption className="relative p-4">
                  <span className="eyebrow">{String(i + 1).padStart(2, "0")}</span>
                  <span className="mt-1 block text-sm font-semibold uppercase tracking-wide">
                    {t.label}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
