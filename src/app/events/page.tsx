import type { Metadata } from "next";
import Link from "next/link";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Events",
  description: `Upcoming and past events at ${SITE.name}, Kaloor, Kochi.`,
};

export const revalidate = 60;

type EventRow = {
  _id: string;
  slug: string;
  name: string;
  date: string;
  venue: string;
  disciplines: string[];
  feeInr: number;
  posterUrl: string | null;
};

async function getEvents(): Promise<{ upcoming: EventRow[]; past: EventRow[] } | null> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  try {
    const client = new ConvexHttpClient(url);
    return (await client.query(api.events.listPublic, {})) as {
      upcoming: EventRow[];
      past: EventRow[];
    };
  } catch {
    return null;
  }
}

function EventCard({ event }: { event: EventRow }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block border border-rule p-6 transition-colors hover:border-bone"
    >
      <p className="font-mono text-xs text-bone-dim">
        {new Date(event.date).toLocaleDateString("en-IN", {
          dateStyle: "medium",
        })}
      </p>
      <h2 className="display mt-2 text-3xl transition-colors group-hover:text-blood-hot sm:text-4xl">
        {event.name}
      </h2>
      <p className="mt-2 text-sm text-bone-dim">{event.venue}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {event.disciplines.map((d) => (
          <span
            key={d}
            className="eyebrow border border-rule px-2 py-1 text-[0.625rem]"
          >
            {d}
          </span>
        ))}
      </div>
    </Link>
  );
}

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <>
      <section className="border-b border-rule">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="eyebrow">Events</p>
          <h1 className="display mt-4 text-6xl sm:text-8xl">
            Fight
            <br />
            <span className="text-blood">night</span> calendar.
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="eyebrow">Upcoming</h2>
        {!events ? (
          <p className="mt-6 border border-rule bg-coal px-5 py-4 text-sm text-bone-dim">
            Events aren&apos;t available right now. Check back soon.
          </p>
        ) : events.upcoming.length === 0 ? (
          <p className="mt-6 border border-rule bg-coal px-5 py-4 text-sm text-bone-dim">
            No upcoming events yet. Follow our WhatsApp for announcements.
          </p>
        ) : (
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {events.upcoming.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        )}
      </section>

      {events && events.past.length > 0 && (
        <section className="mx-auto max-w-6xl border-t border-rule px-4 py-16 sm:px-6">
          <h2 className="eyebrow">Past events</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {events.past.map((e) => (
              <EventCard key={e._id} event={e} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
