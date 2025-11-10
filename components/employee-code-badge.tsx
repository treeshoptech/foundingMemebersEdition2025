/**
 * Employee Code Badge Component
 *
 * Displays the TreeShop employee code in a styled badge format.
 * Shows the full code with tooltips for each component.
 */

"use client"

import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  CAREER_TRACKS,
  TIER_SYSTEM,
  LEADERSHIP_ADDONS,
  EQUIPMENT_ADDONS,
  DRIVER_ADDONS,
  CERTIFICATION_ADDONS,
  type CareerTrackCode,
  type TierLevel,
  type LeadershipCode,
  type EquipmentCode,
  type DriverCode,
  type CertificationCode,
} from "@/lib/treeshop-employee-types"

interface EmployeeCodeBadgeProps {
  code: string
  size?: "sm" | "md" | "lg"
  showTooltip?: boolean
}

export function EmployeeCodeBadge({ code, size = "md", showTooltip = true }: EmployeeCodeBadgeProps) {
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  }

  if (!showTooltip) {
    return (
      <Badge variant="secondary" className={`font-mono ${sizeClasses[size]}`}>
        {code}
      </Badge>
    )
  }

  // Parse the code to extract components
  const [mainPart, crossTrainingPart] = code.split(" / ")
  const parts = mainPart.split("+")

  // Extract primary role and tier
  const primaryRole = parts[0]
  const careerTrack = primaryRole.slice(0, 3) as CareerTrackCode
  const tier = parseInt(primaryRole.slice(3)) as TierLevel

  const careerTrackName = CAREER_TRACKS[careerTrack] || "Unknown Role"
  const tierInfo = TIER_SYSTEM[tier]

  // Build tooltip content
  const tooltipLines: string[] = [
    `Primary Role: ${careerTrackName}`,
    `Tier ${tier}: ${tierInfo?.name || "Unknown"} (${tierInfo?.description || ""})`,
  ]

  // Parse add-ons
  for (let i = 1; i < parts.length; i++) {
    const part = parts[i]

    if (part in LEADERSHIP_ADDONS) {
      const addon = LEADERSHIP_ADDONS[part as LeadershipCode]
      tooltipLines.push(`Leadership: ${addon.name} (+$${addon.premium}/hr)`)
    } else if (part in EQUIPMENT_ADDONS) {
      const addon = EQUIPMENT_ADDONS[part as EquipmentCode]
      tooltipLines.push(`Equipment: ${addon.name} (+$${addon.premium}/hr)`)
    } else if (part in DRIVER_ADDONS) {
      const addon = DRIVER_ADDONS[part as DriverCode]
      tooltipLines.push(`Driver: ${addon.name} (+$${addon.premium}/hr)`)
    } else if (part in CERTIFICATION_ADDONS) {
      const addon = CERTIFICATION_ADDONS[part as CertificationCode]
      tooltipLines.push(`Certification: ${addon.name} (+$${addon.premium}/hr)`)
    }
  }

  // Parse cross-training
  if (crossTrainingPart) {
    tooltipLines.push("") // Empty line for separation
    tooltipLines.push("Cross-Training:")
    const crossTrainingCodes = crossTrainingPart.split("+")
    crossTrainingCodes.forEach((ctCode) => {
      if (ctCode.startsWith("X-")) {
        const roleCode = ctCode.slice(2)
        const ctCareerTrack = roleCode.slice(0, 3) as CareerTrackCode
        const ctTier = parseInt(roleCode.slice(3)) as TierLevel
        const ctName = CAREER_TRACKS[ctCareerTrack] || "Unknown"
        tooltipLines.push(`  • ${ctName} (Tier ${ctTier})`)
      }
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge variant="secondary" className={`font-mono cursor-help ${sizeClasses[size]}`}>
            {code}
          </Badge>
        </TooltipTrigger>
        <TooltipContent className="max-w-sm">
          <div className="space-y-1">
            {tooltipLines.map((line, idx) => (
              <div key={idx} className="text-xs">
                {line}
              </div>
            ))}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
