import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import RegisterForm from "./RegisterForm";

type EventDetail = {
  _id: string;
  slug: string;
  name: string;
  disciplines: string[];
  deadline: string;
  feeInr: number;
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
  return { title: event ? `Register — ${event.name}` : "Register" };
}

export default async function RegisterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) notFound();

  // eslint-disable-next-line react-hooks/purity -- server component, evaluated per-request by design
  const deadlinePassed = new Date(event.deadline).getTime() < Date.now();
  if (deadlinePassed) notFound();

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="eyebrow">Register</p>
      <h1 className="display mt-4 text-5xl sm:text-6xl">{event.name}</h1>
      <div className="mt-10">
        <RegisterForm
          eventId={event._id}
          eventName={event.name}
          disciplines={event.disciplines}
          feeInr={event.feeInr}
        />
      </div>
    </section>
  );
}
