import type { Metadata } from "next";
import Link from "next/link";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { isAdmin } from "../actions";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin — Events",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type EventRow = {
  _id: string;
  name: string;
  date: string;
  venue: string;
  status: "draft" | "published";
};

async function getEvents(): Promise<EventRow[] | null> {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  try {
    const client = new ConvexHttpClient(url);
    return (await client.query(api.events.listAll, {})) as EventRow[];
  } catch {
    return null;
  }
}

export default async function AdminEventsPage() {
  if (!(await isAdmin())) redirect("/admin");

  const events = await getEvents();

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Admin</p>
          <h1 className="display mt-3 text-5xl">Events</h1>
        </div>
        <Link
          href="/admin/events/new"
          className="bg-blood px-5 py-3 text-sm font-semibold uppercase tracking-wide text-bone transition-colors hover:bg-blood-hot"
        >
          New event
        </Link>
      </div>

      {events === null ? (
        <p className="mt-10 border border-rule bg-coal px-5 py-4 text-sm text-bone-dim">
          Convex isn&apos;t connected. Set <code>NEXT_PUBLIC_CONVEX_URL</code>.
        </p>
      ) : events.length === 0 ? (
        <p className="mt-10 border border-rule bg-coal px-5 py-4 text-sm text-bone-dim">
          No events yet. Create the first one.
        </p>
      ) : (
        <div className="mt-10 overflow-x-auto">
          <table className="w-full min-w-150 border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-blood">
                <th className="eyebrow py-3 pr-4">Date</th>
                <th className="eyebrow py-3 pr-4">Name</th>
                <th className="eyebrow py-3 pr-4">Venue</th>
                <th className="eyebrow py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e._id} className="border-b border-rule align-top">
                  <td className="whitespace-nowrap py-3 pr-4 font-mono text-xs text-bone-dim">
                    {new Date(e.date).toLocaleDateString("en-IN", {
                      dateStyle: "medium",
                    })}
                  </td>
                  <td className="py-3 pr-4 font-medium">
                    <Link
                      href={`/admin/events/${e._id}`}
                      className="underline-offset-4 hover:underline"
                    >
                      {e.name}
                    </Link>
                  </td>
                  <td className="py-3 pr-4 text-bone-dim">{e.venue}</td>
                  <td className="py-3">
                    <span
                      className={`eyebrow ${e.status === "published" ? "text-blood-hot" : "text-bone-dim"}`}
                    >
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
