import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

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
