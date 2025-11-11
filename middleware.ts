import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  isAuthenticatedNextjs,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isPublicPage = createRouteMatcher([
  "/",
  "/sign-in",
  "/sign-up",
  "/invite",
  "/manifest.json",
]);

export default convexAuthNextjsMiddleware((request) => {
  // Allow public pages
  if (isPublicPage(request)) {
    return;
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticatedNextjs()) {
    return nextjsMiddlewareRedirect(request, "/sign-in");
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
