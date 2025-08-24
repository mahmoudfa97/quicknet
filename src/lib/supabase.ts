import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://abwrtipyqfgawquwyego.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFid3J0aXB5cWZnYXdxdXd5ZWdvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU5NzE0ODgsImV4cCI6MjA3MTU0NzQ4OH0.erpYmJIZcIaeu3usw96T5xK_JRVIHMCXgDt0l0XpOJo"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          username: string
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          username: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          invoice_number: string
          client_name: string
          phone: string | null
          id_number: string | null
          balance: number
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_number: string
          client_name: string
          phone?: string | null
          id_number?: string | null
          balance: number
          user_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_number?: string
          client_name?: string
          phone?: string | null
          id_number?: string | null
          balance?: number
          user_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          client_id: string
          amount: number
          receipt_number: string
          user_id: string
          timestamp: string
        }
        Insert: {
          id?: string
          client_id: string
          amount: number
          receipt_number: string
          user_id: string
          timestamp?: string
        }
        Update: {
          id?: string
          client_id?: string
          amount?: number
          receipt_number?: string
          user_id?: string
          timestamp?: string
        }
      }
    }
  }
}
