import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { isAdmin } from "../../actions";
import { createEvent } from "../actions";
import EventForm from "../EventForm";

export const metadata: Metadata = {
  title: "Admin — New event",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewEventPage() {
  if (!(await isAdmin())) redirect("/admin");

  return (
    <section className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="eyebrow">Admin</p>
      <h1 className="display mt-3 text-5xl">New event</h1>
      <div className="mt-10">
        <EventForm action={createEvent} />
      </div>
    </section>
  );
}
