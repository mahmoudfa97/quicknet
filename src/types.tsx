export interface Client {
  id: string
  invoiceNumber: string
  clientName: string
  phone?: string
  idNumber?: string
  balance: number
  createdAt: Date
  updatedAt: Date
}

export interface Payment {
  id: string
  clientId: string
  amount: number
  timestamp: Date
  receiptNumber: string
}

export interface User {
  id: string
  username: string
  isAdmin: boolean
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
}
