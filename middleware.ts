import { authkitMiddleware } from '@workos-inc/authkit-nextjs';

export default authkitMiddleware({
  middlewareAuth: {
    enabled: true,
    unauthenticatedPaths: ['/', '/api/convex/_site_preview'],
  },
});

export const config = {
  matcher: ['/', '/dashboard/:path*', '/auth/:path*'],
};
