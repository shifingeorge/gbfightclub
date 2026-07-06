import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { isAdmin } from "../../actions";
import { updateEvent } from "../actions";
import EventForm from "../EventForm";
import RegistrationsTable from "./RegistrationsTable";

export const metadata: Metadata = {
  title: "Admin — Edit event",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type EventDetail = {
  _id: string;
  name: string;
  date: string;
  venue: string;
  description: string;
  disciplines: string[];
  deadline: string;
  feeInr: number;
  maxParticipants?: number;
  status: "draft" | "published";
  posterUrl: string | null;
};

type Registration = {
  _id: string;
  _creationTime: number;
  name: string;
  phone: string;
  email: string;
  discipline: string;
  weightKg: number;
  gender: string;
  paymentStatus: "pending" | "received";
  attended: boolean;
};

export default async function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!(await isAdmin())) redirect("/admin");

  const { id } = await params;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) notFound();

  const client = new ConvexHttpClient(url);
  const event = (await client.query(api.events.getById, {
    id: id as Id<"events">,
  })) as EventDetail | null;
  if (!event) notFound();

  const registrations = (await client.query(api.registrations.listForEvent, {
    eventId: id as Id<"events">,
  })) as Registration[];

  const boundUpdate = updateEvent.bind(null, id);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Admin</p>
      <h1 className="display mt-3 text-5xl">{event.name}</h1>

      <div className="mt-10 grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <h2 className="eyebrow mb-4">Event details</h2>
          <EventForm
            action={boundUpdate}
            defaults={{
              name: event.name,
              date: event.date,
              venue: event.venue,
              description: event.description,
              disciplines: event.disciplines,
              deadline: event.deadline,
              feeInr: event.feeInr,
              maxParticipants: event.maxParticipants,
              status: event.status,
              posterUrl: event.posterUrl,
            }}
          />
        </div>

        <div>
          <h2 className="eyebrow mb-4">
            Registrations <span className="text-bone">({registrations.length})</span>
          </h2>
          <RegistrationsTable eventId={id} registrations={registrations} />
        </div>
      </div>
    </section>
  );
}
