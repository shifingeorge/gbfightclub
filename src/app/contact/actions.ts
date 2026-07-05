"use server";

import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";

export type EnquiryState = {
  status: "idle" | "sent" | "error" | "fallback";
  error?: string;
};

const INTERESTS = ["Boxing", "Kickboxing", "Muay Thai", "MMA", "Not sure yet"];

export async function submitEnquiry(
  _prev: EnquiryState,
  formData: FormData,
): Promise<EnquiryState> {
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").replace(/[^\d+]/g, "");
  const interest = String(formData.get("interest") ?? "");
  const message = String(formData.get("message") ?? "").trim();

  if (name.length < 2) return { status: "error", error: "Enter your name." };
  if (!/^\+?\d{10,13}$/.test(phone))
    return { status: "error", error: "Enter a valid phone number." };
  if (!INTERESTS.includes(interest))
    return { status: "error", error: "Pick what you're interested in." };

  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!convexUrl) {
    // Convex not deployed yet — tell the form to offer the WhatsApp fallback.
    return { status: "fallback" };
  }

  try {
    const client = new ConvexHttpClient(convexUrl);
    await client.mutation(api.enquiries.submit, {
      name,
      phone,
      interest,
      message: message || undefined,
    });
    return { status: "sent" };
  } catch {
    return { status: "fallback" };
  }
}
