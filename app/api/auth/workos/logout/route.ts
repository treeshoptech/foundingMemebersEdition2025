import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  // Create HTML page that clears localStorage and redirects
  const html = `
<!DOCTYPE html>
<html>
<head>
  <title>Signing out...</title>
</head>
<body>
  <script>
    localStorage.removeItem('treeshop_user');
    localStorage.removeItem('treeshop_workos_session');
    window.location.href = '/';
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
