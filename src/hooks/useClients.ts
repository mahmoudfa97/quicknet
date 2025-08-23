"use client"

import { useState, useEffect } from "react"
import type { Client, Payment } from "@/types"
import { supabase } from "@/lib/supabase"

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([])
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        const { data: clientsData, error: clientsError } = await supabase
          .from("clients")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })

        if (clientsError) {
          console.error("Error fetching clients:", clientsError)
        } else {
          setClients(
            clientsData.map((c) => ({
              ...c,
              createdAt: new Date(c.created_at),
              updatedAt: new Date(c.updated_at),
              clientName: c.client_name,
              invoiceNumber: c.invoice_number,
              idNumber: c.id_number,
            })),
          )
        }

        const { data: paymentsData, error: paymentsError } = await supabase
          .from("payments")
          .select("*")
          .eq("user_id", user.id)
          .order("timestamp", { ascending: false })

        if (paymentsError) {
          console.error("Error fetching payments:", paymentsError)
        } else {
          setPayments(
            paymentsData.map((p) => ({
              ...p,
              timestamp: new Date(p.timestamp),
              receiptNumber: p.receipt_number,
              clientId: p.client_id,
            })),
          )
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const addClient = async (clientData: Omit<Client, "id" | "createdAt" | "updatedAt">) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const { data, error } = await supabase
        .from("clients")
        .insert({
          invoice_number: clientData.invoiceNumber,
          client_name: clientData.clientName,
          phone: clientData.phone || null,
          id_number: clientData.idNumber || null,
          balance: clientData.balance,
          user_id: user.id,
        })
        .select()
        .single()

      if (error) {
        console.error("Error adding client:", error)
        return null
      }

      const newClient: Client = {
        ...data,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
        clientName: data.client_name,
        invoiceNumber: data.invoice_number,
        idNumber: data.id_number,
      }

      setClients((prev) => [newClient, ...prev])
      return newClient
    } catch (error) {
      console.error("Error adding client:", error)
      return null
    }
  }

  const updateClient = async (id: string, updates: Partial<Client>) => {
    try {
      const updateData: any = {}
      if (updates.clientName) updateData.client_name = updates.clientName
      if (updates.invoiceNumber) updateData.invoice_number = updates.invoiceNumber
      if (updates.phone !== undefined) updateData.phone = updates.phone
      if (updates.idNumber !== undefined) updateData.id_number = updates.idNumber
      if (updates.balance !== undefined) updateData.balance = updates.balance
      updateData.updated_at = new Date().toISOString()

      const { error } = await supabase.from("clients").update(updateData).eq("id", id)

      if (error) {
        console.error("Error updating client:", error)
        return
      }

      setClients((prev) =>
        prev.map((client) => (client.id === id ? { ...client, ...updates, updatedAt: new Date() } : client)),
      )
    } catch (error) {
      console.error("Error updating client:", error)
    }
  }

  const processPayment = async (clientId: string, amount: number) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("User not authenticated")

      const client = clients.find((c) => c.id === clientId)
      if (!client) return null

      const receiptNumber = `RCP-${Date.now()}`

      const { data: paymentData, error: paymentError } = await supabase
        .from("payments")
        .insert({
          client_id: clientId,
          amount,
          receipt_number: receiptNumber,
          user_id: user.id,
        })
        .select()
        .single()

      if (paymentError) {
        console.error("Error processing payment:", paymentError)
        return null
      }

      const newPayment: Payment = {
        ...paymentData,
        timestamp: new Date(paymentData.timestamp),
        receiptNumber: paymentData.receipt_number,
        clientId: paymentData.client_id,
      }

      setPayments((prev) => [newPayment, ...prev])

      await updateClient(clientId, { balance: client.balance + amount })

      return newPayment
    } catch (error) {
      console.error("Error processing payment:", error)
      return null
    }
  }

  const searchClients = (query: string) => {
    if (!query.trim()) return clients

    const lowercaseQuery = query.toLowerCase()
    return clients.filter(
      (client) =>
        client.clientName.toLowerCase().includes(lowercaseQuery) ||
        client.invoiceNumber.toLowerCase().includes(lowercaseQuery) ||
        client.phone?.toLowerCase().includes(lowercaseQuery) ||
        client.idNumber?.toLowerCase().includes(lowercaseQuery),
    )
  }

  const getClientPayments = (clientId: string) => {
    return payments.filter((p) => p.clientId === clientId).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
  }

  const getTotalStats = () => {
    const totalClients = clients.length
    const totalBalance = clients.reduce((sum, client) => sum + client.balance, 0)
    const totalPayments = payments.reduce((sum, payment) => sum + payment.amount, 0)
    const recentPayments = payments.filter((p) => Date.now() - p.timestamp.getTime() < 24 * 60 * 60 * 1000).length

    return { totalClients, totalBalance, totalPayments, recentPayments }
  }

  return {
    clients,
    payments,
    loading,
    addClient,
    updateClient,
    processPayment,
    searchClients,
    getClientPayments,
    getTotalStats,
  }
}
