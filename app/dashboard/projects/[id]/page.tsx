"use client"

import { use } from "react"
import { useAuth } from "@/lib/auth-context"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  FolderOpen,
  User,
  MapPin,
  DollarSign,
  Calendar,
  FileText,
  ClipboardList,
  Receipt,
  ArrowRight,
  Phone,
  Mail,
} from "lucide-react"
import Link from "next/link"
import {
  PROJECT_STATUS_LABELS,
  PROJECT_STATUS_COLORS,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_COLORS,
  PROPOSAL_STATUS_LABELS,
  PROPOSAL_STATUS_COLORS,
  WORK_ORDER_STATUS_LABELS,
  WORK_ORDER_STATUS_COLORS,
  INVOICE_STATUS_LABELS,
  INVOICE_STATUS_COLORS,
  INVOICE_TYPE_LABELS,
  type ProjectStatus,
  type LeadStatus,
  type ProposalStatus,
  type WorkOrderStatus,
  type InvoiceStatus,
  type InvoiceType,
} from "@/lib/pipeline-constants"

export default function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { user } = useAuth()

  const projectData = useQuery(
    api.projects.getFullDetails,
    id ? { projectId: id as any } : "skip"
  )

  const formatDate = (timestamp?: number) => {
    if (!timestamp) return "—"
    return new Date(timestamp).toLocaleDateString()
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (!projectData) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Loading Project...</h1>
      </div>
    )
  }

  const { project, lead, proposal, workOrder, invoices } = projectData

  if (!project) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Project Not Found</h1>
        <p>The project you're looking for doesn't exist.</p>
        <Link href="/dashboard/projects">
          <Button>Back to Projects</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/dashboard/projects" className="hover:underline">
              Projects
            </Link>
            <ArrowRight className="h-4 w-4" />
            <span>{project.customerName}</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">{project.customerName}</h1>
          <p className="text-muted-foreground">{project.propertyAddress}</p>
        </div>
        <Badge className={PROJECT_STATUS_COLORS[project.status as ProjectStatus]}>
          {PROJECT_STATUS_LABELS[project.status as ProjectStatus] || project.status}
        </Badge>
      </div>

      {/* Project Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Project Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Service Type</p>
            <p className="text-lg font-semibold">{project.serviceType}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Investment</p>
            <p className="text-lg font-semibold">{formatCurrency(project.totalInvestment)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Start Date</p>
            <p className="text-lg font-semibold">{formatDate(project.startDate)}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Completion Date</p>
            <p className="text-lg font-semibold">{formatDate(project.completionDate)}</p>
          </div>
        </CardContent>
      </Card>

      {/* Pipeline Flow */}
      <Card>
        <CardHeader>
          <CardTitle>Sales Pipeline</CardTitle>
          <CardDescription>Complete project history from lead to invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Lead */}
          {lead && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Lead</h3>
                </div>
                <Badge className={LEAD_STATUS_COLORS[lead.status as LeadStatus]}>
                  {LEAD_STATUS_LABELS[lead.status as LeadStatus] || lead.status}
                </Badge>
              </div>
              <div className="grid gap-2 text-sm">
                {lead.phoneNumber && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    {lead.phoneNumber}
                  </div>
                )}
                {lead.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    {lead.email}
                  </div>
                )}
                {lead.estimatedValue && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    Estimated: {formatCurrency(lead.estimatedValue)}
                  </div>
                )}
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created: {formatDate(lead.createdAt)}
                </div>
              </div>
              {lead.notes && (
                <p className="mt-3 text-sm text-muted-foreground">{lead.notes}</p>
              )}
            </div>
          )}

          {/* Proposal */}
          {proposal && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Proposal</h3>
                </div>
                <Badge className={PROPOSAL_STATUS_COLORS[proposal.status as ProposalStatus]}>
                  {PROPOSAL_STATUS_LABELS[proposal.status as ProposalStatus] || proposal.status}
                </Badge>
              </div>
              <div className="grid gap-2 text-sm mb-3">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DollarSign className="h-4 w-4" />
                  Total Investment: {formatCurrency(proposal.totalInvestment)}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Created: {formatDate(proposal.createdAt)}
                </div>
              </div>

              {/* Line Items */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Line Items:</p>
                {proposal.lineItems.map((item) => (
                  <div
                    key={item.lineNumber}
                    className="flex justify-between items-start text-sm bg-muted/50 p-2 rounded"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.totalHours} hrs @ {formatCurrency(item.hourlyRate)}/hr
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(item.lineTotal)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-3">
                <Link href={`/dashboard/proposals/${proposal._id}`}>
                  <Button variant="outline" size="sm">View Full Proposal</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Work Order */}
          {workOrder && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5 text-muted-foreground" />
                  <h3 className="font-semibold">Work Order</h3>
                </div>
                <Badge className={WORK_ORDER_STATUS_COLORS[workOrder.status as WorkOrderStatus]}>
                  {WORK_ORDER_STATUS_LABELS[workOrder.status as WorkOrderStatus] || workOrder.status}
                </Badge>
              </div>
              <div className="grid gap-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  Scheduled: {formatDate(workOrder.scheduledDate)}
                </div>
                {workOrder.completedDate && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Completed: {formatDate(workOrder.completedDate)}
                  </div>
                )}
                <div className="text-muted-foreground">
                  Est. Hours: {workOrder.estimatedHours}
                  {workOrder.actualHours && ` | Actual: ${workOrder.actualHours}`}
                </div>
                <div className="text-muted-foreground">
                  Assigned: {workOrder.assignedEmployeeIds.length} employees, {workOrder.assignedEquipmentIds.length} equipment
                </div>
              </div>
              {workOrder.notes && (
                <p className="mt-3 text-sm text-muted-foreground">{workOrder.notes}</p>
              )}
              <div className="mt-3">
                <Link href={`/dashboard/work-orders`}>
                  <Button variant="outline" size="sm">View Work Order</Button>
                </Link>
              </div>
            </div>
          )}

          {/* Invoices */}
          {invoices && invoices.length > 0 && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Receipt className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">Invoices ({invoices.length})</h3>
              </div>
              <div className="space-y-2">
                {invoices.map((invoice) => (
                  <div
                    key={invoice._id}
                    className="flex justify-between items-center bg-muted/50 p-3 rounded"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{invoice.invoiceNumber}</p>
                        <Badge variant="outline" className="text-xs">
                          {INVOICE_TYPE_LABELS[invoice.invoiceType as InvoiceType]}
                        </Badge>
                        <Badge className={INVOICE_STATUS_COLORS[invoice.status as InvoiceStatus]}>
                          {INVOICE_STATUS_LABELS[invoice.status as InvoiceStatus] || invoice.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Due: {formatDate(invoice.dueDate)}
                        {invoice.paidDate && ` | Paid: ${formatDate(invoice.paidDate)}`}
                      </p>
                    </div>
                    <p className="font-semibold">{formatCurrency(invoice.total)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-3">
                <Link href={`/dashboard/invoices`}>
                  <Button variant="outline" size="sm">View All Invoices</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {project.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{project.notes}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
