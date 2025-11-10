"use client"

import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency } from "@/lib/pricing-calculator"
import { Plus, Eye, Trash2, FileText } from "lucide-react"

export default function ProposalsPage() {
  const router = useRouter()
  const { user } = useAuth()

  const proposals: any[] = []

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this proposal?")) {
      console.log("[v0] Delete proposal:", id)
      // Would delete from Convex when connected
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "secondary"
      case "sent":
        return "default"
      case "accepted":
        return "default"
      case "declined":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Proposals</h1>
          <p className="text-muted-foreground">Manage customer proposals and quotes</p>
        </div>
        <Button onClick={() => router.push("/dashboard/proposals/new")}>
          <Plus className="mr-2 h-4 w-4" />
          New Proposal
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Proposals</CardTitle>
          <CardDescription>View and manage your proposals</CardDescription>
        </CardHeader>
        <CardContent>
          {proposals.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">No proposals created yet</p>
              <Button onClick={() => router.push("/dashboard/proposals/new")}>
                <Plus className="mr-2 h-4 w-4" />
                Create First Proposal
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Property Address</TableHead>
                  <TableHead>Line Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {proposals.map((proposal) => (
                  <TableRow key={proposal._id}>
                    <TableCell className="font-medium">{proposal.customerName}</TableCell>
                    <TableCell>{proposal.propertyAddress}</TableCell>
                    <TableCell>{proposal.lineItems.length} items</TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(proposal.totalInvestment)}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(proposal.status)}>{proposal.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => router.push(`/dashboard/proposals/${proposal._id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(proposal._id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
