# Environment Variables Configuration

## Required Environment Variables

### For Development (.env.local)

```bash
# Convex Configuration (REQUIRED)
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
CONVEX_DEPLOYMENT=dev:your-dev-deployment

# Google Maps API (for address autocomplete and drive time calculations)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

### For Production (Vercel/Deployment)

```bash
# Convex Configuration (REQUIRED)
NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
CONVEX_DEPLOYMENT=prod:your-prod-deployment

# Google Maps API (for address autocomplete and drive time calculations)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

## Removed Environment Variables

The following environment variables are **NO LONGER NEEDED** after the Convex Auth migration:

```bash
# ❌ REMOVE THESE - No longer used
# WORKOS_CLIENT_ID=...
# WORKOS_API_KEY=...
# WORKOS_REDIRECT_URI=...
# WORKOS_COOKIE_PASSWORD=...
```

## How to Set Environment Variables

### Local Development

1. Create `.env.local` in the project root:
   ```bash
   touch .env.local
   ```

2. Add the required variables:
   ```bash
   NEXT_PUBLIC_CONVEX_URL=https://your-convex-deployment.convex.cloud
   CONVEX_DEPLOYMENT=dev:your-dev-deployment
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

3. Get your Convex deployment URL:
   ```bash
   npx convex dev
   ```
   This will output your CONVEX_URL and DEPLOYMENT values.

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Environment Variables"
3. Add each variable with the appropriate values:
   - `NEXT_PUBLIC_CONVEX_URL` - Your production Convex URL
   - `CONVEX_DEPLOYMENT` - Your production Convex deployment name
   - `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Your Google Maps API key

4. **Important**: Remove any old WorkOS variables if they exist

### Environment Variable Details

#### NEXT_PUBLIC_CONVEX_URL
- **Purpose**: Connects your Next.js frontend to your Convex backend
- **Format**: `https://your-deployment-name.convex.cloud`
- **Required**: Yes
- **Public**: Yes (prefixed with `NEXT_PUBLIC_`)
- **Example**: `https://happy-unicorn-123.convex.cloud`

#### CONVEX_DEPLOYMENT
- **Purpose**: Identifies which Convex deployment to use (dev/prod)
- **Format**: `environment:deployment-name`
- **Required**: Yes (for Convex CLI operations)
- **Public**: No
- **Examples**:
  - Dev: `dev:happy-unicorn-123`
  - Prod: `prod:happy-unicorn-456`

#### NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
- **Purpose**: Enables address autocomplete and drive time calculations
- **Format**: String API key from Google Cloud Console
- **Required**: Yes (for location features)
- **Public**: Yes (prefixed with `NEXT_PUBLIC_`)
- **How to get**:
  1. Go to Google Cloud Console
  2. Enable Maps JavaScript API and Places API
  3. Create API key with restrictions

## Verification

To verify your environment variables are set correctly:

```bash
# Check if Convex is configured
npm run dev

# You should see:
# ✓ Convex functions ready
# ✓ Server running on http://localhost:3000
```

If you see any errors about missing environment variables, check that:
1. `.env.local` exists in your project root
2. All required variables are set
3. Variables are not wrapped in quotes (unless the value itself contains spaces)
4. You've restarted your dev server after adding variables

## Security Notes

- ✅ **NEXT_PUBLIC_*** variables are safe to expose (client-side)
- ✅ **CONVEX_DEPLOYMENT** should be kept private (server-side only)
- ✅ Never commit `.env.local` to git (already in `.gitignore`)
- ✅ Use different Google Maps API keys for dev and production
- ✅ Set up API key restrictions in Google Cloud Console

## Need Help?

If you're having issues with environment variables:

1. Ensure `.env.local` is in the project root directory
2. Restart your development server: `npm run dev`
3. Check for typos in variable names (they're case-sensitive)
4. Verify your Convex deployment is active: `npx convex dashboard`
5. Test Google Maps API key: Visit the Google Cloud Console

## Summary

After the Convex Auth migration, you now need:
- ✅ Only 2-3 environment variables (was 4-5 with WorkOS)
- ✅ No third-party auth service API keys
- ✅ Simpler configuration
- ✅ Better security
- ✅ Lower cost

Your environment is now leaner and more secure!
