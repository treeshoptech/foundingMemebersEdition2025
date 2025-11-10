import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

// Simplified middleware - let AuthKit handle everything
export default authkitMiddleware({
  debug: true,
});

export const config = {
  matcher: [
    // Exclude static files and API routes from middleware
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
