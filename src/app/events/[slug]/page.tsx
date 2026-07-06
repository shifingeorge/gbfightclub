import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

type EventDetail = {
  _id: string;
  slug: string;
  name: string;
  date: string;
  venue: string;
  description: string;
  disciplines: string[];
  deadline: string;
  feeInr: number;
  maxParticipants?: number;
  posterUrl: string | null;
};

async function getEvent(slug: string): Promise<EventDetail | null> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  try {
    const client = new ConvexHttpClient(url);
    return (await client.query(api.events.getBySlug, { slug })) as EventDetail | null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event" };
  return {
    title: event.name,
    description: event.description.slice(0, 160),
  };
}

export const revalidate = 60;

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  // eslint-disable-next-line react-hooks/purity -- server component, evaluated per-request by design
  const deadlinePassed = new Date(event.deadline).getTime() < Date.now();

  return (
    <>
      <section className="border-b border-rule">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-20">
          <p className="eyebrow">
            {new Date(event.date).toLocaleDateString("en-IN", {
              dateStyle: "full",
            })}
          </p>
          <h1 className="display mt-4 text-5xl sm:text-7xl">{event.name}</h1>
          <p className="mt-4 text-lg text-bone-dim">{event.venue}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            {event.disciplines.map((d) => (
              <span key={d} className="eyebrow border border-rule px-3 py-1.5">
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {event.posterUrl && (
        <section className="border-b border-rule bg-coal">
          <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={event.posterUrl}
              alt={`${event.name} poster`}
              className="max-h-[70vh] w-full border border-rule object-contain"
            />
          </div>
        </section>
      )}

      <section className="border-b border-rule">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
          <p className="whitespace-pre-wrap text-base leading-7 text-bone">
            {event.description}
          </p>

          <dl className="mt-8 grid gap-4 border-t border-rule pt-6 sm:grid-cols-3">
            <div>
              <dt className="eyebrow">Fee</dt>
              <dd className="mt-1 text-lg">
                {event.feeInr === 0 ? "Free" : `₹${event.feeInr}`}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Registration closes</dt>
              <dd className="mt-1 text-lg">
                {new Date(event.deadline).toLocaleDateString("en-IN", {
                  dateStyle: "medium",
                })}
              </dd>
            </div>
            {event.maxParticipants && (
              <div>
                <dt className="eyebrow">Spots</dt>
                <dd className="mt-1 text-lg">{event.maxParticipants} max</dd>
              </div>
            )}
          </dl>

          <div className="mt-10">
            {deadlinePassed ? (
              <p className="border border-rule bg-coal px-5 py-4 text-sm text-bone-dim">
                Registration for this event has closed.
              </p>
            ) : (
              <Link
                href={`/events/${event.slug}/register`}
                className="inline-block bg-blood px-7 py-4 text-base font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot"
              >
                Register now
              </Link>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
