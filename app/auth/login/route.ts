import { NextRequest, NextResponse } from "next/server"
import { WorkOS } from "@workos-inc/node"

const workos = new WorkOS(process.env.WORKOS_API_KEY)
const clientId = process.env.WORKOS_CLIENT_ID!

export async function GET(request: NextRequest) {
  const redirectUri = `${request.nextUrl.origin}/auth/callback`

  // Debug logging
  console.log("[WorkOS Login] Client ID:", clientId)
  console.log("[WorkOS Login] Redirect URI:", redirectUri)
  console.log("[WorkOS Login] API Key prefix:", process.env.WORKOS_API_KEY?.substring(0, 8) + "...")

  if (!clientId || !process.env.WORKOS_API_KEY) {
    return NextResponse.json(
      { error: "WorkOS credentials not configured" },
      { status: 500 }
    )
  }

  try {
    // Get the authorization URL from WorkOS
    const authorizationUrl = workos.userManagement.getAuthorizationUrl({
      provider: "authkit",
      clientId,
      redirectUri,
    })

    console.log("[WorkOS Login] Auth URL generated successfully")
    console.log("[WorkOS Login] Redirecting to WorkOS...")

    return NextResponse.redirect(authorizationUrl)
  } catch (error: any) {
    console.error("[WorkOS Login] Error:", error.message)
    console.error("[WorkOS Login] Error details:", error)
    return NextResponse.json(
      { error: "Failed to generate auth URL", details: error.message },
      { status: 500 }
    )
  }
}
