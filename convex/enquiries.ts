import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

const INTERESTS = [
  "Boxing",
  "Kickboxing",
  "Muay Thai",
  "MMA",
  "Not sure yet",
];

export const submit = mutation({
  args: {
    name: v.string(),
    phone: v.string(),
    interest: v.string(),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    const phone = args.phone.replace(/[^\d+]/g, "");
    if (name.length < 2 || name.length > 80) {
      throw new Error("Name must be 2–80 characters.");
    }
    if (!/^\+?\d{10,13}$/.test(phone)) {
      throw new Error("Enter a valid phone number.");
    }
    if (!INTERESTS.includes(args.interest)) {
      throw new Error("Pick a valid interest.");
    }
    if (args.message && args.message.length > 1000) {
      throw new Error("Message too long (max 1000 characters).");
    }
    return await ctx.db.insert("enquiries", {
      name,
      phone,
      interest: args.interest,
      message: args.message?.trim() || undefined,
    });
  },
});

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("enquiries").order("desc").take(200);
  },
});
