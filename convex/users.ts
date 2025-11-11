import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Get or create user profile after authentication
export const getOrCreateUserProfile = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    organizationName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Check if user profile already exists
    const existing = await ctx.db
      .query("users")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", userId))
      .first();

    if (existing) {
      return existing;
    }

    // Create default organization for new user
    const orgId = await ctx.db.insert("organizations", {
      name: args.organizationName || `${args.name}'s Company`,
      businessAddress: "",
      createdAt: Date.now(),
    });

    // Create user profile
    const userProfileId = await ctx.db.insert("users", {
      authUserId: userId,
      email: args.email,
      name: args.name,
      organizationId: orgId,
      role: "owner",
      createdAt: Date.now(),
    });

    return await ctx.db.get(userProfileId);
  },
});

// Get current user profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("users")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", userId))
      .first();
  },
});

// Get user by email
export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

// Update user profile
export const updateUserProfile = mutation({
  args: {
    name: v.optional(v.string()),
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

    await ctx.db.patch(user._id, {
      ...(args.name && { name: args.name }),
    });

    return await ctx.db.get(user._id);
  },
});

// Helper query to check if user is authenticated
export const isAuthenticated = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    return userId !== null;
  },
});
