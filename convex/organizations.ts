import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Get organization by ID
export const get = query({
  args: { organizationId: v.id("organizations") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.organizationId);
  },
});

// Get current user's organization
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", userId))
      .first();

    if (!user) {
      return null;
    }

    return await ctx.db.get(user.organizationId);
  },
});

// Update organization details
export const update = mutation({
  args: {
    name: v.optional(v.string()),
    businessAddress: v.optional(v.string()),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    logoUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", userId))
      .first();

    if (!user) {
      throw new Error("User profile not found");
    }

    // Only owners and admins can update organization
    if (user.role !== "owner" && user.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    // Remove undefined values
    const cleanUpdates = Object.fromEntries(
      Object.entries(args).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(cleanUpdates).length > 0) {
      await ctx.db.patch(user.organizationId, cleanUpdates);
    }

    return await ctx.db.get(user.organizationId);
  },
});

// Generate upload URL for logo upload
export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    return await ctx.storage.generateUploadUrl();
  },
});

// List all organizations (for debugging only - remove in production)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const orgs = await ctx.db.query("organizations").collect();
    return orgs.map((org) => ({
      _id: org._id,
      name: org.name,
      businessAddress: org.businessAddress,
      createdAt: org.createdAt,
    }));
  },
});

// WIPE: Delete all data from all tables (for testing only)
export const wipeAllData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Starting data wipe...");

    // Get all records from all tables
    const organizations = await ctx.db.query("organizations").collect();
    const users = await ctx.db.query("users").collect();
    const invitations = await ctx.db.query("invitations").collect();
    const equipment = await ctx.db.query("equipment").collect();
    const employees = await ctx.db.query("employees").collect();
    const loadouts = await ctx.db.query("loadouts").collect();
    const customers = await ctx.db.query("customers").collect();
    const leads = await ctx.db.query("leads").collect();
    const proposals = await ctx.db.query("proposals").collect();
    const workOrders = await ctx.db.query("workOrders").collect();
    const invoices = await ctx.db.query("invoices").collect();

    // Delete all records
    for (const org of organizations) await ctx.db.delete(org._id);
    for (const user of users) await ctx.db.delete(user._id);
    for (const inv of invitations) await ctx.db.delete(inv._id);
    for (const eq of equipment) await ctx.db.delete(eq._id);
    for (const emp of employees) await ctx.db.delete(emp._id);
    for (const loadout of loadouts) await ctx.db.delete(loadout._id);
    for (const customer of customers) await ctx.db.delete(customer._id);
    for (const lead of leads) await ctx.db.delete(lead._id);
    for (const proposal of proposals) await ctx.db.delete(proposal._id);
    for (const wo of workOrders) await ctx.db.delete(wo._id);
    for (const invoice of invoices) await ctx.db.delete(invoice._id);

    console.log("Data wipe complete!");

    return {
      message: "All data wiped successfully",
      deleted: {
        organizations: organizations.length,
        users: users.length,
        invitations: invitations.length,
        equipment: equipment.length,
        employees: employees.length,
        loadouts: loadouts.length,
        customers: customers.length,
        leads: leads.length,
        proposals: proposals.length,
        workOrders: workOrders.length,
        invoices: invoices.length,
      },
    };
  },
});
