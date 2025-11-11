import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

// Create an invitation for a new user
export const createInvitation = mutation({
  args: {
    email: v.string(),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("manager"), v.literal("estimator")),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get the current user's profile
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", userId))
      .first();

    if (!currentUser) {
      throw new Error("User profile not found");
    }

    // Only owners and admins can invite users
    if (currentUser.role !== "owner" && currentUser.role !== "admin") {
      throw new Error("Insufficient permissions to invite users");
    }

    // Check if user already exists in the organization
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (existingUser && existingUser.organizationId === currentUser.organizationId) {
      throw new Error("User already exists in this organization");
    }

    // Check for existing pending invitation
    const existingInvite = await ctx.db
      .query("invitations")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .filter((q) =>
        q.and(
          q.eq(q.field("organizationId"), currentUser.organizationId),
          q.eq(q.field("status"), "pending")
        )
      )
      .first();

    if (existingInvite) {
      throw new Error("An invitation has already been sent to this email");
    }

    // Generate a unique token
    const token = crypto.randomUUID();

    // Create invitation (expires in 7 days)
    const invitationId = await ctx.db.insert("invitations", {
      email: args.email,
      organizationId: currentUser.organizationId,
      role: args.role,
      token,
      invitedBy: currentUser._id,
      status: "pending",
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
      createdAt: Date.now(),
    });

    return {
      invitationId,
      token,
    };
  },
});

// Get invitation by token
export const getInvitationByToken = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation) {
      return null;
    }

    // Check if expired
    if (invitation.expiresAt < Date.now()) {
      return null;
    }

    if (invitation.status !== "pending") {
      return null;
    }

    // Get organization details
    const organization = await ctx.db.get(invitation.organizationId);

    return {
      ...invitation,
      organizationName: organization?.name,
    };
  },
});

// Accept invitation and create user profile
export const acceptInvitation = mutation({
  args: {
    token: v.string(),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    // Get invitation
    const invitation = await ctx.db
      .query("invitations")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();

    if (!invitation) {
      throw new Error("Invalid invitation");
    }

    if (invitation.status !== "pending") {
      throw new Error("Invitation has already been used");
    }

    if (invitation.expiresAt < Date.now()) {
      throw new Error("Invitation has expired");
    }

    // Check if user profile already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", userId))
      .first();

    if (existingUser) {
      throw new Error("User profile already exists");
    }

    // Create user profile with the invited organization
    const userProfileId = await ctx.db.insert("users", {
      authUserId: userId,
      email: invitation.email,
      name: args.name,
      organizationId: invitation.organizationId,
      role: invitation.role,
      createdAt: Date.now(),
    });

    // Mark invitation as accepted
    await ctx.db.patch(invitation._id, {
      status: "accepted",
    });

    return await ctx.db.get(userProfileId);
  },
});

// List invitations for current organization
export const listInvitations = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      return [];
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", userId))
      .first();

    if (!currentUser) {
      return [];
    }

    return await ctx.db
      .query("invitations")
      .withIndex("by_organization", (q) => q.eq("organizationId", currentUser.organizationId))
      .collect();
  },
});

// Cancel/delete an invitation
export const cancelInvitation = mutation({
  args: { invitationId: v.id("invitations") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) {
      throw new Error("Not authenticated");
    }

    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_auth_user", (q) => q.eq("authUserId", userId))
      .first();

    if (!currentUser) {
      throw new Error("User profile not found");
    }

    const invitation = await ctx.db.get(args.invitationId);
    if (!invitation) {
      throw new Error("Invitation not found");
    }

    // Verify the invitation belongs to the user's organization
    if (invitation.organizationId !== currentUser.organizationId) {
      throw new Error("Unauthorized");
    }

    // Only owners and admins can cancel invitations
    if (currentUser.role !== "owner" && currentUser.role !== "admin") {
      throw new Error("Insufficient permissions");
    }

    await ctx.db.delete(args.invitationId);
  },
});
