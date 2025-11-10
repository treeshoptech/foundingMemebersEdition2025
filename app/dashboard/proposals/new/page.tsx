"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PricingCalculatorModal, type LineItemData } from "@/components/pricing-calculator-modal"
import { formatCurrency, formatHours } from "@/lib/pricing-calculator"
import { Plus, Trash2, Save, ArrowLeft, Calculator } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function NewProposalPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [customerName, setCustomerName] = useState("")
  const [propertyAddress, setPropertyAddress] = useState("")
  const [driveTimeMinutes, setDriveTimeMinutes] = useState(30)
  const [lineItems, setLineItems] = useState<LineItemData[]>([])

  const loadouts: any[] = []

  const handleAddLineItem = (item: LineItemData) => {
    const newItem = {
      ...item,
      lineNumber: lineItems.length + 1,
    }
    setLineItems([...lineItems, newItem])
  }

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index))
  }

  const totalInvestment = lineItems.reduce((sum, item) => sum + item.lineTotal, 0)
  const totalHours = lineItems.reduce((sum, item) => sum + item.totalHours, 0)

  const handleSave = async () => {
    if (!user || lineItems.length === 0) return

    setIsSaving(true)
    console.log("[v0] Saving proposal:", { customerName, propertyAddress, driveTimeMinutes, lineItems })
    // Would save to Convex when connected
    setTimeout(() => {
      setIsSaving(false)
      alert("Demo mode: Proposal saved! In production, this would redirect to the proposal detail page.")
    }, 1000)
  }

  if (loadouts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">New Proposal</h1>
            <p className="text-muted-foreground">Create a customer proposal</p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Loadouts Available</AlertTitle>
          <AlertDescription>
            You need to create at least one loadout before creating proposals.{" "}
            <Link href="/dashboard/loadouts" className="underline font-medium">
              Create a loadout now
            </Link>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">New Proposal</h1>
            <p className="text-muted-foreground">Create a customer proposal</p>
          </div>
        </div>
        <Button onClick={handleSave} disabled={isSaving || lineItems.length === 0 || !customerName || !propertyAddress}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Proposal"}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
            <CardDescription>Enter customer and property details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="John Smith"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="propertyAddress">Property Address</Label>
              <Input
                id="propertyAddress"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                placeholder="123 Main St, City, State"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="driveTime">Drive Time (minutes)</Label>
              <Input
                id="driveTime"
                type="number"
                value={driveTimeMinutes}
                onChange={(e) => setDriveTimeMinutes(Number.parseInt(e.target.value) || 0)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proposal Summary</CardTitle>
            <CardDescription>Overview of the proposal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Line Items:</span>
                <span className="font-medium">{lineItems.length}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Hours:</span>
                <span className="font-medium">{formatHours(totalHours)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total Investment:</span>
                <span className="text-primary">{formatCurrency(totalInvestment)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Line Items</CardTitle>
              <CardDescription>Add services and calculate pricing</CardDescription>
            </div>
            <Button onClick={() => setIsCalculatorOpen(true)}>
              <Calculator className="mr-2 h-4 w-4" />
              Add Line Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {lineItems.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">No line items added yet</p>
              <Button onClick={() => setIsCalculatorOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add First Line Item
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Loadout</TableHead>
                  <TableHead className="text-right">Hours</TableHead>
                  <TableHead className="text-right">Rate</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lineItems.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{item.description}</div>
                        <div className="text-xs text-muted-foreground">{item.serviceType}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{item.loadoutName}</TableCell>
                    <TableCell className="text-right">{formatHours(item.totalHours)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(item.hourlyRate)}</TableCell>
                    <TableCell className="text-right font-semibold">{formatCurrency(item.lineTotal)}</TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveLineItem(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <PricingCalculatorModal
        open={isCalculatorOpen}
        onOpenChange={setIsCalculatorOpen}
        loadouts={loadouts}
        onAddLineItem={handleAddLineItem}
      />
    </div>
  )
}
