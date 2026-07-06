import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  enquiries: defineTable({
    name: v.string(),
    phone: v.string(),
    interest: v.string(),
    message: v.optional(v.string()),
  }),

  events: defineTable({
    name: v.string(),
    slug: v.string(),
    posterId: v.optional(v.id("_storage")),
    date: v.string(),
    venue: v.string(),
    description: v.string(),
    disciplines: v.array(v.string()),
    deadline: v.string(),
    feeInr: v.number(),
    maxParticipants: v.optional(v.number()),
    status: v.union(v.literal("draft"), v.literal("published")),
  }).index("by_slug", ["slug"]),

  registrations: defineTable({
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
    paymentStatus: v.union(v.literal("pending"), v.literal("received")),
    attended: v.boolean(),
  }).index("by_event", ["eventId"]),
});
