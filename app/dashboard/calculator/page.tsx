"use client"

import { useAuth } from "@/lib/auth-context"
import { QuickQuoteCalculator } from "@/components/quick-quote-calculator"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import Link from "next/link"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"

export default function CalculatorPage() {
  const { user } = useAuth()

  // Connect to live Convex data
  const loadouts = useQuery(api.loadouts.list, user?.organizationId ? { organizationId: user.organizationId as any } : "skip") || []

  if (loadouts.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Pricing Calculator</h1>
          <p className="text-muted-foreground">Quick quotes and job estimates</p>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>No Loadouts Available</AlertTitle>
          <AlertDescription>
            You need to create at least one loadout before using the pricing calculator.{" "}
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
      <div>
        <h1 className="text-3xl font-bold">Pricing Calculator</h1>
        <p className="text-muted-foreground">Get instant pricing estimates for customer quotes</p>
      </div>

      <QuickQuoteCalculator loadouts={loadouts} />

      <Card>
        <CardContent className="pt-6">
          <div className="text-sm text-muted-foreground space-y-2">
            <p className="font-medium">How to use the calculator:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Select the loadout that matches the job type</li>
              <li>Enter the number of work units (trees, stumps, acres, etc.)</li>
              <li>Input the one-way drive time to the job site</li>
              <li>Adjust the buffer percentage for job complexity</li>
              <li>The calculator shows total time and pricing instantly</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
