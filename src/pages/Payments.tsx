"use client"

import { useState, useEffect } from "react"
import { Layout } from "@/components/Layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Search, Filter, Download, Receipt } from "lucide-react"
import { format } from "date-fns"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import type { Payment } from "@/types"

interface PaymentWithClient extends Payment {
  client: {
    client_name: string
    invoice_number: string
  }
}

const Payments = () => {
  const { authState } = useAuth()
  const [payments, setPayments] = useState<PaymentWithClient[]>([])
  const [filteredPayments, setFilteredPayments] = useState<PaymentWithClient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [amountFilter, setAmountFilter] = useState<"all" | "low" | "medium" | "high">("all")

  useEffect(() => {
    fetchPayments()
  }, [])

  useEffect(() => {
    filterPayments()
  }, [payments, searchTerm, dateRange, amountFilter])
  
  const handlePrint = (payment) => {
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    // Convert timestamp to Date safely
    let dateObj;
    if (payment?.timestamp) {
      const clean = payment.timestamp.replace("+00a:00", "+00:00"); // fix format if needed
      dateObj = new Date(clean);
    }

    const formattedDate = dateObj
      ? dateObj.toLocaleDateString("en-GB")
      : "";
    const formattedTime = dateObj
      ? dateObj.toLocaleTimeString("en-GB")
      : "";

    printWindow.document.open();
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Payment Receipt - ${payment?.receiptNumber || ""}</title>
          <style>
            body { font-family: Arial, sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; color: #333; }
            .receipt { border: 2px solid #ddd; padding: 20px; background: white; border-radius: 8px; }
            .header { text-align: center; border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px; }
            .title { font-size: 24px; font-weight: bold; color: #2563eb; margin-bottom: 5px; }
            .receipt-number { color: #666; font-size: 14px; }
            .info-row { display: flex; justify-content: space-between; margin: 8px 0; padding: 4px 0; }
            .label { font-weight: bold; color: #555; }
            .amount { font-size: 20px; font-weight: bold; color: #16a34a; }
            .footer { text-align: center; margin-top: 20px; padding-top: 15px; border-top: 1px solid #eee; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div id="receipt-content">
            <div class="receipt">
              <div class="header">
                <div class="title">QuickNet</div>
                <div class="receipt-number">Receipt #${payment?.receipt_number || ""}</div>
              </div>

              <div class="space-y-3">
                <div class="info-row">
                  <span class="label">Client Name:</span>
                  <span>${payment?.client?.client_name || ""}</span>
                </div>

                <div class="info-row">
                  <span class="label">Invoice Number:</span>
                  <span>${payment?.client?.invoice_number || ""}</span>
                </div>

                <div class="info-row">
                  <span class="label">Payment Date:</span>
                  <span>${formattedDate}</span>
                </div>

                <div class="info-row">
                  <span class="label">Payment Time:</span>
                  <span>${formattedTime}</span>
                </div>

                <hr class="my-4" />

                <div class="info-row">
                  <span class="label">Payment Amount:</span>
                  <span class="amount">₪${payment?.amount?.toFixed(2) || "0.00"}</span>
                </div>

              </div>

              <div class="footer">
                <p>Thank you for your payment!</p>
                <p>Generated on ${new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  }
};


  const fetchPayments = async () => {
    try {

      let query = supabase
        .from("payments")
        .select(`
          *,
          client:clients(client_name, invoice_number)
        `)
        .order("timestamp", { ascending: false })

     
      const { data, error } = await query

      if (error) {
        console.error("Error fetching payments:", error)
        return
      }
    

      setPayments(data || [])
    } catch (error) {
      console.error("Error fetching payments:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterPayments = () => {
    let filtered = payments

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (payment) =>
          payment.client.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.client.invoice_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          payment.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Date range filter
    if (dateRange.from) {
      filtered = filtered.filter((payment) => new Date(payment.timestamp) >= dateRange.from!)
    }
    if (dateRange.to) {
      filtered = filtered.filter((payment) => new Date(payment.timestamp) <= dateRange.to!)
    }

    // Amount filter
    if (amountFilter !== "all") {
      filtered = filtered.filter((payment) => {
        if (amountFilter === "low") return payment.amount < 1000
        if (amountFilter === "medium") return payment.amount >= 1000 && payment.amount < 5000
        if (amountFilter === "high") return payment.amount >= 5000
        return true
      })
    }

    setFilteredPayments(filtered)
  }

  const exportPayments = () => {
    const csvContent = [
      ["Date", "Client Name", "Invoice Number", "Amount", "Receipt Number"],
      ...filteredPayments.map((payment) => [
        format(new Date(payment.timestamp), "yyyy-MM-dd HH:mm"),
        payment.client.client_name,
        payment.client.invoice_number,
        payment.amount.toString(),
        payment.receiptNumber,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `payments-${format(new Date(), "yyyy-MM-dd")}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const totalAmount = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0)

  if (loading) {
    return (
      <Layout title="Payments">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading payments...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Payments">
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Payments</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredPayments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${totalAmount.toLocaleString()}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Payment</CardTitle>
              <Receipt className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${filteredPayments.length > 0 ? (totalAmount / filteredPayments.length).toFixed(2) : "0"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search payments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={amountFilter} onValueChange={(value: any) => setAmountFilter(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Amount range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All amounts</SelectItem>
                  <SelectItem value="low">Under $1,000</SelectItem>
                  <SelectItem value="medium">$1,000 - $5,000</SelectItem>
                  <SelectItem value="high">Over $5,000</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange.from ? format(dateRange.from, "MMM dd, yyyy") : "From date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => setDateRange((prev) => ({ ...prev, from: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <Button onClick={exportPayments} variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Payments List */}
        <Card>
          <CardHeader>
            <CardTitle>Payment History</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredPayments.length === 0 ? (
              <div className="text-center py-8">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No payments found matching your criteria.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredPayments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    onClick={() => handlePrint(payment)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{payment.client.client_name}</h3>
                        <Badge variant="secondary">{payment.client.invoice_number}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{format(new Date(payment.timestamp), "MMM dd, yyyy HH:mm")}</span>
                        <span>Receipt: {payment.receiptNumber}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600">${payment.amount.toLocaleString()}</div>                    
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  )
}

export default Payments
