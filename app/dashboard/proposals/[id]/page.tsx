"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Mail } from "lucide-react"

export default function ProposalDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  const router = useRouter()

  const proposal = {
    id,
    customerName: "John Doe",
    propertyAddress: "123 Elm Street",
    driveTimeMinutes: 30,
    status: "draft",
    totalInvestment: 650,
    totalHours: 5,
    lineItemsCount: 2,
    createdAt: new Date().toISOString(),
    lineItems: [
      {
        lineNumber: 1,
        description: "Mulch front yard beds",
        serviceType: "Mulching",
        loadoutName: "Small Mulch Crew",
        totalHours: 2,
        productionHours: 1,
        transportHours: 0.5,
        bufferHours: 0.5,
        hourlyRate: 100,
        lineTotal: 200,
      },
      {
        lineNumber: 2,
        description: "Remove 3 stumps in backyard",
        serviceType: "Stump Grinding",
        loadoutName: "Stump Grinder + Operator",
        totalHours: 3,
        productionHours: 2.5,
        transportHours: 0.5,
        bufferHours: 1,
        hourlyRate: 150,
        lineTotal: 450,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Proposal #{id}</h1>
            <p className="text-muted-foreground">Created {new Date(proposal.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-sm capitalize">
            {proposal.status}
          </Badge>
          <Button onClick={() => alert("Demo: Mark as sent")}>
            <Mail className="mr-2 h-4 w-4" />
            Mark as Sent
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="text-sm text-muted-foreground">Customer Name</div>
              <div className="font-medium">{proposal.customerName}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Property Address</div>
              <div className="font-medium">{proposal.propertyAddress}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Drive Time</div>
              <div className="font-medium">{proposal.driveTimeMinutes} minutes</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Proposal Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Line Items:</span>
              <span className="font-medium">{proposal.lineItemsCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Hours:</span>
              <span className="font-medium">{proposal.totalHours} hours</span>
            </div>
            <Separator />
            <div className="flex justify-between text-xl font-bold">
              <span>Total Investment:</span>
              <span className="text-primary">${proposal.totalInvestment}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Line Items</CardTitle>
          <CardDescription>Detailed breakdown of services</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Loadout</TableHead>
                <TableHead className="text-right">Hours</TableHead>
                <TableHead className="text-right">Rate</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proposal.lineItems.map((item) => (
                <TableRow key={item.lineNumber}>
                  <TableCell className="font-medium">{item.lineNumber}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.serviceType}</Badge>
                  </TableCell>
                  <TableCell className="text-sm">{item.loadoutName}</TableCell>
                  <TableCell className="text-right">
                    <div className="space-y-1">
                      <div>{item.totalHours} hours</div>
                      <div className="text-xs text-muted-foreground">
                        Prod: {item.productionHours}h | Trans: {item.transportHours}h | Buf: {item.bufferHours}h
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">${item.hourlyRate}</TableCell>
                  <TableCell className="text-right font-semibold">${item.lineTotal}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50">
                <TableCell colSpan={6} className="text-right font-bold">
                  Total Investment:
                </TableCell>
                <TableCell className="text-right font-bold text-lg text-primary">${proposal.totalInvestment}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
