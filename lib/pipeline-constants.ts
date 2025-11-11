/**
 * Centralized constants for the project pipeline system
 * This file defines all statuses and workflow stages across the sales pipeline
 */

// Lead Statuses
export const LEAD_STATUSES = {
  NEW: "new",
  CONTACTED: "contacted",
  QUALIFIED: "qualified",
  PROPOSAL_SENT: "proposal_sent",
  CONVERTED: "converted", // Converted to proposal
  LOST: "lost",
} as const

export type LeadStatus = (typeof LEAD_STATUSES)[keyof typeof LEAD_STATUSES]

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  [LEAD_STATUSES.NEW]: "New",
  [LEAD_STATUSES.CONTACTED]: "Contacted",
  [LEAD_STATUSES.QUALIFIED]: "Qualified",
  [LEAD_STATUSES.PROPOSAL_SENT]: "Proposal Sent",
  [LEAD_STATUSES.CONVERTED]: "Converted",
  [LEAD_STATUSES.LOST]: "Lost",
}

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  [LEAD_STATUSES.NEW]: "bg-blue-100 text-blue-800",
  [LEAD_STATUSES.CONTACTED]: "bg-yellow-100 text-yellow-800",
  [LEAD_STATUSES.QUALIFIED]: "bg-purple-100 text-purple-800",
  [LEAD_STATUSES.PROPOSAL_SENT]: "bg-indigo-100 text-indigo-800",
  [LEAD_STATUSES.CONVERTED]: "bg-green-100 text-green-800",
  [LEAD_STATUSES.LOST]: "bg-gray-100 text-gray-800",
}

// Proposal Statuses
export const PROPOSAL_STATUSES = {
  DRAFT: "draft",
  SENT: "sent",
  ACCEPTED: "accepted",
  DECLINED: "declined",
} as const

export type ProposalStatus = (typeof PROPOSAL_STATUSES)[keyof typeof PROPOSAL_STATUSES]

export const PROPOSAL_STATUS_LABELS: Record<ProposalStatus, string> = {
  [PROPOSAL_STATUSES.DRAFT]: "Draft",
  [PROPOSAL_STATUSES.SENT]: "Sent",
  [PROPOSAL_STATUSES.ACCEPTED]: "Accepted",
  [PROPOSAL_STATUSES.DECLINED]: "Declined",
}

export const PROPOSAL_STATUS_COLORS: Record<ProposalStatus, string> = {
  [PROPOSAL_STATUSES.DRAFT]: "bg-gray-100 text-gray-800",
  [PROPOSAL_STATUSES.SENT]: "bg-blue-100 text-blue-800",
  [PROPOSAL_STATUSES.ACCEPTED]: "bg-green-100 text-green-800",
  [PROPOSAL_STATUSES.DECLINED]: "bg-red-100 text-red-800",
}

// Project Statuses
export const PROJECT_STATUSES = {
  ACTIVE: "active",
  ON_HOLD: "on-hold",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const

export type ProjectStatus = (typeof PROJECT_STATUSES)[keyof typeof PROJECT_STATUSES]

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  [PROJECT_STATUSES.ACTIVE]: "Active",
  [PROJECT_STATUSES.ON_HOLD]: "On Hold",
  [PROJECT_STATUSES.COMPLETED]: "Completed",
  [PROJECT_STATUSES.CANCELLED]: "Cancelled",
}

export const PROJECT_STATUS_COLORS: Record<ProjectStatus, string> = {
  [PROJECT_STATUSES.ACTIVE]: "bg-green-100 text-green-800",
  [PROJECT_STATUSES.ON_HOLD]: "bg-yellow-100 text-yellow-800",
  [PROJECT_STATUSES.COMPLETED]: "bg-blue-100 text-blue-800",
  [PROJECT_STATUSES.CANCELLED]: "bg-gray-100 text-gray-800",
}

