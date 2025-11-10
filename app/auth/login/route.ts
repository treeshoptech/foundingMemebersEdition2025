import { NextRequest, NextResponse } from "next/server"
import { WorkOS } from "@workos-inc/node"

const workos = new WorkOS(process.env.WORKOS_API_KEY)
const clientId = process.env.WORKOS_CLIENT_ID!

export async function GET(request: NextRequest) {
  const redirectUri = `${request.nextUrl.origin}/auth/callback`

  // Get the authorization URL from WorkOS
  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: "authkit",
    clientId,
    redirectUri,
  })

  return NextResponse.redirect(authorizationUrl)
}
