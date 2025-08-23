"use client"

import { useState, useEffect } from "react"
import { useClients } from "@/hooks/useClients"
import { Layout } from "@/components/Layout"
import { ClientCard } from "@/components/ClientCard"
import { SearchBar } from "@/components/SearchBar"
import { AddClientForm } from "@/components/AddClientForm"
import { PaymentModal } from "@/components/PaymentModal"
import { ReceiptModal } from "@/components/ReceiptModal"
import { Button } from "@/components/ui/button"
import type { Client, Payment } from "@/types"
import { Plus, Filter } from "lucide-react"

const Clients = () => {
  const { clients, addClient, processPayment, searchClients } = useClients()

  const [searchResults, setSearchResults] = useState<Client[]>(clients)
  const [showAddForm, setShowAddForm] = useState(false)
  const [paymentClient, setPaymentClient] = useState<Client | null>(null)
  const [receiptData, setReceiptData] = useState<{
    payment: Payment
    client: Client
  } | null>(null)

  // Update search results when clients change
  useEffect(() => {
    setSearchResults(clients)
  }, [clients])

  const handleSearch = (query: string) => {
    const results = searchClients(query)
    setSearchResults(results)
  }

  const handleAddClient = (clientData: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    // Check for duplicate invoice number
    const duplicate = clients.find((c) => c.invoiceNumber === clientData.invoiceNumber)
    if (duplicate) {
      throw new Error("Invoice number already exists")
    }

    addClient(clientData)
    setShowAddForm(false)
    // Refresh search results
    setSearchResults(clients)
  }

  const handleProcessPayment = (clientId: string, amount: number) => {
    return processPayment(clientId, amount)
  }

  const handleShowReceipt = (payment: Payment, client: Client) => {
    setReceiptData({ payment, client })
  }

  return (
    <Layout title="Client Management">
      {/* Main Actions */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <SearchBar onSearch={handleSearch} placeholder="Search by name, invoice, phone, or ID..." />
        </div>
        <Button variant="professional" onClick={() => setShowAddForm(!showAddForm)}>
          <Plus className="w-4 h-4" />
          Add Client
        </Button>
      </div>

      {/* Add Client Form */}
      {showAddForm && (
        <div className="mb-8">
          <AddClientForm onAddClient={handleAddClient} onCancel={() => setShowAddForm(false)} />
        </div>
      )}

      {/* Clients Grid */}
      {searchResults.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Filter className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground mb-2">No clients found</h3>
          <p className="text-muted-foreground mb-4">
            {clients.length === 0 ? "Start by adding your first client" : "Try adjusting your search criteria"}
          </p>
          {clients.length === 0 && (
            <Button variant="professional" onClick={() => setShowAddForm(true)}>
              <Plus className="w-4 h-4" />
              Add Your First Client
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {searchResults.map((client, index) => (
            <div key={client.id} style={{ animationDelay: `${index * 50}ms` }}>
              <ClientCard
                client={client}
                onPayment={(clientId) => {
                  const client = clients.find((c) => c.id === clientId)
                  setPaymentClient(client || null)
                }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      <PaymentModal
        client={paymentClient}
        isOpen={!!paymentClient}
        onClose={() => setPaymentClient(null)}
        onProcessPayment={handleProcessPayment}
        onShowReceipt={handleShowReceipt}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        payment={receiptData?.payment || null}
        client={receiptData?.client || null}
        isOpen={!!receiptData}
        onClose={() => setReceiptData(null)}
      />
    </Layout>
  )
}

export default Clients
