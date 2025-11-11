"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { formatCurrency } from "@/lib/pricing-calculator"
import { Plus, Eye, Trash2, FileText, FolderOpen } from "lucide-react"
import { PROPOSAL_STATUS_COLORS, PROPOSAL_STATUS_LABELS, type ProposalStatus } from "@/lib/pipeline-constants"

export default function ProposalsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [convertingId, setConvertingId] = useState<string | null>(null)

  const proposals = useQuery(
    api.proposals.list,
    user?.organizationId ? { organizationId: user.organizationId as any } : "skip"
  )

  const deleteProposal = useMutation(api.proposals.remove)
  const updateStatus = useMutation(api.proposals.updateStatus)
  const convertToProject = useMutation(api.proposals.convertToProject)

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this proposal?")) {
      try {
        await deleteProposal({ id: id as any })
      } catch (error) {
        console.error("Failed to delete proposal:", error)
        alert("Failed to delete proposal. Please try again.")
      }
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateStatus({ id: id as any, status: newStatus })
    } catch (error) {
      console.error("Failed to update status:", error)
      alert("Failed to update status. Please try again.")
    }
  }

  const handleConvertToProject = async (id: string) => {
    if (confirm("This will create a project and work order from this proposal. Continue?")) {
      setConvertingId(id)
      try {
        const result = await convertToProject({ proposalId: id as any })
        if (result?.projectId) {
          router.push(`/dashboard/projects/${result.projectId}`)
        }
      } catch (error: any) {
        console.error("Failed to convert to project:", error)
        alert(error?.message || "Failed to convert to project. Please try again.")
      } finally {
        setConvertingId(null)
      }
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
          {!proposals ? (
            <div className="text-center py-12 text-muted-foreground">Loading proposals...</div>
          ) : proposals.length === 0 ? (
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
                      <Select
                        value={proposal.status}
                        onValueChange={(value) => handleStatusChange(proposal._id, value)}
                      >
                        <SelectTrigger className="w-[120px]">
                          <Badge className={PROPOSAL_STATUS_COLORS[proposal.status as ProposalStatus]}>
                            {PROPOSAL_STATUS_LABELS[proposal.status as ProposalStatus] || proposal.status}
                          </Badge>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="sent">Sent</SelectItem>
                          <SelectItem value="accepted">Accepted</SelectItem>
                          <SelectItem value="declined">Declined</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right text-sm text-muted-foreground">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {proposal.status === "accepted" && !proposal.projectId && (
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleConvertToProject(proposal._id)}
                            disabled={convertingId === proposal._id}
                          >
                            <FolderOpen className="h-3 w-3 mr-1" />
                            {convertingId === proposal._id ? "Converting..." : "Convert"}
                          </Button>
                        )}
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
