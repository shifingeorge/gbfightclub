"use server";

import { ConvexHttpClient } from "convex/browser";
import { revalidatePath } from "next/cache";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";
import { isAdmin } from "../../actions";

function client() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("Convex not configured.");
  return new ConvexHttpClient(url);
}

export async function togglePayment(
  eventId: string,
  registrationId: string,
  next: "pending" | "received",
) {
  if (!(await isAdmin())) throw new Error("Not authorized.");
  await client().mutation(api.registrations.updatePaymentStatus, {
    id: registrationId as Id<"registrations">,
    paymentStatus: next,
  });
  revalidatePath(`/admin/events/${eventId}`);
}

export async function toggleAttended(
  eventId: string,
  registrationId: string,
  next: boolean,
) {
  if (!(await isAdmin())) throw new Error("Not authorized.");
  await client().mutation(api.registrations.updateAttended, {
    id: registrationId as Id<"registrations">,
    attended: next,
  });
  revalidatePath(`/admin/events/${eventId}`);
}
