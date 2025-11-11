# TreeShop - Founding Members Edition

Professional tree service management platform with scientific pricing.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://www.treeshopterminal.com)

## Overview

TreeShop is the first-ever scientific pricing system for tree service companies. Built with revolutionary TreeShop Score™ technology and 80+ complexity factors (AFISS system) to transform how tree service companies price and manage their operations.

## Live Deployment

**Production:** [https://www.treeshopterminal.com](https://www.treeshopterminal.com)

**Features:**
- Scientific pricing calculators (Forestry Mulching, Stump Grinding, Land Clearing)
- Equipment & crew management
- Customer & project tracking
- Professional proposal generation
- WorkOS authentication for founding members

## Tech Stack

- **Framework:** Next.js 16 with Turbopack
- **Database:** Convex
- **Authentication:** WorkOS AuthKit
- **UI:** Radix UI + Tailwind CSS
- **Deployment:** Vercel

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## WorkOS Configuration

**Redirect URLs:**
- Development: `http://localhost:3000/api/auth/workos/callback`
- Production: `https://www.treeshopterminal.com/callback`

See `WORKOS_SETUP.md` for complete authentication setup.
