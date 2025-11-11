"use client"

import { useAuth } from "@/lib/auth-context"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FolderOpen, Eye } from "lucide-react"
import Link from "next/link"
import { PROJECT_STATUS_LABELS, PROJECT_STATUS_COLORS, type ProjectStatus } from "@/lib/pipeline-constants"

export default function ProjectsPage() {
  const { user } = useAuth()

  const projects = useQuery(
    api.projects.list,
    user?.organizationId ? { organizationId: user.organizationId as any } : "skip"
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage and track all your active projects
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            All Projects
          </CardTitle>
          <CardDescription>
            View project status, timeline, and total investment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!projects ? (
            <div className="text-center py-8 text-muted-foreground">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No projects yet</p>
              <p className="text-sm mt-2">Projects are created when proposals are accepted</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Property Address</TableHead>
                  <TableHead>Service Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Investment</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead>Completion Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project._id}>
                    <TableCell className="font-medium">{project.customerName}</TableCell>
                    <TableCell>{project.propertyAddress}</TableCell>
                    <TableCell>{project.serviceType}</TableCell>
                    <TableCell>
                      <Badge className={PROJECT_STATUS_COLORS[project.status as ProjectStatus]}>
                        {PROJECT_STATUS_LABELS[project.status as ProjectStatus] || project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatCurrency(project.totalInvestment)}</TableCell>
                    <TableCell>{formatDate(project.startDate)}</TableCell>
                    <TableCell>{formatDate(project.completionDate)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/projects/${project._id}`}>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </Link>
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
