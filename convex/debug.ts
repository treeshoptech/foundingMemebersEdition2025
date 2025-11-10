import { query } from "./_generated/server"

// Debug query to see all organizations
export const listAllOrgs = query({
  args: {},
  handler: async (ctx) => {
    const orgs = await ctx.db.query("organizations").collect()
    return orgs.map(org => ({
      _id: org._id,
      name: org.name,
      workosOrgId: org.workosOrgId,
    }))
  },
})

// Debug query to see all users
export const listAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect()
    return users.map(user => ({
      _id: user._id,
      email: user.email,
      name: user.name,
      organizationId: user.organizationId,
    }))
  },
})
