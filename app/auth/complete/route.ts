import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // This page completes the WorkOS -> Convex organization mapping
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Setting up your account...</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-center;
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
  <script src="https://cdn.jsdelivr.net/npm/convex@latest/browser/convex.umd.js"></script>
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <p>Setting up your account...</p>
  </div>
  <script type="module">
    async function completeSetup() {
      try {
        const sessionDataStr = localStorage.getItem('treeshop_workos_session');
        if (!sessionDataStr) {
          throw new Error('No session data found');
        }

        const workosSession = JSON.parse(sessionDataStr);

        // TODO: Call Convex mutation to:
        // 1. Check if organization exists for this WorkOS org
        // 2. Create organization if it doesn't exist
        // 3. Get/create user record
        // 4. Return Convex organization ID

        // For now, use demo organization
        const convexSession = {
          userId: "k57015tkwh8r3mj078n4fra2s97v4ckd",
          organizationId: "kd74nxbz8vv2q7cv57p9chbhts7v4znm",
          organizationName: workosSession.organizationName || "Demo Tree Service Co.",
          name: workosSession.name,
          email: workosSession.email,
          role: "owner"
        };

        // Store the proper session
        localStorage.setItem('treeshop_user', JSON.stringify(convexSession));

        // Clean up WorkOS session
        localStorage.removeItem('treeshop_workos_session');

        // Redirect to dashboard
        window.location.href = '/dashboard';
      } catch (error) {
        console.error('Setup error:', error);
        window.location.href = '/?error=setup_failed';
      }
    }

    completeSetup();
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
