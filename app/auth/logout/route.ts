import { signOut } from '@workos-inc/authkit-nextjs';

export async function GET() {
  // Sign out from WorkOS and redirect to home page
  const response = await signOut({ returnTo: process.env.NEXT_PUBLIC_BASE_URL || 'https://treeshopterminal.com' });
  return response;
}
