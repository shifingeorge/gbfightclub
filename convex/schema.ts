import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  enquiries: defineTable({
    name: v.string(),
    phone: v.string(),
    interest: v.string(),
    message: v.optional(v.string()),
  }),
});
