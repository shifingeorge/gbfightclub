import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    posterId: v.optional(v.id("_storage")),
    date: v.string(),
    venue: v.string(),
    description: v.string(),
    disciplines: v.array(v.string()),
    deadline: v.string(),
    feeInr: v.number(),
    maxParticipants: v.optional(v.number()),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    const name = args.name.trim();
    if (name.length < 2) throw new Error("Event name required.");
    if (!args.date) throw new Error("Date required.");
    if (!args.venue.trim()) throw new Error("Venue required.");
    if (args.disciplines.length === 0)
      throw new Error("Pick at least one discipline.");
    if (args.feeInr < 0) throw new Error("Fee must be zero or more.");

    const baseSlug = slugify(name);
    let slug = baseSlug;
    let suffix = 1;
    while (
      await ctx.db
        .query("events")
        .withIndex("by_slug", (q) => q.eq("slug", slug))
        .unique()
    ) {
      suffix += 1;
      slug = `${baseSlug}-${suffix}`;
    }

    return await ctx.db.insert("events", {
      name,
      slug,
      posterId: args.posterId,
      date: args.date,
      venue: args.venue.trim(),
      description: args.description.trim(),
      disciplines: args.disciplines,
      deadline: args.deadline,
      feeInr: args.feeInr,
      maxParticipants: args.maxParticipants,
      status: args.status,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("events"),
    name: v.string(),
    posterId: v.optional(v.id("_storage")),
    date: v.string(),
    venue: v.string(),
    description: v.string(),
    disciplines: v.array(v.string()),
    deadline: v.string(),
    feeInr: v.number(),
    maxParticipants: v.optional(v.number()),
    status: v.union(v.literal("draft"), v.literal("published")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.get(args.id);
    if (!existing) throw new Error("Event not found.");

    const name = args.name.trim();
    if (name.length < 2) throw new Error("Event name required.");
    if (!args.venue.trim()) throw new Error("Venue required.");
    if (args.disciplines.length === 0)
      throw new Error("Pick at least one discipline.");
    if (args.feeInr < 0) throw new Error("Fee must be zero or more.");

    await ctx.db.patch(args.id, {
      name,
      posterId: args.posterId,
      date: args.date,
      venue: args.venue.trim(),
      description: args.description.trim(),
      disciplines: args.disciplines,
      deadline: args.deadline,
      feeInr: args.feeInr,
      maxParticipants: args.maxParticipants,
      status: args.status,
    });
  },
});

export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db.query("events").order("desc").collect();
    return await Promise.all(
      events.map(async (e) => ({
        ...e,
        posterUrl: e.posterId ? await ctx.storage.getUrl(e.posterId) : null,
      })),
    );
  },
});

export const listPublic = query({
  args: {},
  handler: async (ctx) => {
    const events = await ctx.db
      .query("events")
      .filter((q) => q.eq(q.field("status"), "published"))
      .collect();
    const now = Date.now();
    const withUrls = await Promise.all(
      events.map(async (e) => ({
        ...e,
        posterUrl: e.posterId ? await ctx.storage.getUrl(e.posterId) : null,
      })),
    );
    const upcoming = withUrls
      .filter((e) => new Date(e.date).getTime() >= now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const past = withUrls
      .filter((e) => new Date(e.date).getTime() < now)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return { upcoming, past };
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const event = await ctx.db
      .query("events")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (!event || event.status !== "published") return null;
    return {
      ...event,
      posterUrl: event.posterId ? await ctx.storage.getUrl(event.posterId) : null,
    };
  },
});

export const getById = query({
  args: { id: v.id("events") },
  handler: async (ctx, args) => {
    const event = await ctx.db.get(args.id);
    if (!event) return null;
    return {
      ...event,
      posterUrl: event.posterId ? await ctx.storage.getUrl(event.posterId) : null,
    };
  },
});
