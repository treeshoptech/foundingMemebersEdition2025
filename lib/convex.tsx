"use client"

import type React from "react"
import { ConvexProvider, ConvexReactClient } from "convex/react"

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL || ""

export const convex = convexUrl ? new ConvexReactClient(convexUrl) : null

export function ConvexClientProvider({
  children,
}: {
  children: React.ReactNode
}) {
  if (!convex) {
    console.log("[v0] Convex not connected - add NEXT_PUBLIC_CONVEX_URL to enable backend")
  }

  if (!convex) {
    return <>{children}</>
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>
}
