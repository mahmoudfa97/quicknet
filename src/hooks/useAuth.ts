"use client"

import { useState, useEffect, createContext, useContext } from "react"
import type { AuthState } from "@/types"
import { supabase } from "@/lib/supabase"

const AuthContext = createContext<{
  authState: AuthState
  login: (username: string, password: string) => Promise<boolean>
  register: (username: string, password: string) => Promise<boolean>
  logout: () => void
} | null>(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}

export const useAuthState = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
  })

  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (userData) {
          setAuthState({
            user: {
              id: userData.id,
              username: userData.username,
              isAdmin: userData.is_admin,
            },
            isAuthenticated: true,
          })
        }
      }
    }

    getInitialSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

        if (userData) {
          setAuthState({
            user: {
              id: userData.id,
              username: userData.username,
              isAdmin: userData.is_admin,
            },
            isAuthenticated: true,
          })
        }
      } else {
        setAuthState({ user: null, isAuthenticated: false })
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: `${username}`, // Convert username to email format
        password,
      })

      if (error) {
        console.error("Login error:", error)
        return false
      }

      return true
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const register = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data: existingUser } = await supabase.from("users").select("username").eq("username", username).single()

      if (existingUser) {
        return false // Username already exists
      }

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: `${username}`, // Convert username to email format
        password,
      })

      if (authError || !authData.user) {
        console.error("Registration error:", authError)
        return false
      }

      const { count } = await supabase.from("users").select("*", { count: "exact", head: true })

      const { error: profileError } = await supabase.from("users").insert({
        id: authData.user.id,
        username,
        password,
        is_admin: count === 0, // First user is admin
      })

      if (profileError) {
        console.error("Profile creation error:", profileError)
        return false
      }

      return true
    } catch (error) {
      console.error("Registration error:", error)
      return false
    }
  }

  const logout = async () => {
    setAuthState({ user: null, isAuthenticated: false })
    await supabase.auth.signOut()
  }

  return { authState, login, register, logout }
}

export { AuthContext }
