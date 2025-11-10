import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // This page completes the WorkOS -> Convex organization mapping
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Signing in...</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: #000;
      color: #fff;
    }
    .loader {
      text-align: center;
    }
    .spinner {
      border: 3px solid rgba(255,255,255,0.1);
      border-radius: 50%;
      border-top: 3px solid #fff;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <p>Signing in...</p>
  </div>
  <script type="module">
    async function completeSignIn() {
      try {
        console.log('[Auth Complete] Completing sign in...');
        const sessionDataStr = localStorage.getItem('treeshop_workos_session');
        console.log('[Auth Complete] Session data:', sessionDataStr);

        if (!sessionDataStr) {
          throw new Error('No session data found');
        }

        const workosSession = JSON.parse(sessionDataStr);
        console.log('[Auth Complete] WorkOS session:', workosSession);

        // Import Convex client
        const { ConvexHttpClient } = await import("https://esm.sh/convex@1.16.2/browser");
        const client = new ConvexHttpClient("https://avid-dinosaur-776.convex.cloud");
        console.log('[Auth Complete] Convex client created');

        // Get or create organization in Convex
        console.log('[Auth Complete] Calling getOrCreateFromWorkOS mutation...');
        const api = {
          organizations: {
            getOrCreateFromWorkOS: "organizations:getOrCreateFromWorkOS"
          }
        };

        const result = await client.mutation(
          api.organizations.getOrCreateFromWorkOS,
          {
            workosOrgId: workosSession.workosOrganizationId,
            workosOrgName: workosSession.organizationName,
            userEmail: workosSession.email,
            userName: workosSession.name,
          }
        );
        console.log('[Auth Complete] Mutation result:', result);

        // Validate the organization ID
        if (!result.organizationId) {
          throw new Error('No organization ID returned from mutation');
        }

        // Validate that it's actually an organizations table ID
        const orgIdStr = String(result.organizationId);
        if (orgIdStr.includes('projects') || !orgIdStr.includes('organizations')) {
          console.error('[Auth Complete] CORRUPTED ORG ID DETECTED:', result.organizationId);
          throw new Error('Received invalid organization ID from server. Please contact support.');
        }

        // Create final session with Convex IDs
        const convexSession = {
          userId: result.userId,
          organizationId: result.organizationId,
          organizationName: result.organizationName,
          organizationLogo: result.organizationLogo,
          name: workosSession.name,
          email: workosSession.email,
          role: "owner"
        };
        console.log('[Auth Complete] Convex session:', convexSession);

        // Store the proper session
        localStorage.setItem('treeshop_user', JSON.stringify(convexSession));
        console.log('[Auth Complete] Session stored, redirecting to dashboard...');

        // Clean up WorkOS session
        localStorage.removeItem('treeshop_workos_session');

        // Redirect to dashboard
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('[Auth Complete] Sign in error:', error);
        alert('Sign in failed: ' + error.message + '. Please check the browser console for details.');
        window.location.href = '/?error=signin_failed';
      }
    }

    completeSignIn();
  </script>
</body>
</html>
  `

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html",
    },
  })
}
