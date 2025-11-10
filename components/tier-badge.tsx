/**
 * Tier Badge Component
 *
 * Displays an employee's tier level with color coding and progression info.
 */

"use client"

import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { TIER_SYSTEM, type TierLevel } from "@/lib/treeshop-employee-types"

interface TierBadgeProps {
  tier: TierLevel
  showTooltip?: boolean
  size?: "sm" | "md" | "lg"
}

export function TierBadge({ tier, showTooltip = true, size = "md" }: TierBadgeProps) {
  const tierInfo = TIER_SYSTEM[tier]

  if (!tierInfo) {
    return <Badge variant="outline">Tier {tier}</Badge>
  }

  // Color coding by tier
  const tierColors = {
    1: "bg-gray-100 text-gray-800 border-gray-300",
    2: "bg-blue-100 text-blue-800 border-blue-300",
    3: "bg-green-100 text-green-800 border-green-300",
    4: "bg-purple-100 text-purple-800 border-purple-300",
    5: "bg-amber-100 text-amber-800 border-amber-300",
  }

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-2.5 py-0.5",
    lg: "text-base px-3 py-1",
  }

  const badge = (
    <Badge
      variant="outline"
      className={`${tierColors[tier]} font-semibold ${sizeClasses[size]} ${showTooltip ? "cursor-help" : ""}`}
    >
      Tier {tier}
    </Badge>
  )

  if (!showTooltip) {
    return badge
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{badge}</TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <div className="font-semibold">{tierInfo.name}</div>
            <div className="text-xs text-muted-foreground">{tierInfo.description}</div>
            <div className="text-xs font-medium">Multiplier: {tierInfo.multiplier}x</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
