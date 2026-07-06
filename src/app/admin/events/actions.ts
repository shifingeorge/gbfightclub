"use server";

import { ConvexHttpClient } from "convex/browser";
import { redirect } from "next/navigation";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { isAdmin } from "../actions";

export type EventFormState = {
  status: "idle" | "error";
  error?: string;
};

function client() {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) throw new Error("Convex not configured.");
  return new ConvexHttpClient(url);
}

function parseEventForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const date = String(formData.get("date") ?? "");
  const venue = String(formData.get("venue") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const disciplines = formData.getAll("disciplines").map(String);
  const deadline = String(formData.get("deadline") ?? "");
  const feeInr = Number(formData.get("feeInr") ?? 0);
  const maxParticipantsRaw = String(formData.get("maxParticipants") ?? "");
  const maxParticipants = maxParticipantsRaw ? Number(maxParticipantsRaw) : undefined;
  const status = formData.get("status") === "published" ? "published" : "draft";
  const posterIdRaw = String(formData.get("posterId") ?? "");
  const posterId = posterIdRaw ? (posterIdRaw as Id<"_storage">) : undefined;

  return {
    name,
    date,
    venue,
    description,
    disciplines,
    deadline,
    feeInr,
    maxParticipants,
    status,
    posterId,
  } as const;
}

export async function getUploadUrl(): Promise<string> {
  if (!(await isAdmin())) throw new Error("Not authorized.");
  return await client().mutation(api.events.generateUploadUrl, {});
}

export async function createEvent(
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  if (!(await isAdmin())) return { status: "error", error: "Not authorized." };

  const fields = parseEventForm(formData);
  let id: string;
  try {
    id = await client().mutation(api.events.create, fields);
  } catch (err) {
    return {
      status: "error",
      error: err instanceof Error ? err.message : "Failed to create event.",
    };
  }
  redirect(`/admin/events/${id}`);
}

export async function updateEvent(
  id: string,
  _prev: EventFormState,
  formData: FormData,
): Promise<EventFormState> {
  if (!(await isAdmin())) return { status: "error", error: "Not authorized." };

  const fields = parseEventForm(formData);
  try {
    await client().mutation(api.events.update, {
      id: id as Id<"events">,
      ...fields,
    });
  } catch (err) {
    return {
      status: "error",
      error: err instanceof Error ? err.message : "Failed to update event.",
    };
  }
  redirect(`/admin/events/${id}`);
}
