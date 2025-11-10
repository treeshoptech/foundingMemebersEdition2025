# WorkOS Authentication Setup Guide

## Current Status

✅ **WorkOS SDK installed and configured**
✅ **Complete OAuth flow implemented**
✅ **Session management working**
⏳ **Redirect URLs need configuration**

---

## WorkOS Dashboard Configuration

### 1. **Add Redirect URIs**

Go to your WorkOS dashboard and add these redirect URLs:

**Development:**
```
http://localhost:3000/api/auth/workos/callback
```

**Production:**
```
https://foundingmembersedition.vercel.app/api/auth/workos/callback
```

### 2. **Enable AuthKit**

Make sure AuthKit is enabled in your WorkOS dashboard for your application.

---

## How It Works

### Authentication Flow:

1. **User clicks "Sign In"** → `/api/auth/workos/login`
   - Redirects to WorkOS AuthKit login page

2. **User signs in via WorkOS**
   - WorkOS handles authentication
   - Returns authorization code

3. **WorkOS redirects back** → `/api/auth/workos/callback?code=xxx`
   - Exchange code for user data
   - Get user info + WorkOS organization ID

4. **Session setup** → `/api/auth/workos/session`
   - Store session data in localStorage

5. **Complete setup** → `/api/auth/workos/complete`
   - Map WorkOS org ID → Convex org ID
   - Store final session
   - Redirect to dashboard

### Sign Out Flow:

1. **User clicks "Sign Out"** → Auth context calls signOut()
2. **Clear storage** → Remove localStorage items
3. **Redirect** → `/api/auth/workos/logout` → Homepage

---

## Environment Variables

Already configured in `.env.local`:

```bash
WORKOS_API_KEY=sk_live_...
WORKOS_CLIENT_ID=client_01K9HJ...
NEXT_PUBLIC_WORKOS_CLIENT_ID=client_01K9HJ...
```

---

## Testing the Flow

### Local Development:

1. Start dev server:
   ```bash
   npm run dev
   ```

2. Go to http://localhost:3000

3. Click "Sign In" button

4. You'll be redirected to WorkOS

5. Sign in with your WorkOS account

6. You'll be redirected back to `/api/auth/workos/callback`

7. Should complete and land on `/dashboard`

### What Happens on First Login:

Currently, the flow:
- ✅ Gets WorkOS user data
- ✅ Stores session in localStorage
- ⏳ **Maps to demo organization** (temporary)
- ⏳ **Needs Convex mutation** to create real org

---

## Next Steps for Production

### 1. **Create Convex Mutation for Org Mapping**

Create `convex/auth.ts`:

```typescript
export const getOrCreateOrganization = mutation({
  args: {
    workosOrgId: v.string(),
    orgName: v.string(),
    userEmail: v.string(),
    userName: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if org exists with WorkOS ID
    const existingOrg = await ctx.db
      .query("organizations")
      .filter(q => q.eq(q.field("workosOrgId"), args.workosOrgId))
      .first()

    if (existingOrg) {
      return { organizationId: existingOrg._id }
    }

    // Create new organization
    const orgId = await ctx.db.insert("organizations", {
      name: args.orgName,
      workosOrgId: args.workosOrgId,
      businessAddress: "",
      createdAt: Date.now(),
    })

    // Create owner user
    const userId = await ctx.db.insert("users", {
      email: args.userEmail,
      name: args.userName,
      workosUserId: "", // Store WorkOS user ID
      organizationId: orgId,
      role: "owner",
      createdAt: Date.now(),
    })

    return { organizationId: orgId, userId }
  },
})
```

### 2. **Update Schema**

Add WorkOS ID fields to `convex/schema.ts`:

```typescript
organizations: defineTable({
  name: v.string(),
  workosOrgId: v.optional(v.string()), // Add this
  // ... rest of fields
}).index("by_workos_org", ["workosOrgId"]),

users: defineTable({
  email: v.string(),
  name: v.string(),
  workosUserId: v.optional(v.string()), // Add this
  // ... rest of fields
}),
```

### 3. **Update Complete Route**

Update `/api/auth/workos/complete/route.ts` to call the Convex mutation instead of using demo org.

### 4. **Add Session Encryption**

For production, replace localStorage with encrypted HTTP-only cookies using `iron-session` or similar.

---

## Troubleshooting

### "404: NOT_FOUND" Error

This happens when WorkOS tries to redirect but the URL isn't configured.

**Fix:** Add the redirect URL in WorkOS dashboard (see step 1 above)

### "Demo organization" after sign in

Currently working as designed - mapping to demo org until Convex mutation is implemented.

### localStorage Not Persisting

Check browser console for errors. Make sure you're not in incognito mode.

---

## Security Notes

⚠️ **Current Implementation (Development):**
- Session stored in localStorage (not secure)
- Demo organization mapping (temporary)
- No CSRF protection

✅ **Production Requirements:**
- Encrypted session cookies (HTTP-only)
- CSRF tokens
- Proper WorkOS → Convex org mapping
- Rate limiting on auth endpoints
- Session expiration and refresh

---

## URLs to Configure in WorkOS

| Environment | Redirect URL |
|-------------|--------------|
| Development | `http://localhost:3000/api/auth/workos/callback` |
| Production  | `https://foundingmembersedition.vercel.app/api/auth/workos/callback` |
| Custom Domain (future) | `https://app.treeshop.app/api/auth/workos/callback` |

---

**Last Updated:** 2025-11-10
**Status:** Development - Ready for testing with redirect URLs configured
