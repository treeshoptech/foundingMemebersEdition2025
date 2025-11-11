import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getUserOrganization } from "./lib/auth";

// Get all leads for current user's organization
export const list = query({
  args: {},
  handler: async (ctx) => {
    const organizationId = await getUserOrganization(ctx);

    const leads = await ctx.db
      .query("leads")
      .withIndex("by_organization", (q) => q.eq("organizationId", organizationId))
      .collect();

    return leads;
  },
});

// Create a new lead
export const create = mutation({
  args: {
    customerName: v.string(),
    propertyAddress: v.string(),
    phoneNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    serviceType: v.string(),
    status: v.optional(v.string()),
    estimatedValue: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const organizationId = await getUserOrganization(ctx);

    const leadId = await ctx.db.insert("leads", {
      organizationId,
      customerName: args.customerName,
      propertyAddress: args.propertyAddress,
      phoneNumber: args.phoneNumber,
      email: args.email,
      serviceType: args.serviceType,
      status: args.status || "new",
      estimatedValue: args.estimatedValue,
      notes: args.notes,
      createdAt: Date.now(),
    });

    return leadId;
  },
});

// Update lead
export const update = mutation({
  args: {
    leadId: v.id("leads"),
    customerName: v.optional(v.string()),
    propertyAddress: v.optional(v.string()),
    phoneNumber: v.optional(v.string()),
    email: v.optional(v.string()),
    serviceType: v.optional(v.string()),
    status: v.optional(v.string()),
    estimatedValue: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const organizationId = await getUserOrganization(ctx);

    // Verify lead belongs to user's organization
    const lead = await ctx.db.get(args.leadId);
    if (!lead || lead.organizationId !== organizationId) {
      throw new Error("Lead not found or access denied");
    }

    const { leadId, ...updates } = args;
    await ctx.db.patch(leadId, updates);
  },
});

// Delete lead
export const remove = mutation({
  args: { leadId: v.id("leads") },
  handler: async (ctx, args) => {
    const organizationId = await getUserOrganization(ctx);

    // Verify lead belongs to user's organization
    const lead = await ctx.db.get(args.leadId);
    if (!lead || lead.organizationId !== organizationId) {
      throw new Error("Lead not found or access denied");
    }

    await ctx.db.delete(args.leadId);
  },
});
