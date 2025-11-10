import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Signing out...</title>
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
    .container {
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>Clearing session...</h1>
    <p>Redirecting to login...</p>
  </div>
  <script>
    // Clear all auth data
    localStorage.removeItem('treeshop_user');
    localStorage.removeItem('treeshop_workos_session');

    console.log('[Logout] Cleared all auth data');

    // Redirect to homepage after a brief delay
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
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
