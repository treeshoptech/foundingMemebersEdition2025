# TreeShop Web Setup Guide

## Prerequisites

You have an existing Convex deployment at:
`https://dashboard.convex.dev/t/jeremiah-and-lacey-anderson/treeshop-astro/watchful-jackal-831`

## Setup Steps

### 1. Connect Your Convex Deployment

Add the following environment variable in the **Vars section** of the v0 sidebar:

\`\`\`
NEXT_PUBLIC_CONVEX_URL=https://watchful-jackal-831.convex.cloud
\`\`\`

### 2. Sync Convex Schema (Local Development)

When running locally, you'll need to sync the schema:

\`\`\`bash
npx convex dev
\`\`\`

This will:
- Connect to your existing Convex deployment
- Generate the `convex/_generated/api.ts` file with proper types
- Watch for schema changes

### 3. Deploy Schema to Convex

Push the new schema files to your Convex deployment:

\`\`\`bash
npx convex deploy
\`\`\`

This syncs:
- `convex/schema.ts` - Database tables
- `convex/equipment.ts` - Equipment CRUD operations
- `convex/employees.ts` - Employee management
- `convex/loadouts.ts` - Loadout management
- `convex/proposals.ts` - Proposal builder operations

### 4. Integrate WorkOS Authentication

Since you're using WorkOS for auth, you'll need to:

1. Update `lib/auth-context.tsx` to use WorkOS session management
2. Replace the landing page with WorkOS sign-in component
3. Map WorkOS user data to the TreeShop user schema

Example WorkOS integration:

\`\`\`tsx
// In lib/auth-context.tsx
import { useUser } from '@workos-inc/authkit-nextjs'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user: workosUser, isLoading } = useUser()
  
  // Map WorkOS user to TreeShop user format
  const user = workosUser ? {
    userId: workosUser.id,
    email: workosUser.email,
    name: workosUser.firstName + ' ' + workosUser.lastName,
    organizationId: workosUser.organizationId,
    // ... other fields
  } : null
  
  // ... rest of provider
}
\`\`\`

## Features Implemented

- Multi-tenant organization system
- Equipment management with hourly cost tracking
- Employee management with skill levels
- Loadout builder (equipment + employees)
- Advanced pricing calculator with 5 service types:
  - Mulching
  - Stump Grinding
  - Land Clearing
  - Tree Removal
  - Tree Trimming
- Proposal builder with line items
- Dashboard with KPIs
- Real-time Convex integration

## Next Steps

1. Set environment variable in v0
2. Test the app preview
3. Integrate WorkOS authentication
4. Deploy to Vercel
