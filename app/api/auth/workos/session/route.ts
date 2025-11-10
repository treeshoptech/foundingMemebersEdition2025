import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const sessionData = request.nextUrl.searchParams.get("data")

  if (!sessionData) {
    return NextResponse.redirect(`${request.nextUrl.origin}/?error=no_session`)
  }

  // Create HTML page that stores session in localStorage and redirects
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Completing sign in...</title>
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
</head>
<body>
  <div class="loader">
    <div class="spinner"></div>
    <p>Completing sign in...</p>
  </div>
  <script>
    try {
      const sessionData = decodeURIComponent('${sessionData}');

      // TODO: Call Convex mutation to create/get organization
      // For now, we need to handle the WorkOS org ID -> Convex org ID mapping

      // Store in localStorage temporarily
      localStorage.setItem('treeshop_workos_session', sessionData);

      // Redirect to a setup page that will complete the onboarding
      window.location.href = '/api/auth/workos/complete';
    } catch (error) {
      console.error('Session storage error:', error);
      window.location.href = '/?error=session_storage_failed';
    }
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
