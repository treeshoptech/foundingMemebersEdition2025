"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calculator } from "lucide-react"
import { calculatePricing, formatCurrency, formatHours } from "@/lib/pricing-calculator"
import type { Id } from "@/convex/_generated/dataModel"

interface PricingCalculatorModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  loadouts: Array<{
    _id: Id<"loadouts">
    name: string
    serviceType: string
    billingRate: number
    productionRate: number
  }>
  onAddLineItem: (lineItem: LineItemData) => void
}

export interface LineItemData {
  loadoutId: string
  loadoutName: string
  serviceType: string
  description: string
  productionHours: number
  transportHours: number
  bufferHours: number
  totalHours: number
  hourlyRate: number
  totalCost: number
  lineTotal: number
}

export function PricingCalculatorModal({ open, onOpenChange, loadouts, onAddLineItem }: PricingCalculatorModalProps) {
  const [selectedLoadoutId, setSelectedLoadoutId] = useState<string>("")
  const [workUnits, setWorkUnits] = useState<number>(1)
  const [driveTimeMinutes, setDriveTimeMinutes] = useState<number>(30)
  const [bufferPercentage, setBufferPercentage] = useState<number>(15)
  const [description, setDescription] = useState<string>("")

  const selectedLoadout = loadouts.find((l) => l._id === selectedLoadoutId)

  // Calculate pricing whenever inputs change
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

  const handleAddLineItem = () => {
    if (!selectedLoadout || !pricing) return

    onAddLineItem({
      loadoutId: selectedLoadout._id,
      loadoutName: selectedLoadout.name,
      serviceType: selectedLoadout.serviceType,
      description: description || `${selectedLoadout.serviceType} - ${workUnits} units`,
      ...pricing,
    })

    // Reset form
    setDescription("")
    setWorkUnits(1)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <DialogTitle className="text-2xl">Pricing Calculator</DialogTitle>
          </div>
          <DialogDescription>Calculate job pricing based on loadout and job parameters</DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Section */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="loadout">Select Loadout</Label>
              <Select value={selectedLoadoutId} onValueChange={setSelectedLoadoutId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a loadout" />
                </SelectTrigger>
                <SelectContent>
                  {loadouts.map((loadout) => (
                    <SelectItem key={loadout._id} value={loadout._id}>
                      {loadout.name} - {loadout.serviceType}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedLoadout && (
              <>
                <Card className="p-4 bg-muted/50">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Billing Rate:</span>
                      <span className="font-semibold">{formatCurrency(selectedLoadout.billingRate)}/hr</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Production Rate:</span>
                      <span className="font-semibold">{selectedLoadout.productionRate} units/hr</span>
                    </div>
                  </div>
                </Card>

                <div className="space-y-2">
                  <Label htmlFor="workUnits">Work Units</Label>
                  <Input
                    id="workUnits"
                    type="number"
                    step="0.1"
                    value={workUnits}
                    onChange={(e) => setWorkUnits(Number.parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Number of units to complete (trees, stumps, acres, etc.)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driveTime">Drive Time (minutes, one way)</Label>
                  <Input
                    id="driveTime"
                    type="number"
                    value={driveTimeMinutes}
                    onChange={(e) => setDriveTimeMinutes(Number.parseInt(e.target.value) || 0)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="buffer">Buffer / Contingency (%)</Label>
                  <Input
                    id="buffer"
                    type="number"
                    value={bufferPercentage}
                    onChange={(e) => setBufferPercentage(Number.parseFloat(e.target.value) || 0)}
                  />
                  <p className="text-xs text-muted-foreground">Extra time for unexpected issues</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe the work to be done..."
                    rows={3}
                  />
                </div>
              </>
            )}
          </div>

          {/* Results Section */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg mb-3">Calculation Results</h3>
              {!pricing ? (
                <Card className="p-8 text-center text-muted-foreground">Select a loadout to see pricing</Card>
              ) : (
                <div className="space-y-4">
                  <Card className="p-4 space-y-3">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                      Time Breakdown
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Production Time:</span>
                        <span className="font-medium">{formatHours(pricing.productionHours)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Transport Time:</span>
                        <span className="font-medium">{formatHours(pricing.transportHours)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Buffer Time:</span>
                        <span className="font-medium">{formatHours(pricing.bufferHours)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Total Hours:</span>
                        <span className="text-primary">{formatHours(pricing.totalHours)}</span>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4 space-y-3 bg-primary/5 border-primary/20">
                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Pricing</div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Hourly Rate:</span>
                        <span className="font-medium">{formatCurrency(pricing.hourlyRate)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Hours:</span>
                        <span className="font-medium">{formatHours(pricing.totalHours)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-xl font-bold">
                        <span>Line Total:</span>
                        <span className="text-primary">{formatCurrency(pricing.lineTotal)}</span>
                      </div>
                    </div>
                  </Card>

                  <div className="pt-2 space-y-2 text-sm text-muted-foreground">
                    <p>This calculation includes all costs, profit margin, and contingency buffer.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddLineItem} disabled={!pricing}>
            Add Line Item
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
