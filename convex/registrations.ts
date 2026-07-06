import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const GENDERS = ["Male", "Female", "Other"];

export const submit = mutation({
  args: {
    eventId: v.id("events"),
    name: v.string(),
    dob: v.string(),
    gender: v.string(),
    phone: v.string(),
    email: v.string(),
    discipline: v.string(),
    weightKg: v.number(),
    experienceNote: v.optional(v.string()),
    emergencyContact: v.string(),
  },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.eventId);
    if (!event || event.status !== "published")
      throw new Error("Event not found.");
    if (new Date(event.deadline).getTime() < Date.now())
      throw new Error("Registration deadline has passed.");

    const name = args.name.trim();
    if (name.length < 2 || name.length > 80)
      throw new Error("Name must be 2–80 characters.");

    const phone = args.phone.replace(/[^\d+]/g, "");
    if (!/^\+?\d{10,13}$/.test(phone))
      throw new Error("Enter a valid phone number.");

    if (!/^\S+@\S+\.\S+$/.test(args.email.trim()))
      throw new Error("Enter a valid email.");

    if (!GENDERS.includes(args.gender)) throw new Error("Pick a valid gender.");

    if (!event.disciplines.includes(args.discipline))
      throw new Error("Pick a valid discipline for this event.");

    if (args.weightKg <= 0 || args.weightKg > 300)
      throw new Error("Enter a valid weight in kg.");

    const emergencyContact = args.emergencyContact.replace(/[^\d+]/g, "");
    if (!/^\+?\d{10,13}$/.test(emergencyContact))
      throw new Error("Enter a valid emergency contact number.");

    if (event.maxParticipants) {
      const count = await ctx.db
        .query("registrations")
        .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
        .collect();
      if (count.length >= event.maxParticipants)
        throw new Error("This event is full.");
    }

    return await ctx.db.insert("registrations", {
      eventId: args.eventId,
      name,
      dob: args.dob,
      gender: args.gender,
      phone,
      email: args.email.trim(),
      discipline: args.discipline,
      weightKg: args.weightKg,
      experienceNote: args.experienceNote?.trim() || undefined,
      emergencyContact,
      paymentStatus: "pending",
      attended: false,
    });
  },
});

export const listForEvent = query({
  args: { eventId: v.id("events") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("registrations")
      .withIndex("by_event", (q) => q.eq("eventId", args.eventId))
      .order("desc")
      .collect();
  },
});

export const updatePaymentStatus = mutation({
  args: {
    id: v.id("registrations"),
    paymentStatus: v.union(v.literal("pending"), v.literal("received")),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { paymentStatus: args.paymentStatus });
  },
});

export const updateAttended = mutation({
  args: { id: v.id("registrations"), attended: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { attended: args.attended });
  },
});
