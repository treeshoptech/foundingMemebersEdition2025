"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Calculator } from "lucide-react"
import { calculatePricing, formatCurrency, formatHours } from "@/lib/pricing-calculator"
import type { Id } from "@/convex/_generated/dataModel"

interface QuickQuoteCalculatorProps {
  loadouts: Array<{
    _id: Id<"loadouts">
    name: string
    serviceType: string
    billingRate: number
    productionRate: number
  }>
}

export function QuickQuoteCalculator({ loadouts }: QuickQuoteCalculatorProps) {
  const [selectedLoadoutId, setSelectedLoadoutId] = useState<string>("")
  const [workUnits, setWorkUnits] = useState<number>(1)
  const [driveTimeMinutes, setDriveTimeMinutes] = useState<number>(30)
  const [bufferPercentage, setBufferPercentage] = useState<number>(15)

  const selectedLoadout = loadouts.find((l) => l._id === selectedLoadoutId)

  const pricing = selectedLoadout
    ? calculatePricing({
        loadoutId: selectedLoadout._id,
        loadoutName: selectedLoadout.name,
        serviceType: selectedLoadout.serviceType,
        billingRate: selectedLoadout.billingRate,
        productionRate: selectedLoadout.productionRate,
        driveTimeMinutes,
        workUnits,
        bufferPercentage,
      })
    : null

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-primary" />
          <CardTitle>Quick Quote Calculator</CardTitle>
        </div>
        <CardDescription>Get instant pricing estimates for quick phone quotes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="quick-loadout">Loadout</Label>
            <Select value={selectedLoadoutId} onValueChange={setSelectedLoadoutId}>
              <SelectTrigger id="quick-loadout">
                <SelectValue placeholder="Select loadout" />
              </SelectTrigger>
              <SelectContent>
                {loadouts.map((loadout) => (
                  <SelectItem key={loadout._id} value={loadout._id}>
                    {loadout.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-units">Work Units</Label>
            <Input
              id="quick-units"
              type="number"
              step="0.1"
              value={workUnits}
              onChange={(e) => setWorkUnits(Number.parseFloat(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-drive">Drive Time (min)</Label>
            <Input
              id="quick-drive"
              type="number"
              value={driveTimeMinutes}
              onChange={(e) => setDriveTimeMinutes(Number.parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quick-buffer">Buffer (%)</Label>
            <Input
              id="quick-buffer"
              type="number"
              value={bufferPercentage}
              onChange={(e) => setBufferPercentage(Number.parseFloat(e.target.value) || 0)}
            />
          </div>
        </div>

        {pricing && (
          <>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Total Time</div>
                <div className="text-3xl font-bold">{formatHours(pricing.totalHours)}</div>
                <div className="text-xs text-muted-foreground">
                  Production: {formatHours(pricing.productionHours)} + Transport: {formatHours(pricing.transportHours)}{" "}
                  + Buffer: {formatHours(pricing.bufferHours)}
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Quote Price</div>
                <div className="text-3xl font-bold text-primary">{formatCurrency(pricing.lineTotal)}</div>
                <div className="text-xs text-muted-foreground">At {formatCurrency(pricing.hourlyRate)}/hr</div>
              </div>
            </div>
          </>
        )}

        {!selectedLoadout && (
          <div className="text-center py-8 text-muted-foreground">Select a loadout to calculate pricing</div>
        )}
      </CardContent>
    </Card>
  )
}