// Work Order Statuses
export const WORK_ORDER_STATUSES = {
  SCHEDULED: "scheduled",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const

export type WorkOrderStatus = (typeof WORK_ORDER_STATUSES)[keyof typeof WORK_ORDER_STATUSES]

export const WORK_ORDER_STATUS_LABELS: Record<WorkOrderStatus, string> = {
  [WORK_ORDER_STATUSES.SCHEDULED]: "Scheduled",
  [WORK_ORDER_STATUSES.IN_PROGRESS]: "In Progress",
  [WORK_ORDER_STATUSES.COMPLETED]: "Completed",
  [WORK_ORDER_STATUSES.CANCELLED]: "Cancelled",
}

export const WORK_ORDER_STATUS_COLORS: Record<WorkOrderStatus, string> = {
  [WORK_ORDER_STATUSES.SCHEDULED]: "bg-blue-100 text-blue-800",
  [WORK_ORDER_STATUSES.IN_PROGRESS]: "bg-yellow-100 text-yellow-800",
  [WORK_ORDER_STATUSES.COMPLETED]: "bg-green-100 text-green-800",
  [WORK_ORDER_STATUSES.CANCELLED]: "bg-gray-100 text-gray-800",
}

// Invoice Statuses
export const INVOICE_STATUSES = {
  DRAFT: "draft",
  SENT: "sent",
  PAID: "paid",
  OVERDUE: "overdue",
  CANCELLED: "cancelled",
} as const

export type InvoiceStatus = (typeof INVOICE_STATUSES)[keyof typeof INVOICE_STATUSES]

export const INVOICE_STATUS_LABELS: Record<InvoiceStatus, string> = {
  [INVOICE_STATUSES.DRAFT]: "Draft",
  [INVOICE_STATUSES.SENT]: "Sent",
  [INVOICE_STATUSES.PAID]: "Paid",
  [INVOICE_STATUSES.OVERDUE]: "Overdue",
  [INVOICE_STATUSES.CANCELLED]: "Cancelled",
}

export const INVOICE_STATUS_COLORS: Record<InvoiceStatus, string> = {
  [INVOICE_STATUSES.DRAFT]: "bg-gray-100 text-gray-800",
  [INVOICE_STATUSES.SENT]: "bg-blue-100 text-blue-800",
  [INVOICE_STATUSES.PAID]: "bg-green-100 text-green-800",
  [INVOICE_STATUSES.OVERDUE]: "bg-red-100 text-red-800",
  [INVOICE_STATUSES.CANCELLED]: "bg-gray-100 text-gray-800",
}

// Invoice Types
export const INVOICE_TYPES = {
  DEPOSIT: "deposit",
  FINAL: "final",
  BALANCE: "balance",
} as const

export type InvoiceType = (typeof INVOICE_TYPES)[keyof typeof INVOICE_TYPES]

export const INVOICE_TYPE_LABELS: Record<InvoiceType, string> = {
  [INVOICE_TYPES.DEPOSIT]: "Deposit",
  [INVOICE_TYPES.FINAL]: "Final",
  [INVOICE_TYPES.BALANCE]: "Balance",
}

// Pipeline Stage Names
export const PIPELINE_STAGES = {
  LEAD: "lead",
  PROPOSAL: "proposal",
  PROJECT: "project",
  WORK_ORDER: "work_order",
  INVOICE: "invoice",
} as const

export type PipelineStage = (typeof PIPELINE_STAGES)[keyof typeof PIPELINE_STAGES]

export const PIPELINE_STAGE_LABELS: Record<PipelineStage, string> = {
  [PIPELINE_STAGES.LEAD]: "Lead",
  [PIPELINE_STAGES.PROPOSAL]: "Proposal",
  [PIPELINE_STAGES.PROJECT]: "Project",
  [PIPELINE_STAGES.WORK_ORDER]: "Work Order",
  [PIPELINE_STAGES.INVOICE]: "Invoice",
}
