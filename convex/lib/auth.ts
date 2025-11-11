import { auth } from "../auth";

/**
 * Helper function to get the authenticated user's organization ID
 * Throws an error if user is not authenticated or profile not found
 */
export async function getUserOrganization(ctx: any) {
  const userId = await auth.getUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q: any) => q.eq("authUserId", userId))
    .first();

  if (!user) {
    throw new Error("User profile not found");
  }

  return user.organizationId;
}

/**
 * Helper function to get the current user's profile
 */
export async function getCurrentUserProfile(ctx: any) {
  const userId = await auth.getUserId(ctx);
  if (!userId) {
    throw new Error("Not authenticated");
  }

  const user = await ctx.db
    .query("users")
    .withIndex("by_auth_user", (q: any) => q.eq("authUserId", userId))
    .first();

  if (!user) {
    throw new Error("User profile not found");
  }

  return user;
}

/**
 * Verify that a resource belongs to the user's organization
 */
export async function verifyOrganizationAccess(
  ctx: any,
  resourceOrganizationId: string
) {
  const userOrganizationId = await getUserOrganization(ctx);

  if (resourceOrganizationId !== userOrganizationId) {
    throw new Error("Access denied");
  }
}
