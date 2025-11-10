"use client"

import { useState } from "react"
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Stack,
} from "@mui/material"
import { Add, Edit, Delete, AttachMoney, Receipt } from "@mui/icons-material"

const mockInvoices = [
  {
    _id: "1",
    invoiceNumber: "INV-2024-001",
    workOrderId: "1",
    customerName: "John Smith",
    issueDate: "2024-01-15",
    dueDate: "2024-01-30",
    subtotal: 2500,
    tax: 225,
    total: 2725,
    status: "sent",
    paymentMethod: "check",
  },
  {
    _id: "2",
    invoiceNumber: "INV-2024-002",
    workOrderId: "2",
    customerName: "Sarah Johnson",
    issueDate: "2024-01-16",
    dueDate: "2024-01-31",
    subtotal: 8500,
    tax: 765,
    total: 9265,
    status: "paid",
    paymentMethod: "card",
  },
  {
    _id: "3",
    invoiceNumber: "INV-2024-003",
    workOrderId: "3",
    customerName: "Mike Davis",
    issueDate: "2024-01-14",
    dueDate: "2024-01-29",
    subtotal: 450,
    tax: 40.5,
    total: 490.5,
    status: "overdue",
    paymentMethod: null,
  },
]

const statusColors: Record<string, "default" | "primary" | "success" | "warning" | "error"> = {
  draft: "default",
  sent: "primary",
  paid: "success",
  overdue: "error",
  cancelled: "error",
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState(mockInvoices)
  const [openDialog, setOpenDialog] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<any>(null)
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customerName: "",
    issueDate: "",
    dueDate: "",
    subtotal: 0,
    tax: 0,
    total: 0,
    status: "draft",
    paymentMethod: "",
  })

  const handleOpenDialog = (invoice?: any) => {
    if (invoice) {
      setEditingInvoice(invoice)
      setFormData(invoice)
    } else {
      setEditingInvoice(null)
      const today = new Date().toISOString().split("T")[0]
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 15)
      setFormData({
        invoiceNumber: `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(3, "0")}`,
        customerName: "",
        issueDate: today,
        dueDate: dueDate.toISOString().split("T")[0],
        subtotal: 0,
        tax: 0,
        total: 0,
        status: "draft",
        paymentMethod: "",
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setEditingInvoice(null)
  }

  const handleSubtotalChange = (subtotal: number) => {
    const tax = subtotal * 0.09 // 9% tax rate
    const total = subtotal + tax
    setFormData({ ...formData, subtotal, tax, total })
  }

  const handleSubmit = () => {
    if (editingInvoice) {
      setInvoices(invoices.map((inv) => (inv._id === editingInvoice._id ? { ...inv, ...formData } : inv)))
    } else {
      setInvoices([...invoices, { _id: Date.now().toString(), ...formData }])
    }
    handleCloseDialog()
  }

  const handleDelete = (id: string) => {
    setInvoices(invoices.filter((inv) => inv._id !== id))
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Invoices
        </Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpenDialog()}>
          Create Invoice
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Invoice #</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Issue Date</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Subtotal</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice._id}>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Receipt sx={{ fontSize: 16 }} />
                    {invoice.invoiceNumber}
                  </Typography>
                </TableCell>
                <TableCell>{invoice.customerName}</TableCell>
                <TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
                <TableCell>${invoice.subtotal.toLocaleString()}</TableCell>
                <TableCell>${invoice.tax.toFixed(2)}</TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 700, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AttachMoney sx={{ fontSize: 16 }} />
                    {invoice.total.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label={invoice.status} size="small" color={statusColors[invoice.status]} />
                </TableCell>
                <TableCell>
                  <IconButton size="small" onClick={() => handleOpenDialog(invoice)}>
                    <Edit fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => handleDelete(invoice._id)} color="error">
                    <Delete fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editingInvoice ? "Edit Invoice" : "Create Invoice"}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField label="Invoice Number" fullWidth value={formData.invoiceNumber} disabled />
            <TextField
              label="Customer Name"
              fullWidth
              value={formData.customerName}
              onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                label="Issue Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
              <TextField
                label="Due Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </Box>
            <TextField
              label="Subtotal"
              type="number"
              fullWidth
              value={formData.subtotal}
              onChange={(e) => handleSubtotalChange(Number.parseFloat(e.target.value))}
            />
            <TextField label="Tax (9%)" type="number" fullWidth value={formData.tax.toFixed(2)} disabled />
            <TextField label="Total" type="number" fullWidth value={formData.total.toFixed(2)} disabled />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                select
                label="Status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="draft">Draft</MenuItem>
                <MenuItem value="sent">Sent</MenuItem>
                <MenuItem value="paid">Paid</MenuItem>
                <MenuItem value="overdue">Overdue</MenuItem>
                <MenuItem value="cancelled">Cancelled</MenuItem>
              </TextField>
              <TextField
                select
                label="Payment Method"
                value={formData.paymentMethod}
                onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
              >
                <MenuItem value="">Not Paid</MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="check">Check</MenuItem>
                <MenuItem value="card">Credit Card</MenuItem>
                <MenuItem value="bank_transfer">Bank Transfer</MenuItem>
              </TextField>
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editingInvoice ? "Save" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
