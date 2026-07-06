"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../../convex/_generated/api";
import type { Id } from "../../../../../convex/_generated/dataModel";

export type RegisterState = {
  status: "idle" | "sent" | "error";
  error?: string;
  registrationId?: string;
};

const GENDERS = ["Male", "Female", "Other"];

export async function submitRegistration(
  eventId: string,
  disciplines: string[],
  _prev: RegisterState,
  formData: FormData,
): Promise<RegisterState> {
  const name = String(formData.get("name") ?? "").trim();
  const dob = String(formData.get("dob") ?? "");
  const gender = String(formData.get("gender") ?? "");
  const phone = String(formData.get("phone") ?? "").replace(/[^\d+]/g, "");
  const email = String(formData.get("email") ?? "").trim();
  const discipline = String(formData.get("discipline") ?? "");
  const weightKg = Number(formData.get("weightKg") ?? 0);
  const experienceNote = String(formData.get("experienceNote") ?? "").trim();
  const emergencyContact = String(formData.get("emergencyContact") ?? "").replace(
    /[^\d+]/g,
    "",
  );

  if (name.length < 2) return { status: "error", error: "Enter your name." };
  if (!dob) return { status: "error", error: "Enter your date of birth." };
  if (!GENDERS.includes(gender))
    return { status: "error", error: "Pick a gender." };
  if (!/^\+?\d{10,13}$/.test(phone))
    return { status: "error", error: "Enter a valid phone number." };
  if (!/^\S+@\S+\.\S+$/.test(email))
    return { status: "error", error: "Enter a valid email." };
  if (!disciplines.includes(discipline))
    return { status: "error", error: "Pick a discipline." };
  if (!weightKg || weightKg <= 0)
    return { status: "error", error: "Enter your weight in kg." };
  if (!/^\+?\d{10,13}$/.test(emergencyContact))
    return {
      status: "error",
      error: "Enter a valid emergency contact number.",
    };

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl)
    return { status: "error", error: "Registration is temporarily unavailable." };

  try {
    const client = new ConvexHttpClient(convexUrl);
    const id = await client.mutation(api.registrations.submit, {
      eventId: eventId as Id<"events">,
      name,
      dob,
      gender,
      phone,
      email,
      discipline,
      weightKg,
      experienceNote: experienceNote || undefined,
      emergencyContact,
    });
    return { status: "sent", registrationId: id };
  } catch (err) {
    return {
      status: "error",
      error: err instanceof Error ? err.message : "Something went wrong.",
    };
  }
}
