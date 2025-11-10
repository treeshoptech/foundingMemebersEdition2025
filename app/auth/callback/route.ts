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
    const redirectUri = `${request.nextUrl.origin}/auth/callback`

    // Exchange the authorization code for a user
    const { user, organizationId } = await workos.userManagement.authenticateWithCode({
      code,
      clientId,
    })

    // Get organization name from WorkOS
    let orgName = "TreeShop User"
    if (organizationId) {
      try {
        const org = await workos.organizations.getOrganization(organizationId)
        orgName = org.name
      } catch (error) {
        console.error("Failed to get organization name:", error)
      }
    }

    // Create session data
    const sessionData = {
      workosUserId: user.id,
      workosOrganizationId: organizationId || "",
      organizationName: orgName,
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
    return NextResponse.redirect(`${request.nextUrl.origin}/auth/session?data=${sessionParam}`)
  } catch (error) {
    console.error("WorkOS authentication error:", error)
    return NextResponse.redirect(`${request.nextUrl.origin}/?error=auth_failed`)
  }
}
