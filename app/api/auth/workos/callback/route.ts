import { NextRequest, NextResponse } from "next/server"
import { WorkOS } from "@workos-inc/node"

const workos = new WorkOS(process.env.WORKOS_API_KEY)
const clientId = process.env.WORKOS_CLIENT_ID!

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(`${request.nextUrl.origin}/?error=no_code`)
  }

  try {
    const redirectUri = `${request.nextUrl.origin}/api/auth/workos/callback`

    // Exchange the authorization code for a user
    const { user, organizationId } = await workos.userManagement.authenticateWithCode({
      code,
      clientId,
    })

    // Create session data
    const sessionData = {
      userId: user.id,
      organizationId: organizationId || "", // WorkOS organization ID
      organizationName: organizationId || "TreeShop User",
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email,
      email: user.email,
      role: "owner" as const,
    }

    // In production, you'd want to:
    // 1. Check if organization exists in Convex
    // 2. Create organization if it doesn't exist
    // 3. Map WorkOS org ID to Convex org ID
    // 4. Store in encrypted session cookie

    // For now, redirect to dashboard with session data in URL (temporary)
    const sessionParam = encodeURIComponent(JSON.stringify(sessionData))
    return NextResponse.redirect(`${request.nextUrl.origin}/api/auth/workos/session?data=${sessionParam}`)
  } catch (error) {
    console.error("WorkOS authentication error:", error)
    return NextResponse.redirect(`${request.nextUrl.origin}/?error=auth_failed`)
  }
}
